/**
 * Duel REST routes: /api/duels/*
 *
 * The actual real-time duel logic lives in ws/duelServer.js (WebSocket).
 * These REST routes handle non-real-time duel data: history, stats.
 *
 * GET /api/duels/history  → the current user's past duels
 * GET /api/duels/stats    → win/loss record
 */

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()
router.use(requireAuth)

// Duel history: last 20 duels the user participated in
router.get('/history', async (req, res) => {
  try {
    const duels = await prisma.duel.findMany({
      where: {
        // OR: matches duels where user was either the challenger or the opponent
        OR: [{ challengerId: req.user.id }, { opponentId: req.user.id }],
        status: 'complete',
      },
      orderBy: { completedAt: 'desc' },
      take: 20,
      // include pulls in the related User rows so we get usernames/avatars
      include: {
        challenger: { select: { username: true, avatar: true } },
        opponent:   { select: { username: true, avatar: true } },
      },
    })

    // Add a derived field: did the current user win this duel?
    const formatted = duels.map((d) => ({
      ...d,
      won: d.winnerId === req.user.id,
    }))

    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Win/loss summary
router.get('/stats', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { duelsWon: true, duelsLost: true },
    })
    const total = (user?.duelsWon ?? 0) + (user?.duelsLost ?? 0)
    const winRate = total === 0 ? 0 : Math.round((user.duelsWon / total) * 100)
    res.json({ ...user, total, winRate })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
