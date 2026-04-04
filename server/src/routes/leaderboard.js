/**
 * Leaderboard route: GET /api/leaderboard
 *
 * Returns top 50 players, optionally filtered by language.
 * Also returns the current user's rank.
 *
 * Query params:
 *   ?language=python  → filter to users who have completed python lessons
 */

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()
router.use(requireAuth)

router.get('/', async (req, res) => {
  const { language } = req.query

  try {
    let entries

    if (language) {
      // Language-specific leaderboard: rank by XP earned in that region only
      const regionProgress = await prisma.progress.groupBy({
        by: ['userId'],
        where: { regionId: language },
        _sum: { xpEarned: true },
        orderBy: { _sum: { xpEarned: 'desc' } },
        take: 50,
      })

      // Fetch user details for each entry
      const userIds = regionProgress.map((p) => p.userId)
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true, avatar: true, level: true, heroClass: true, xp: true, points: true }
      })
      const userMap = Object.fromEntries(users.map((u) => [u.id, u]))

      entries = regionProgress.map((p, i) => ({
        rank: i + 1,
        ...userMap[p.userId],
        xp: p._sum.xpEarned ?? 0,
        points: userMap[p.userId]?.points ?? 0,
      }))
    } else {
      // Global leaderboard: rank by total points
      const users = await prisma.user.findMany({
        orderBy: { points: 'desc' },
        take: 50,
        select: { id: true, username: true, avatar: true, level: true, heroClass: true, xp: true, points: true }
      })
      entries = users.map((u, i) => ({ rank: i + 1, ...u }))
    }

    // Current user's rank
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { xp: true, points: true, username: true, avatar: true, level: true, heroClass: true }
    })

    const userRankCount = await prisma.user.count({
      where: { points: { gt: currentUser?.points ?? 0 } }
    })

    res.json({
      entries,
      userRank: currentUser ? { rank: userRankCount + 1, ...currentUser } : null
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
