/**
 * Entry point for the CodeQuest Express server.
 *
 * How it works:
 *  1. We create an explicit HTTP server (so Express + WebSocket share one port)
 *  2. Register middleware (cors, json parsing)
 *  3. Mount route handlers at /api/* paths
 *  4. Attach the WebSocket duel server to the same HTTP server
 *  5. Start listening on port 5000
 */

import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import lessonRoutes from './routes/lessons.js'
import progressRoutes from './routes/progress.js'
import executeRoutes from './routes/execute.js'
import userRoutes from './routes/users.js'
import leaderboardRoutes from './routes/leaderboard.js'
import duelRoutes from './routes/duels.js'
import shopRoutes from './routes/shop.js'
import guildRoutes from './routes/guilds.js'
import { attachDuelServer } from './ws/duelServer.js'
import { seed } from './seed.js'
import { PrismaClient } from '@prisma/client'

const app = express()
// We create an explicit HTTP server so we can attach both Express AND WebSocket to the same port.
// app.listen() creates one internally — here we do it manually so attachDuelServer can use it.
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000

// ── Middleware ──
// cors() allows the frontend to make requests to this server.
// In dev: only localhost:3000 is allowed.
// In production: CLIENT_URL is set to the Vercel frontend URL via environment variable.
// Without the right origin here, browsers block the request with a CORS error.
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
]
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

// express.json() parses incoming request bodies as JSON automatically.
// Without this, req.body would be undefined.
app.use(express.json())

// ── Routes ──
// All routes are prefixed with /api so the Vite proxy can forward them correctly.
app.use('/api/auth',        authRoutes)
app.use('/api/lessons',     lessonRoutes)
app.use('/api/progress',    progressRoutes)
app.use('/api/execute',     executeRoutes)
app.use('/api/users',       userRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/duels',       duelRoutes)
app.use('/api/shop',        shopRoutes)
app.use('/api/guilds',      guildRoutes)

// Health check endpoint — useful for verifying the server is up
app.get('/api/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0' }))

// 404 handler — catches any unmatched routes
// The leading underscore on _req is a convention meaning "required by Express signature but unused"
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// Global error handler — Express calls this when next(err) is invoked inside any route.
// The 4-parameter signature is what tells Express this is an error handler (not a normal middleware).
// _req and _next are unused but required for Express to recognise the 4-arg error handler signature.
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

// ── WebSocket duel server ──
// Attaches to the same httpServer so both HTTP and WS traffic share port 5000.
// WebSocket connections arrive at ws://localhost:5000/ws/duel
attachDuelServer(httpServer)

// Auto-seed the database on first run if no lessons exist yet
const prisma = new PrismaClient()
async function startServer() {
  const lessonCount = await prisma.lesson.count()
  if (lessonCount === 0) {
    console.log('📦 No lessons found — running seed...')
    await seed()
  }
  await prisma.$disconnect()

  httpServer.listen(PORT, () => {
    console.log(`🗡  CodeQuest server running on http://localhost:${PORT}`)
    console.log(`⚔  Duel WebSocket ready at ws://localhost:${PORT}/ws/duel`)
  })
}

startServer().catch((e) => { console.error(e); process.exit(1) })
