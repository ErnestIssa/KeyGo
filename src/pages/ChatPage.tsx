import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { type Message } from '../types'

// Placeholder function to fetch messages
async function fetchMessages(requestId: string): Promise<Message[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'msg-1',
          requestId,
          senderId: 'owner-123',
          content: 'Hi! Thanks for accepting my request. When can we meet?',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'msg-2',
          requestId,
          senderId: 'driver-456',
          content: 'Hi! I can meet at the central station at 14:00. Does that work?',
          timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
        },
        {
          id: 'msg-3',
          requestId,
          senderId: 'owner-123',
          content: 'Perfect! I\'ll see you there. I have the keys with me.',
          timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
        },
      ])
    }, 300)
  })
}

// Placeholder function to send a message
async function sendMessage(requestId: string, content: string, senderId: string): Promise<Message> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `msg-${Date.now()}`,
        requestId,
        senderId,
        content,
        timestamp: new Date().toISOString(),
      })
    }, 200)
  })
}

export default function ChatPage() {
  const { requestId } = useParams<{ requestId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = 'driver-456' // TODO: Get from auth context

  useEffect(() => {
    if (!requestId) return

    const loadMessages = async () => {
      try {
        setLoading(true)
        const data = await fetchMessages(requestId)
        setMessages(data)
      } catch (error) {
        console.error('Could not fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()

    // TODO: Set up real-time message polling or WebSocket connection
    // For now, we'll simulate receiving new messages
    const interval = setInterval(() => {
      // This would be replaced with actual real-time updates
    }, 5000)

    return () => clearInterval(interval)
  }, [requestId])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!messageInput.trim() || !requestId || sending) return

    const content = messageInput.trim()
    setMessageInput('')
    setSending(true)

    try {
      const newMessage = await sendMessage(requestId, content, currentUserId)
      setMessages((prev) => [...prev, newMessage])
    } catch (error) {
      console.error('Could not send message:', error)
      // Restore message input on error
      setMessageInput(content)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Now'
    if (minutes < 60) return `${minutes} min ago`
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isOwnMessage = (senderId: string): boolean => {
    return senderId === currentUserId
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#1F2937' }}>Chat</h1>
          <p className="mt-1 text-sm font-normal" style={{ color: '#6B7280' }}>
            Request #{requestId}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-xl flex flex-col border-2" style={{ height: '600px', borderColor: '#E5ECF9' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-16 rounded-lg w-3/4" style={{ backgroundColor: '#E5ECF9' }}></div>
              <div className="h-16 rounded-lg w-3/4 ml-auto" style={{ backgroundColor: '#E5ECF9' }}></div>
              <div className="h-16 rounded-lg w-2/3" style={{ backgroundColor: '#E5ECF9' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1F2937' }}>Chatt</h1>
          <p className="text-base font-normal" style={{ color: '#6B7280' }}>
            Förfrågan #{requestId}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl flex flex-col border-2" style={{ height: '600px', borderColor: '#E5ECF9' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: '#6B7280' }}>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage(message.senderId) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="rounded-lg p-3 max-w-xs"
                    style={{
                      backgroundColor: isOwnMessage(message.senderId) ? '#2563EB' : '#E5ECF9',
                      color: isOwnMessage(message.senderId) ? '#FFFFFF' : '#1F2937'
                    }}
                  >
                    <p className="text-sm font-normal">{message.content}</p>
                    <p
                      className="text-xs mt-1"
                      style={{
                        color: isOwnMessage(message.senderId) ? 'rgba(255, 255, 255, 0.8)' : '#6B7280'
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <div className="border-t-2 p-4" style={{ borderColor: '#E5ECF9' }}>
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Write a message..."
              disabled={sending}
              className="flex-1 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all"
              style={{ 
                border: '2px solid #E5ECF9',
                color: '#1F2937',
                backgroundColor: sending ? '#E5ECF9' : '#FFFFFF'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5ECF9'
                e.target.style.boxShadow = 'none'
              }}
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || sending}
              className="px-6 py-3 rounded-lg font-semibold text-base text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
              style={{ 
                border: '2px solid #2563EB',
                backgroundColor: '#2563EB'
              }}
              onMouseEnter={(e) => {
                if (!sending && messageInput.trim()) {
                  e.currentTarget.style.backgroundColor = '#1D4ED8'
                  e.currentTarget.style.borderColor = '#1D4ED8'
                }
              }}
              onMouseLeave={(e) => {
                if (!sending && messageInput.trim()) {
                  e.currentTarget.style.backgroundColor = '#2563EB'
                  e.currentTarget.style.borderColor = '#2563EB'
                }
              }}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          to="/chat"
          className="px-8 py-3 rounded-lg font-semibold text-base transition-all"
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
          Back to Chats
        </Link>
      </div>
    </div>
  )
}
