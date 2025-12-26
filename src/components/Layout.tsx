import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthPage = location.pathname === '/'
  const isLoggedIn = !isAuthPage

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar - Only Profile Icon when logged in */}
      {isLoggedIn && (
        <div className="bg-white shadow-lg border-b sticky top-0 z-50" style={{ borderColor: '#E5ECF9' }}>
          <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/home" className="text-base font-semibold" style={{ color: '#2563EB' }}>
              KeyGo
            </Link>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full transition-colors"
              style={{ color: '#1F2937' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5ECF9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Profile"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${isAuthPage ? '' : 'max-w-md mx-auto w-full px-4 py-6'}`}>
        {children}
      </main>

      {/* Bottom Navigation - Only when logged in */}
      {isLoggedIn && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 shadow-lg z-50" style={{ borderColor: '#E5ECF9' }}>
          <div className="max-w-md mx-auto">
            <div className="flex justify-around items-center h-16">
              {/* Home */}
              <Link
                to="/home"
                className="flex flex-col items-center justify-center flex-1 h-full"
                style={{ color: location.pathname === '/home' ? '#2563EB' : '#6B7280' }}
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="text-xs font-medium">Home</span>
              </Link>

              {/* Create Request */}
              <Link
                to="/create-request"
                className="flex flex-col items-center justify-center flex-1 h-full"
                style={{ color: location.pathname === '/create-request' ? '#2563EB' : '#6B7280' }}
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-xs font-medium">Create</span>
              </Link>

              {/* Browse Requests */}
              <Link
                to="/browse"
                className="flex flex-col items-center justify-center flex-1 h-full"
                style={{ color: location.pathname === '/browse' ? '#2563EB' : '#6B7280' }}
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-xs font-medium">Browse</span>
              </Link>

              {/* Chat */}
              <Link
                to="/chat"
                className="flex flex-col items-center justify-center flex-1 h-full"
                style={{ color: location.pathname === '/chat' || location.pathname.startsWith('/chat/') ? '#2563EB' : '#6B7280' }}
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-xs font-medium">Chat</span>
              </Link>

              {/* Profile */}
              <button
                onClick={() => navigate('/profile')}
                className="flex flex-col items-center justify-center flex-1 h-full"
                style={{ color: location.pathname === '/profile' ? '#2563EB' : '#6B7280' }}
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-xs font-medium">Profile</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
