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
          content: 'Hej! Tack för att du accepterade min förfrågan. När kan vi träffas?',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'msg-2',
          requestId,
          senderId: 'driver-456',
          content: 'Hej! Jag kan träffas vid centralstationen kl 14:00. Fungerar det?',
          timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
        },
        {
          id: 'msg-3',
          requestId,
          senderId: 'owner-123',
          content: 'Perfekt! Jag ses där då. Nycklarna har jag med mig.',
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
        console.error('Kunde inte hämta meddelanden:', error)
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
      console.error('Kunde inte skicka meddelande:', error)
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

    if (minutes < 1) return 'Nu'
    if (minutes < 60) return `${minutes} min sedan`
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('sv-SE', {
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
          <h1 className="text-2xl font-bold text-gray-900">Chatt</h1>
          <p className="mt-1 text-sm text-gray-600">
            Förfrågan #{requestId}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow flex flex-col" style={{ height: '600px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-16 bg-gray-200 rounded-lg w-3/4 ml-auto"></div>
              <div className="h-16 bg-gray-200 rounded-lg w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chatt</h1>
        <p className="mt-1 text-sm text-gray-600">
          Förfrågan #{requestId}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow flex flex-col" style={{ height: '600px' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Inga meddelanden ännu. Börja konversationen!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage(message.senderId) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-xs ${
                      isOwnMessage(message.senderId)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage(message.senderId) ? 'text-blue-100' : 'text-gray-500'
                      }`}
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
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Skriv ett meddelande..."
              disabled={sending}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || sending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {sending ? 'Skickar...' : 'Skicka'}
            </button>
          </form>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          to="/dashboard"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Tillbaka till översikt
        </Link>
      </div>
    </div>
  )
}
