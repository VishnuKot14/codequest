import { Link } from 'react-router-dom'

// The languages available in CodeQuest — each has a region on the world map
const LANGUAGES = [
  { name: 'Python',     emoji: '🐍', region: 'Python Plains',      color: 'from-blue-500 to-yellow-400',   desc: 'Beginner friendly' },
  { name: 'JavaScript', emoji: '⚡', region: 'JS Jungle',          color: 'from-yellow-400 to-yellow-600', desc: 'Web & interactivity' },
  { name: 'TypeScript', emoji: '🔷', region: 'TypeScript Tundra',  color: 'from-blue-400 to-blue-700',     desc: 'Typed JS' },
  { name: 'Rust',       emoji: '⚙',  region: 'Rust Ruins',         color: 'from-orange-500 to-red-600',    desc: 'Systems & speed' },
  { name: 'SQL',        emoji: '🗄',  region: 'SQL Sanctum',        color: 'from-teal-400 to-teal-700',     desc: 'Databases' },
  { name: 'Go',         emoji: '🐹', region: 'Go Glacier',         color: 'from-cyan-400 to-cyan-700',     desc: 'Concurrency' },
]

const FEATURES = [
  { icon: '🗺', title: 'Adventure World Map',   desc: 'Explore regions for each language. Unlock new areas as you level up.' },
  { icon: '⚔', title: 'Boss Battles',           desc: 'End-of-chapter bosses test everything you\'ve learned. Defeat them to advance.' },
  { icon: '🏆', title: 'PvP Duels',             desc: 'Challenge other players to real-time coding duels. First to solve wins.' },
  { icon: '🎭', title: 'Character Progression', desc: 'Earn XP, level up, and equip your hero with gear unlocked through achievements.' },
  { icon: '🛒', title: 'Reward Shop',           desc: 'Spend your hard-earned points on cosmetics, accessories, and avatar upgrades.' },
  { icon: '📊', title: 'Global Leaderboard',    desc: 'Compete for the top spot across all languages or within your chosen path.' },
]

export default function LandingPage() {
  return (
    // min-h-screen ensures the page fills the viewport even with little content
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Top nav (minimal, public) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-quest-darker/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-quest text-xl font-bold text-quest-gold tracking-wider">⚔ CodeQuest</span>
          <div className="flex items-center gap-3">
            <Link to="/login"    className="text-white/60 hover:text-white text-sm px-4 py-2 transition-colors">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2">Start Adventure</Link>
          </div>
        </div>
      </header>

      {/* ── Hero section ── */}
      {/*
        The hero uses a layered background:
        1. The base dark color (from body styles)
        2. A radial purple glow (pseudo-atmosphere effect)
        3. Grid lines via background-image for a "digital world" feel
      */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-quest-purple/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-quest-teal/5 rounded-full blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge above headline */}
          <div className="inline-flex items-center gap-2 bg-quest-purple/20 border border-quest-purple/30 text-quest-purple-light px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-quest-teal rounded-full animate-pulse" />
            Learn. Battle. Conquer.
          </div>

          {/* Main headline — font-quest uses the Cinzel serif for a fantasy feel */}
          <h1 className="font-quest text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Master Code Through{' '}
            <span className="bg-gradient-to-r from-quest-purple-light via-quest-teal to-quest-gold bg-clip-text text-transparent">
              Epic Adventure
            </span>
          </h1>

          <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            CodeQuest turns learning programming into an RPG. Explore worlds, defeat bosses,
            duel other players, and build your legendary hero — one line of code at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-gold text-lg px-8 py-4">
              ⚔ Begin Your Quest
            </Link>
            <Link to="/login" className="btn-primary text-lg px-8 py-4 bg-white/10 hover:bg-white/20">
              🔑 Continue Journey
            </Link>
          </div>

          {/* Social proof numbers */}
          <div className="mt-16 flex flex-wrap gap-8 justify-center">
            {[['12K+', 'Adventurers'], ['6', 'Languages'], ['500+', 'Quests'], ['48', 'Bosses']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-quest-gold font-quest">{num}</div>
                <div className="text-white/40 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Language regions showcase ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-quest text-3xl font-bold text-center text-white mb-4">Choose Your Path</h2>
          <p className="text-white/40 text-center mb-12">Each language is a unique region of the CodeQuest world</p>

          {/*
            CSS Grid with auto-fill and minmax: creates a responsive grid that
            fills as many columns as fit at 280px min width — no media queries needed.
          */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {LANGUAGES.map((lang) => (
              <div key={lang.name} className="card-glow group cursor-pointer">
                <div className={`text-4xl mb-3`}>{lang.emoji}</div>
                <h3 className="font-quest font-bold text-white text-lg">{lang.name}</h3>
                <p className="text-quest-purple-light text-sm">{lang.region}</p>
                <p className="text-white/40 text-xs mt-1">{lang.desc}</p>
                {/* Progress bar shown on hover — simulated for landing page */}
                <div className="mt-4 xp-bar opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`h-full bg-gradient-to-r ${lang.color} rounded-full w-0 group-hover:w-full transition-all duration-700`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="py-20 px-6 bg-quest-dark/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-quest text-3xl font-bold text-center text-white mb-4">What Awaits You</h2>
          <p className="text-white/40 text-center mb-12">More than a tutorial — a world to conquer</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-glow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to action ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-quest text-4xl font-black text-white mb-6">
            Your Legend Starts{' '}
            <span className="text-quest-gold">Today</span>
          </h2>
          <p className="text-white/40 mb-10">Free to play. No credit card. Just courage.</p>
          <Link to="/register" className="btn-gold text-xl px-12 py-5">
            ⚔ Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-white/20 text-sm">
        © 2025 CodeQuest. Built with ❤ and many lines of code.
      </footer>
    </div>
  )
}
