/**
 * Code execution route: POST /api/execute
 *
 * Security note: We receive user-submitted code and run it as a subprocess.
 * Each language has a different execution model:
 *   - Interpreted (Python, JS): write file → run interpreter
 *   - Compiled (Rust, Go): write file → compile → run binary → clean up binary
 *   - Query (SQL): run against an in-memory SQLite database
 *
 * All executions are protected by a 5-second timeout.
 * In production use a proper sandbox (Docker/Firecracker/Judge0).
 */

import { Router } from 'express'
import { exec } from 'child_process'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── Language execution strategies ─────────────────────────
//
// Each entry is a function that receives the temp file path and returns:
//   { command: string, cleanup?: string[] }
// For compiled languages, cleanup lists extra files to delete after running.

function makeId() {
  return `cq_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

const STRATEGIES = {
  python: (filepath) => ({
    command: `python3 "${filepath}"`,
    cleanup: [],
  }),

  javascript: (filepath) => ({
    command: `node "${filepath}"`,
    cleanup: [],
  }),

  typescript: (filepath) => ({
    // ts-node runs TypeScript directly without a separate compile step.
    // Requires: npm install -g ts-node typescript
    command: `ts-node "${filepath}"`,
    cleanup: [],
  }),

  go: (filepath) => {
    // Go requires compilation. We compile to a temp binary then run it.
    // The binary gets a unique name so concurrent executions don't conflict.
    const binary = filepath.replace('.go', '')
    return {
      // Shell: compile first, then run binary if compile succeeded
      command: `go build -o "${binary}" "${filepath}" && "${binary}"`,
      cleanup: [binary],  // delete the compiled binary after running
    }
  },

  rust: (filepath) => {
    // Rust also compiles first. `rustc` is the Rust compiler.
    const binary = filepath.replace('.rs', '')
    return {
      command: `rustc "${filepath}" -o "${binary}" && "${binary}"`,
      cleanup: [binary],
    }
  },

  sql: (filepath) => ({
    // SQLite3 CLI: read the .sql file and execute it against an in-memory DB.
    // ":memory:" means the DB exists only for this execution, then is discarded.
    command: `sqlite3 :memory: < "${filepath}"`,
    cleanup: [],
  }),
}

const EXTENSIONS = {
  python: 'py', javascript: 'js', typescript: 'ts',
  go: 'go', rust: 'rs', sql: 'sql',
}

// ── Helper: run a shell command with timeout ───────────────
function runCommand(command, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { timeout: timeoutMs, maxBuffer: 1024 * 64 },
      (error, stdout, stderr) => {
        if (error?.killed) return reject(new Error('⏰ Time limit exceeded (8s)'))
        // For compile errors, stderr is the primary output — include it
        resolve({ stdout, stderr })
      }
    )
  })
}

// ── Helper: delete files silently ─────────────────────────
async function cleanupFiles(files) {
  await Promise.all(files.map((f) => unlink(f).catch(() => {})))
}

router.post('/', requireAuth, async (req, res) => {
  const { code, language, tests = [] } = req.body

  if (!code || !language) {
    return res.status(400).json({ error: 'code and language required' })
  }

  const strategy = STRATEGIES[language]
  if (!strategy) {
    return res.status(400).json({
      error: `Language '${language}' not supported. Supported: ${Object.keys(STRATEGIES).join(', ')}`,
    })
  }

  const ext = EXTENSIONS[language] ?? 'txt'
  const id = makeId()
  const filepath = join(tmpdir(), `${id}.${ext}`)

  try {
    await writeFile(filepath, code, 'utf-8')
    const { command, cleanup } = strategy(filepath)

    let rawOutput
    try {
      const { stdout, stderr } = await runCommand(command)
      // Combine stdout + stderr so users see compiler errors in the output panel
      rawOutput = stdout + (stderr ? `\n[stderr]:\n${stderr}` : '')
    } catch (execErr) {
      // Execution itself failed (timeout, crash, compile error)
      rawOutput = execErr.message
    } finally {
      // Always clean up the source file and any compiled artifacts
      await cleanupFiles([filepath, ...cleanup])
    }

    const output = rawOutput.trim()

    // Run tests: check if the expected string appears anywhere in output
    const testResults = tests.map((test) => ({
      description: test.description,
      passed: output.includes(test.expected),
    }))

    const allPassed = testResults.length > 0 && testResults.every((t) => t.passed)

    res.json({ success: allPassed, stdout: output, testResults })
  } catch (err) {
    // Outer catch: file write failed or other unexpected error
    await cleanupFiles([filepath])
    res.json({
      success: false,
      stdout: `Server error: ${err.message}`,
      testResults: tests.map((t) => ({ description: t.description, passed: false })),
    })
  }
})

export default router
