import { useState, useEffect } from 'react'
import { useAuthStore } from '../lib/store'
import api from '../lib/api'

const TABS = ['Global', 'Python', 'JavaScript', 'TypeScript', 'Rust', 'SQL', 'Go']

// The top 3 places get a medal
const MEDALS = ['🥇', '🥈', '🥉']

// Rank color changes based on position
function rankColor(rank) {
  if (rank === 1) return 'text-quest-gold'
  if (rank === 2) return 'text-white/60'
  if (rank === 3) return 'text-orange-400'
  return 'text-white/30'
}

export default function LeaderboardPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('Global')
  const [entries, setEntries] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)

  // Re-fetch whenever the active tab changes
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const params = activeTab === 'Global' ? '' : `?language=${activeTab}`
        const res = await api.get(`/leaderboard${params}`)
        setEntries(res.data.entries)
        setUserRank(res.data.userRank)
      } catch {
        // Seed with placeholder data so UI renders during development
        setEntries(
          Array.from({ length: 10 }, (_, i) => ({
            rank: i + 1,
            username: `Hero${i + 1}`,
            avatar: ['🧙', '⚔️', '🏹', '🛡', '🔮'][i % 5],
            level: 20 - i,
            xp: (20 - i) * 800,
            points: (20 - i) * 500,
            heroClass: ['Mage', 'Warrior', 'Ranger', 'Paladin'][i % 4],
          }))
        )
        setUserRank(null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [activeTab])

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <h1 className="font-quest text-4xl font-black text-white mb-2">Leaderboard</h1>
        <p className="text-white/40 mb-8">The mightiest coders in the realm</p>

        {/* Tab bar */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-quest-purple text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* User's own rank — always pinned at top if not in top 10 */}
        {userRank && userRank.rank > 10 && (
          <div className="card mb-4 border-quest-purple/30 bg-quest-purple/10">
            <div className="flex items-center gap-4">
              <span className={`font-quest font-black text-xl w-8 text-center ${rankColor(userRank.rank)}`}>
                #{userRank.rank}
              </span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-quest-purple to-quest-teal flex items-center justify-center text-xl">
                {user?.avatar ?? '⚔️'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  {user?.username} <span className="text-quest-purple-light text-xs">(You)</span>
                </div>
                <div className="text-white/40 text-xs capitalize">{user?.heroClass} · Lv.{user?.level}</div>
              </div>
              <div className="text-right">
                <div className="text-quest-gold font-bold">{userRank.points}</div>
                <div className="text-white/30 text-xs">pts</div>
              </div>
            </div>
          </div>
        )}

        {/* Main leaderboard list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="card h-16 animate-pulse bg-white/3 border-white/5" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const isCurrentUser = entry.username === user?.username
              return (
                <div
                  key={entry.rank}
                  className={`card flex items-center gap-4 transition-all ${
                    isCurrentUser
                      ? 'border-quest-purple/40 bg-quest-purple/10'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Rank number / medal */}
                  <div className="w-8 text-center">
                    {entry.rank <= 3 ? (
                      <span className="text-2xl">{MEDALS[entry.rank - 1]}</span>
                    ) : (
                      <span className={`font-quest font-black text-lg ${rankColor(entry.rank)}`}>
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-quest-purple/50 to-quest-teal/50 flex items-center justify-center text-xl flex-shrink-0">
                    {entry.avatar}
                  </div>

                  {/* Name + class */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm flex items-center gap-2 truncate">
                      {entry.username}
                      {isCurrentUser && <span className="text-quest-purple-light text-xs">(You)</span>}
                    </div>
                    <div className="text-white/40 text-xs capitalize truncate">
                      {entry.heroClass} · Lv.{entry.level}
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right hidden sm:block">
                    <div className="text-white/60 text-sm">{entry.xp.toLocaleString()} XP</div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-quest-gold font-bold">{entry.points.toLocaleString()}</div>
                    <div className="text-white/30 text-xs">pts</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
