/**
 * BossPage — multi-stage boss battle at the end of each region.
 *
 * Key concept: useReducer
 * When state has several interconnected fields that change together,
 * useReducer is cleaner than multiple useState calls. Instead of:
 *   setStage(s+1); setLives(l-1); setPhase('transition')
 * you dispatch one action: dispatch({ type: 'WRONG_ANSWER' })
 * and the reducer handles all the state changes atomically.
 */

import { useReducer, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useAuthStore, useGameStore } from '../lib/store'
import api from '../lib/api'

// ── Hardcoded boss data (would come from DB in production) ──
const BOSSES = {
  python: {
    name: 'The Syntax Serpent',
    emoji: '🐲',
    region: 'Python Plains',
    totalXP: 500,
    lives: 3,
    stages: [
      {
        title: 'Phase 1: The Serpent Stirs',
        description: 'The Syntax Serpent awakens! Prove you know loops.\n\nPrint all numbers from 1 to 5, one per line.',
        starterCode: '# Defeat Phase 1\n',
        expected: '1\n2\n3\n4\n5',
      },
      {
        title: 'Phase 2: Venomous Functions',
        description: 'The Serpent attacks with functions! Define a function square(n) that returns n*n.\nPrint square(7)',
        starterCode: 'def square(n):\n    pass\n\nprint(square(7))',
        expected: '49',
      },
      {
        title: 'Phase 3: Final Strike',
        description: 'The Serpent\'s final form! Filter a list.\n\nGiven nums = [1,2,3,4,5,6], print only the even numbers, one per line.',
        starterCode: 'nums = [1, 2, 3, 4, 5, 6]\n# Print only even numbers\n',
        expected: '2\n4\n6',
      },
    ],
  },
  javascript: {
    name: 'The Async Dragon',
    emoji: '🔥',
    region: 'JS Jungle',
    totalXP: 600,
    lives: 3,
    stages: [
      {
        title: 'Phase 1: Arrow of Fire',
        description: 'The Dragon breathes fire! Tame arrow functions.\n\nWrite an arrow function double = (n) => ... that returns n*2.\nThen console.log(double(15))',
        starterCode: 'const double = (n) => {\n  // your code\n}\nconsole.log(double(15))',
        expected: '30',
      },
      {
        title: 'Phase 2: Array Inferno',
        description: 'The Dragon summons an array army!\n\nGiven arr = [1,2,3,4,5], use .filter() to get only numbers > 3.\nThen console.log the result.',
        starterCode: 'const arr = [1, 2, 3, 4, 5]\n// Use .filter()\n',
        expected: '[ 4, 5 ]',
      },
      {
        title: 'Phase 3: The Dragon\'s Core',
        description: 'Destroy the core! Use .reduce() to sum an array.\n\nGiven nums = [10, 20, 30, 40], print their total using .reduce()',
        starterCode: 'const nums = [10, 20, 30, 40]\n// Use .reduce()\n',
        expected: '100',
      },
    ],
  },
}

// ── State machine with useReducer ──────────────────────────
// The "state" shape:
//   phase:   'intro' | 'fighting' | 'transition' | 'won' | 'lost'
//   stage:   0–2 (which boss phase we're on)
//   lives:   3–0
//   stdout:  last code output string

const initialState = (bossLives) => ({
  phase: 'intro',
  stage: 0,
  lives: bossLives,
  stdout: '',
})

// The reducer is a pure function: (currentState, action) => newState
// It never mutates state — always returns a new object (spread operator handles this)
function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, phase: 'fighting' }

    case 'CORRECT': {
      const isLastStage = action.totalStages && state.stage >= action.totalStages - 1
      if (isLastStage) {
        return { ...state, phase: 'won', stdout: action.stdout }
      }
      // Move to next stage, show transition message briefly
      return { ...state, phase: 'transition', stage: state.stage + 1, stdout: action.stdout }
    }

    case 'RESUME_FIGHT':
      return { ...state, phase: 'fighting', stdout: '' }

    case 'WRONG': {
      const newLives = state.lives - 1
      return {
        ...state,
        lives: newLives,
        phase: newLives <= 0 ? 'lost' : 'fighting',
        stdout: action.stdout,
      }
    }

    default:
      return state
  }
}

