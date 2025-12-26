import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { type Request, type AgreementState } from '../types'

// Placeholder function to fetch request by ID
async function fetchRequestById(id: string): Promise<Request> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
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
      })
    }, 300)
  })
}

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [request, setRequest] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)
  const [agreement, setAgreement] = useState<AgreementState>({
    driverAcknowledged: false,
    ownerAcknowledged: false,
  })

  useEffect(() => {
    if (!id) return

    const loadRequest = async () => {
      try {
        setLoading(true)
        const data = await fetchRequestById(id)
        setRequest(data)
      } catch (error) {
        console.error('Could not fetch request:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRequest()
  }, [id])

  const handleCheckboxChange = (field: keyof AgreementState) => {
    setAgreement((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleAcceptRequest = () => {
    // TODO: Implement API call to accept request
    console.log('Accepting request:', id, agreement)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
          <p className="text-gray-600">Request could not be found.</p>
          <Link
            to="/browse"
            className="mt-4 inline-block px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to requests
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1F2937' }}>Request Details</h1>
        <p className="text-base font-normal" style={{ color: '#6B7280' }}>
          Request #{request.id}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-8 space-y-8 border-2" style={{ borderColor: '#E5ECF9' }}>
        <div>
          <h2 className="text-lg font-medium mb-6 pb-3 border-b-2" style={{ color: '#1F2937', borderColor: '#E5ECF9' }}>Trip Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium" style={{ color: '#6B7280' }}>Pickup Location:</span>
              <p className="mt-1" style={{ color: '#1F2937' }}>{request.from}</p>
            </div>
            <div>
              <span className="text-sm font-medium" style={{ color: '#6B7280' }}>Dropoff Location:</span>
              <p className="mt-1" style={{ color: '#1F2937' }}>{request.to}</p>
            </div>
            <div>
              <span className="text-sm font-medium" style={{ color: '#6B7280' }}>Date:</span>
              <p className="mt-1" style={{ color: '#1F2937' }}>{request.date}</p>
            </div>
            <div>
              <span className="text-sm font-medium" style={{ color: '#6B7280' }}>Insurance Company:</span>
              <p className="mt-1" style={{ color: '#1F2937' }}>{request.insuranceCompany}</p>
            </div>
            <div>
              <span className="text-sm font-medium" style={{ color: '#6B7280' }}>Deductible:</span>
              <p className="mt-1" style={{ color: '#1F2937' }}>{request.deductibleAmount.toLocaleString('en-US')} SEK</p>
            </div>
          </div>
        </div>

        {request.notes && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ color: '#1F2937' }}>Additional Information</h2>
            <p style={{ color: '#6B7280' }}>{request.notes}</p>
          </div>
        )}

        <div className="border-t-2 pt-6" style={{ borderColor: '#E5ECF9' }}>
          <h2 className="text-lg font-medium mb-6 pb-3 border-b-2" style={{ color: '#1F2937', borderColor: '#E5ECF9' }}>Liability and Responsibilities</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                id="driver-acknowledgment"
                name="driver-acknowledgment"
                type="checkbox"
                checked={agreement.driverAcknowledged}
                onChange={() => handleCheckboxChange('driverAcknowledged')}
                className="mt-1 h-4 w-4 rounded"
                style={{ accentColor: '#2563EB' }}
              />
              <label htmlFor="driver-acknowledgment" className="ml-3 text-sm" style={{ color: '#1F2937' }}>
                I understand that I may be personally liable for damages, including the deductible.
              </label>
            </div>
            <div className="flex items-start">
              <input
                id="owner-acknowledgment"
                name="owner-acknowledgment"
                type="checkbox"
                checked={agreement.ownerAcknowledged}
                onChange={() => handleCheckboxChange('ownerAcknowledged')}
                className="mt-1 h-4 w-4 rounded"
                style={{ accentColor: '#2563EB' }}
              />
              <label htmlFor="owner-acknowledgment" className="ml-3 text-sm" style={{ color: '#1F2937' }}>
                I understand that my vehicle insurance will be used and that I will pay the deductible.
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2" style={{ borderColor: '#E5ECF9' }}>
          <Link
            to="/home"
            className="px-8 py-3 rounded-lg font-semibold text-base text-center transition-all"
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
            Back
          </Link>
          <button
            type="button"
            onClick={handleAcceptRequest}
            disabled={!agreement.driverAcknowledged}
            className="px-8 py-3 rounded-lg font-semibold text-base text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
            style={{ 
              border: '2px solid #2563EB',
              backgroundColor: agreement.driverAcknowledged ? '#2563EB' : '#E5ECF9',
              color: agreement.driverAcknowledged ? '#FFFFFF' : '#6B7280'
            }}
            onMouseEnter={(e) => {
              if (agreement.driverAcknowledged) {
                e.currentTarget.style.backgroundColor = '#1D4ED8'
                e.currentTarget.style.borderColor = '#1D4ED8'
              }
            }}
            onMouseLeave={(e) => {
              if (agreement.driverAcknowledged) {
                e.currentTarget.style.backgroundColor = '#2563EB'
                e.currentTarget.style.borderColor = '#2563EB'
              }
            }}
          >
            Accept Request
          </button>
        </div>
      </div>
    </div>
  )
}
