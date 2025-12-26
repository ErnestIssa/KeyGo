import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type Request } from '../types'

// Placeholder function to fetch user's active requests with chat
async function fetchActiveChats(userId: string): Promise<Request[]> {
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
          date: '2024-12-25',
          time: '14:00',
          notes: 'Car relocation from central Stockholm to Gothenburg center.',
          insuranceCompany: 'Folksam',
          deductibleAmount: 5000,
          status: 'accepted',
          createdAt: '2024-12-20T10:00:00Z',
        },
        {
          id: 'req-2',
          ownerId: 'owner-789',
          driverId: userId,
          from: 'Malmö, Central Station',
          to: 'Lund, Central Station',
          date: '2024-12-26',
          time: '10:00',
          notes: 'Short relocation within Skåne',
          insuranceCompany: 'Länsförsäkringar',
          deductibleAmount: 3000,
          status: 'in_progress',
          createdAt: '2024-12-21T08:00:00Z',
        },
      ])
    }, 300)
  })
}

export default function ChatListPage() {
  const navigate = useNavigate()
  const [chats, setChats] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true)
        const storedUser = localStorage.getItem('keygo_user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          const data = await fetchActiveChats(user.id)
          setChats(data)
        }
      } catch (error) {
        console.error('Could not load chats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1F2937' }}>Chat</h1>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-xl p-6 animate-pulse border-2" style={{ borderColor: '#E5ECF9' }}>
              <div className="h-6 rounded w-2/3 mb-2" style={{ backgroundColor: '#E5ECF9' }}></div>
              <div className="h-4 rounded w-1/2" style={{ backgroundColor: '#E5ECF9' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2937' }}>Chatt</h1>
        <p className="text-base font-normal" style={{ color: '#6B7280' }}>
          Your active conversations
        </p>
      </div>

      {chats.length === 0 ? (
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 text-center" style={{ borderColor: '#E5ECF9' }}>
          <p className="mb-4 text-base font-normal" style={{ color: '#6B7280' }}>No active chats yet.</p>
          <p className="text-sm font-normal" style={{ color: '#6B7280' }}>
            When you accept or create a request, chats will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((request) => (
            <div
              key={request.id}
              onClick={() => navigate(`/chat/${request.id}`)}
              className="bg-white rounded-xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-200 border-2 transform hover:scale-[1.02]"
              style={{ borderColor: '#E5ECF9' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1" style={{ color: '#1F2937' }}>
                    {request.from} → {request.to}
                  </h3>
                  <p className="text-sm font-normal" style={{ color: '#6B7280' }}>
                    {new Date(request.date).toLocaleDateString('en-US')} at {request.time}
                  </p>
                  <div className="mt-2">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: request.status === 'accepted' ? '#E5ECF9' : 
                                        request.status === 'in_progress' ? '#E5ECF9' : '#E5ECF9',
                        color: request.status === 'accepted' ? '#2563EB' : 
                               request.status === 'in_progress' ? '#2563EB' : '#1F2937'
                      }}
                    >
                      {request.status === 'accepted' ? 'Accepted' :
                       request.status === 'in_progress' ? 'In Progress' : request.status}
                    </span>
                  </div>
                </div>
                <svg
                  className="w-6 h-6 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#6B7280' }}
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
          ))}
        </div>
      )}
    </div>
  )
}

