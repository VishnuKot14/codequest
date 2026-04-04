/**
 * Guild routes: /api/guilds/*
 *
 * GET  /api/guilds              → list all guilds (for browsing)
 * GET  /api/guilds/mine         → the current user's guild
 * POST /api/guilds              → create a guild
 * POST /api/guilds/:id/join     → join a guild
 * POST /api/guilds/:id/leave    → leave a guild
 * DELETE /api/guilds/:id        → disband (leader only)
 */

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()
router.use(requireAuth)

// List all guilds with member count, sorted by total XP
router.get('/', async (req, res) => {
  try {
    const guilds = await prisma.guild.findMany({
      orderBy: { totalXP: 'desc' },
      include: { _count: { select: { members: true } } },
    })
    res.json(guilds)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Get the user's current guild with full member list
router.get('/mine', async (req, res) => {
  try {
    const membership = await prisma.guildMember.findUnique({
      where: { userId: req.user.id },
    })
    if (!membership) return res.json(null)

    const guild = await prisma.guild.findUnique({
      where: { id: membership.guildId },
      include: {
        members: {
          include: {
            // We query the User table via a raw approach since we didn't add a relation field on User.
            // Instead, fetch member userIds and look them up separately.
          },
          orderBy: { joinedAt: 'asc' },
        },
        _count: { select: { members: true } },
      },
    })

    // Fetch user details for all members
    const userIds = guild.members.map((m) => m.userId)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, avatar: true, level: true, xp: true, heroClass: true },
    })
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]))

    const enrichedMembers = guild.members.map((m) => ({
      ...m,
      user: userMap[m.userId] ?? null,
    }))

    res.json({ ...guild, members: enrichedMembers, myRole: membership.role })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Create a new guild
router.post('/', async (req, res) => {
  const { name, tag, description, emblem } = req.body
  if (!name || !tag) return res.status(400).json({ error: 'name and tag are required' })
  if (tag.length > 6) return res.status(400).json({ error: 'Tag must be 6 characters or fewer' })

  try {
    // Check if user is already in a guild
    const existing = await prisma.guildMember.findUnique({ where: { userId: req.user.id } })
    if (existing) return res.status(409).json({ error: 'Leave your current guild first' })

    // Create guild + add creator as leader in one transaction
    const guild = await prisma.$transaction(async (tx) => {
      const g = await tx.guild.create({
        data: {
          name, tag,
          description: description ?? '',
          emblem: emblem ?? '🛡',
          leaderId: req.user.id,
        },
      })
      await tx.guildMember.create({
        data: { guildId: g.id, userId: req.user.id, role: 'leader' },
      })
      return g
    })

    res.status(201).json(guild)
  } catch (err) {
    // Prisma unique constraint violations use code P2002
    if (err.code === 'P2002') return res.status(409).json({ error: 'Guild name or tag already taken' })
    res.status(500).json({ error: 'Server error' })
  }
})

// Join a guild
router.post('/:id/join', async (req, res) => {
  try {
    const guild = await prisma.guild.findUnique({ where: { id: req.params.id } })
    if (!guild) return res.status(404).json({ error: 'Guild not found' })

    const existing = await prisma.guildMember.findUnique({ where: { userId: req.user.id } })
    if (existing) return res.status(409).json({ error: 'Leave your current guild before joining another' })

    // Add member + bump guild totalXP by the joining user's XP
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { xp: true } })
    await prisma.$transaction([
      prisma.guildMember.create({ data: { guildId: guild.id, userId: req.user.id } }),
      prisma.guild.update({ where: { id: guild.id }, data: { totalXP: { increment: user?.xp ?? 0 } } }),
    ])

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Leave a guild
router.post('/:id/leave', async (req, res) => {
  try {
    const membership = await prisma.guildMember.findUnique({ where: { userId: req.user.id } })
    if (!membership || membership.guildId !== req.params.id) {
      return res.status(400).json({ error: 'You are not in this guild' })
    }
    if (membership.role === 'leader') {
      return res.status(400).json({ error: 'Transfer leadership before leaving, or disband the guild' })
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { xp: true } })
    await prisma.$transaction([
      prisma.guildMember.delete({ where: { userId: req.user.id } }),
      prisma.guild.update({ where: { id: req.params.id }, data: { totalXP: { decrement: user?.xp ?? 0 } } }),
    ])

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Disband guild (leader only)
router.delete('/:id', async (req, res) => {
  try {
    const guild = await prisma.guild.findUnique({ where: { id: req.params.id } })
    if (!guild) return res.status(404).json({ error: 'Guild not found' })
    if (guild.leaderId !== req.user.id) return res.status(403).json({ error: 'Only the guild leader can disband' })

    // Cascade delete removes GuildMember rows too (defined in schema with onDelete: Cascade)
    await prisma.guild.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