// ── Life hearts display ────────────────────────────────────
function Lives({ current, max }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`text-xl transition-all ${i < current ? 'opacity-100' : 'opacity-20 grayscale'}`}>
          ❤️
        </span>
      ))}
    </div>
  )
}

export default function BossPage() {
  const { regionId } = useParams()  // e.g. "python" or "javascript"
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { triggerXPGain } = useGameStore()

  const boss = BOSSES[regionId]
  const [bossState, dispatch] = useReducer(reducer, initialState(boss?.lives ?? 3))
  const [code, setCode] = useState('')
  const [running, setRunning] = useState(false)

  // Set starter code when stage changes
  useEffect(() => {
    if (boss) setCode(boss.stages[bossState.stage]?.starterCode ?? '')
  }, [bossState.stage, boss])

  // Auto-advance from 'transition' phase after 2 seconds
  useEffect(() => {
    if (bossState.phase === 'transition') {
      const t = setTimeout(() => dispatch({ type: 'RESUME_FIGHT' }), 2000)
      return () => clearTimeout(t)
    }
  }, [bossState.phase])

  if (!boss) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-white/40">Boss not found for region: {regionId}</div>
      </div>
    )
  }

  const currentStage = boss.stages[bossState.stage]
  const hpPercent = Math.max(0, ((boss.stages.length - bossState.stage) / boss.stages.length) * 100)

  const handleSubmit = async () => {
    if (!code.trim() || running) return
    setRunning(true)
    try {
      const res = await api.post('/execute', {
        code,
        language: regionId,
        tests: [{ description: 'Boss test', expected: currentStage.expected }],
      })
      const passed = res.data.success

      if (passed) {
        dispatch({ type: 'CORRECT', stdout: res.data.stdout, totalStages: boss.stages.length })
        if (bossState.stage >= boss.stages.length - 1) {
          // Boss defeated — award XP
          triggerXPGain(boss.totalXP)
          await api.post('/progress/complete', {
            lessonId: `${regionId}-boss`,
            xpEarned: boss.totalXP,
          }).catch(() => {})
        }
      } else {
        dispatch({ type: 'WRONG', stdout: res.data.stdout })
      }
    } catch {
      dispatch({ type: 'WRONG', stdout: 'Server error — check your backend is running.' })
    } finally {
      setRunning(false)
    }
  }

  // ── Intro screen ─────────────────────────────────────────
  if (bossState.phase === 'intro') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          {/* Boss entrance animation */}
          <div className="text-9xl mb-6 animate-float">{boss.emoji}</div>
          <h1 className="font-quest text-5xl font-black text-quest-red mb-3">{boss.name}</h1>
          <p className="text-white/40 text-lg mb-2">{boss.region} — Final Guardian</p>
          <p className="text-white/60 mb-8">
            Defeat this boss in <strong className="text-white">{boss.stages.length} phases</strong>.
            You have <strong className="text-quest-red">{boss.lives} lives</strong>. Wrong answers cost a life.
            Lose all lives and the boss wins.
          </p>
          <div className="card mb-8 border-quest-red/20 bg-quest-red/5">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Boss HP</span><span>100%</span>
            </div>
            <div className="xp-bar">
              <div className="h-full bg-gradient-to-r from-quest-red to-orange-500 rounded-full w-full transition-all" />
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={() => dispatch({ type: 'START' })} className="btn-gold text-lg px-8 py-4">
              ⚔ Challenge Boss
            </button>
            <button onClick={() => navigate('/map')} className="btn-primary bg-white/10 hover:bg-white/20">
              Retreat
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Won screen ────────────────────────────────────────────
  if (bossState.phase === 'won') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="text-9xl mb-6 animate-float">🏆</div>
          <h1 className="font-quest text-5xl font-black text-quest-gold mb-3">Boss Defeated!</h1>
          <p className="text-white/60 mb-6">
            You conquered <strong className="text-white">{boss.name}</strong>!<br/>
            The {boss.region} is now yours.
          </p>
          <div className="card mb-8 border-quest-gold/30 bg-quest-gold/10">
            <div className="text-quest-gold font-bold text-3xl">+{boss.totalXP} XP</div>
            <div className="text-white/40 text-sm mt-1">Epic reward for defeating the boss</div>
          </div>
          <button onClick={() => navigate('/map')} className="btn-gold text-lg px-8 py-4">
            Return to World Map
          </button>
        </div>
      </div>
    )
  }

  // ── Lost screen ───────────────────────────────────────────
  if (bossState.phase === 'lost') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="text-9xl mb-6">{boss.emoji}</div>
          <h1 className="font-quest text-5xl font-black text-quest-red mb-3">Defeated!</h1>
          <p className="text-white/60 mb-8">
            {boss.name} was too powerful this time. Train harder and return!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCode(boss.stages[0].starterCode ?? '')
                dispatch({ type: 'RESET' })
                // Reset by re-mounting — navigate away and back
                navigate('/map')
              }}
              className="btn-primary bg-white/10 hover:bg-white/20"
            >
              ← Retreat to Map
            </button>
            <button onClick={() => window.location.reload()} className="btn-gold">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active fighting phase ─────────────────────────────────
  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Boss header */}
      <div className="bg-quest-darker border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Boss info */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{boss.emoji}</span>
            <div>
              <div className="font-quest font-bold text-quest-red">{boss.name}</div>
              <div className="text-white/30 text-xs">Phase {bossState.stage + 1} / {boss.stages.length}</div>
            </div>
          </div>

          {/* Boss HP bar */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Boss HP</span><span>{Math.round(hpPercent)}%</span>
            </div>
            <div className="xp-bar">
              <div
                className="h-full bg-gradient-to-r from-quest-red to-orange-500 rounded-full transition-all duration-700"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Player lives */}
          <div className="flex items-center gap-3">
            <Lives current={bossState.lives} max={boss.lives} />
          </div>
        </div>

        {/* Stage transition flash */}
        {bossState.phase === 'transition' && (
          <div className="text-center py-2 text-quest-teal text-sm font-bold animate-pulse">
            ✓ Phase cleared! Prepare for the next phase...
          </div>
        )}
      </div>

      {/* Main: problem + editor (same layout as LessonPage) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] overflow-hidden">

        {/* Problem */}
        <div className="border-r border-white/5 p-6 overflow-y-auto bg-quest-darker">
          <h2 className="font-quest text-xl font-bold text-quest-red mb-4">{currentStage.title}</h2>
          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
            {currentStage.description}
          </p>
        </div>

        {/* Editor */}
        <div className="flex flex-col border-r border-white/5">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-white/5">
            <span className="text-white/30 text-xs font-mono">battle.{regionId === 'python' ? 'py' : 'js'}</span>
            <button
              onClick={handleSubmit}
              disabled={running || bossState.phase === 'transition'}
              className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-semibold bg-quest-red/20 text-quest-red hover:bg-quest-red/30 border border-quest-red/30 transition-all disabled:opacity-40"
            >
              {running ? '⏳ Running...' : '⚔ Attack!'}
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={regionId}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"JetBrains Mono", monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16 },
              }}
            />
          </div>
        </div>

        {/* Output */}
        <div className="p-4 overflow-y-auto">
          <div className="text-white/30 text-xs uppercase tracking-wider mb-3">Output</div>
          {bossState.stdout ? (
            <pre className="bg-black/30 border border-white/10 rounded-lg p-3 font-mono text-sm text-white/70 whitespace-pre-wrap">
              {bossState.stdout}
            </pre>
          ) : (
            <div className="text-white/20 text-sm">Attack the boss to see output</div>
          )}
        </div>
      </div>
    </div>
  )
}
