import { useGameStore } from '../lib/store'

// This component reads from the global Zustand store.
// When triggerXPGain(xp) is called anywhere in the app, this toast animates in.
// It uses CSS transitions (translate-y + opacity) to slide up and fade out.
export default function XPToast() {
  const { showXPGain, xpGained } = useGameStore()

  return (
    <div
      className={`fixed top-20 right-6 z-[100] transition-all duration-500 ${
        showXPGain ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-quest-gold text-quest-darker font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
        <span className="text-2xl">⭐</span>
        <div>
          <div className="text-xs uppercase tracking-wider opacity-70">XP Gained</div>
          <div className="text-xl">+{xpGained} XP</div>
        </div>
      </div>
    </div>
  )
}
