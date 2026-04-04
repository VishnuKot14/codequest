/**
 * WebSocket Duel Server
 *
 * How WebSockets work vs HTTP:
 *   HTTP:      Client asks → Server answers → connection closes
 *   WebSocket: Client connects → connection stays open → either side can send at any time
 *
 * This file manages the entire real-time duel lifecycle:
 *   1. A player sends { type: "join_queue", language }
 *   2. Once two players are queued for the same language, a duel starts
 *   3. Both players get the same coding problem
 *   4. Players send { type: "submit", code } when they think they've solved it
 *   5. Server runs the code and broadcasts the winner
 *
 * State is kept in memory (Maps). In production you'd use Redis so multiple
 * server instances can share state — but for a single server, Maps are fine.
 */

import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'
import { exec } from 'child_process'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'codequest-dev-secret-change-in-production'

// ── In-memory state ───────────────────────────────────────
// Queue: players waiting for an opponent, keyed by language
// Map<language, { ws, userId, username }>
const queue = new Map()

// Active duels: Map<duelId, { playerA, playerB, problem, startTime, resolved }>
const activeduels = new Map()

// ── Duel problems ─────────────────────────────────────────
// A small pool of problems used in duels. In production these come from the DB.
const DUEL_PROBLEMS = {
  python: [
    {
      id: 'duel-py-1',
      title: 'Sum of Two Numbers',
      description: 'Write a function add(a, b) that returns a + b.\nThen print add(3, 7)',
      starterCode: 'def add(a, b):\n    # your code here\n    pass\n\nprint(add(3, 7))',
      expected: '10',
    },
    {
      id: 'duel-py-2',
      title: 'Reverse a String',
      description: 'Print the reverse of the string "quest"',
      starterCode: 'word = "quest"\n# print the reversed word\n',
      expected: 'tseuq',
    },
  ],
  javascript: [
    {
      id: 'duel-js-1',
      title: 'Double the Number',
      description: 'Write a function double(n) that returns n * 2. Then console.log(double(21))',
      starterCode: 'function double(n) {\n  // your code\n}\nconsole.log(double(21))',
      expected: '42',
    },
  ],
}

// ── Helper: run code and check output ─────────────────────
const RUNNERS = {
  python: (f) => `python3 "${f}"`,
  javascript: (f) => `node "${f}"`,
}
const EXTS = { python: 'py', javascript: 'js' }

async function runCode(code, language) {
  const runner = RUNNERS[language]
  if (!runner) return { success: false, stdout: 'Language not supported' }

  const ext = EXTS[language] ?? 'txt'
  const filename = `duel_${Date.now()}.${ext}`
  const filepath = join(tmpdir(), filename)

  try {
    await writeFile(filepath, code, 'utf-8')
    const stdout = await new Promise((resolve, reject) => {
      exec(runner(filepath), { timeout: 5000, maxBuffer: 1024 * 32 }, (err, out, errOut) => {
        if (err?.killed) return reject(new Error('Time limit exceeded'))
        resolve(out + (errOut ? `\n${errOut}` : ''))
      })
    })
    return { success: true, stdout: stdout.trim() }
  } catch (err) {
    return { success: false, stdout: err.message }
  } finally {
    unlink(filepath).catch(() => {})
  }
}

// ── Helper: send JSON to a WebSocket client ────────────────
// WebSocket.send() only accepts strings or Buffers, so we always JSON.stringify
function send(ws, payload) {
  if (ws.readyState === 1) { // 1 = OPEN
    ws.send(JSON.stringify(payload))
  }
}

// ── Helper: pick a random problem for a language ──────────
function pickProblem(language) {
  const pool = DUEL_PROBLEMS[language] ?? DUEL_PROBLEMS.python
  return pool[Math.floor(Math.random() * pool.length)]
}

