import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../lib/store'

// Each nav item: path, label, and an emoji icon (avoids an icon library dependency)
const NAV_LINKS = [
  { to: '/map',         label: 'World Map',   icon: '🗺' },
  { to: '/duel',        label: 'PvP Duel',    icon: '⚔' },
  { to: '/guilds',      label: 'Guilds',      icon: '🛡' },
  { to: '/shop',        label: 'Shop',        icon: '🛒' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
]

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  // useLocation gives us the current URL path so we can highlight the active link
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const level = user?.level ?? 1
  const currentXP = user?.xp ?? 0
  const xpForNextLevel = level * 100
  const xpProgress = Math.min(((currentXP % xpForNextLevel) / xpForNextLevel) * 100, 100)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-quest-darker/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/map" className="font-quest text-xl font-bold text-quest-gold tracking-wider flex-shrink-0">
          ⚔ CodeQuest
        </Link>

        {/* Nav links — hidden on mobile, shown md+ */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon }) => {
            // isActive: true when the current URL starts with this link's path
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-quest-purple/20 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right side: XP bar + avatar + logout */}
        {user && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* XP bar — only on sm+ screens */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-quest-gold font-bold">Lv.{level}</span>
                <span className="text-white/40">{currentXP % xpForNextLevel}/{xpForNextLevel} XP</span>
              </div>
              <div className="xp-bar w-24">
                <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>

            {/* Points balance */}
            <div className="hidden lg:flex items-center gap-1 text-quest-gold text-sm font-bold">
              <span>🪙</span>
              <span>{user.points ?? 0}</span>
            </div>

            {/* Avatar → profile link */}
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-quest-purple to-quest-teal flex items-center justify-center text-lg">
                {user.avatar ?? '⚔️'}
              </div>
              <span className="text-sm font-medium hidden lg:block">{user.username}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-white/30 hover:text-white/70 text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile nav — scrollable row of icon links below the main bar */}
      <div className="md:hidden flex border-t border-white/5 overflow-x-auto">
        {NAV_LINKS.map(({ to, label, icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 text-xs flex-shrink-0 transition-colors ${
                isActive ? 'text-white border-b-2 border-quest-purple' : 'text-white/40'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
