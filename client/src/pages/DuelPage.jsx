/**
 * DuelPage — real-time PvP coding battle screen.
 *
 * The page is driven by a state machine: idle → queued → active → finished.
 * Each state renders a completely different UI:
 *   idle:     Language selector + "Find Opponent" button
 *   queued:   Animated "searching..." screen
 *   active:   Split-screen editor (like LessonPage but competitive)
 *   finished: Win/loss result screen
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useAuthStore } from '../lib/store'
import { useDuelSocket } from '../hooks/useDuelSocket'

const LANGUAGES = [
  { id: 'python',     label: 'Python',     emoji: '🐍' },
  { id: 'javascript', label: 'JavaScript', emoji: '⚡' },
]

export default function DuelPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [selectedLang, setSelectedLang] = useState('python')
  const [code, setCode] = useState('')

  const {
    status,
    problem,
    opponentName,
    result,
    submitResult,
    opponentSubmitted,
    queueMessage,
    connect,
    submit,
    forfeit,
  } = useDuelSocket(selectedLang)

  // When a duel starts, pre-fill the editor with the starter code
  const handleDuelStart = () => {
    if (problem?.starterCode) setCode(problem.starterCode)
  }

  // Whenever status becomes 'active' and we have a problem, set starter code
  if (status === 'active' && problem && !code) {
    setCode(problem.starterCode ?? '')
  }

  // ── Idle: pick language + find opponent ──────────────────
  if (status === 'idle') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">⚔</div>
            <h1 className="font-quest text-4xl font-black text-white">PvP Duel</h1>
            <p className="text-white/40 mt-2">
              Challenge a random opponent to a real-time coding battle. First to solve wins.
            </p>
          </div>

          {/* Language selector */}
          <div className="card mb-6">
            <h2 className="text-white/60 text-sm font-medium mb-3">Choose Language</h2>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedLang === lang.id
                      ? 'border-quest-purple bg-quest-purple/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-3xl mb-2">{lang.emoji}</div>
                  <div className="font-semibold text-white">{lang.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="card mb-6 border-white/5 text-sm text-white/40 space-y-2">
            <p>⚡ You'll be matched with the next available opponent</p>
            <p>🧩 Both players get the same problem simultaneously</p>
            <p>🏆 First to submit a passing solution wins 100 points</p>
            <p>💀 Disconnecting counts as a forfeit</p>
          </div>

          <button onClick={connect} className="btn-gold w-full text-lg py-4">
            ⚔ Find Opponent
          </button>
        </div>
      </div>
    )
  }

  // ── Queued: searching for opponent ──────────────────────
  if (status === 'queued') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">⚔</div>
          <h2 className="font-quest text-2xl font-bold text-white mb-3">Searching for Opponent</h2>
          <p className="text-white/40 mb-8">{queueMessage}</p>

          {/* Pulsing rings — pure CSS animation to show activity */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-quest-purple/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-quest-purple/50 animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-4 rounded-full bg-quest-purple/20 flex items-center justify-center">
              <span className="text-2xl">🗡</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/map')}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // ── Finished: win/loss screen ────────────────────────────
  if (status === 'finished' && result) {
    const won = result.youWon
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-8xl mb-6">{won ? '🏆' : '💀'}</div>

          <h1 className={`font-quest text-5xl font-black mb-3 ${won ? 'text-quest-gold' : 'text-quest-red'}`}>
            {won ? 'Victory!' : 'Defeat'}
          </h1>

          <p className="text-white/60 text-lg mb-2">
            {result.forfeit
              ? (won ? `${opponentName} forfeited.` : 'You forfeited.')
              : result.disconnect
              ? (won ? `${opponentName} disconnected.` : 'You disconnected.')
              : (won ? `You solved it before ${opponentName}!` : `${opponentName} solved it first.`)}
          </p>

          {won && (
            <div className="card mt-6 mb-8 bg-quest-gold/10 border-quest-gold/30 text-center">
              <div className="text-quest-gold font-bold text-2xl">+100 Points</div>
              <div className="text-white/40 text-sm">added to your account</div>
            </div>
          )}

          <div className="flex gap-4 justify-center mt-6">
            <button onClick={connect} className="btn-gold">
              ⚔ Rematch
            </button>
            <button onClick={() => navigate('/map')} className="btn-primary bg-white/10 hover:bg-white/20">
              Back to Map
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active: live duel editor ─────────────────────────────
  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Duel header bar */}
      <div className="bg-quest-darker border-b border-white/5 px-6 py-3 flex items-center justify-between">
        {/* Left: current user */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-quest-purple to-quest-teal flex items-center justify-center text-sm font-bold">
            {user?.avatar ?? '⚔'}
          </div>
          <span className="font-semibold text-white text-sm">{user?.username}</span>
          <span className="badge bg-quest-teal/20 text-quest-teal text-xs">You</span>
        </div>

        {/* Center: VS + problem title */}
        <div className="text-center">
          <div className="font-quest text-quest-gold font-bold">VS</div>
          <div className="text-white/40 text-xs">{problem?.title}</div>
        </div>

        {/* Right: opponent */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-quest-red to-orange-500 flex items-center justify-center text-sm font-bold">
            {opponentName?.[0]?.toUpperCase()}
          </div>
          <span className="font-semibold text-white text-sm">{opponentName}</span>
          {opponentSubmitted && (
            <span className="badge bg-orange-500/20 text-orange-400 text-xs animate-pulse">Submitting...</span>
          )}
        </div>
      </div>

      {/* Main: problem + editor */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr] overflow-hidden">

        {/* Problem description */}
        <div className="border-r border-white/5 p-6 overflow-y-auto bg-quest-darker">
          <h2 className="font-quest font-bold text-white text-xl mb-4">{problem?.title}</h2>
          <div className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
            {problem?.description}
          </div>

          {/* Wrong answer feedback */}
          {submitResult && !submitResult.passed && (
            <div className="mt-6 bg-quest-red/10 border border-quest-red/20 rounded-lg p-4">
              <div className="text-quest-red text-sm font-semibold mb-2">✗ Not quite</div>
              <pre className="text-white/60 text-xs font-mono whitespace-pre-wrap">{submitResult.stdout}</pre>
            </div>
          )}

          {/* Forfeit button */}
          <button
            onClick={forfeit}
            className="mt-8 text-white/20 hover:text-quest-red text-xs transition-colors"
          >
            Forfeit duel
          </button>
        </div>

        {/* Editor */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-white/5">
            <span className="text-white/30 text-xs font-mono">
              solution.{selectedLang === 'python' ? 'py' : 'js'}
            </span>
            <button
              onClick={() => submit(code)}
              className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-semibold bg-quest-gold/20 text-quest-gold hover:bg-quest-gold/30 border border-quest-gold/30 transition-all"
            >
              ⚔ Submit
            </button>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              language={selectedLang}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"JetBrains Mono", monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 16 },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