// ── Main: attach WebSocket server to existing HTTP server ──
export function attachDuelServer(httpServer) {
  // We attach to the same port as Express but at path /ws/duel
  // This means the same port 5000 serves both HTTP and WebSocket traffic
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/duel' })

  wss.on('connection', (ws, req) => {
    // Extract JWT from query string: ws://localhost:5000/ws/duel?token=xxx
    const url = new URL(req.url, 'http://localhost')
    const token = url.searchParams.get('token')

    let player = null
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      player = { ws, userId: decoded.id, username: decoded.username, duelId: null }
    } catch {
      send(ws, { type: 'error', message: 'Invalid token' })
      ws.close()
      return
    }

    console.log(`⚔ Duel socket connected: ${player.username}`)

    // ── Handle incoming messages ────────────────────────────
    // Each message from the client is a JSON string with a `type` field
    ws.on('message', async (raw) => {
      let msg
      try { msg = JSON.parse(raw) } catch { return }

      // ── Join matchmaking queue ──────────────────────────
      if (msg.type === 'join_queue') {
        const lang = msg.language || 'python'
        player.language = lang

        // Is there already someone waiting for this language?
        const waiting = queue.get(lang)

        if (waiting && waiting.userId !== player.userId) {
          // Match found! Start a duel immediately
          queue.delete(lang)

          const problem = pickProblem(lang)
          const duelId = `duel_${Date.now()}`

          // Store the active duel in memory
          activeduels.set(duelId, {
            playerA: { ...waiting, solved: false },
            playerB: { ...player, solved: false },
            problem,
            language: lang,
            startTime: Date.now(),
            resolved: false,
          })

          player.duelId = duelId
          waiting.duelId = duelId

          // Tell both players the duel has started
          const duelStart = {
            type: 'duel_start',
            duelId,
            problem,
            opponentName: '',
          }
          send(waiting.ws, { ...duelStart, opponentName: player.username })
          send(player.ws,  { ...duelStart, opponentName: waiting.username })

        } else {
          // No opponent yet — add to queue
          queue.set(lang, player)
          send(ws, { type: 'queued', message: `Waiting for an opponent in ${lang}...` })
        }
      }

      // ── Submit code ────────────────────────────────────
      if (msg.type === 'submit') {
        if (!player.duelId) return
        const duel = activeduels.get(player.duelId)
        if (!duel || duel.resolved) return

        // Tell the opponent "they're working on it"
        const opponent = duel.playerA.userId === player.userId ? duel.playerB : duel.playerA
        send(opponent.ws, { type: 'opponent_submitted' })

        // Run the submitted code
        const result = await runCode(msg.code, duel.language)
        const passed = result.success && result.stdout.includes(duel.problem.expected)

        if (passed && !duel.resolved) {
          // This player solved it first — they win!
          duel.resolved = true

          // Update database: record duel winner, update win/loss counts
          try {
            await prisma.duel.create({
              data: {
                challengerId: duel.playerA.userId,
                opponentId:   duel.playerB.userId,
                language:     duel.language,
                status:       'complete',
                winnerId:     player.userId,
                completedAt:  new Date(),
              }
            })
            await prisma.user.update({
              where: { id: player.userId },
              data: { duelsWon: { increment: 1 }, points: { increment: 100 } }
            })
            await prisma.user.update({
              where: { id: opponent.userId },
              data: { duelsLost: { increment: 1 } }
            })
          } catch (err) {
            console.error('Failed to save duel:', err.message)
          }

          // Broadcast result to both players
          send(player.ws,   { type: 'duel_result', winner: player.username, youWon: true,  stdout: result.stdout })
          send(opponent.ws, { type: 'duel_result', winner: player.username, youWon: false, stdout: '' })

          activeduels.delete(player.duelId)
        } else {
          // Code ran but didn't pass — tell them and let them try again
          send(ws, { type: 'submit_result', passed: false, stdout: result.stdout })
        }
      }

      // ── Forfeit ────────────────────────────────────────
      if (msg.type === 'forfeit') {
        if (!player.duelId) return
        const duel = activeduels.get(player.duelId)
        if (!duel || duel.resolved) return

        duel.resolved = true
        const opponent = duel.playerA.userId === player.userId ? duel.playerB : duel.playerA

        send(opponent.ws, { type: 'duel_result', winner: opponent.username, youWon: true,  forfeit: true })
        send(player.ws,   { type: 'duel_result', winner: opponent.username, youWon: false, forfeit: true })

        activeduels.delete(player.duelId)
      }
    })

    // ── Clean up on disconnect ──────────────────────────────
    ws.on('close', () => {
      console.log(`⚔ Duel socket disconnected: ${player?.username}`)
      // Remove from queue if they were waiting
      if (player?.language) {
        const waiting = queue.get(player.language)
        if (waiting?.userId === player.userId) queue.delete(player.language)
      }
      // If they were in a duel, the opponent wins by default
      if (player?.duelId) {
        const duel = activeduels.get(player.duelId)
        if (duel && !duel.resolved) {
          duel.resolved = true
          const opponent = duel.playerA.userId === player.userId ? duel.playerB : duel.playerA
          send(opponent.ws, { type: 'duel_result', winner: opponent.username, youWon: true, disconnect: true })
          activeduels.delete(player.duelId)
        }
      }
    })
  })

  console.log('⚔ Duel WebSocket server attached at /ws/duel')
}
