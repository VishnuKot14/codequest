/**
 * Auth routes: /api/auth/*
 *
 * POST /api/auth/register  → create account
 * POST /api/auth/login     → get a token
 * GET  /api/auth/me        → get current user (requires token)
 */

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { signToken, requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// ── Register ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password, avatar, heroClass } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' })
  }

  try {
    // Check for existing account — Prisma will throw if unique constraint fails,
    // but we give a clearer error by checking manually first
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })
    if (existing) {
      return res.status(409).json({
        error: existing.email === email ? 'Email already registered' : 'Username taken'
      })
    }

    // bcrypt.hash(password, 12) — the 12 is the "salt rounds".
    // Higher = slower to crack if db is stolen, but also slower to hash.
    // 12 is a good balance for 2024 hardware.
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatar: avatar ?? '⚔️',
        heroClass: heroClass ?? 'warrior',
      },
      // Only return safe fields — never send the password hash to the client
      select: { id: true, username: true, email: true, avatar: true, heroClass: true, xp: true, level: true, points: true }
    })

    const token = signToken({ id: user.id, username: user.username, email: user.email })
    res.status(201).json({ user, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Login ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    // We use the same generic error for "not found" and "wrong password"
    // to prevent email enumeration attacks (attackers figuring out which emails are registered)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signToken({ id: user.id, username: user.username, email: user.email })
    const { password: _, ...safeUser } = user // destructure out password before sending
    res.json({ user: safeUser, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Get current user ─────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, email: true, avatar: true, heroClass: true, xp: true, level: true, points: true, streak: true, duelsWon: true }
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
