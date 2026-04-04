import { useState, useEffect } from 'react'
import { useAuthStore } from '../lib/store'
import api from '../lib/api'

const EQUIPMENT_SLOTS = ['helmet', 'armor', 'weapon', 'boots', 'amulet', 'ring']

// Display a single equipment slot — empty or equipped item
function EquipSlot({ slot, item }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-4 border-white/5 hover:border-quest-purple/30 transition-colors cursor-pointer">
      {item ? (
        <>
          <div className="text-3xl">{item.emoji}</div>
          <div className="text-white text-xs font-medium text-center">{item.name}</div>
          <div className="text-quest-gold text-xs">+{item.statBonus}</div>
        </>
      ) : (
        <>
          <div className="text-3xl opacity-20">🔲</div>
          <div className="text-white/20 text-xs capitalize">{slot}</div>
        </>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [equipment, setEquipment] = useState({})

  // useEffect to load profile data when page mounts
  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, achievRes, equipRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/users/achievements'),
          api.get('/users/equipment'),
        ])
        setStats(statsRes.data)
        setAchievements(achievRes.data)
        setEquipment(equipRes.data)
      } catch {
        // Graceful fallback — show what we have from auth store
      }
    }
    load()
  }, [])

  const level = user?.level ?? 1
  const xp = user?.xp ?? 0
  const xpForNext = level * 100
  const xpThisLevel = xp % xpForNext
  const xpProgress = Math.min((xpThisLevel / xpForNext) * 100, 100)

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Hero card ── */}
        <div className="card mb-8 bg-gradient-to-r from-quest-purple/10 to-quest-teal/5 border-quest-purple/20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar circle */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-quest-purple to-quest-teal flex items-center justify-center text-5xl">
                {user?.avatar ?? '⚔️'}
              </div>
              {/* Level badge overlaid on avatar */}
              <div className="absolute -bottom-2 -right-2 bg-quest-gold text-quest-darker text-xs font-black px-2 py-0.5 rounded-full">
                {level}
              </div>
            </div>

            {/* User info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-quest text-3xl font-black text-white">{user?.username}</h1>
              <p className="text-quest-purple-light capitalize mt-1">{user?.heroClass ?? 'Adventurer'}</p>

              {/* XP bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>Level {level}</span>
                  <span>{xpThisLevel} / {xpForNext} XP to Level {level + 1}</span>
                </div>
                <div className="xp-bar max-w-sm">
                  <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                {[
                  { label: 'Total XP', value: xp, color: 'text-quest-purple-light' },
                  { label: 'Points',   value: user?.points ?? 0, color: 'text-quest-gold' },
                  { label: 'Rank',     value: `#${stats?.rank ?? '—'}`, color: 'text-quest-teal' },
                  { label: 'Duels Won', value: stats?.duelsWon ?? 0, color: 'text-white' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 rounded-lg px-3 py-2 text-center">
                    <div className={`font-bold text-lg ${color}`}>{value}</div>
                    <div className="text-white/30 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Equipment ── */}
          <div>
            <h2 className="font-quest text-xl font-bold text-white mb-4">Equipment</h2>
            {/*
              grid-cols-3 with 6 slots = 2 rows
              Each slot can be empty or show an equipped item
            */}
            <div className="grid grid-cols-3 gap-3">
              {EQUIPMENT_SLOTS.map((slot) => (
                <EquipSlot key={slot} slot={slot} item={equipment[slot] ?? null} />
              ))}
            </div>
            <p className="text-white/30 text-xs mt-3">
              Earn items from bosses and the shop. Equip them to boost your stats.
            </p>
          </div>

          {/* ── Achievements ── */}
          <div>
            <h2 className="font-quest text-xl font-bold text-white mb-4">Achievements</h2>
            {achievements.length === 0 ? (
              <div className="card border-white/5 text-white/30 text-sm text-center py-8">
                Complete lessons to earn achievements!
              </div>
            ) : (
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className={`card flex items-center gap-4 border-white/5 ${ach.unlocked ? '' : 'opacity-40'}`}>
                    <div className="text-3xl">{ach.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{ach.title}</div>
                      <div className="text-white/40 text-xs">{ach.description}</div>
                    </div>
                    {ach.unlocked && (
                      <span className="badge bg-quest-gold/20 text-quest-gold border border-quest-gold/30 text-xs">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Language progress ── */}
        <div className="mt-8">
          <h2 className="font-quest text-xl font-bold text-white mb-4">Language Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(stats?.languageProgress ?? []).map((lang) => (
              <div key={lang.language} className="card border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white text-sm">{lang.language}</span>
                  <span className="text-white/40 text-xs">{lang.completed}/{lang.total}</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-fill" style={{ width: `${Math.round((lang.completed / lang.total) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
