import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'

export default function LoginPage() {
  // Local state: tracks what the user is typing in the form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Pull the login action and loading state from our global store
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    // e.preventDefault() stops the browser from doing a full page reload
    // (the default HTML form behavior we don't want in React)
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/map') // on success, send user to the game
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-quest-purple/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="font-quest text-3xl font-black text-quest-gold">⚔ CodeQuest</Link>
          <p className="text-white/40 mt-2 text-sm">Welcome back, adventurer</p>
        </div>

        {/* Card containing the form */}
        <div className="card border-white/10">
          <h2 className="font-quest text-xl font-bold text-white mb-6">Continue Your Journey</h2>

          {/* Error banner — only shows when error is non-empty */}
          {error && (
            <div className="bg-quest-red/10 border border-quest-red/30 text-quest-red text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* onSubmit on the <form> means pressing Enter in any input also submits */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="hero@codequest.dev"
                required
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {/* disabled while loading so the user can't double-submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : '⚔ Enter the Realm'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            New here?{' '}
            <Link to="/register" className="text-quest-purple-light hover:text-white transition-colors">
              Create your hero
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
