import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useGameStore } from '../lib/store'
import api from '../lib/api'

// Each region is a "world area" on the map
// requiredLevel: the minimum level to unlock this region
const REGIONS = [
  {
    id: 'python',
    language: 'Python',
    region: 'Python Plains',
    emoji: '🐍',
    description: 'The gentle starter lands. Master the fundamentals of programming.',
    gradient: 'from-blue-600/30 to-yellow-500/20',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    requiredLevel: 1,
    totalLessons: 12,
    boss: { name: 'The Syntax Serpent', emoji: '🐲' },
  },
  {
    id: 'javascript',
    language: 'JavaScript',
    region: 'JS Jungle',
    emoji: '⚡',
    description: 'Dense and wild. Tame the browser, conquer the DOM.',
    gradient: 'from-yellow-500/30 to-yellow-700/20',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20',
    requiredLevel: 3,
    totalLessons: 15,
    boss: { name: 'The Async Dragon', emoji: '🔥' },
  },
  {
    id: 'typescript',
    language: 'TypeScript',
    region: 'TypeScript Tundra',
    emoji: '🔷',
    description: 'A frozen land of strict types and powerful abstractions.',
    gradient: 'from-blue-400/30 to-blue-700/20',
    border: 'border-blue-400/30',
    glow: 'shadow-blue-400/20',
    requiredLevel: 6,
    totalLessons: 14,
    boss: { name: 'The Type Titan', emoji: '🗿' },
  },
  {
    id: 'sql',
    language: 'SQL',
    region: 'SQL Sanctum',
    emoji: '🗄',
    description: 'Ancient ruins where data is law. Query your way to victory.',
    gradient: 'from-teal-500/30 to-teal-800/20',
    border: 'border-teal-500/30',
    glow: 'shadow-teal-500/20',
    requiredLevel: 4,
    totalLessons: 10,
    boss: { name: 'The Query Kraken', emoji: '🦑' },
  },
  {
    id: 'rust',
    language: 'Rust',
    region: 'Rust Ruins',
    emoji: '⚙',
    description: 'For the bravest warriors. Zero-cost abstractions await.',
    gradient: 'from-orange-600/30 to-red-700/20',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
    requiredLevel: 8,
    totalLessons: 16,
    boss: { name: 'The Memory Demon', emoji: '💀' },
  },
  {
    id: 'go',
    language: 'Go',
    region: 'Go Glacier',
    emoji: '🐹',
    description: 'Crisp and fast. Master concurrency in the frozen north.',
    gradient: 'from-cyan-500/30 to-cyan-800/20',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    requiredLevel: 5,
    totalLessons: 11,
    boss: { name: 'The Goroutine Golem', emoji: '🤖' },
  },
]

