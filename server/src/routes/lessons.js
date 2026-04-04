/**
 * Lesson routes: /api/lessons/*
 *
 * GET /api/lessons/:id       → single lesson with its tests
 * GET /api/lessons?region=x  → all lessons in a region (ordered)
 */

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// All lesson routes require auth — you must be logged in to access content
router.use(requireAuth)

// Get a single lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      // include pulls in related records from other tables (the JOIN equivalent in Prisma)
      include: { tests: true }
    })
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' })
    res.json(lesson)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all lessons for a region, ordered by their position
router.get('/', async (req, res) => {
  const { region } = req.query
  if (!region) return res.status(400).json({ error: 'region query param required' })

  try {
    const lessons = await prisma.lesson.findMany({
      where: { regionId: region },
      orderBy: { order: 'asc' },
      // Don't include full description/starterCode in list view — bandwidth savings
      select: { id: true, title: true, order: true, xpReward: true, isBoss: true }
    })
    res.json(lessons)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
