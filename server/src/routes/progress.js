/**
 * Progress routes: /api/progress/*
 *
 * GET  /api/progress/map     → user's progress across all regions (for map page)
 * POST /api/progress/complete → record a completed lesson + award XP
 */

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(requireAuth)

// Get map-level progress: one entry per region the user has touched
router.get('/map', async (req, res) => {
  try {
    // Prisma groupBy + _count aggregates completedLessons per region for this user
    const rawProgress = await prisma.progress.groupBy({
      by: ['regionId'],
      where: { userId: req.user.id },
      _count: { lessonId: true }
    })

    // Format for the frontend: [{ regionId, completedLessons, bossDefeated }]
    const formatted = rawProgress.map((p) => ({
      regionId: p.regionId,
      completedLessons: p._count.lessonId,
      bossDefeated: false, // TODO: check if the boss lesson is in the completed set
    }))

    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Record a lesson completion + award XP and check for level-up
router.post('/complete', async (req, res) => {
  const { lessonId, xpEarned } = req.body
  if (!lessonId || xpEarned == null) {
    return res.status(400).json({ error: 'lessonId and xpEarned required' })
  }

  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' })

    // upsert: create if not exists, otherwise increment attempts
    // This handles cases where the user re-submits a lesson they already completed
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId: req.user.id, lessonId } },
      create: { userId: req.user.id, lessonId, regionId: lesson.regionId, xpEarned },
      update: { attempts: { increment: 1 } }
    })

    // Award XP and update level
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    const newXP = user.xp + xpEarned
    // Level formula: each level needs level * 100 XP
    // We recalculate level from total XP using a loop
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
      data: { xp: newXP, level: newLevel },
      select: { xp: true, level: true, points: true }
    })

    res.json({ success: true, ...updatedUser, leveledUp: newLevel > user.level })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
