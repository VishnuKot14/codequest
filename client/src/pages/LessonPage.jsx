import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useAuthStore, useGameStore } from '../lib/store'
import api from '../lib/api'

// Fallback lesson data used when the backend isn't running yet.
// In production all lessons come from the database.
const FALLBACK_LESSON = {
  id: 'python-1',
  title: 'Hello, World!',
  language: 'python',
  xpReward: 50,
  description: `## Your First Quest: Hello, World!

Every adventurer starts the same way — by making the world hear them.

In Python, you output text with the **print()** function:

\`\`\`python
print("Hello, World!")
\`\`\`

### Your Mission
Write a program that prints exactly:
\`\`\`
Hello, Quest!
\`\`\`

### Hints
- Python is case-sensitive: \`Print\` is not the same as \`print\`
- The text must be inside quotes (single or double both work)
- Don't forget the parentheses!`,
  starterCode: '# Write your code below\n',
  tests: [
    { description: 'Output contains "Hello, Quest!"', expected: 'Hello, Quest!' },
  ],
}

// Maps language name → Monaco editor language ID
const LANG_MAP = {
  python: 'python', javascript: 'javascript', typescript: 'typescript',
  rust: 'rust', go: 'go', sql: 'sql',
}

// Simple markdown renderer — converts headings, bold, code blocks to JSX
function SimpleMarkdown({ content }) {
  // Split by code blocks first, then handle inline markdown
  const parts = content.split(/(```[\s\S]*?```)/g)
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```\w*\n?/, '').replace(/```$/, '').trim()
          return (
            <pre key={i} className="bg-black/30 border border-white/10 rounded-lg p-4 font-mono text-sm text-quest-teal overflow-x-auto">
              <code>{code}</code>
            </pre>
          )
        }
        // Inline formatting: ## headings, **bold**, `inline code`
        return (
          <div key={i}>
            {part.split('\n').map((line, j) => {
              if (line.startsWith('## ')) return <h2 key={j} className="font-quest text-xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>
              if (line.startsWith('### ')) return <h3 key={j} className="font-semibold text-quest-purple-light mt-4 mb-2">{line.slice(4)}</h3>
              if (line.startsWith('- ')) return <li key={j} className="text-white/60 text-sm ml-4 list-disc">{line.slice(2)}</li>
              if (!line.trim()) return <div key={j} className="h-2" />
              // Replace **bold** and `code` inline
              const formatted = line
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                .replace(/`(.*?)`/g, '<code class="bg-black/30 text-quest-teal px-1 rounded text-sm">$1</code>')
              return <p key={j} className="text-white/60 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function LessonPage() {
  // useParams reads URL segments — for /lesson/python-3, id = "python-3"
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { triggerXPGain } = useGameStore()

  const [lesson, setLesson] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState(null)  // { success, stdout, testResults }
  const [running, setRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Fetch lesson from server when the URL changes
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${id}`)
        setLesson(res.data)
        setCode(res.data.starterCode || '')
      } catch {
        // Use fallback for development
        setLesson(FALLBACK_LESSON)
        setCode(FALLBACK_LESSON.starterCode)
      }
    }
    fetchLesson()
    // Reset state when navigating to a new lesson
    setOutput(null)
    setCompleted(false)
    setShowHint(false)
  }, [id]) // re-run whenever `id` changes

  const handleRunCode = async () => {
    if (!code.trim() || running) return
    setRunning(true)
    setOutput(null)

    try {
      // POST to /api/execute — server runs code in a sandboxed environment
      const res = await api.post('/execute', {
        code,
        language: lesson.language,
        lessonId: lesson.id,
        tests: lesson.tests,
      })

      setOutput(res.data)

      // If all tests passed, mark lesson complete and award XP
      if (res.data.success && !completed) {
        setCompleted(true)
        triggerXPGain(lesson.xpReward) // shows the XPToast notification
        // Record progress on the server
        await api.post('/progress/complete', {
          lessonId: lesson.id,
          xpEarned: lesson.xpReward,
        })
      }
    } catch (err) {
      setOutput({
        success: false,
        stdout: err.response?.data?.error || 'Server error. Make sure the backend is running.',
        testResults: [],
      })
    } finally {
      setRunning(false)
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-white/40">Loading quest...</div>
      </div>
    )
  }

  // Parse lesson ID to build prev/next navigation (e.g. python-1 → python-2)
  const [regionId, lessonNum] = id.split('-')
  const prevId = parseInt(lessonNum) > 1 ? `${regionId}-${parseInt(lessonNum) - 1}` : null
  const nextId = `${regionId}-${parseInt(lessonNum) + 1}`

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Top bar: lesson title + navigation */}
      <div className="border-b border-white/5 bg-quest-darker px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/map')} className="text-white/30 hover:text-white text-sm transition-colors">
            ← Map
          </button>
          <span className="text-white/10">/</span>
          <h1 className="font-quest font-bold text-white">{lesson.title}</h1>
          {completed && (
            <span className="badge bg-quest-teal/20 text-quest-teal border border-quest-teal/30">✓ Completed +{lesson.xpReward}XP</span>
          )}
        </div>

        {/* Prev / Next lesson navigation */}
        <div className="flex items-center gap-2">
          {prevId && (
            <button onClick={() => navigate(`/lesson/${prevId}`)} className="text-white/40 hover:text-white text-sm px-3 py-1 rounded border border-white/10 hover:border-white/30 transition-all">
              ← Prev
            </button>
          )}
          <button onClick={() => navigate(`/lesson/${nextId}`)} className="text-white/40 hover:text-white text-sm px-3 py-1 rounded border border-white/10 hover:border-white/30 transition-all">
            Next →
          </button>
        </div>
      </div>

      {/* Main 3-panel layout — uses CSS Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] overflow-hidden">

        {/* ── Panel 1: Lesson instructions ── */}
        <div className="border-r border-white/5 overflow-y-auto p-6 bg-quest-darker">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge bg-quest-purple/20 text-quest-purple-light">{lesson.language}</span>
            <span className="badge bg-quest-gold/20 text-quest-gold">+{lesson.xpReward} XP</span>
          </div>

          <SimpleMarkdown content={lesson.description} />

          {/* Hint toggle */}
          {lesson.hint && (
            <div className="mt-6">
              <button
                onClick={() => setShowHint((h) => !h)}
                className="text-quest-purple-light hover:text-white text-sm flex items-center gap-1.5 transition-colors"
              >
                {showHint ? '▾' : '▸'} {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              {showHint && (
                <div className="mt-3 bg-quest-purple/10 border border-quest-purple/20 rounded-lg p-4 text-white/60 text-sm">
                  💡 {lesson.hint}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Panel 2: Monaco Code Editor ── */}
        <div className="flex flex-col border-r border-white/5">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-white/5">
            <span className="text-white/30 text-xs font-mono">solution.{lesson.language === 'python' ? 'py' : lesson.language}</span>
            <button
              onClick={handleRunCode}
              disabled={running}
              className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-semibold transition-all
                ${running
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-quest-teal/20 text-quest-teal hover:bg-quest-teal/30 border border-quest-teal/30'
                }`}
            >
              {running ? (
                <>
                  <span className="w-3 h-3 border border-white/30 border-t-transparent rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>▶ Run Code</>
              )}
            </button>
          </div>

          {/*
            Monaco Editor — the full VS Code editor embedded in the browser.
            onChange fires every keystroke, updating our `code` state.
            theme="vs-dark" matches our dark UI.
          */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={LANG_MAP[lesson.language] || 'plaintext'}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"JetBrains Mono", monospace',
                minimap: { enabled: false },     // hide the minimap — too small for learning
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 16 },
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* ── Panel 3: Output + test results ── */}
        <div className="flex flex-col bg-quest-darker overflow-y-auto">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-white/40 text-sm font-medium">Output</span>
          </div>

          <div className="flex-1 p-4">
            {!output && !running && (
              <div className="text-white/20 text-sm text-center mt-10">
                ▶ Run your code to see results
              </div>
            )}

            {running && (
              <div className="flex items-center gap-2 text-white/40 text-sm mt-10 justify-center">
                <span className="w-4 h-4 border border-white/30 border-t-transparent rounded-full animate-spin" />
                Executing...
              </div>
            )}

            {output && (
              <div className="space-y-4">
                {/* stdout */}
                {output.stdout && (
                  <div>
                    <div className="text-white/30 text-xs mb-2 uppercase tracking-wider">Console</div>
                    <pre className="bg-black/30 border border-white/10 rounded-lg p-3 font-mono text-sm text-white/80 whitespace-pre-wrap">
                      {output.stdout}
                    </pre>
                  </div>
                )}

                {/* Test results — each test shows pass/fail */}
                {output.testResults?.length > 0 && (
                  <div>
                    <div className="text-white/30 text-xs mb-2 uppercase tracking-wider">Tests</div>
                    <div className="space-y-2">
                      {output.testResults.map((t, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${
                            t.passed
                              ? 'bg-quest-teal/10 border-quest-teal/20 text-quest-teal'
                              : 'bg-quest-red/10 border-quest-red/20 text-quest-red'
                          }`}
                        >
                          <span>{t.passed ? '✓' : '✗'}</span>
                          <span>{t.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overall result banner */}
                <div className={`p-4 rounded-xl border text-center font-quest font-bold ${
                  output.success
                    ? 'bg-quest-teal/10 border-quest-teal/30 text-quest-teal'
                    : 'bg-quest-red/10 border-quest-red/30 text-quest-red'
                }`}>
                  {output.success ? '⭐ Quest Complete!' : '💀 Not quite — try again!'}
                </div>

                {output.success && (
                  <button
                    onClick={() => navigate(`/lesson/${nextId}`)}
                    className="btn-gold w-full"
                  >
                    Next Quest →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
