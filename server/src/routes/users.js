/**
 * User routes: /api/users/*
 *
 * GET /api/users/stats        → XP, rank, language progress
 * GET /api/users/achievements → unlocked achievements
 * GET /api/users/equipment    → equipped items by slot
 */

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()
router.use(requireAuth)

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id

    // Count rank: how many users have more XP than this user?
    // rank = that count + 1
    const rank = await prisma.user.count({
      where: { xp: { gt: (await prisma.user.findUnique({ where: { id: userId }, select: { xp: true } }))?.xp ?? 0 } }
    }) + 1

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, points: true, duelsWon: true, duelsLost: true }
    })

    // Per-language lesson completion summary
    const progress = await prisma.progress.groupBy({
      by: ['regionId'],
      where: { userId },
      _count: { lessonId: true }
    })

    // Get total lessons per region from the Lesson table
    const lessonCounts = await prisma.lesson.groupBy({
      by: ['regionId'],
      _count: { id: true }
    })
    const lessonCountMap = Object.fromEntries(lessonCounts.map((l) => [l.regionId, l._count.id]))

    const languageProgress = progress.map((p) => ({
      language: p.regionId,
      completed: p._count.lessonId,
      total: lessonCountMap[p.regionId] ?? 10,
    }))

    res.json({ rank, ...user, languageProgress })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/achievements', async (req, res) => {
  try {
    const allAchievements = await prisma.achievement.findMany()
    const unlocked = await prisma.userAchievement.findMany({
      where: { userId: req.user.id },
      select: { achievementId: true }
    })
    const unlockedIds = new Set(unlocked.map((u) => u.achievementId))

    // Merge: all achievements + whether this user has unlocked each one
    const merged = allAchievements.map((a) => ({
      ...a,
      unlocked: unlockedIds.has(a.id)
    }))

    res.json(merged)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/equipment', async (req, res) => {
  try {
    const equipped = await prisma.userEquipment.findMany({
      where: { userId: req.user.id, equipped: true },
      include: { item: true }
    })

    // Return as { helmet: item, weapon: item, ... } keyed by slot
    const bySlot = {}
    equipped.forEach((e) => { bySlot[e.item.slot] = e.item })

    res.json(bySlot)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
