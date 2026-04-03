import { type ReactNode, useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import CreateTripPage from './pages/CreateTripPage'
import TripListPage from './pages/TripListPage'
import MyTripsPage from './pages/MyTripsPage'
import TripDetailPage from './pages/TripDetailPage'
import ActivityPage from './pages/ActivityPage'
import ProfilePage from './pages/ProfilePage'
import ProfileSectionPage from './pages/ProfileSectionPage'
import { getStoredUser, isLoggedIn } from './lib/authStorage'
import type { UserRole } from './types'

/** Avoid render-phase <Navigate> on `/` — it can fight with other redirects and hit max update depth. */
function PublicAuthScreen() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  useLayoutEffect(() => {
    if (loggedIn) navigate('/home', { replace: true })
  }, [loggedIn, navigate])

  if (loggedIn) return null
  return <AuthPage />
}

function ProtectedLayout() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  useLayoutEffect(() => {
    if (!loggedIn) navigate('/', { replace: true })
  }, [loggedIn, navigate])

  if (!loggedIn) return null
  return <Layout />
}

function WildcardRedirect() {
  const navigate = useNavigate()
  useLayoutEffect(() => {
    navigate(isLoggedIn() ? '/home' : '/', { replace: true })
  }, [navigate])
  return null
}

function RoleRoute({ role, children }: { role: UserRole; children: ReactNode }) {
  const user = getStoredUser()
  if (!user || user.role !== role) {
    return <Navigate to="/home" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicAuthScreen />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/trips/new"
          element={
            <RoleRoute role="owner">
              <CreateTripPage />
            </RoleRoute>
          }
        />
        <Route
          path="/trips/available"
          element={
            <RoleRoute role="driver">
              <TripListPage />
            </RoleRoute>
          }
        />
        <Route path="/trips/mine" element={<MyTripsPage />} />
        <Route path="/trips/:id" element={<TripDetailPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:section" element={<ProfileSectionPage />} />
      </Route>
      <Route path="*" element={<WildcardRedirect />} />
    </Routes>
  )
}
