import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from './api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('cq_token', res.data.token)
        set({ user: res.data.user, token: res.data.token, isLoading: false })
        return res.data
      },

      register: async (username, email, password) => {
        set({ isLoading: true })
        const res = await api.post('/auth/register', { username, email, password })
        localStorage.setItem('cq_token', res.data.token)
        set({ user: res.data.user, token: res.data.token, isLoading: false })
        return res.data
      },

      logout: () => {
        localStorage.removeItem('cq_token')
        set({ user: null, token: null })
      },

      refreshUser: async () => {
        try {
          const res = await api.get('/auth/me')
          set({ user: res.data })
        } catch {
          get().logout()
        }
      },
    }),
    { name: 'cq-auth', partialize: (s) => ({ token: s.token }) }
  )
)

export const useGameStore = create((set) => ({
  selectedLanguage: null,
  setLanguage: (lang) => set({ selectedLanguage: lang }),

  currentLesson: null,
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  showXPGain: false,
  xpGained: 0,
  triggerXPGain: (xp) => {
    set({ showXPGain: true, xpGained: xp })
    setTimeout(() => set({ showXPGain: false, xpGained: 0 }), 3000)
  },
}))
