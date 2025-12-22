import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type Request } from '../types'

// Placeholder function to fetch open requests
async function fetchOpenRequests(): Promise<Request[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'req-1',
          ownerId: 'owner-123',
          from: 'Stockholm, Centralstation',
          to: 'Göteborg, Centralstation',
          date: '2024-12-25',
          time: '14:00',
          notes: 'Bilflyttning från centrala Stockholm till Göteborg centrum. Bilen är redo för flyttning och alla nycklar finns tillgängliga.',
          insuranceCompany: 'Folksam',
          deductibleAmount: 5000,
          status: 'pending',
          createdAt: '2024-12-20T10:00:00Z',
        },
        {
          id: 'req-2',
          ownerId: 'owner-456',
          from: 'Malmö, Centralstation',
          to: 'Lund, Centralstation',
          date: '2024-12-26',
          time: '10:00',
          notes: 'Kort flyttning inom Skåne',
          insuranceCompany: 'Länsförsäkringar',
          deductibleAmount: 3000,
          status: 'pending',
          createdAt: '2024-12-21T08:00:00Z',
        },
        {
          id: 'req-3',
          ownerId: 'owner-789',
          from: 'Uppsala, Centralstation',
          to: 'Stockholm, Arlanda',
          date: '2024-12-27',
          time: '09:00',
          notes: 'Flyttning till flygplatsen',
          insuranceCompany: 'If',
          deductibleAmount: 4000,
          status: 'pending',
          createdAt: '2024-12-22T14:00:00Z',
        },
      ])
    }, 300)
  })
}

export default function BrowseRequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchOpenRequests()
        // Filter to only show pending requests
        const openRequests = data.filter((req) => req.status === 'pending')
        setRequests(openRequests)
      } catch (err) {
        console.error('Kunde inte hämta förfrågningar:', err)
        setError('Kunde inte ladda förfrågningar. Försök igen senare.')
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [])

  const handleCardClick = (requestId: string) => {
    navigate(`/request/${requestId}`)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bläddra förfrågningar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Hitta förfrågningar för bilflyttning
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bläddra förfrågningar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Hitta förfrågningar för bilflyttning
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Försök igen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bläddra förfrågningar</h1>
        <p className="mt-1 text-sm text-gray-600">
          Hitta förfrågningar för bilflyttning
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">Inga öppna förfrågningar tillgängliga just nu.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              onClick={() => handleCardClick(request.id)}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.from} → {request.to}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      {formatDate(request.date)} kl {request.time}
                    </p>
                    {request.notes && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {request.notes}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {request.insuranceCompany}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {request.deductibleAmount.toLocaleString('sv-SE')} SEK självrisk
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                  <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Visa detaljer
                    <svg
                      className="ml-2 -mr-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
