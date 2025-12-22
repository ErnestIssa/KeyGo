import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isAuthPage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                  Keygo
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/browse"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Bläddra
                </Link>
                <Link
                  to="/create-request"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Skapa förfrågan
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profil
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className={isAuthPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {children}
      </main>
    </div>
  )
}

