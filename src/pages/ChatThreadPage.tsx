import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useChatUnread } from '../context/ChatUnreadContext'
import { listChatMessages, markConversationRead, postChatMessage, type ChatMessage } from '../lib/api'
import { friendlyErrorMessage } from '../lib/userFriendlyError'
import { getStoredUser } from '../lib/authStorage'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ChatAvatar } from '../components/chat/ChatAvatar'

const POLL_MS = 4000

export default function ChatThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as
    | {
        otherUserName?: string
        peerDisplayName?: string
        peerAvatarUrl?: string
        peerName?: string
      }
    | undefined
  const user = getStoredUser()
  const { refreshUnread } = useChatUnread()
  const listRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    if (!conversationId) return
    try {
      const res = await listChatMessages(conversationId)
      setMessages(res.messages)
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
    const id = setInterval(() => void loadMessages(), POLL_MS)
    return () => clearInterval(id)
  }, [conversationId, loadMessages])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const send = async () => {
    const text = input.trim()
    if (!text || !conversationId || sending) return
    setSending(true)
    setInput('')
    try {
      const res = await postChatMessage(conversationId, text)
      setMessages((prev) => [...prev, res.message])
    } catch (e) {
      setError(friendlyErrorMessage(e))
      setInput(text)
    } finally {
      setSending(false)
    }
  }

  const myId = user?.id ?? ''
  const title = state?.peerDisplayName ?? state?.otherUserName ?? 'Chat'

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
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
          <ChatAvatar
            name={state?.peerName ?? state?.otherUserName ?? '?'}
            avatarUrl={state?.peerAvatarUrl}
            size={32}
          />
          <h1 className="text-lg font-bold text-[var(--text)] truncate">{title}</h1>
        </div>
        <div className="w-14 shrink-0" aria-hidden />
      </div>

      {loading ? (
        <div className="flex-1 min-h-[40vh] flex items-center justify-center text-[var(--text-muted)]">Loading…</div>
      ) : (
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 max-h-[min(60vh,520px)]"
        >
          {messages.length === 0 ? (
            <p className="text-center text-[var(--text-muted)] text-sm py-8">No messages yet. Say hello!</p>
          ) : null}
          {messages.map((m) => {
            const mine = m.senderId === myId
            return (
              <div key={m.id} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                {!mine ? (
                  <ChatAvatar
                    name={m.senderName ?? m.senderDisplayName ?? '?'}
                    avatarUrl={m.senderAvatarUrl}
                    size={28}
                  />
                ) : null}
                <Card
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    mine
                      ? 'bg-[var(--brand)] text-white border-transparent'
                      : 'bg-[var(--bg-elevated)] border-[var(--border)]'
                  }`}
                >
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${mine ? 'text-white' : 'text-[var(--text)]'}`}>
                    {m.text}
                  </p>
                  <p
                    className={`text-[11px] mt-1 ${mine ? 'text-white/75' : 'text-[var(--text-muted)]'}`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Card>
                {mine ? (
                  <ChatAvatar
                    name={user?.name ?? '?'}
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    avatarUrl={user?.avatarUrl}
                    size={28}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      {error ? <p className="text-sm text-[var(--text-muted)] mb-2">{error}</p> : null}

      <div className="flex gap-2 items-end sticky bottom-0 pb-2 bg-[var(--bg-page)] pt-2 border-t border-[var(--border)]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
