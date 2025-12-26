import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type User, type Request, type Rating } from '../types'

// Placeholder function to fetch current user
async function fetchCurrentUser(): Promise<User> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'user-123',
        email: 'anna.andersson@example.se',
        name: 'Anna Andersson',
        phone: '070-123 45 67',
        licenseNumber: 'ABC123456',
        role: 'both',
      })
    }, 200)
  })
}

// Placeholder function to fetch user's completed requests
async function fetchUserHistory(userId: string): Promise<Request[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'req-1',
          ownerId: userId,
          driverId: 'driver-456',
          from: 'Stockholm, Centralstation',
          to: 'Göteborg, Centralstation',
          date: '2024-12-20',
          time: '14:00',
          notes: 'Car relocation from central Stockholm to Gothenburg center.',
          insuranceCompany: 'Folksam',
          deductibleAmount: 5000,
          status: 'completed',
          createdAt: '2024-12-15T10:00:00Z',
        },
        {
          id: 'req-2',
          ownerId: 'owner-789',
          driverId: userId,
          from: 'Malmö, Central Station',
          to: 'Lund, Central Station',
          date: '2024-12-15',
          time: '10:00',
          notes: 'Short relocation within Skåne',
          insuranceCompany: 'Länsförsäkringar',
          deductibleAmount: 3000,
          status: 'completed',
          createdAt: '2024-12-10T08:00:00Z',
        },
      ])
    }, 300)
  })
}

// Placeholder function to fetch user's ratings
async function fetchUserRatings(userId: string): Promise<Rating[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'rating-1',
          requestId: 'req-1',
          fromUserId: 'driver-456',
          toUserId: userId,
          rating: 5,
          comment: 'Very professional and reliable!',
          createdAt: '2024-12-21T10:00:00Z',
        },
        {
          id: 'rating-2',
          requestId: 'req-2',
          fromUserId: userId,
          toUserId: 'owner-789',
          rating: 4,
          comment: 'Good communication and punctual.',
          createdAt: '2024-12-16T14:00:00Z',
        },
      ])
    }, 300)
  })
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<Request[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('keygo_user')
    localStorage.removeItem('keygo_auth')
    navigate('/')
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [userData, historyData, ratingsData] = await Promise.all([
          fetchCurrentUser(),
          fetchCurrentUser().then((u) => fetchUserHistory(u.id)),
          fetchCurrentUser().then((u) => fetchUserRatings(u.id)),
        ])
        setUser(userData)
        setHistory(historyData)
        setRatings(ratingsData)
      } catch (error) {
        console.error('Could not load profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    // TODO: Implement edit functionality
    console.log('Edit profile')
  }

  const handleSave = () => {
    setIsEditing(false)
    // TODO: Implement save functionality
    console.log('Save profile')
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getRoleLabel = (role?: string): string => {
    switch (role) {
      case 'owner':
        return 'Owner'
      case 'driver':
        return 'Driver'
      case 'both':
        return 'Owner & Driver'
      default:
        return 'Unknown'
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
      : 0

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-8 border-2 border-white/30">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6 pb-20">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-8 border-2 border-white/30">
          <p className="text-gray-600">Could not load user information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1F2937' }}>Profile</h1>
          <p className="text-base font-normal" style={{ color: '#6B7280' }}>
            Manage your profile and view your history
          </p>
        </div>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-8 py-3 rounded-lg font-semibold text-base transition-all"
            style={{ 
              border: '2px solid #E5ECF9',
              backgroundColor: '#E5ECF9',
              color: '#1F2937'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D1D9E6'
              e.currentTarget.style.borderColor = '#D1D9E6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E5ECF9'
              e.currentTarget.style.borderColor = '#E5ECF9'
            }}
          >
            Edit
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6 border-2" style={{ borderColor: '#E5ECF9' }}>
        <h2 className="text-lg font-medium mb-6 pb-3 border-b-2" style={{ color: '#1F2937', borderColor: '#E5ECF9' }}>Profile Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium" style={{ color: '#6B7280' }}>Name</label>
            <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium" style={{ color: '#6B7280' }}>Email</label>
            <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium" style={{ color: '#6B7280' }}>Role</label>
            <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{getRoleLabel(user.role)}</p>
          </div>
          {user.phone && (
            <div>
              <label className="block text-sm font-medium" style={{ color: '#6B7280' }}>Phone Number</label>
              <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{user.phone}</p>
            </div>
          )}
          {user.licenseNumber && (
            <div>
              <label className="block text-sm font-medium" style={{ color: '#6B7280' }}>License Number</label>
              <p className="mt-1 text-sm" style={{ color: '#1F2937' }}>{user.licenseNumber}</p>
            </div>
          )}
        </div>
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-all"
              style={{ 
                border: '1px solid #E5ECF9',
                backgroundColor: '#E5ECF9',
                color: '#1F2937'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D1D9E6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E5ECF9'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-lg font-semibold text-base text-white transition-all transform hover:scale-[1.02] shadow-lg"
              style={{ 
                border: '2px solid #2563EB',
                backgroundColor: '#2563EB'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1D4ED8'
                e.currentTarget.style.borderColor = '#1D4ED8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB'
                e.currentTarget.style.borderColor = '#2563EB'
              }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Rating Summary */}
      {ratings.length > 0 && (
        <div className="bg-white rounded-xl shadow-xl p-8 border-2" style={{ borderColor: '#E5ECF9' }}>
          <h2 className="text-lg font-medium mb-6 pb-3 border-b-2" style={{ color: '#1F2937', borderColor: '#E5ECF9' }}>Ratings</h2>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold" style={{ color: '#1F2937' }}>
              {averageRating.toFixed(1)}
            </div>
            <div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                Based on {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-lg shadow p-6 border-2" style={{ borderColor: '#E5ECF9' }}>
        <h2 className="text-lg font-medium mb-6 pb-3 border-b-2" style={{ color: '#1F2937', borderColor: '#E5ECF9' }}>History</h2>
        {history.length === 0 ? (
          <p className="text-sm" style={{ color: '#6B7280' }}>No completed trips yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((request) => {
              const requestRating = ratings.find((r) => r.requestId === request.id)
              const isOwner = request.ownerId === user.id

              return (
                <div key={request.id} className="border-b pb-4 last:border-b-0 last:pb-0" style={{ borderColor: '#E5ECF9' }}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium" style={{ color: '#1F2937' }}>
                        {request.from} → {request.to}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                        {formatDate(request.date)} at {request.time} • Completed
                      </p>
                      {isOwner && request.driverId && (
                        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                          Driver assigned
                        </p>
                      )}
                      {!isOwner && (
                        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                          You drove this trip
                        </p>
                      )}
                    </div>
                    {requestRating && (
                      <div className="mt-2 sm:mt-0 sm:ml-4">
                        <div className="flex items-center space-x-2">
                          {renderStars(requestRating.rating)}
                          {requestRating.comment && (
                            <p className="text-xs max-w-xs" style={{ color: '#6B7280' }}>
                              "{requestRating.comment}"
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="bg-white rounded-xl shadow-xl p-8 border-2" style={{ borderColor: '#E5ECF9' }}>
        <button
          onClick={handleLogout}
          className="w-full px-8 py-3 rounded-lg font-semibold text-base text-white transition-all transform hover:scale-[1.02] shadow-lg"
          style={{ 
            border: '2px solid #991B1B',
            backgroundColor: '#991B1B'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#7F1D1D'
            e.currentTarget.style.borderColor = '#7F1D1D'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#991B1B'
            e.currentTarget.style.borderColor = '#991B1B'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