export default function MapPage() {
  const { user } = useAuthStore()
  const { setLanguage } = useGameStore()
  const navigate = useNavigate()

  // progressMap: { [regionId]: { completedLessons: number, bossDefeated: boolean } }
  // We fetch this from the server so it persists across sessions
  const [progressMap, setProgressMap] = useState({})
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [loading, setLoading] = useState(true)

  // useEffect runs *after* the component renders.
  // The empty [] dependency array means "run this once when the component mounts"
  // (equivalent to componentDidMount in class components)
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/map')
        // Convert array [{regionId, completedLessons, bossDefeated}] to a lookup object
        const map = {}
        res.data.forEach((p) => { map[p.regionId] = p })
        setProgressMap(map)
      } catch {
        // If the endpoint fails (e.g. server not running yet), show empty progress
        setProgressMap({})
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, []) // [] = run once

  const userLevel = user?.level ?? 1

  const handleEnterRegion = (region) => {
    if (userLevel < region.requiredLevel) return // locked
    setLanguage(region.language)
    // Resume from the next incomplete lesson, not always lesson 1
    const completed = progressMap[region.id]?.completedLessons ?? 0
    const nextLesson = Math.min(completed + 1, region.totalLessons)
    navigate(`/lesson/${region.id}-${nextLesson}`)
  }

  return (
    // pt-16 = padding-top to clear the fixed navbar (which is 16 = 64px tall)
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-quest text-4xl font-black text-white">
            World Map
          </h1>
          <p className="text-white/40 mt-2">
            Choose a region to begin your quest. Higher-level areas unlock as you grow stronger.
          </p>
        </div>

        {/* Player level banner */}
        <div className="card mb-10 flex items-center gap-4 bg-gradient-to-r from-quest-purple/10 to-quest-teal/10 border-quest-purple/20">
          <div className="text-4xl">{user?.avatar ?? '⚔️'}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-quest font-bold text-white text-lg">{user?.username}</span>
              <span className="badge bg-quest-gold/20 text-quest-gold border border-quest-gold/30">
                Level {userLevel} {user?.heroClass && `· ${user.heroClass}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="xp-bar flex-1 max-w-xs">
                <div
                  className="xp-fill"
                  style={{ width: `${Math.min(((user?.xp ?? 0) % (userLevel * 100)) / (userLevel * 100) * 100, 100)}%` }}
                />
              </div>
              <span className="text-white/40 text-xs">{user?.xp ?? 0} XP total</span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-quest-gold font-bold text-xl">{user?.points ?? 0}</div>
            <div className="text-white/40 text-xs">points</div>
          </div>
        </div>

        {/* Region grid */}
        {loading ? (
          // Skeleton loading state — shows pulsing placeholders while data loads
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse h-64 bg-white/3" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONS.map((region) => {
              const progress = progressMap[region.id]
              const completed = progress?.completedLessons ?? 0
              const bossDefeated = progress?.bossDefeated ?? false
              const progressPct = Math.round((completed / region.totalLessons) * 100)
              const isLocked = userLevel < region.requiredLevel
              const isComplete = bossDefeated

              return (
                <div
                  key={region.id}
                  onClick={() => !isLocked && setSelectedRegion(region)}
                  className={`card relative overflow-hidden transition-all duration-300 cursor-pointer
                    bg-gradient-to-br ${region.gradient}
                    border ${region.border}
                    ${isLocked ? 'opacity-40 cursor-not-allowed' : `hover:shadow-xl hover:${region.glow} hover:scale-[1.02]`}
                    ${selectedRegion?.id === region.id ? 'ring-2 ring-quest-purple' : ''}
                  `}
                >
                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute top-3 right-3">
                      <span className="badge bg-white/10 text-white/40">🔒 Lv.{region.requiredLevel}</span>
                    </div>
                  )}

                  {/* Completion badge */}
                  {isComplete && (
                    <div className="absolute top-3 right-3">
                      <span className="badge bg-quest-gold/20 text-quest-gold border border-quest-gold/30">✓ Conquered</span>
                    </div>
                  )}

                  {/* Region emoji + name */}
                  <div className="text-5xl mb-3">{region.emoji}</div>
                  <h3 className="font-quest font-bold text-white text-xl mb-1">{region.region}</h3>
                  <p className="text-quest-purple-light text-sm font-medium mb-2">{region.language}</p>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{region.description}</p>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-white/40 mb-1.5">
                      <span>{completed}/{region.totalLessons} lessons</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="xp-bar">
                      <div className="xp-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>

                  {/* Boss info */}
                  <div className="flex items-center gap-2 text-xs text-white/30 mt-3">
                    <span>{region.boss.emoji}</span>
                    <span>Boss: {region.boss.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Region detail panel — slides up when a region is selected */}
        {selectedRegion && (
          <div className="fixed inset-x-0 bottom-0 z-40 bg-quest-dark border-t border-white/10 p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-quest text-2xl font-bold text-white">
                    {selectedRegion.emoji} {selectedRegion.region}
                  </h2>
                  <p className="text-white/50 text-sm mt-1">{selectedRegion.description}</p>
                </div>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="text-white/30 hover:text-white text-2xl leading-none"
                >×</button>
              </div>

              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => handleEnterRegion(selectedRegion)}
                  className="btn-gold"
                >
                  ⚔ Enter Region
                </button>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <span>{selectedRegion.totalLessons} lessons</span>
                  <span>·</span>
                  <span>{selectedRegion.boss.emoji} {selectedRegion.boss.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
