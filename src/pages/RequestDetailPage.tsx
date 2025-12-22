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
        notes: 'Bilflyttning från centrala Stockholm till Göteborg centrum. Bilen är redo för flyttning och alla nycklar finns tillgängliga.',
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
        console.error('Kunde inte hämta förfrågan:', error)
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
    // TODO: Implementera API-anrop för att acceptera förfrågan
    console.log('Accepterar förfrågan:', id, agreement)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
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
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Förfrågan kunde inte hittas.</p>
          <Link
            to="/browse"
            className="mt-4 inline-block px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Tillbaka till förfrågningar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Förfrågans detaljer</h1>
        <p className="mt-1 text-sm text-gray-600">
          Förfrågan #{request.id}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Reseinformation</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Hämtningsplats:</span>
              <p className="text-gray-900 mt-1">{request.from}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Leveransplats:</span>
              <p className="text-gray-900 mt-1">{request.to}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Datum:</span>
              <p className="text-gray-900 mt-1">{request.date}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Försäkringsbolag:</span>
              <p className="text-gray-900 mt-1">{request.insuranceCompany}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Självrisk:</span>
              <p className="text-gray-900 mt-1">{request.deductibleAmount.toLocaleString('sv-SE')} SEK</p>
            </div>
          </div>
        </div>

        {request.notes && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ytterligare information</h2>
            <p className="text-gray-600">{request.notes}</p>
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ansvar och ansvarsförhållanden</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                id="driver-acknowledgment"
                name="driver-acknowledgment"
                type="checkbox"
                checked={agreement.driverAcknowledged}
                onChange={() => handleCheckboxChange('driverAcknowledged')}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="driver-acknowledgment" className="ml-3 text-sm text-gray-700">
                Jag förstår att jag personligen kan bli ersättningsskyldig vid skada, inklusive självrisk.
              </label>
            </div>
            <div className="flex items-start">
              <input
                id="owner-acknowledgment"
                name="owner-acknowledgment"
                type="checkbox"
                checked={agreement.ownerAcknowledged}
                onChange={() => handleCheckboxChange('ownerAcknowledged')}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="owner-acknowledgment" className="ml-3 text-sm text-gray-700">
                Jag förstår att min fordonsförsäkring används och att jag betalar självrisken.
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
          <Link
            to="/browse"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
          >
            Tillbaka
          </Link>
          <button
            type="button"
            onClick={handleAcceptRequest}
            disabled={!agreement.driverAcknowledged}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          >
            Acceptera förfrågan
          </button>
        </div>
      </div>
    </div>
  )
}
