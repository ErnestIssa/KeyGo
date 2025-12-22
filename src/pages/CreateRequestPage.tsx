import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { type Request } from '../types'

interface CreateRequestFormData {
  from: string
  to: string
  date: string
  time: string
  insuranceCompany: string
  deductibleAmount: string
  notes: string
}

interface FormErrors {
  from?: string
  to?: string
  date?: string
  time?: string
  insuranceCompany?: string
  deductibleAmount?: string
}

// Placeholder function to create request
async function createRequest(data: Omit<CreateRequestFormData, 'deductibleAmount'> & { deductibleAmount: number }): Promise<Request> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `req-${Date.now()}`,
        ownerId: 'current-user-id', // TODO: Get from auth context
        from: data.from,
        to: data.to,
        date: data.date,
        time: data.time,
        notes: data.notes || undefined,
        insuranceCompany: data.insuranceCompany,
        deductibleAmount: data.deductibleAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })
    }, 500)
  })
}

export default function CreateRequestPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CreateRequestFormData>({
    from: '',
    to: '',
    date: '',
    time: '',
    insuranceCompany: '',
    deductibleAmount: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.from.trim()) {
      newErrors.from = 'Hämtningsplats krävs'
    }

    if (!formData.to.trim()) {
      newErrors.to = 'Leveransplats krävs'
    }

    if (!formData.date) {
      newErrors.date = 'Datum krävs'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = 'Datumet kan inte vara i det förflutna'
      }
    }

    if (!formData.time) {
      newErrors.time = 'Tid krävs'
    }

    if (!formData.insuranceCompany.trim()) {
      newErrors.insuranceCompany = 'Försäkringsbolag krävs'
    }

    if (!formData.deductibleAmount.trim()) {
      newErrors.deductibleAmount = 'Självrisk krävs'
    } else {
      const amount = parseFloat(formData.deductibleAmount)
      if (isNaN(amount) || amount < 0) {
        newErrors.deductibleAmount = 'Självrisk måste vara ett giltigt belopp'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof CreateRequestFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const deductibleAmount = parseFloat(formData.deductibleAmount)
      const request = await createRequest({
        from: formData.from,
        to: formData.to,
        date: formData.date,
        time: formData.time,
        insuranceCompany: formData.insuranceCompany,
        deductibleAmount,
        notes: formData.notes,
      })

      // TODO: Show success message and redirect
      console.log('Förfrågan skapad:', request)
      navigate(`/request/${request.id}`)
    } catch (error) {
      console.error('Kunde inte skapa förfrågan:', error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skapa förfrågan</h1>
        <p className="mt-1 text-sm text-gray-600">
          Skapa en ny förfrågan för bilflyttning
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">
            Hämtningsplats <span className="text-red-500">*</span>
          </label>
          <input
            id="from"
            name="from"
            type="text"
            value={formData.from}
            onChange={handleChange('from')}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.from ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="t.ex. Stockholm, Centralstation"
          />
          {errors.from && (
            <p className="mt-1 text-sm text-red-600">{errors.from}</p>
          )}
        </div>

        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">
            Leveransplats <span className="text-red-500">*</span>
          </label>
          <input
            id="to"
            name="to"
            type="text"
            value={formData.to}
            onChange={handleChange('to')}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.to ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="t.ex. Göteborg, Centralstation"
          />
          {errors.to && (
            <p className="mt-1 text-sm text-red-600">{errors.to}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Önskat datum <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              min={new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Önskad tid <span className="text-red-500">*</span>
            </label>
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange('time')}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.time ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="insuranceCompany" className="block text-sm font-medium text-gray-700">
              Försäkringsbolag <span className="text-red-500">*</span>
            </label>
            <select
              id="insuranceCompany"
              name="insuranceCompany"
              value={formData.insuranceCompany}
              onChange={handleChange('insuranceCompany')}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.insuranceCompany ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Välj försäkringsbolag</option>
              <option value="Folksam">Folksam</option>
              <option value="Länsförsäkringar">Länsförsäkringar</option>
              <option value="If">If</option>
              <option value="Trygg-Hansa">Trygg-Hansa</option>
              <option value="Gjensidige">Gjensidige</option>
              <option value="ICA Försäkring">ICA Försäkring</option>
              <option value="Svedea">Svedea</option>
              <option value="Annat">Annat</option>
            </select>
            {errors.insuranceCompany && (
              <p className="mt-1 text-sm text-red-600">{errors.insuranceCompany}</p>
            )}
          </div>

          <div>
            <label htmlFor="deductibleAmount" className="block text-sm font-medium text-gray-700">
              Självrisk (SEK) <span className="text-red-500">*</span>
            </label>
            <input
              id="deductibleAmount"
              name="deductibleAmount"
              type="number"
              min="0"
              step="100"
              value={formData.deductibleAmount}
              onChange={handleChange('deductibleAmount')}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.deductibleAmount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="t.ex. 5000"
            />
            {errors.deductibleAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.deductibleAmount}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Ytterligare information
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange('notes')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Eventuella särskilda instruktioner eller information..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {isSubmitting ? 'Skapar...' : 'Skapa förfrågan'}
          </button>
        </div>
      </form>
    </div>
  )
}
