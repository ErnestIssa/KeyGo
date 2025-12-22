import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { type User, type Request } from '../types'

// Placeholder function to fetch current user
async function fetchCurrentUser(): Promise<User> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if user is stored in localStorage (from login)
      const storedUser = localStorage.getItem('keygo_user')
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          resolve(user)
          return
        } catch (e) {
          console.error('Failed to parse stored user:', e)
        }
      }
      // Fallback to default user
      resolve({
        id: 'user-123',
        email: 'användare@example.se',
        name: 'Anna Andersson',
        phone: '070-123 45 67',
        licenseNumber: 'ABC123456',
        role: 'both', // Can be 'owner', 'driver', or 'both'
      })
    }, 200)
  })
}

// Placeholder function to fetch user's requests (as owner)
async function fetchOwnerRequests(userId: string): Promise<Request[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'req-1',
          ownerId: userId,
          from: 'Stockholm, Centralstation',
          to: 'Göteborg, Centralstation',
          date: '2024-12-25',
          time: '14:00',
          notes: 'Bilflyttning från centrala Stockholm till Göteborg centrum.',
          insuranceCompany: 'Folksam',
          deductibleAmount: 5000,
          status: 'pending',
          createdAt: '2024-12-20T10:00:00Z',
        },
        {
          id: 'req-4',
          ownerId: userId,
          driverId: 'driver-456',
          from: 'Uppsala, Centralstation',
          to: 'Stockholm, Arlanda',
          date: '2024-12-27',
          time: '09:00',
          notes: 'Flyttning till flygplatsen',
          insuranceCompany: 'If',
          deductibleAmount: 4000,
          status: 'accepted',
          createdAt: '2024-12-22T14:00:00Z',
        },
      ])
    }, 300)
  })
}

// Placeholder function to fetch user's requests (as driver)
async function fetchDriverRequests(userId: string): Promise<Request[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'req-2',
          ownerId: 'owner-456',
          driverId: userId,
          from: 'Malmö, Centralstation',
          to: 'Lund, Centralstation',
          date: '2024-12-26',
          time: '10:00',
          notes: 'Kort flyttning inom Skåne',
          insuranceCompany: 'Länsförsäkringar',
          deductibleAmount: 3000,
          status: 'accepted',
          createdAt: '2024-12-21T08:00:00Z',
        },
        {
          id: 'req-3',
          ownerId: 'owner-789',
          driverId: userId,
          from: 'Göteborg, Centralstation',
          to: 'Stockholm, Centralstation',
          date: '2024-12-28',
          time: '12:00',
          notes: 'Returresa',
          insuranceCompany: 'Trygg-Hansa',
          deductibleAmount: 4500,
          status: 'in_progress',
          createdAt: '2024-12-23T16:00:00Z',
        },
      ])
    }, 300)
  })
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [ownerRequests, setOwnerRequests] = useState<Request[]>([])
  const [driverRequests, setDriverRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)

        // Load requests based on user role
        if (currentUser.role === 'owner' || currentUser.role === 'both') {
          const ownerReqs = await fetchOwnerRequests(currentUser.id)
          setOwnerRequests(ownerReqs)
        }

        if (currentUser.role === 'driver' || currentUser.role === 'both') {
          const driverReqs = await fetchDriverRequests(currentUser.id)
          setDriverRequests(driverReqs)
        }
      } catch (error) {
        console.error('Kunde inte ladda dashboard-data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadgeColor = (status: Request['status']): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Request['status']): string => {
    switch (status) {
      case 'pending':
        return 'Väntar'
      case 'accepted':
        return 'Accepterad'
      case 'in_progress':
        return 'Pågår'
      case 'completed':
        return 'Slutförd'
      case 'cancelled':
        return 'Inställd'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Kunde inte ladda användarinformation.</p>
        </div>
      </div>
    )
  }

  const showOwnerSection = user.role === 'owner' || user.role === 'both'
  const showDriverSection = user.role === 'driver' || user.role === 'both'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Översikt</h1>
        <p className="mt-1 text-sm text-gray-600">
          Översikt över dina förfrågningar och aktiviteter
        </p>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Din profil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Namn</p>
            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">E-post</p>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <p className="text-sm font-medium text-gray-500">Telefon</p>
              <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
            </div>
          )}
          {user.licenseNumber && (
            <div>
              <p className="text-sm font-medium text-gray-500">Körkortsnummer</p>
              <p className="mt-1 text-sm text-gray-900">{user.licenseNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/create-request"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Skapa förfrågan</h3>
              <p className="mt-1 text-sm text-gray-600">
                Skapa en ny förfrågan för bilflyttning
              </p>
            </div>
            <svg
              className="w-6 h-6 text-blue-600"
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
          </div>
        </Link>
        <Link
          to="/browse"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Bläddra förfrågningar</h3>
              <p className="mt-1 text-sm text-gray-600">
                Hitta förfrågningar att acceptera
              </p>
            </div>
            <svg
              className="w-6 h-6 text-green-600"
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
          </div>
        </Link>
      </div>

      {/* Owner Requests */}
      {showOwnerSection && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Mina förfrågningar</h2>
            <span className="text-sm text-gray-500">
              {ownerRequests.length} {ownerRequests.length === 1 ? 'förfrågan' : 'förfrågningar'}
            </span>
          </div>
          {ownerRequests.length === 0 ? (
            <p className="text-sm text-gray-500">Du har inga skapade förfrågningar ännu.</p>
          ) : (
            <div className="space-y-4">
              {ownerRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => navigate(`/request/${request.id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {request.from} → {request.to}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(request.date)} kl {request.time}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            request.status
                          )}`}
                        >
                          {getStatusLabel(request.status)}
                        </span>
                        {request.driverId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Förare tilldelad
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Driver Requests */}
      {showDriverSection && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Accepterade förfrågningar</h2>
            <span className="text-sm text-gray-500">
              {driverRequests.length} {driverRequests.length === 1 ? 'förfrågan' : 'förfrågningar'}
            </span>
          </div>
          {driverRequests.length === 0 ? (
            <p className="text-sm text-gray-500">Du har inga accepterade förfrågningar ännu.</p>
          ) : (
            <div className="space-y-4">
              {driverRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => navigate(`/request/${request.id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {request.from} → {request.to}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(request.date)} kl {request.time}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            request.status
                          )}`}
                        >
                          {getStatusLabel(request.status)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {request.insuranceCompany}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
