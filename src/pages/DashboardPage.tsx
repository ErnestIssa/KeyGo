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
          notes: 'Car relocation from central Stockholm to Gothenburg center.',
          insuranceCompany: 'Folksam',
          deductibleAmount: 5000,
          status: 'pending',
          createdAt: '2024-12-20T10:00:00Z',
        },
        {
          id: 'req-4',
          ownerId: userId,
          driverId: 'driver-456',
          from: 'Uppsala, Central Station',
          to: 'Stockholm, Arlanda',
          date: '2024-12-27',
          time: '09:00',
          notes: 'Relocation to the airport',
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
          notes: 'Short relocation within Skåne',
          insuranceCompany: 'Länsförsäkringar',
          deductibleAmount: 3000,
          status: 'accepted',
          createdAt: '2024-12-21T08:00:00Z',
        },
        {
          id: 'req-3',
          ownerId: 'owner-789',
          driverId: userId,
          from: 'Gothenburg, Central Station',
          to: 'Stockholm, Central Station',
          date: '2024-12-28',
          time: '12:00',
          notes: 'Return trip',
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
        console.error('Could not load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
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
        return 'Pending'
      case 'accepted':
        return 'Accepted'
      case 'in_progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
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
            <div key={i} className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-6 animate-pulse border border-white/20">
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
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
          <p className="text-gray-600">Could not load user information.</p>
        </div>
      </div>
    )
  }

  const showOwnerSection = user.role === 'owner' || user.role === 'both'
  const showDriverSection = user.role === 'driver' || user.role === 'both'

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1F2937' }}>Overview</h1>
        <p className="text-base font-normal" style={{ color: '#6B7280' }}>
          Overview of your requests and activities
        </p>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-xl shadow-xl p-8 border-2" style={{ borderColor: '#E5ECF9' }}>
        <h2 className="text-lg font-medium mb-6 pb-3 border-b-2" style={{ color: '#1F2937', borderColor: '#E5ECF9' }}>Your Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Namn</p>
            <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#6B7280' }}>E-post</p>
            <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Telefon</p>
              <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{user.phone}</p>
            </div>
          )}
          {user.licenseNumber && (
            <div>
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Körkortsnummer</p>
              <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{user.licenseNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          to="/create-request"
          className="block bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 border-2 transform hover:scale-[1.02]"
          style={{ borderColor: '#E5ECF9' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: '#1F2937' }}>Create Request</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#2563EB' }}>
              <svg
                className="w-6 h-6 text-white"
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
          </div>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Create a new car relocation request
          </p>
          <button className="w-full py-3 px-6 border-2 font-semibold rounded-lg transition-all text-base text-white" style={{ borderColor: '#2563EB', backgroundColor: '#2563EB' }}>
            Create Now →
          </button>
        </Link>
        <Link
          to="/browse"
          className="block bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 border-2 transform hover:scale-[1.02]"
          style={{ borderColor: '#E5ECF9' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: '#1F2937' }}>Browse Requests</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#2563EB' }}>
              <svg
                className="w-6 h-6 text-white"
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
          </div>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Find requests to accept
          </p>
          <button className="w-full py-3 px-6 border-2 font-semibold rounded-lg transition-all text-base text-white" style={{ borderColor: '#2563EB', backgroundColor: '#2563EB' }}>
            Browse Now →
          </button>
        </Link>
      </div>

      {/* Owner Requests */}
      {showOwnerSection && (
        <div className="bg-white rounded-xl shadow-xl p-8 border-2" style={{ borderColor: '#E5ECF9' }}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2" style={{ borderColor: '#E5ECF9' }}>
            <h2 className="text-lg font-medium" style={{ color: '#1F2937' }}>My Requests</h2>
            <span className="text-sm" style={{ color: '#6B7280' }}>
              {ownerRequests.length} {ownerRequests.length === 1 ? 'request' : 'requests'}
            </span>
          </div>
          {ownerRequests.length === 0 ? (
            <p className="text-sm" style={{ color: '#6B7280' }}>You have no created requests yet.</p>
          ) : (
            <div className="space-y-4">
              {ownerRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => navigate(`/request/${request.id}`)}
                  className="border rounded-lg p-4 cursor-pointer transition-all duration-200 transform hover:scale-[1.01]"
                  style={{ borderColor: '#E5ECF9' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB'
                    e.currentTarget.style.backgroundColor = '#E5ECF9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5ECF9'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium" style={{ color: '#1F2937' }}>
                        {request.from} → {request.to}
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
                        {formatDate(request.date)} at {request.time}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#E5ECF9', color: '#2563EB' }}
                        >
                          {getStatusLabel(request.status)}
                        </span>
                        {request.driverId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#E5ECF9', color: '#2563EB' }}>
                            Driver assigned
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
        <div className="bg-white rounded-xl shadow-xl p-8 border-2" style={{ borderColor: '#E5ECF9' }}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2" style={{ borderColor: '#E5ECF9' }}>
            <h2 className="text-lg font-medium" style={{ color: '#1F2937' }}>Accepted Requests</h2>
            <span className="text-sm" style={{ color: '#6B7280' }}>
              {driverRequests.length} {driverRequests.length === 1 ? 'request' : 'requests'}
            </span>
          </div>
          {driverRequests.length === 0 ? (
            <p className="text-sm" style={{ color: '#6B7280' }}>You have no accepted requests yet.</p>
          ) : (
            <div className="space-y-4">
              {driverRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => navigate(`/request/${request.id}`)}
                  className="border rounded-lg p-4 cursor-pointer transition-all duration-200 transform hover:scale-[1.01]"
                  style={{ borderColor: '#E5ECF9' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB'
                    e.currentTarget.style.backgroundColor = '#E5ECF9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5ECF9'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium" style={{ color: '#1F2937' }}>
                        {request.from} → {request.to}
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
                        {formatDate(request.date)} at {request.time}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#E5ECF9', color: '#2563EB' }}
                        >
                          {getStatusLabel(request.status)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#E5ECF9', color: '#1F2937' }}>
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
