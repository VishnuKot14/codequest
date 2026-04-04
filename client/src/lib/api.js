import axios from 'axios'

// In development: VITE_API_URL is unset, so baseURL falls back to '/api'
// which Vite's dev proxy forwards to localhost:5000.
// In production: Vercel injects VITE_API_URL = "https://your-backend.onrender.com/api"
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cq_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cq_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api