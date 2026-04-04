/**
 * ShopPage — spend points on character cosmetics and gear.
 *
 * Key concept: Optimistic updates
 * When the user clicks "Buy", we immediately mark the item as "owned" in local state
 * before the server responds. If the purchase fails, we revert.
 * This makes the UI feel instant instead of having a loading delay on every click.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import api from '../lib/api'

const RARITY_COLORS = {
  common:    { badge: 'bg-white/10 text-white/50',          glow: '', label: 'Common' },
  rare:      { badge: 'bg-blue-500/20 text-blue-400',       glow: 'hover:border-blue-500/40', label: 'Rare' },
  epic:      { badge: 'bg-quest-purple/20 text-quest-purple-light', glow: 'hover:border-quest-purple/40', label: 'Epic' },
  legendary: { badge: 'bg-quest-gold/20 text-quest-gold',   glow: 'hover:border-quest-gold/40', label: 'Legendary' },
}

const SLOT_LABELS = {
  helmet: '🪖 Helmet', armor: '🛡 Armor', weapon: '⚔ Weapon',
  boots: '👢 Boots', amulet: '📿 Amulet', ring: '💍 Ring',
}

const FILTER_TABS = ['All', 'Helmet', 'Armor', 'Weapon', 'Boots', 'Amulet', 'Ring']

export default function ShopPage() {
  const { user, refreshUser } = useAuthStore()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [buying, setBuying] = useState(null)   // itemId currently being purchased
  const [equipping, setEquipping] = useState(null)
  const [toast, setToast] = useState(null)     // { message, type: 'success'|'error' }

  useEffect(() => {
    api.get('/shop')
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleBuy = async (item) => {
    if (buying || item.owned) return
    if ((user?.points ?? 0) < item.cost) {
      showToast(`Need ${item.cost - (user?.points ?? 0)} more points`, 'error')
      return
    }

    setBuying(item.id)

    // Optimistic update: mark as owned immediately in local state
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, owned: true } : i))

    try {
      await api.post('/shop/buy', { itemId: item.id })
      // Refresh the auth store so the points balance updates in the Navbar
      await refreshUser()
      showToast(`${item.name} purchased!`)
    } catch (err) {
      // Revert the optimistic update on failure
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, owned: false } : i))
      showToast(err.response?.data?.error ?? 'Purchase failed', 'error')
    } finally {
      setBuying(null)
    }
  }

  const handleEquip = async (item) => {
    if (equipping || !item.owned) return
    setEquipping(item.id)

    // Optimistic update: toggle equipped state locally
    const wasEquipped = item.equipped
    setItems((prev) => prev.map((i) => {
      if (i.id === item.id) return { ...i, equipped: !wasEquipped }
      // Unequip other items in the same slot
      if (i.slot === item.slot && i.equipped && !wasEquipped) return { ...i, equipped: false }
      return i
    }))

    try {
      await api.post('/shop/equip', { itemId: item.id })
      showToast(wasEquipped ? `${item.name} unequipped` : `${item.name} equipped!`)
    } catch (err) {
      // Revert on failure
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, equipped: wasEquipped } : i))
      showToast('Failed to equip item', 'error')
    } finally {
      setEquipping(null)
    }
  }

  const filtered = activeFilter === 'All'
    ? items
    : items.filter((i) => i.slot === activeFilter.toLowerCase())

  return (
    <div className="min-h-screen pt-16">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl font-semibold shadow-xl transition-all ${
          toast.type === 'success'
            ? 'bg-quest-teal text-quest-darker'
            : 'bg-quest-red text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-quest text-4xl font-black text-white">Reward Shop</h1>
            <p className="text-white/40 mt-1">Spend your hard-earned points on gear and cosmetics</p>
          </div>
          <div className="card border-quest-gold/20 bg-quest-gold/5 text-center px-6 py-3">
            <div className="text-quest-gold font-bold text-2xl">{user?.points ?? 0}</div>
            <div className="text-white/40 text-xs">points</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === tab
                  ? 'bg-quest-purple text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab !== 'All' && SLOT_LABELS[tab.toLowerCase()]?.split(' ')[0]} {tab}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-56 animate-pulse bg-white/3 border-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/20">No items in this category yet</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => {
              const rarity = RARITY_COLORS[item.rarity] ?? RARITY_COLORS.common
              const canAfford = (user?.points ?? 0) >= item.cost
              const isBuying = buying === item.id
              const isEquipping = equipping === item.id

              return (
                <div
                  key={item.id}
                  className={`card flex flex-col items-center text-center border transition-all ${
                    item.equipped
                      ? 'border-quest-gold/40 bg-quest-gold/5'
                      : item.owned
                      ? 'border-quest-teal/20 bg-quest-teal/5'
                      : `border-white/5 ${rarity.glow}`
                  }`}
                >
                  {/* Rarity badge */}
                  <div className={`badge ${rarity.badge} self-start mb-3 text-xs`}>
                    {rarity.label}
                  </div>

                  {/* Item emoji */}
                  <div className={`text-5xl mb-3 ${item.equipped ? 'animate-pulse-slow' : ''}`}>
                    {item.emoji}
                  </div>

                  <div className="font-semibold text-white text-sm mb-1">{item.name}</div>
                  <div className="text-white/40 text-xs mb-1">{SLOT_LABELS[item.slot] ?? item.slot}</div>
                  <div className="text-quest-teal text-xs mb-4">{item.statBonus}</div>

                  {/* Action button — changes based on ownership and equip state */}
                  {item.owned ? (
                    <button
                      onClick={() => handleEquip(item)}
                      disabled={isEquipping}
                      className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                        item.equipped
                          ? 'bg-quest-gold/20 text-quest-gold border border-quest-gold/30 hover:bg-quest-gold/30'
                          : 'bg-quest-teal/20 text-quest-teal border border-quest-teal/20 hover:bg-quest-teal/30'
                      }`}
                    >
                      {isEquipping ? '...' : item.equipped ? '✓ Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={isBuying || !canAfford}
                      className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                        canAfford
                          ? 'bg-quest-gold/20 text-quest-gold border border-quest-gold/30 hover:bg-quest-gold/30'
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {isBuying ? '...' : `🪙 ${item.cost} pts`}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}