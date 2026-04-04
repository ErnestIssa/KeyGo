import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSyncGlobalLoading } from '../context/LoadingOverlayContext'
import {
  createConversation,
  listChatMatches,
  listChatRecentTrips,
  listConversations,
  type ChatRecentTripRow,
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

export default function ChatPage() {
  const navigate = useNavigate()
  const me = getStoredUser()
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [matches, setMatches] = useState<
    { user: { id: string; name: string; displayName?: string; avatarUrl?: string }; conversationId: string | null }[]
  >([])
  const [recentTrips, setRecentTrips] = useState<ChatRecentTripRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startingId, setStartingId] = useState<string | null>(null)

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
          setRecentTrips(tripRes.trips)
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
    peer: { name: string; displayName?: string; avatarUrl?: string },
  ) => {
    navigate(`/chat/${encodeURIComponent(conversationId)}`, {
      state: {
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
      openThread(existingId, peer)
      return
    }
    setStartingId(participantId)
    try {
      const res = await createConversation(participantId)
      openThread(res.conversation.id, peer)
    } catch (e) {
      setError(friendlyErrorMessage(e))
    } finally {
      setStartingId(null)
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

      {!loading && recentTrips.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Recent activity</h2>
          <div className="grid gap-3 max-w-3xl">
            {recentTrips.slice(0, 8).map((trip) => (
              <Card key={trip.id} className="p-4">
                <p className="font-semibold text-[var(--text)] truncate">
                  {trip.pickupLocation} → {trip.dropoffLocation}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {statusLabel[trip.status] ?? trip.status}
                  {trip.owner?.name || trip.driver?.name
                    ? ` · ${trip.owner?.name ?? '?'} & ${trip.driver?.name ?? '?'}`
                    : ''}
                </p>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {!loading && safeMatches.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            People you can message
          </h2>
          <div className="grid gap-3 max-w-3xl">
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
        </section>
      ) : null}

      {!loading && safeConversations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Conversations</h2>
          <div className="grid gap-3 max-w-3xl">
            {safeConversations.map((c) => (
              <Link
                key={c.id}
                to={`/chat/${encodeURIComponent(c.id)}`}
                state={{
                  peerDisplayName: c.otherUser.displayName ?? c.otherUser.name,
                  peerAvatarUrl: c.otherUser.avatarUrl,
                  peerName: c.otherUser.name,
                  otherUserName: c.otherUser.name,
                }}
              >
                <Card className="p-4 hover:bg-[var(--bg-subtle)] transition-colors flex items-start gap-3">
                  <ChatAvatar name={c.otherUser.name} avatarUrl={c.otherUser.avatarUrl} size={40} />
                  <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--text)]">{c.otherUser.displayName ?? c.otherUser.name}</p>
                  {c.lastMessagePreview ? (
                    <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{c.lastMessagePreview}</p>
                  ) : (
                    <p className="text-sm text-[var(--text-muted)] mt-1">No messages yet</p>
                  )}
                  </div>
                </Card>
              </Link>
            ))}
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
