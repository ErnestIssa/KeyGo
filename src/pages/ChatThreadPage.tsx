import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { io, type Socket } from 'socket.io-client'
import { useChatUnread } from '../context/ChatUnreadContext'
import { listChatMessages, markConversationRead, postChatMessage, type ChatMessage } from '../lib/api'
import { outgoingDeliveryStatus } from '../lib/chatDelivery'
import { getApiOrigin } from '../lib/apiOrigin'
import { friendlyErrorMessage } from '../lib/userFriendlyError'
import { getStoredUser, getToken } from '../lib/authStorage'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ChatAvatar } from '../components/chat/ChatAvatar'

function socketOrigin(): string {
  const o = getApiOrigin()
  if (o) return o
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

function normalizeMessage(m: ChatMessage): ChatMessage {
  const createdAt =
    typeof m.createdAt === 'string'
      ? m.createdAt
      : (m.createdAt as unknown) instanceof Date
        ? ((m.createdAt as unknown) as Date).toISOString()
        : String(m.createdAt)
  return { ...m, createdAt }
}

const TYPING_EMIT_MS = 400
const TYPING_STOP_MS = 2800
const GROUP_WINDOW_MS = 5 * 60 * 1000

export default function ChatThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as
    | {
        peerUserId?: string
        otherUserName?: string
        peerDisplayName?: string
        peerAvatarUrl?: string
        peerName?: string
      }
    | undefined
  const user = getStoredUser()
  const { refreshUnread } = useChatUnread()
  const listRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const myIdRef = useRef('')
  const typingEmitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const peerTypingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [peerLastReadAt, setPeerLastReadAt] = useState<string | null>(null)
  const [peerTyping, setPeerTyping] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    if (!conversationId) return
    try {
      const res = await listChatMessages(conversationId)
      setMessages(res.messages)
      setPeerLastReadAt(res.peerLastReadAt ?? null)
      setError(null)
    } catch (e) {
      setError(friendlyErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  useEffect(() => {
    if (!conversationId) return
    void markConversationRead(conversationId).then(() => void refreshUnread())
  }, [conversationId, refreshUnread])

  useEffect(() => {
    if (!conversationId) return
    const token = getToken()
    const origin = socketOrigin()
    if (!token || !origin) return

    const socket = io(origin, {
      path: '/socket.io/',
      auth: { token },
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    const joinRoom = () => {
      socket.emit('join_conversation', conversationId)
      socket.emit('messages_read', { conversationId })
    }
    if (socket.connected) joinRoom()
    else socket.on('connect', joinRoom)

    socket.on('new_message', (payload: { message: ChatMessage }) => {
      const raw = payload?.message
      if (!raw) return
      const m = normalizeMessage(raw)
      if (m.senderId !== myIdRef.current) {
        m.isUnread = true
        socket.emit('message_delivered', { messageId: m.id })
      }
      setMessages((prev) => {
        if (prev.some((x) => x.id === m.id)) return prev
        return [...prev, m]
      })
      if (m.senderId !== myIdRef.current) {
        void markConversationRead(conversationId).then(() => {
          void refreshUnread()
          socket.emit('messages_read', { conversationId })
          setMessages((prev) =>
            prev.map((x) => (x.senderId !== myIdRef.current ? { ...x, isUnread: false } : x)),
          )
        })
      }
    })

    socket.on('message_updated', (payload: { message?: ChatMessage }) => {
      const m = payload?.message
      if (!m || m.conversationId !== conversationId) return
      const n = normalizeMessage(m)
      setMessages((prev) => {
        const i = prev.findIndex((x) => x.id === n.id)
        if (i === -1) return [...prev, n]
        const next = [...prev]
        next[i] = n
        return next
      })
    })

    socket.on(
      'message_delivery',
      (payload: { conversationId?: string; messageId?: string }) => {
        if (!payload || payload.conversationId !== conversationId || !payload.messageId) return
        setMessages((prev) =>
          prev.map((x) =>
            x.id === payload.messageId && x.senderId === myIdRef.current
              ? { ...x, deliveryStatus: 'delivered' as const }
              : x,
          ),
        )
      },
    )

    socket.on(
      'messages_read',
      (payload: { conversationId?: string; readerId?: string; readAt?: string }) => {
        if (!payload || payload.conversationId !== conversationId) return
        if (payload.readerId === myIdRef.current) return
        const readAt = payload.readAt
        if (!readAt) return
        setPeerLastReadAt((prev) => {
          if (!prev) return readAt
          return new Date(readAt) > new Date(prev) ? readAt : prev
        })
      },
    )

    socket.on(
      'user_typing',
      (payload: { conversationId?: string; userId?: string; isTyping?: boolean }) => {
        if (!payload || payload.conversationId !== conversationId) return
        if (payload.userId === myIdRef.current) return
        const typing = Boolean(payload.isTyping)
        if (peerTypingStopTimerRef.current) clearTimeout(peerTypingStopTimerRef.current)
        setPeerTyping(typing)
        if (typing) {
          peerTypingStopTimerRef.current = setTimeout(() => setPeerTyping(false), 6000)
        }
      },
    )

    return () => {
      socket.emit('typing', { conversationId, isTyping: false })
      socket.emit('leave_conversation', conversationId)
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
      if (typingEmitTimerRef.current) clearTimeout(typingEmitTimerRef.current)
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current)
      if (peerTypingStopTimerRef.current) clearTimeout(peerTypingStopTimerRef.current)
    }
  }, [conversationId, refreshUnread])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, peerTyping])

  const flushTypingEmit = useCallback(() => {
    const socket = socketRef.current
    if (!socket?.connected) return
    socket.emit('typing', { conversationId, isTyping: true })
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current)
    typingStopTimerRef.current = setTimeout(() => {
      socket.emit('typing', { conversationId, isTyping: false })
    }, TYPING_STOP_MS)
  }, [conversationId])

  const onInputChange = useCallback(
    (text: string) => {
      setInput(text)
      if (!text.trim()) {
        if (typingEmitTimerRef.current) clearTimeout(typingEmitTimerRef.current)
        if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current)
        socketRef.current?.emit('typing', { conversationId, isTyping: false })
        return
      }
      if (typingEmitTimerRef.current) clearTimeout(typingEmitTimerRef.current)
      typingEmitTimerRef.current = setTimeout(() => {
        flushTypingEmit()
      }, TYPING_EMIT_MS)
    },
    [conversationId, flushTypingEmit],
  )

  const sendViaRest = async (text: string) => {
    if (!conversationId) return
    setSending(true)
    try {
      const res = await postChatMessage(conversationId, text)
      setMessages((prev) => (prev.some((x) => x.id === res.message.id) ? prev : [...prev, res.message]))
    } catch (e) {
      setError(friendlyErrorMessage(e))
      setInput(text)
    } finally {
      setSending(false)
    }
  }

  const send = async () => {
    const text = input.trim()
    if (!text || !conversationId || sending) return
    setSending(true)
    setInput('')
    socketRef.current?.emit('typing', { conversationId, isTyping: false })

    const socket = socketRef.current
    if (socket?.connected) {
      const t = setTimeout(() => setSending(false), 12000)
      socket.emit(
        'send_message',
        { conversationId, text },
        (ack: { ok: true } | { ok: false; error?: string } | undefined) => {
          clearTimeout(t)
          setSending(false)
          if (ack && 'ok' in ack && ack.ok === false) {
            void sendViaRest(text)
          }
        },
      )
      return
    }

    await sendViaRest(text)
  }

  const myId = user?.id ?? ''
  myIdRef.current = myId
  const title = state?.peerDisplayName ?? state?.otherUserName ?? 'Chat'
  const peerLabel = state?.peerDisplayName ?? state?.otherUserName ?? state?.peerName ?? 'Driver'

  const onScroll = () => {
    const el = listRef.current
    if (!el || !conversationId) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight - scrollTop - clientHeight < 80) {
      socketRef.current?.emit('messages_read', { conversationId })
    }
  }

  if (!conversationId) {
    return (
      <div className="p-4">
        <p className="text-[var(--text-muted)]">This conversation isn&apos;t available.</p>
        <Link to="/chat" className="text-[var(--brand)] font-semibold mt-2 inline-block">
          Back to chat
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[60vh] max-w-3xl w-full">
      <div className="flex items-center gap-3 mb-4 min-h-[44px]">
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="text-[var(--brand)] font-semibold min-h-[44px] px-2 -ml-2 rounded-lg hover:bg-[var(--brand-soft)]"
        >
          ← Back
        </button>
        <Link
          to={state?.peerUserId ? `/profile/user/${encodeURIComponent(state.peerUserId)}` : '#'}
          className={`flex items-center gap-2 flex-1 min-w-0 justify-center min-h-[44px] ${state?.peerUserId ? 'hover:opacity-90' : 'pointer-events-none'}`}
          onClick={(e) => {
            if (!state?.peerUserId) e.preventDefault()
          }}
        >
          <ChatAvatar
            name={state?.peerName ?? state?.otherUserName ?? '?'}
            avatarUrl={state?.peerAvatarUrl}
            size={32}
          />
          <h1 className="text-lg font-bold text-[var(--text)] truncate">{title}</h1>
        </Link>
        <div className="w-14 shrink-0" aria-hidden />
      </div>

      {loading ? (
        <div className="flex-1 min-h-[40vh] flex items-center justify-center text-[var(--text-muted)]">Loading…</div>
      ) : (
        <div
          ref={listRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 max-h-[min(60vh,520px)]"
        >
          {messages.length === 0 ? (
            <p className="text-center text-[var(--text-muted)] text-sm py-8">No messages yet. Say hello!</p>
          ) : null}
          {messages.map((m, index) => {
            const mine = m.senderId === myId
            const inboundUnread = !mine && m.isUnread
            const prev = index > 0 ? messages[index - 1] : undefined
            const prevTime = prev ? new Date(prev.createdAt).getTime() : 0
            const curTime = new Date(m.createdAt).getTime()
            const sameGroup =
              prev &&
              prev.senderId === m.senderId &&
              !Number.isNaN(prevTime) &&
              !Number.isNaN(curTime) &&
              curTime - prevTime < GROUP_WINDOW_MS
            const showMeta = !sameGroup

            const ds = mine ? outgoingDeliveryStatus(m.createdAt, peerLastReadAt) : m.deliveryStatus
            const deliveryLabel =
              ds === 'read' ? 'Read' : ds === 'delivered' ? 'Delivered' : ds === 'sent' ? 'Sent' : ''
            const deliveryClass =
              ds === 'read' ? 'text-green-200' : ds === 'delivered' ? 'text-blue-200' : ds === 'sent' ? 'text-pink-200' : ''
            return (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'} ${sameGroup ? 'mt-1' : 'mt-3'}`}
              >
                {!mine ? (
                  sameGroup ? (
                    <div className="w-7 shrink-0" aria-hidden />
                  ) : (
                    <ChatAvatar
                      name={m.senderName ?? m.senderDisplayName ?? '?'}
                      avatarUrl={m.senderAvatarUrl}
                      size={28}
                    />
                  )
                ) : null}
                <Card
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    mine
                      ? 'bg-[var(--brand)] text-white border-transparent'
                      : inboundUnread
                        ? 'bg-[var(--brand-soft)] border-[var(--brand)]'
                        : 'bg-[var(--bg-elevated)] border-[var(--border)]'
                  }`}
                >
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${mine ? 'text-white' : 'text-[var(--text)]'}`}>
                    {m.text}
                  </p>
                  {showMeta ? (
                    <div className={`text-[11px] mt-1 flex flex-wrap items-center gap-x-2 ${mine ? 'text-white/75' : 'text-[var(--text-muted)]'}`}>
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {mine && deliveryLabel ? (
                        <span className={`font-semibold ${deliveryClass}`}>{deliveryLabel}</span>
                      ) : null}
                      {!mine && inboundUnread ? (
                        <span className="font-semibold text-[var(--brand)]">New</span>
                      ) : null}
                    </div>
                  ) : mine && deliveryLabel ? (
                    <div className="text-[11px] mt-1 flex justify-end">
                      <span className={`font-semibold ${deliveryClass}`}>{deliveryLabel}</span>
                    </div>
                  ) : null}
                </Card>
                {mine ? (
                  sameGroup ? (
                    <div className="w-7 shrink-0" aria-hidden />
                  ) : (
                    <ChatAvatar
                      name={user?.name ?? '?'}
                      firstName={user?.firstName}
                      lastName={user?.lastName}
                      avatarUrl={user?.avatarUrl}
                      size={28}
                    />
                  )
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      {error ? <p className="text-sm text-[var(--text-muted)] mb-2">{error}</p> : null}

      {peerTyping ? (
        <p className="text-[13px] text-[var(--text-muted)] italic px-1 mb-2">{peerLabel} is typing…</p>
      ) : null}

      <div className="flex gap-2 items-end sticky bottom-0 pb-2 bg-[var(--bg-page)] pt-2 border-t border-[var(--border)]">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Message…"
          rows={2}
          maxLength={4000}
          disabled={sending}
          className="flex-1 min-h-[44px] max-h-32 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] px-3 py-2 text-sm resize-y"
        />
        <Button type="button" variant="primary" disabled={sending || !input.trim()} onClick={() => void send()}>
          {sending ? '…' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
