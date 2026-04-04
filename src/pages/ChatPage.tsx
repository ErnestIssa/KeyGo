import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatUnread } from '../context/ChatUnreadContext'
import { useSyncGlobalLoading } from '../context/LoadingOverlayContext'
import {
  createConversation,
  deleteConversation,
  listChatMatches,
  listChatRecentTrips,
  listConversations,
  type ChatActivityLogRow,
  type ConversationListItem,
} from '../lib/api'
import { getStoredUser } from '../lib/authStorage'
import { friendlyErrorMessage } from '../lib/userFriendlyError'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ChatAvatar } from '../components/chat/ChatAvatar'

const statusLabel: Record<string, string> = {
  pending: 'Open',
  accepted: 'In progress',
  completed: 'Done',
}

function formatShortTime(iso?: string) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function lastStatusLabel(status: ConversationListItem['lastMessageStatus']) {
  switch (status) {
    case 'sent':
      return { text: 'Sent', className: 'text-[#ec4899]' }
    case 'delivered':
      return { text: 'Delivered', className: 'text-[#3b82f6]' }
    case 'read':
      return { text: 'Read', className: 'text-[#22c55e]' }
    case 'received':
      return { text: 'New', className: 'text-[#ec4899]' }
    default:
      return { text: '', className: 'text-[var(--text-muted)]' }
  }
}

