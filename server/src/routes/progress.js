import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(requireAuth)

// Get map-level progress: one entry per region the user has touched
router.get('/map', async (req, res) => {
  try {
    const rawProgress = await prisma.progress.groupBy({
      by: ['regionId'],
      where: { userId: req.user.id },
      _count: { lessonId: true }
    })

    const formatted = rawProgress.map((p) => ({
      regionId: p.regionId,
      completedLessons: p._count.lessonId,
      bossDefeated: false,
    }))

    res.json(formatted)
  } catch (err) {
    console.error('progress/map error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Check if a specific lesson is completed by the current user
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const record = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId: req.user.id, lessonId: req.params.lessonId } }
    })
    res.json({ completed: !!record })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Record a lesson completion + award XP
router.post('/complete', async (req, res) => {
  const { lessonId, xpEarned } = req.body

  if (!lessonId) {
    return res.status(400).json({ error: 'lessonId required' })
  }

  // Ensure xpEarned is a valid number — default to 50 if missing
  const xp = parseInt(xpEarned) || 50

  // Derive regionId from lessonId: "python-3" → "python", "javascript-1" → "javascript"
  const parts = lessonId.split('-')
  const regionId = parts.slice(0, -1).join('-') || lessonId

  try {
    // Check if already completed — only award XP on first completion
    const existing = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId: req.user.id, lessonId } }
    })

    if (existing) {
      // Already completed — just increment attempts, no XP awarded
      await prisma.progress.update({
        where: { userId_lessonId: { userId: req.user.id, lessonId } },
        data: { attempts: { increment: 1 } }
      })
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { xp: true, level: true, points: true }
      })
      return res.json({ success: true, ...user, leveledUp: false, alreadyCompleted: true })
    }

    // First completion — save progress record
    await prisma.progress.create({
      data: { userId: req.user.id, lessonId, regionId, xpEarned: xp }
    })

    // Points awarded per lesson = xp / 5 (so a 50xp lesson gives 10 points)
    // Points are the leaderboard currency; XP is for leveling up
    const pointsEarned = Math.floor(xp / 5)

    // Award XP and recalculate level
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    const newXP = (user.xp || 0) + xp

    let newLevel = 1
    let xpNeeded = 100
    let remaining = newXP
    while (remaining >= xpNeeded) {
      remaining -= xpNeeded
      newLevel++
      xpNeeded = newLevel * 100
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { xp: newXP, level: newLevel, points: { increment: pointsEarned } },
      select: { xp: true, level: true, points: true }
    })

    res.json({ success: true, ...updatedUser, leveledUp: newLevel > user.level })
  } catch (err) {
    console.error('progress/complete error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
