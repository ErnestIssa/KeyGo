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
          notes: 'Car relocation from central Stockholm to Gothenburg center. The car is ready for relocation and all keys are available.',
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
          notes: 'Short relocation within Skåne',
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
          notes: 'Relocation to the airport',
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
        console.error('Could not fetch requests:', err)
        setError('Could not load requests. Please try again later.')
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#1F2937' }}>Browse Requests</h1>
          <p className="mt-1 text-sm font-normal" style={{ color: '#6B7280' }}>
            Find car relocation requests
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-xl p-6 animate-pulse border-2" style={{ borderColor: '#E5ECF9' }}>
              <div className="h-6 rounded w-1/3 mb-2" style={{ backgroundColor: '#E5ECF9' }}></div>
              <div className="h-4 rounded w-1/4 mb-4" style={{ backgroundColor: '#E5ECF9' }}></div>
              <div className="h-4 rounded w-full" style={{ backgroundColor: '#E5ECF9' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1F2937' }}>Bläddra förfrågningar</h1>
          <p className="text-base font-normal" style={{ color: '#6B7280' }}>
            Hitta förfrågningar för bilflyttning
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 border-2" style={{ borderColor: '#E5ECF9' }}>
          <p className="mb-4 text-base font-normal" style={{ color: '#991B1B' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-lg font-semibold text-base text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:scale-[1.02] shadow-lg"
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
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: '#1F2937' }}>Bläddra förfrågningar</h1>
        <p className="mt-1 text-sm font-normal" style={{ color: '#6B7280' }}>
          Hitta förfrågningar för bilflyttning
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center border-2" style={{ borderColor: '#E5ECF9' }}>
          <p style={{ color: '#6B7280' }}>No open requests available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              onClick={() => handleCardClick(request.id)}
              className="bg-white rounded-xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-200 border-2 transform hover:scale-[1.02]"
              style={{ borderColor: '#E5ECF9' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium" style={{ color: '#1F2937' }}>
                    {request.from} → {request.to}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-normal" style={{ color: '#6B7280' }}>
                      {formatDate(request.date)} kl {request.time}
                    </p>
                    {request.notes && (
                      <p className="text-sm font-normal line-clamp-2" style={{ color: '#6B7280' }}>
                        {request.notes}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#E5ECF9', color: '#2563EB' }}>
                      {request.insuranceCompany}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#E5ECF9', color: '#1F2937' }}>
                      {request.deductibleAmount.toLocaleString('en-US')} SEK deductible
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                  <button 
                    className="px-6 py-3 border-2 font-semibold rounded-lg transition-all text-base shadow-lg text-white"
                    style={{ 
                      borderColor: '#2563EB',
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
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
