import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'

// Avatar options — users pick their starting look
const AVATARS = ['🧙', '⚔️', '🏹', '🛡', '🔮', '🦊']

// These are the classes in our game — they affect starting stats
const CLASSES = [
  { id: 'warrior',  name: 'Warrior',  emoji: '⚔️', bonus: '+10% XP from challenges' },
  { id: 'mage',     name: 'Mage',     emoji: '🔮', bonus: '+15% XP from theory lessons' },
  { id: 'ranger',   name: 'Ranger',   emoji: '🏹', bonus: '+10% XP from speed challenges' },
  { id: 'paladin',  name: 'Paladin',  emoji: '🛡', bonus: 'Slower XP loss on wrong answers' },
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm: '',
    avatar: '🧙', heroClass: 'warrior',
  })
  const [step, setStep] = useState(1) // 2-step form: credentials → character creation
  const [error, setError] = useState('')

  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  // Generic onChange handler: spreads existing form values and updates just the changed field
  // This is a common React pattern to avoid writing a separate handler for every input
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleStep1 = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setError('')
    setStep(2) // advance to character creation
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form.username, form.email, form.password, form.avatar, form.heroClass)
      navigate('/map')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
      setStep(1) // go back if server error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-quest-purple/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <Link to="/" className="font-quest text-3xl font-black text-quest-gold">⚔ CodeQuest</Link>
          <p className="text-white/40 mt-2 text-sm">Create your legend</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-quest-purple text-white' : 'bg-white/10 text-white/30'
              }`}>{s}</div>
              {s < 2 && <div className={`w-16 h-0.5 transition-all ${step > s ? 'bg-quest-purple' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          {error && (
            <div className="bg-quest-red/10 border border-quest-red/30 text-quest-red text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* ── Step 1: Account credentials ── */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <h2 className="font-quest text-xl font-bold text-white mb-6">Account Details</h2>

              <div>
                <label className="block text-white/60 text-sm mb-1.5">Hero Name</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => set('username', e.target.value)}
                  className="input-field"
                  placeholder="DragonSlayer99"
                  minLength={3}
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="input-field"
                  placeholder="hero@codequest.dev"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => set('confirm', e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full mt-2">
                Next: Choose Your Hero →
              </button>
            </form>
          )}

          {/* ── Step 2: Character creation ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-quest text-xl font-bold text-white mb-2">Create Your Hero</h2>

              {/* Avatar picker */}
              <div>
                <label className="block text-white/60 text-sm mb-3">Choose Avatar</label>
                <div className="flex gap-3 flex-wrap">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => set('avatar', av)}
                      className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                        form.avatar === av
                          ? 'border-quest-purple bg-quest-purple/20 scale-110'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class picker */}
              <div>
                <label className="block text-white/60 text-sm mb-3">Choose Class</label>
                <div className="grid grid-cols-2 gap-3">
                  {CLASSES.map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => set('heroClass', cls.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        form.heroClass === cls.id
                          ? 'border-quest-purple bg-quest-purple/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cls.emoji}</div>
                      <div className="font-semibold text-white text-sm">{cls.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">{cls.bonus}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-primary bg-white/10 hover:bg-white/20 flex-1">
                  ← Back
                </button>
                <button type="submit" disabled={isLoading} className="btn-gold flex-1 disabled:opacity-50">
                  {isLoading ? 'Creating...' : '⚔ Begin Quest!'}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <p className="text-center text-white/40 text-sm mt-6">
              Already an adventurer?{' '}
              <Link to="/login" className="text-quest-purple-light hover:text-white transition-colors">Login here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
