import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const steps = [
  {
    number: 1,
    title: 'Create or find a request',
    description: 'Owners create requests, drivers find them',
    bgColor: '#2563EB',
  },
  {
    number: 2,
    title: 'Accept and chat',
    description: 'Drivers accept and you coordinate via chat',
    bgColor: '#2563EB',
  },
  {
    number: 3,
    title: 'Complete and rate',
    description: 'After the trip, you rate each other',
    bgColor: '#2563EB',
  },
]

export default function LoginPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  // Change card every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % steps.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const navItems = [
    {
      name: 'Request',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      path: '/create-request',
      onClick: () => navigate('/create-request')
    },
    {
      name: 'Requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      path: '/browse',
      onClick: () => navigate('/browse')
    },
    {
      name: 'Log in',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
      path: '/',
      onClick: () => navigate('/')
    },
    {
      name: 'Help',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/help',
      onClick: () => {
        // Placeholder for help - could navigate to a help page or show a modal
        alert('Help section coming soon!')
      }
    },
    {
      name: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: '/profile',
      onClick: () => navigate('/profile')
    }
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="flex justify-center px-4 pt-4">
        <div className="max-w-md w-full space-y-8">
          {/* Keygo Introduction */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-0.5" style={{ color: '#1F2937' }}>KeyGo</h1>
            <p className="text-base font-normal mb-6" style={{ color: '#6B7280' }}>
              Turning trips into help
            </p>
            
            {/* How it works - Swipe Animation Cards */}
            <div className="mb-12">
              <div className="overflow-hidden relative w-full flex justify-center items-center" style={{ height: '180px', pointerEvents: 'none', userSelect: 'none' }}>
                {steps.map((step, index) => {
                  const isActive = index === currentCardIndex
                  
                  // Always come from right (150%) and go to left (-150%)
                  // Calculate position based on how many steps away from current
                  let translateX = 150
                  let opacity = 0
                  
                  if (isActive) {
                    translateX = 0
                    opacity = 1
                  } else {
                    // Calculate the difference, accounting for wrap-around
                    let diff = index - currentCardIndex
                    if (diff < 0) {
                      diff = steps.length + diff // Wrap around
                    }
                    
                    if (diff === 1) {
                      // Next card - coming from right
                      translateX = 150
                    } else {
                      // All others - already gone to left
                      translateX = -150
                    }
                    opacity = 0
                  }
                  
                  return (
                    <div
                      key={step.number}
                      className="absolute transition-all transform duration-700"
                      style={{ 
                        pointerEvents: 'none',
                        userSelect: 'none',
                        transform: `translateX(${translateX}%)`,
                        opacity: opacity,
                        width: 'calc(100vw - 3rem)',
                        maxWidth: '20rem'
                      }}
                    >
                      <div 
                        className="backdrop-blur-md p-6 border-2"
                        style={{ 
                          borderRadius: '20px', 
                          overflow: 'hidden',
                          backgroundColor: step.bgColor,
                          borderColor: '#E5ECF9',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium mb-2" style={{ color: '#FFFFFF' }}>
                              {step.title}
                            </h3>
                            <p className="text-sm font-normal" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Indicator Dots */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {steps.map((step, index) => {
                  const isActive = index === currentCardIndex
                  return (
                    <div
                      key={step.number}
                      className="transition-all duration-300"
                      style={{
                        width: isActive ? '24px' : '8px',
                        height: '8px',
                        borderRadius: isActive ? '4px' : '50%',
                        backgroundColor: isActive ? '#2563EB' : '#6B7280'
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Fixed at bottom of viewport */}
      <nav 
        className="fixed bottom-0 left-0 right-0 shadow-lg" 
        style={{ 
          zIndex: 9999,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <div className="max-w-md mx-auto rounded-t-2xl" style={{ backgroundColor: '#2563EB', borderColor: '#E5ECF9', borderTopWidth: '2px', borderTopStyle: 'solid' }}>
          <div className="flex justify-around items-center h-16 px-2 py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
                  style={{ 
                    color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                    }
                  }}
                >
                  <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium mt-0.5" style={{ fontSize: '10px' }}>{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
