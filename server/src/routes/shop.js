/**
 * Shop routes: /api/shop/*
 *
 * GET  /api/shop           → list all items (with "owned" flag for each)
 * POST /api/shop/buy       → purchase an item, deduct points
 * POST /api/shop/equip     → equip/unequip an item
 */

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()
router.use(requireAuth)

// List all shop items, annotated with whether the user already owns each one
router.get('/', async (req, res) => {
  try {
    const [items, owned] = await Promise.all([
      prisma.shopItem.findMany({ orderBy: [{ rarity: 'asc' }, { cost: 'asc' }] }),
      prisma.userEquipment.findMany({
        where: { userId: req.user.id },
        select: { itemId: true, equipped: true },
      }),
    ])

    // Build a fast lookup: itemId → { owned, equipped }
    const ownedMap = Object.fromEntries(owned.map((o) => [o.itemId, o]))

    const annotated = items.map((item) => ({
      ...item,
      owned:   !!ownedMap[item.id],
      equipped: ownedMap[item.id]?.equipped ?? false,
    }))

    res.json(annotated)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Purchase an item
// This is a database transaction: points deducted AND item granted must both succeed or both fail.
// Prisma's $transaction ensures atomicity — if anything throws, the whole thing rolls back.
router.post('/buy', async (req, res) => {
  const { itemId } = req.body
  if (!itemId) return res.status(400).json({ error: 'itemId required' })

  try {
    const [item, user, alreadyOwned] = await Promise.all([
      prisma.shopItem.findUnique({ where: { id: itemId } }),
      prisma.user.findUnique({ where: { id: req.user.id }, select: { points: true } }),
      prisma.userEquipment.findUnique({
        where: { userId_itemId: { userId: req.user.id, itemId } },
      }),
    ])

    if (!item) return res.status(404).json({ error: 'Item not found' })
    if (alreadyOwned) return res.status(409).json({ error: 'You already own this item' })
    if ((user?.points ?? 0) < item.cost) {
      return res.status(400).json({ error: `Not enough points (need ${item.cost}, have ${user?.points ?? 0})` })
    }

    // Atomic transaction: deduct points + create ownership record together
    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user.id },
        data: { points: { decrement: item.cost } },
      }),
      prisma.userEquipment.create({
        data: { userId: req.user.id, itemId, equipped: false },
      }),
    ])

    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true },
    })

    res.json({ success: true, remainingPoints: updatedUser?.points })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Toggle equip/unequip — only one item per slot can be equipped at a time
router.post('/equip', async (req, res) => {
  const { itemId } = req.body
  if (!itemId) return res.status(400).json({ error: 'itemId required' })

  try {
    const ownership = await prisma.userEquipment.findUnique({
      where: { userId_itemId: { userId: req.user.id, itemId } },
      include: { item: true },
    })
    if (!ownership) return res.status(403).json({ error: 'You do not own this item' })

    if (ownership.equipped) {
      // Unequip
      await prisma.userEquipment.update({
        where: { userId_itemId: { userId: req.user.id, itemId } },
        data: { equipped: false },
      })
      return res.json({ equipped: false })
    }

    // Unequip any other item in the same slot first, then equip the new one
    const sameSlotItems = await prisma.userEquipment.findMany({
      where: { userId: req.user.id, equipped: true, item: { slot: ownership.item.slot } },
      select: { itemId: true },
    })

    await prisma.$transaction([
      // Unequip existing same-slot items
      ...sameSlotItems.map((s) =>
        prisma.userEquipment.update({
          where: { userId_itemId: { userId: req.user.id, itemId: s.itemId } },
          data: { equipped: false },
        })
      ),
      // Equip the new item
      prisma.userEquipment.update({
        where: { userId_itemId: { userId: req.user.id, itemId } },
        data: { equipped: true },
      }),
    ])

    res.json({ equipped: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
