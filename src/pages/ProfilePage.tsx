import { useState, useEffect } from 'react'
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
          notes: 'Bilflyttning från centrala Stockholm till Göteborg centrum.',
          insuranceCompany: 'Folksam',
          deductibleAmount: 5000,
          status: 'completed',
          createdAt: '2024-12-15T10:00:00Z',
        },
        {
          id: 'req-2',
          ownerId: 'owner-789',
          driverId: userId,
          from: 'Malmö, Centralstation',
          to: 'Lund, Centralstation',
          date: '2024-12-15',
          time: '10:00',
          notes: 'Kort flyttning inom Skåne',
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
          comment: 'Mycket professionell och pålitlig!',
          createdAt: '2024-12-21T10:00:00Z',
        },
        {
          id: 'rating-2',
          requestId: 'req-2',
          fromUserId: userId,
          toUserId: 'owner-789',
          rating: 4,
          comment: 'Bra kommunikation och punktlig.',
          createdAt: '2024-12-16T14:00:00Z',
        },
      ])
    }, 300)
  })
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<Request[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

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
        console.error('Kunde inte ladda profildata:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    // TODO: Implement edit functionality
    console.log('Redigera profil')
  }

  const handleSave = () => {
    setIsEditing(false)
    // TODO: Implement save functionality
    console.log('Spara profil')
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getRoleLabel = (role?: string): string => {
    switch (role) {
      case 'owner':
        return 'Ägare'
      case 'driver':
        return 'Förare'
      case 'both':
        return 'Ägare & Förare'
      default:
        return 'Okänd'
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Kunde inte ladda användarinformation.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
          <p className="mt-1 text-sm text-gray-600">
            Hantera din profil och se din historik
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Redigera
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profilinformation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Namn</label>
            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-post</label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll</label>
            <p className="mt-1 text-sm text-gray-900">{getRoleLabel(user.role)}</p>
          </div>
          {user.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefonnummer</label>
              <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
            </div>
          )}
          {user.licenseNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Körkortsnummer</label>
              <p className="mt-1 text-sm text-gray-900">{user.licenseNumber}</p>
            </div>
          )}
        </div>
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Spara ändringar
            </button>
          </div>
        )}
      </div>

      {/* Rating Summary */}
      {ratings.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Betyg</h2>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-gray-500 mt-1">
                Baserat på {ratings.length} {ratings.length === 1 ? 'betyg' : 'betyg'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Historik</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">Inga slutförda resor ännu.</p>
        ) : (
          <div className="space-y-4">
            {history.map((request) => {
              const requestRating = ratings.find((r) => r.requestId === request.id)
              const isOwner = request.ownerId === user.id

              return (
                <div key={request.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {request.from} → {request.to}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(request.date)} kl {request.time} • Slutförd
                      </p>
                      {isOwner && request.driverId && (
                        <p className="text-xs text-gray-400 mt-1">
                          Förare tilldelad
                        </p>
                      )}
                      {!isOwner && (
                        <p className="text-xs text-gray-400 mt-1">
                          Du körde denna resa
                        </p>
                      )}
                    </div>
                    {requestRating && (
                      <div className="mt-2 sm:mt-0 sm:ml-4">
                        <div className="flex items-center space-x-2">
                          {renderStars(requestRating.rating)}
                          {requestRating.comment && (
                            <p className="text-xs text-gray-500 max-w-xs">
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
    </div>
  )
}
