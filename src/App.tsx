import { Routes, Route, Navigate } from 'react-router-dom'
import { type ReactElement } from 'react'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import CreateRequestPage from './pages/CreateRequestPage'
import BrowseRequestsPage from './pages/BrowseRequestsPage'
import RequestDetailPage from './pages/RequestDetailPage'
import ChatListPage from './pages/ChatListPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactElement }) {
  const isAuthenticated = localStorage.getItem('keygo_auth') === 'true'
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-request"
          element={
            <ProtectedRoute>
              <CreateRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowseRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request/:id"
          element={
            <ProtectedRoute>
              <RequestDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:requestId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Redirect old dashboard route to home */}
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        {/* Catch all - redirect to home if logged in, otherwise login */}
        <Route
          path="*"
          element={
            localStorage.getItem('keygo_auth') === 'true' ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
