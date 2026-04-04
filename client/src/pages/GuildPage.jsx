/**
 * GuildPage — browse, create, join, and manage guilds.
 *
 * Key concept: conditional views from a single page component.
 * Rather than having separate routes for "guild dashboard" vs "guild browser",
 * we fetch whether the user has a guild, then render one of two views in the
 * same component. This keeps the URL simple (/guilds) while the content adapts.
 */

import { useState, useEffect } from 'react'
import { useAuthStore } from '../lib/store'
import api from '../lib/api'

const EMBLEMS = ['🛡', '⚔', '🔮', '🏹', '🐉', '🦅', '🌙', '🔱']

// ── Sub-component: create guild form ──────────────────────
function CreateGuildForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({ name: '', tag: '', description: '', emblem: '🛡' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/guilds', form)
      onCreated(res.data)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to create guild')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-md mx-auto border-quest-purple/20">
      <h2 className="font-quest text-xl font-bold text-white mb-6">Found a Guild</h2>
      {error && (
        <div className="bg-quest-red/10 border border-quest-red/20 text-quest-red text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/60 text-sm mb-1.5">Guild Name</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)}
            className="input-field" placeholder="The Iron Coders" required />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-1.5">Tag (max 6 chars)</label>
          <input value={form.tag} onChange={(e) => set('tag', e.target.value.toUpperCase())}
            className="input-field" placeholder="[IRON]" maxLength={6} required />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-1.5">Description</label>
          <input value={form.description} onChange={(e) => set('description', e.target.value)}
            className="input-field" placeholder="We grind loops so you don't have to" />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-3">Emblem</label>
          <div className="flex gap-2 flex-wrap">
            {EMBLEMS.map((em) => (
              <button key={em} type="button" onClick={() => set('emblem', em)}
                className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                  form.emblem === em ? 'border-quest-purple bg-quest-purple/20 scale-110' : 'border-white/10 hover:border-white/30'
                }`}>{em}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="btn-primary bg-white/10 hover:bg-white/20 flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-gold flex-1 disabled:opacity-50">
            {loading ? 'Creating...' : `${form.emblem} Found Guild`}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Sub-component: my guild dashboard ─────────────────────
function MyGuildView({ guild, onLeave }) {
  const { user } = useAuthStore()
  const isLeader = guild.leaderId === user?.id

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this guild?')) return
    try {
      await api.post(`/guilds/${guild.id}/leave`)
      onLeave()
    } catch (err) {
      alert(err.response?.data?.error ?? 'Failed to leave guild')
    }
  }

  const handleDisband = async () => {
    if (!confirm('Disband the guild? This cannot be undone.')) return
    try {
      await api.delete(`/guilds/${guild.id}`)
      onLeave()
    } catch (err) {
      alert(err.response?.data?.error ?? 'Failed to disband guild')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Guild banner */}
      <div className="card mb-6 border-quest-purple/20 bg-gradient-to-r from-quest-purple/10 to-transparent">
        <div className="flex items-center gap-4">
          <div className="text-6xl">{guild.emblem}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-quest text-3xl font-black text-white">{guild.name}</h1>
              <span className="badge bg-quest-purple/20 text-quest-purple-light border border-quest-purple/30">
                {guild.tag}
              </span>
              {guild.myRole === 'leader' && (
                <span className="badge bg-quest-gold/20 text-quest-gold border border-quest-gold/30">👑 Leader</span>
              )}
            </div>
            <p className="text-white/50 text-sm mt-1">{guild.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-quest-gold font-bold">{guild.totalXP.toLocaleString()} XP</span>
              <span className="text-white/40">{guild._count.members} members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Members list */}
      <h2 className="font-quest text-xl font-bold text-white mb-4">Members</h2>
      <div className="space-y-3 mb-8">
        {guild.members.map((member) => {
          const u = member.user
          if (!u) return null
          return (
            <div key={member.id} className="card flex items-center gap-4 border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-quest-purple/50 to-quest-teal/50 flex items-center justify-center text-xl flex-shrink-0">
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{u.username}</span>
                  {member.role === 'leader' && <span className="text-quest-gold text-xs">👑</span>}
                  {member.role === 'officer' && <span className="text-quest-purple-light text-xs">⭐</span>}
                  {u.id === user?.id && <span className="text-white/30 text-xs">(you)</span>}
                </div>
                <div className="text-white/40 text-xs capitalize">{u.heroClass} · Lv.{u.level}</div>
              </div>
              <div className="text-right text-sm">
                <div className="text-white/60">{u.xp.toLocaleString()}</div>
                <div className="text-white/30 text-xs">XP</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Leave / Disband */}
      <div className="flex gap-3">
        {isLeader ? (
          <button onClick={handleDisband} className="text-quest-red/60 hover:text-quest-red text-sm transition-colors">
            Disband Guild
          </button>
        ) : (
          <button onClick={handleLeave} className="text-white/30 hover:text-white/60 text-sm transition-colors">
            Leave Guild
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main GuildPage ────────────────────────────────────────
export default function GuildPage() {
  const [myGuild, setMyGuild] = useState(undefined)  // undefined = loading, null = no guild
  const [allGuilds, setAllGuilds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [joining, setJoining] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      // Fetch both in parallel with Promise.all
      const [myRes, allRes] = await Promise.all([
        api.get('/guilds/mine'),
        api.get('/guilds'),
      ])
      setMyGuild(myRes.data)   // null if user has no guild
      setAllGuilds(allRes.data)
    } catch {
      setMyGuild(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleJoin = async (guild) => {
    setJoining(guild.id)
    try {
      await api.post(`/guilds/${guild.id}/join`)
      await loadData() // reload everything after joining
    } catch (err) {
      alert(err.response?.data?.error ?? 'Could not join guild')
    } finally {
      setJoining(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-white/30">Loading guilds...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* If user is in a guild, show their guild dashboard */}
        {myGuild ? (
          <MyGuildView guild={myGuild} onLeave={() => { setMyGuild(null); loadData() }} />
        ) : showCreate ? (
          <CreateGuildForm
            onCreated={(g) => { setShowCreate(false); loadData() }}
            onCancel={() => setShowCreate(false)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-quest text-4xl font-black text-white">Guilds</h1>
                <p className="text-white/40 mt-1">Join a clan, fight together, climb the ranks</p>
              </div>
              <button onClick={() => setShowCreate(true)} className="btn-gold">
                🛡 Found a Guild
              </button>
            </div>

            {/* All guilds list */}
            {allGuilds.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🛡</div>
                <p className="text-white/30">No guilds yet. Be the first to found one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allGuilds.map((guild, i) => (
                  <div key={guild.id} className="card flex items-center gap-4 border-white/5 hover:border-white/10 transition-all">
                    {/* Rank */}
                    <div className="text-quest-gold font-quest font-black text-xl w-8 text-center flex-shrink-0">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                    </div>

                    {/* Emblem */}
                    <div className="text-4xl flex-shrink-0">{guild.emblem}</div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-quest font-bold text-white">{guild.name}</span>
                        <span className="badge bg-white/10 text-white/50 text-xs">{guild.tag}</span>
                      </div>
                      <p className="text-white/40 text-sm truncate">{guild.description || 'No description'}</p>
                    </div>

                    {/* Stats */}
                    <div className="text-right hidden sm:block">
                      <div className="text-quest-gold font-bold">{guild.totalXP.toLocaleString()}</div>
                      <div className="text-white/30 text-xs">{guild._count.members} members</div>
                    </div>

                    {/* Join button */}
                    <button
                      onClick={() => handleJoin(guild)}
                      disabled={joining === guild.id}
                      className="btn-primary text-sm py-2 px-4 flex-shrink-0 disabled:opacity-50"
                    >
                      {joining === guild.id ? '...' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
