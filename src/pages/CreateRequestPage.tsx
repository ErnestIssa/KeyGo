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
      newErrors.from = 'Pickup location is required'
    }

    if (!formData.to.trim()) {
      newErrors.to = 'Dropoff location is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past'
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required'
    }

    if (!formData.insuranceCompany.trim()) {
      newErrors.insuranceCompany = 'Insurance company is required'
    }

    if (!formData.deductibleAmount.trim()) {
      newErrors.deductibleAmount = 'Deductible is required'
    } else {
      const amount = parseFloat(formData.deductibleAmount)
      if (isNaN(amount) || amount < 0) {
        newErrors.deductibleAmount = 'Deductible must be a valid amount'
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
      console.log('Request created:', request)
      navigate('/home')
    } catch (error) {
      console.error('Could not create request:', error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/home')
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1F2937' }}>Create Request</h1>
        <p className="text-base font-normal" style={{ color: '#6B7280' }}>
          Create a new car relocation request
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 space-y-6 border-2" style={{ borderColor: '#E5ECF9' }}>
        <div>
          <label htmlFor="from" className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
            Pickup Location <span style={{ color: '#991B1B' }}>*</span>
          </label>
          <input
            id="from"
            name="from"
            type="text"
            value={formData.from}
            onChange={handleChange('from')}
            className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all"
            style={{ 
              border: `2px solid ${errors.from ? '#991B1B' : '#E5ECF9'}`,
              color: '#1F2937'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563EB'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.from ? '#991B1B' : '#E5ECF9'
              e.target.style.boxShadow = 'none'
            }}
                  placeholder="e.g. Stockholm, Central Station"
          />
          {errors.from && (
            <p className="mt-1 text-sm" style={{ color: '#991B1B' }}>{errors.from}</p>
          )}
        </div>

        <div>
          <label htmlFor="to" className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
            Dropoff Location <span style={{ color: '#991B1B' }}>*</span>
          </label>
          <input
            id="to"
            name="to"
            type="text"
            value={formData.to}
            onChange={handleChange('to')}
            className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all"
            style={{ 
              border: `2px solid ${errors.to ? '#991B1B' : '#E5ECF9'}`,
              color: '#1F2937'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563EB'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.to ? '#991B1B' : '#E5ECF9'
              e.target.style.boxShadow = 'none'
            }}
                  placeholder="e.g. Gothenburg, Central Station"
          />
          {errors.to && (
            <p className="mt-1 text-sm" style={{ color: '#991B1B' }}>{errors.to}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
              Desired Date <span style={{ color: '#991B1B' }}>*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all"
              style={{ 
                border: `2px solid ${errors.date ? '#991B1B' : '#E5ECF9'}`,
                color: '#1F2937'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.date ? '#991B1B' : '#E5ECF9'
                e.target.style.boxShadow = 'none'
              }}
            />
            {errors.date && (
              <p className="mt-1 text-sm" style={{ color: '#991B1B' }}>{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
              Desired Time <span style={{ color: '#991B1B' }}>*</span>
            </label>
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange('time')}
              className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all"
              style={{ 
                border: `2px solid ${errors.time ? '#991B1B' : '#E5ECF9'}`,
                color: '#1F2937'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.time ? '#991B1B' : '#E5ECF9'
                e.target.style.boxShadow = 'none'
              }}
            />
            {errors.time && (
              <p className="mt-1 text-sm" style={{ color: '#991B1B' }}>{errors.time}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="insuranceCompany" className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
              Insurance Company <span style={{ color: '#991B1B' }}>*</span>
            </label>
            <select
              id="insuranceCompany"
              name="insuranceCompany"
              value={formData.insuranceCompany}
              onChange={handleChange('insuranceCompany')}
              className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all"
              style={{ 
                border: `2px solid ${errors.insuranceCompany ? '#991B1B' : '#E5ECF9'}`,
                color: '#1F2937'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.insuranceCompany ? '#991B1B' : '#E5ECF9'
                e.target.style.boxShadow = 'none'
              }}
            >
              <option value="">Select insurance company</option>
              <option value="Folksam">Folksam</option>
              <option value="Länsförsäkringar">Länsförsäkringar</option>
              <option value="If">If</option>
              <option value="Trygg-Hansa">Trygg-Hansa</option>
              <option value="Gjensidige">Gjensidige</option>
              <option value="ICA Försäkring">ICA Försäkring</option>
              <option value="Svedea">Svedea</option>
              <option value="Other">Other</option>
            </select>
            {errors.insuranceCompany && (
              <p className="mt-1 text-sm" style={{ color: '#991B1B' }}>{errors.insuranceCompany}</p>
            )}
          </div>

          <div>
            <label htmlFor="deductibleAmount" className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
              Deductible (SEK) <span style={{ color: '#991B1B' }}>*</span>
            </label>
            <input
              id="deductibleAmount"
              name="deductibleAmount"
              type="number"
              min="0"
              step="100"
              value={formData.deductibleAmount}
              onChange={handleChange('deductibleAmount')}
              className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all"
              style={{ 
                border: `2px solid ${errors.deductibleAmount ? '#991B1B' : '#E5ECF9'}`,
                color: '#1F2937'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.deductibleAmount ? '#991B1B' : '#E5ECF9'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="e.g. 5000"
            />
            {errors.deductibleAmount && (
              <p className="mt-1 text-sm" style={{ color: '#991B1B' }}>{errors.deductibleAmount}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
            Additional Information
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange('notes')}
            className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all"
            style={{ 
              border: '2px solid #E5ECF9',
              color: '#1F2937'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563EB'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5ECF9'
              e.target.style.boxShadow = 'none'
            }}
            placeholder="Any special instructions or information..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2" style={{ borderColor: '#E5ECF9' }}>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg font-semibold text-base focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ 
              border: '2px solid #E5ECF9',
              backgroundColor: '#E5ECF9',
              color: '#1F2937'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#D1D9E6'
                e.currentTarget.style.borderColor = '#D1D9E6'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#E5ECF9'
                e.currentTarget.style.borderColor = '#E5ECF9'
              }
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg font-semibold text-base text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
            style={{ 
              border: '2px solid #2563EB',
              backgroundColor: '#2563EB'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#1D4ED8'
                e.currentTarget.style.borderColor = '#1D4ED8'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#2563EB'
                e.currentTarget.style.borderColor = '#2563EB'
              }
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
