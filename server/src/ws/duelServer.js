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
// Map<language, { ws, userId, username, timeoutId, botTimeoutId }>
const queue = new Map()

// Active duels: Map<duelId, { playerA, playerB, problem, startTime, resolved }>
const activeduels = new Map()

// How long to wait for a real opponent before sending a bot (ms)
const BOT_DELAY = 15000
// How long before cancelling the queue entirely if even the bot fails (ms)
const QUEUE_TIMEOUT = 30000

// ── Duel problems ─────────────────────────────────────────
// Duel problems — multi-fundamental challenges designed to take 5–10 minutes
const DUEL_PROBLEMS = {
  python: [
    {
      id: 'duel-py-1',
      title: 'Inventory Manager',
      description: `Build a simple inventory system using a class and a dict.

1. Create a class \`Inventory\` with a private \`_items\` dict (name -> qty).
2. Add method \`add(name, qty)\` — adds qty to existing or creates new entry.
3. Add method \`remove(name, qty)\` — reduces qty; if qty drops to 0 or below, delete the entry.
4. Add method \`top(n)\` — returns a list of the top n item names sorted by qty descending.
5. Create an Inventory, run these operations in order:
   inv.add("sword", 5)
   inv.add("potion", 12)
   inv.add("shield", 3)
   inv.add("potion", 8)
   inv.remove("sword", 5)
   inv.add("arrow", 25)
   print(inv.top(3))

Expected output (one line, a Python list):
['arrow', 'potion', 'shield']`,
      starterCode: `class Inventory:
    def __init__(self):
        self._items = {}

    def add(self, name, qty):
        pass  # implement

    def remove(self, name, qty):
        pass  # implement

    def top(self, n):
        pass  # implement

inv = Inventory()
inv.add("sword", 5)
inv.add("potion", 12)
inv.add("shield", 3)
inv.add("potion", 8)
inv.remove("sword", 5)
inv.add("arrow", 25)
print(inv.top(3))
`,
      expected: "['arrow', 'potion', 'shield']",
    },
    {
      id: 'duel-py-2',
      title: 'Word Frequency Analyser',
      description: `Analyse word frequency in a text using dicts, list comprehensions, and sorting.

Given the string:
text = "the hero cast a spell the spell hit the dragon the dragon fled"

1. Write \`word_freq(text)\` that returns a dict of {word: count}.
2. Write \`top_words(text, n)\` that returns a list of the top n most frequent words as tuples (word, count), sorted by count descending. Ties broken alphabetically ascending.
3. Print the result of \`top_words(text, 3)\` — one tuple per line.

Expected output:
('the', 4)
('dragon', 2)
('spell', 2)`,
      starterCode: `def word_freq(text):
    pass  # implement

def top_words(text, n):
    pass  # implement

text = "the hero cast a spell the spell hit the dragon the dragon fled"
for item in top_words(text, 3):
    print(item)
`,
      expected: "('the', 4)\n('dragon', 2)\n('spell', 2)",
    },
    {
      id: 'duel-py-3',
      title: 'Dungeon Crawler Simulator',
      description: `Simulate a dungeon using OOP, inheritance, and list comprehensions.

1. Create base class \`Entity\` with \`name\` (str) and \`hp\` (int). Add method \`is_alive()\` returning \`hp > 0\`.
2. Create \`Hero(Entity)\` with extra \`attack_power\` (int). Add \`attack(enemy)\` which reduces enemy.hp by attack_power.
3. Create \`Monster(Entity)\` with extra \`reward\` (int).
4. Simulate:
   - Create Hero("Aria", hp=100, attack_power=35)
   - Create monsters: Monster("Goblin", hp=40, reward=10), Monster("Troll", hp=90, reward=25), Monster("Dragon", hp=60, reward=50)
   - Hero attacks each monster until it dies (loop until not is_alive)
   - Collect rewards only from defeated monsters
5. Print total reward earned.

Expected output:
85`,
      starterCode: `class Entity:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def is_alive(self):
        pass  # implement

class Hero(Entity):
    def __init__(self, name, hp, attack_power):
        super().__init__(name, hp)
        self.attack_power = attack_power

    def attack(self, enemy):
        pass  # implement

class Monster(Entity):
    def __init__(self, name, hp, reward):
        super().__init__(name, hp)
        self.reward = reward

hero = Hero("Aria", hp=100, attack_power=35)
monsters = [
    Monster("Goblin", hp=40, reward=10),
    Monster("Troll", hp=90, reward=25),
    Monster("Dragon", hp=60, reward=50),
]

total_reward = 0
for monster in monsters:
    while monster.is_alive():
        hero.attack(monster)
    total_reward += monster.reward

print(total_reward)
`,
      expected: '85',
    },
  ],

  javascript: [
    {
      id: 'duel-js-1',
      title: 'Quest Log',
      description: `Build a quest tracking system using classes, closures, and array methods.

1. Create class \`QuestLog\` with private \`#quests = []\` array.
2. Add \`addQuest(name, xp)\` — pushes \`{ name, xp, done: false }\`.
3. Add \`complete(name)\` — marks the matching quest done. If not found, does nothing.
4. Add getter \`totalXP\` — returns sum of xp for completed quests only.
5. Add \`summary()\` — returns an array of strings: \`"[name] - done"\` or \`"[name] - pending"\` for each quest.
6. Run:
   const log = new QuestLog()
   log.addQuest("Slay Dragon", 150)
   log.addQuest("Find Sword", 80)
   log.addQuest("Rescue King", 120)
   log.complete("Slay Dragon")
   log.complete("Rescue King")
   console.log(log.totalXP)
   log.summary().forEach(s => console.log(s))

Expected output:
270
Slay Dragon - done
Find Sword - pending
Rescue King - done`,
      starterCode: `class QuestLog {
  #quests = []

  addQuest(name, xp) {
    // implement
  }

  complete(name) {
    // implement
  }

  get totalXP() {
    // implement
    return 0
  }

  summary() {
    // implement
    return []
  }
}

const log = new QuestLog()
log.addQuest("Slay Dragon", 150)
log.addQuest("Find Sword", 80)
log.addQuest("Rescue King", 120)
log.complete("Slay Dragon")
log.complete("Rescue King")
console.log(log.totalXP)
log.summary().forEach(s => console.log(s))
`,
      expected: '270\nSlay Dragon - done\nFind Sword - pending\nRescue King - done',
    },
    {
      id: 'duel-js-2',
      title: 'Async Hero Stats',
      description: `Combine async/await, Promises, array methods, and error handling.

1. Write async function \`fetchStats(heroName)\` that returns a Promise resolving to:
   - \`{ name: heroName, hp: heroName.length * 10, power: heroName.length * 7 }\`
2. Write async function \`fetchAllStats(names)\` that calls \`fetchStats\` for all names in parallel using \`Promise.all\`.
3. Write \`strongest(stats)\` — returns the stat object with the highest \`power\`.
4. Run with \`["Aria", "Bolt", "Cassandra"]\`:
   - Fetch all stats in parallel
   - Find and print the strongest hero's name and power on separate lines

Expected output:
Cassandra
63`,
      starterCode: `async function fetchStats(heroName) {
  // implement
}

async function fetchAllStats(names) {
  // implement
}

function strongest(stats) {
  // implement
}

async function main() {
  const stats = await fetchAllStats(["Aria", "Bolt", "Cassandra"])
  const best = strongest(stats)
  console.log(best.name)
  console.log(best.power)
}

main()
`,
      expected: 'Cassandra\n63',
    },
    {
      id: 'duel-js-3',
      title: 'Spell Combinatorics',
      description: `Use closures, higher-order functions, Map, and reduce.

1. Write \`makeSpellCaster(multiplier)\` — returns a function \`cast(spellName, basePower)\` that returns \`basePower * multiplier\`.
2. Write \`combineSpells(spells, caster)\` — takes an array of \`{ name, power }\` objects and a caster function, returns a new array with each spell's power run through the caster.
3. Write \`spellMap(spells)\` — returns a Map of \`spellName -> power\` from the (already-cast) spell array.
4. Run:
   const fireMage = makeSpellCaster(3)
   const spells = [{ name: "Fireball", power: 10 }, { name: "Inferno", power: 15 }, { name: "Ember", power: 5 }]
   const boosted = combineSpells(spells, fireMage)
   const map = spellMap(boosted)
   console.log(map.get("Fireball"))
   console.log(map.get("Inferno"))
   console.log([...map.values()].reduce((a, b) => a + b, 0))

Expected output:
30
45
90`,
      starterCode: `function makeSpellCaster(multiplier) {
  // implement
}

function combineSpells(spells, caster) {
  // implement
}

function spellMap(spells) {
  // implement
}

const fireMage = makeSpellCaster(3)
const spells = [
  { name: "Fireball", power: 10 },
  { name: "Inferno", power: 15 },
  { name: "Ember", power: 5 },
]
const boosted = combineSpells(spells, fireMage)
const map = spellMap(boosted)
console.log(map.get("Fireball"))
console.log(map.get("Inferno"))
console.log([...map.values()].reduce((a, b) => a + b, 0))
`,
      expected: '30\n45\n90',
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
      exec(runner(filepath), { timeout: 10000, maxBuffer: 1024 * 64 }, (err, out, errOut) => {
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

// ── Helper: start a duel between two players ──────────────
function startDuel(playerA, playerB, language) {
  const problem = pickProblem(language)
  const duelId = `duel_${Date.now()}`

  activeduels.set(duelId, {
    playerA: { ...playerA, solved: false },
    playerB: { ...playerB, solved: false },
    problem,
    language,
    startTime: Date.now(),
    resolved: false,
  })

  playerA.duelId = duelId
  playerB.duelId = duelId

  send(playerA.ws, { type: 'duel_start', duelId, problem, opponentName: playerB.username })
  send(playerB.ws, { type: 'duel_start', duelId, problem, opponentName: playerA.username })

  return { duelId, problem }
}

// ── Helper: start a bot duel for a queued player ──────────
function startBotDuel(player, language) {
  // Clear their queue timers
  clearTimeout(player.botTimeoutId)
  clearTimeout(player.timeoutId)
  queue.delete(language)

  const problem = pickProblem(language)
  const duelId = `duel_${Date.now()}`
  const botName = ['CodeBot', 'GlitchBot', 'NullBot', 'ByteBot'][Math.floor(Math.random() * 4)]

  // Bot is a fake player — it has no real ws, we handle it server-side
  const botPlayer = { userId: 'bot', username: botName, duelId, solved: false, isBot: true }

  activeduels.set(duelId, {
    playerA: { ...player, solved: false },
    playerB: botPlayer,
    problem,
    language,
    startTime: Date.now(),
    resolved: false,
    isBot: true,
  })

  player.duelId = duelId

  send(player.ws, { type: 'duel_start', duelId, problem, opponentName: botName })

  // Bot submits the correct answer after a random delay (5–10 minutes)
  // giving the human a real chance to solve the harder problems
  const botDelay = 300000 + Math.random() * 300000
  setTimeout(async () => {
    const duel = activeduels.get(duelId)
    if (!duel || duel.resolved) return

    duel.resolved = true
    // Bot wins — tell the human
    send(player.ws, { type: 'duel_result', winner: botName, youWon: false, stdout: '' })
    activeduels.delete(duelId)
  }, botDelay)
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

        // Is there already a real player waiting for this language?
        const waiting = queue.get(lang)

        if (waiting && waiting.userId !== player.userId) {
          // Real opponent found — cancel their timers and start immediately
          clearTimeout(waiting.botTimeoutId)
          clearTimeout(waiting.timeoutId)
          queue.delete(lang)
          startDuel(waiting, player, lang)

        } else {
          // No opponent yet — add to queue and set two timers:
          // 1. After BOT_DELAY: match against a bot so they're not waiting forever
          // 2. After QUEUE_TIMEOUT: give up entirely (shouldn't normally fire since bot fires first)
          queue.set(lang, player)
          send(ws, { type: 'queued', message: `Waiting for an opponent in ${lang}...` })

          player.botTimeoutId = setTimeout(() => {
            // Only fire if still in queue (not matched with a real player yet)
            if (queue.get(lang)?.userId === player.userId) {
              send(ws, { type: 'queued', message: 'No players found — matched with a bot!' })
              startBotDuel(player, lang)
            }
          }, BOT_DELAY)

          player.timeoutId = setTimeout(() => {
            if (queue.get(lang)?.userId === player.userId) {
              queue.delete(lang)
              clearTimeout(player.botTimeoutId)
              send(ws, { type: 'queue_cancelled', message: 'No opponents found. Try again later!' })
            }
          }, QUEUE_TIMEOUT)
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
      // Remove from queue if they were waiting and cancel any pending timers
      if (player?.language) {
        const waiting = queue.get(player.language)
        if (waiting?.userId === player.userId) {
          queue.delete(player.language)
          clearTimeout(player.botTimeoutId)
          clearTimeout(player.timeoutId)
        }
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