export default function ChatPage() {
  const navigate = useNavigate()
  const { refreshUnread } = useChatUnread()
  const me = getStoredUser()
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [matches, setMatches] = useState<
    { user: { id: string; name: string; displayName?: string; avatarUrl?: string }; conversationId: string | null }[]
  >([])
  const [activities, setActivities] = useState<ChatActivityLogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startingId, setStartingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activityOpen, setActivityOpen] = useState(true)
  const [peopleOpen, setPeopleOpen] = useState(false)

  const panelEase = [0.22, 1, 0.36, 1] as const
  const panelDuration = 0.58

  useSyncGlobalLoading(loading)

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const [convRes, matchRes, tripRes] = await Promise.all([
          listConversations(),
          listChatMatches(),
          listChatRecentTrips(),
        ])
        if (!c) {
          setConversations(convRes.conversations)
          setMatches(matchRes.matches)
          setActivities(
            tripRes.activities?.length
              ? tripRes.activities
              : tripRes.trips.map((trip) => ({
                  id: `${trip.id}-fb`,
                  tripId: trip.id,
                  at: trip.updatedAt ?? trip.createdAt,
                  who: [trip.owner?.name, trip.driver?.name].filter(Boolean).join(' & ') || 'Trip',
                  summary: `${statusLabel[trip.status] ?? trip.status} · ${trip.pickupLocation} → ${trip.dropoffLocation}`,
                })),
          )
        }
      } catch (e) {
        if (!c) setError(friendlyErrorMessage(e))
      } finally {
        if (!c) setLoading(false)
      }
    })()
    return () => {
      c = true
    }
  }, [])

  const safeMatches = me ? matches.filter((m) => m.user.id !== me.id) : matches
  const safeConversations = me ? conversations.filter((c) => c.otherUserId !== me.id) : conversations

  const openThread = (
    conversationId: string,
    peer: { id: string; name: string; displayName?: string; avatarUrl?: string },
  ) => {
    navigate(`/chat/${encodeURIComponent(conversationId)}`, {
      state: {
        peerUserId: peer.id,
        peerDisplayName: peer.displayName ?? peer.name,
        peerAvatarUrl: peer.avatarUrl,
        peerName: peer.name,
        otherUserName: peer.name,
      },
    })
  }

  const startOrOpenChat = async (
    participantId: string,
    peer: { name: string; displayName?: string; avatarUrl?: string },
    existingId: string | null,
  ) => {
    if (me?.id && participantId === me.id) {
      return
    }
    if (existingId) {
      openThread(existingId, {
        id: participantId,
        name: peer.name,
        displayName: peer.displayName,
        avatarUrl: peer.avatarUrl,
      })
      return
    }
    setStartingId(participantId)
    try {
      const res = await createConversation(participantId)
      openThread(res.conversation.id, {
        id: participantId,
        name: peer.name,
        displayName: peer.displayName,
        avatarUrl: peer.avatarUrl,
      })
    } catch (e) {
      setError(friendlyErrorMessage(e))
    } finally {
      setStartingId(null)
    }
  }

  const removeConversation = async (id: string) => {
    if (!window.confirm('Delete this conversation and its messages for both of you?')) return
    setDeletingId(id)
    try {
      await deleteConversation(id)
      setConversations((prev) => prev.filter((c) => c.id !== id))
      void refreshUnread()
    } catch (e) {
      setError(friendlyErrorMessage(e))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">Messages</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] tracking-tight">Chat</h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] max-w-2xl max-lg:max-w-none leading-relaxed">
          Trip updates and chats with drivers or owners you&apos;ve paired with on a trip.
        </p>
      </motion.div>

      {loading ? <div className="min-h-[30vh] w-full" aria-hidden /> : null}

      {error ? (
        <Card className="border-[var(--border)] bg-[var(--bg-subtle)] max-w-xl">
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{error}</p>
        </Card>
      ) : null}

      {!loading && activities.length > 0 ? (
        <div className="max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 overflow-hidden">
          <button
            type="button"
            onClick={() => setActivityOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 text-left font-semibold text-[var(--text)] min-h-[44px]"
          >
            Recent activity
            <motion.span
              className="text-xs text-[var(--text-muted)] inline-block"
              animate={{ rotate: activityOpen ? 180 : 0 }}
              transition={{ duration: panelDuration, ease: panelEase }}
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {activityOpen ? (
              <motion.div
                key="activity"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: panelDuration, ease: panelEase }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4 border-t border-[var(--border)] pt-4">
                  {activities.map((row) => (
                    <div key={row.id} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <p className="text-xs text-[var(--text-muted)]">{formatShortTime(row.at)}</p>
                      <p className="font-semibold text-[var(--text)] mt-1">{row.summary}</p>
                      <p className="text-sm text-[var(--text-muted)] mt-1">{row.who}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      {!loading && safeMatches.length > 0 ? (
        <div className="max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 overflow-hidden">
          <button
            type="button"
            onClick={() => setPeopleOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 text-left font-semibold text-[var(--text)] min-h-[44px]"
          >
            People you can message
            <motion.span
              className="text-xs text-[var(--text-muted)] inline-block"
              animate={{ rotate: peopleOpen ? 180 : 0 }}
              transition={{ duration: panelDuration, ease: panelEase }}
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {peopleOpen ? (
              <motion.div
                key="people"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: panelDuration, ease: panelEase }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4 grid gap-3">
                  {safeMatches.map((m) => (
                    <Card key={m.user.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="min-w-0 flex items-center gap-3">
                        <ChatAvatar name={m.user.name} avatarUrl={m.user.avatarUrl} size={40} />
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--text)] truncate">{m.user.displayName ?? m.user.name}</p>
                          <p className="text-sm text-[var(--text-muted)]">
                            {m.conversationId ? 'Continue your conversation' : 'Matched on a trip'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        disabled={startingId === m.user.id}
                        onClick={() =>
                          void startOrOpenChat(
                            m.user.id,
                            { name: m.user.name, displayName: m.user.displayName, avatarUrl: m.user.avatarUrl },
                            m.conversationId,
                          )
                        }
                      >
                        {startingId === m.user.id ? '…' : m.conversationId ? 'Open' : 'Message'}
                      </Button>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      {!loading && safeConversations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Conversations</h2>
          <div className="grid gap-3 max-w-3xl">
            {safeConversations.map((c) => {
              const st = lastStatusLabel(c.lastMessageStatus)
              return (
                <div key={c.id} className="relative">
                  <Link
                    to={`/chat/${encodeURIComponent(c.id)}`}
                    state={{
                      peerUserId: c.otherUserId,
                      peerDisplayName: c.otherUser.displayName ?? c.otherUser.name,
                      peerAvatarUrl: c.otherUser.avatarUrl,
                      peerName: c.otherUser.name,
                      otherUserName: c.otherUser.name,
                    }}
                  >
                    <Card className="p-4 hover:bg-[var(--bg-subtle)] transition-colors flex items-start gap-3 pr-14">
                      <ChatAvatar name={c.otherUser.name} avatarUrl={c.otherUser.avatarUrl} size={40} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-[var(--text)] truncate">
                            {c.otherUser.displayName ?? c.otherUser.name}
                          </p>
                          {c.lastMessageAt ? (
                            <span className="text-[11px] text-[var(--text-muted)] shrink-0">
                              {formatShortTime(c.lastMessageAt)}
                            </span>
                          ) : null}
                        </div>
                        {st.text ? (
                          <p className={`text-[11px] font-semibold mt-0.5 ${st.className}`}>{st.text}</p>
                        ) : null}
                        {c.lastMessagePreview ? (
                          <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{c.lastMessagePreview}</p>
                        ) : (
                          <p className="text-sm text-[var(--text-muted)] mt-1">No messages yet</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                  <button
                    type="button"
                    aria-label="Delete conversation"
                    disabled={deletingId === c.id}
                    onClick={() => void removeConversation(c.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-red-600 hover:bg-red-500/10 text-lg leading-none"
                  >
                    {deletingId === c.id ? '…' : '🗑'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {!loading && safeMatches.length === 0 && safeConversations.length === 0 ? (
        <Card className="max-w-xl p-5">
          <p className="text-[var(--text-muted)] text-sm leading-relaxed">
            When a driver accepts your trip (or you accept one), they&apos;ll appear here for chat.
          </p>
        </Card>
      ) : null}
    </div>
  )
}
