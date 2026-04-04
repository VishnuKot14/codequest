import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MapPage from './pages/MapPage'
import LessonPage from './pages/LessonPage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import DuelPage from './pages/DuelPage'
import BossPage from './pages/BossPage'
import ShopPage from './pages/ShopPage'
import GuildPage from './pages/GuildPage'
import Navbar from './components/Navbar'
import XPToast from './components/XPToast'

// ProtectedRoute: if the user has no JWT token, redirect to /login.
// We check localStorage directly (not the store) so it works even before
// the store rehydrates — avoids a flash of the login page on refresh.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('cq_token')
  return token ? children : <Navigate to="/login" replace />
}

// Layout wrapper: renders the persistent Navbar above the page content.
// Used by every protected route so we don't repeat <Navbar /> on each one.
function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* XPToast floats above everything — rendered once at the app root */}
      <XPToast />
      <Routes>
        {/* ── Public routes — no login needed ── */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Protected routes — login required ── */}
        <Route path="/map" element={
          <ProtectedRoute><AppLayout><MapPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/lesson/:id" element={
          <ProtectedRoute><AppLayout><LessonPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/boss/:regionId" element={
          <ProtectedRoute><AppLayout><BossPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/duel" element={
          <ProtectedRoute><AppLayout><DuelPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/shop" element={
          <ProtectedRoute><AppLayout><ShopPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/guilds" element={
          <ProtectedRoute><AppLayout><GuildPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute><AppLayout><LeaderboardPage /></AppLayout></ProtectedRoute>
        } />

        {/* Catch-all: unknown URLs go home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
