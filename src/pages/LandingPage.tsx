import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-3" style={{ color: '#1F2937' }}>Welcome to KeyGo</h1>
          <p className="text-base font-normal" style={{ color: '#6B7280' }}>
            Voluntary car relocation
          </p>
        </div>

        {/* Main Actions - Dominant */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/create-request')}
            className="w-full py-6 px-6 rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              border: '4px solid #2563EB',
              backgroundColor: '#2563EB',
              color: '#FFFFFF'
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
            <div className="text-center">
              <div className="text-4xl mb-3">🚗</div>
              <h2 className="text-lg font-medium mb-2" style={{ color: '#FFFFFF' }}>Need help with my car</h2>
              <p className="text-sm font-normal" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Create a car relocation request
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/browse')}
            className="w-full py-6 px-6 rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              border: '4px solid #2563EB',
              backgroundColor: '#2563EB',
              color: '#FFFFFF'
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
            <div className="text-center">
              <div className="text-4xl mb-3">🚙</div>
              <h2 className="text-lg font-medium mb-2" style={{ color: '#FFFFFF' }}>I want to drive</h2>
              <p className="text-sm font-normal" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Find requests to accept
              </p>
            </div>
          </button>
        </div>

        {/* Quick Stats or Info */}
        <div className="bg-white rounded-xl p-6 border-2 shadow-xl mt-8" style={{ borderColor: '#E5ECF9' }}>
          <h2 className="text-lg font-medium mb-4" style={{ color: '#1F2937' }}>Quick overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#1F2937' }}>0</div>
              <div className="text-xs mt-1" style={{ color: '#6B7280' }}>Active requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#1F2937' }}>0</div>
              <div className="text-xs mt-1" style={{ color: '#6B7280' }}>Ongoing trips</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
