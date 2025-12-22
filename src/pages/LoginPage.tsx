import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { type User } from '../types'

// Mock users for testing
const MOCK_USERS: User[] = [
  {
    id: 'user-123',
    email: 'anna@keygo.se',
    name: 'Anna Andersson',
    phone: '070-123 45 67',
    licenseNumber: 'ABC123456',
    role: 'both',
  },
  {
    id: 'user-456',
    email: 'owner@keygo.se',
    name: 'Erik Ägare',
    phone: '070-234 56 78',
    licenseNumber: 'DEF789012',
    role: 'owner',
  },
  {
    id: 'user-789',
    email: 'driver@keygo.se',
    name: 'Sara Förare',
    phone: '070-345 67 89',
    licenseNumber: 'GHI345678',
    role: 'driver',
  },
]

// Mock authentication function
async function mockLogin(email: string, password: string): Promise<User | null> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Accept any password for mock users, or accept any email/password for testing
      const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (user) {
        // For mock users, accept any password
        resolve(user)
      } else if (password.length >= 4) {
        // For any other email, accept if password is at least 4 characters
        resolve({
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: 'both',
        })
      } else {
        resolve(null)
      }
    }, 500)
  })
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const user = await mockLogin(email, password)
      if (user) {
        // Store user in localStorage for mock auth
        localStorage.setItem('keygo_user', JSON.stringify(user))
        localStorage.setItem('keygo_auth', 'true')
        navigate('/dashboard')
      } else {
        setError('Ogiltig e-post eller lösenord')
      }
    } catch (err) {
      setError('Ett fel uppstod. Försök igen.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Keygo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Logga in för att fortsätta
          </p>
        </div>

        {/* Mock credentials info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-xs font-medium text-blue-900 mb-2">Testkonton:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>anna@keygo.se</strong> / lösenord (ägare & förare)</p>
            <p><strong>owner@keygo.se</strong> / lösenord (ägare)</p>
            <p><strong>driver@keygo.se</strong> / lösenord (förare)</p>
            <p className="mt-2 text-blue-600">Eller använd valfri e-post + lösenord (minst 4 tecken)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-post
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="din@epost.se"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Lösenord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                disabled={loading}
                minLength={4}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loggar in...' : 'Logga in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
