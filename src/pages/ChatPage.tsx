import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, animate } from 'framer-motion'
import { useChatUnread } from '../context/ChatUnreadContext'
import { useSyncGlobalLoading } from '../context/LoadingOverlayContext'
import {
  createConversation,
  deleteConversation,
  listChatMatches,
  listChatRecentTrips,
  listConversations,
  patchConversationSettings,
  clearConversationHistory,
  postConversationMarkUnread,
  postConversationLock,
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

const PANEL_DURATION = 0.95
const PANEL_CLOSE_DURATION = 0.78
const PANEL_OPEN_FADE = 0.35
const PANEL_EASE = [0.22, 1, 0.36, 1] as const
const PANEL_CLOSE_HEIGHT_EASE = [0.33, 0.86, 0.45, 1] as const
const ACTION_W = 76
const GAP = 10
const SWIPE_COMMIT = 48

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

function SwipeConversationRow({
  c,
  onOpen,
  onProfile,
  onDelete,
  onLongPressStart,
  onLongPressEnd,
  cardBgClass,
}: {
  c: ConversationListItem
  onOpen: () => void
  onProfile: () => void
  onDelete: () => void
  onLongPressStart: () => void
  onLongPressEnd: () => void
  cardBgClass: string
}) {
  const x = useMotionValue(0)
  const longTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressConsumed = useRef(false)
  const maxX = ACTION_W + GAP
  const minX = -(ACTION_W + GAP)

  const onPointerDown = () => {
    longPressConsumed.current = false
    longTimer.current = setTimeout(() => {
      longPressConsumed.current = true
      onLongPressStart()
      if (navigator.vibrate) navigator.vibrate(18)
    }, 420)
  }
  const clearLong = () => {
    if (longTimer.current) clearTimeout(longTimer.current)
    longTimer.current = null
    onLongPressEnd()
  }

  return (
    <div className="relative w-full overflow-hidden mb-0 touch-pan-y">
      <div className="absolute inset-y-0 left-0 z-0 flex items-stretch pl-1" style={{ width: maxX + 8 }}>
        <button
          type="button"
          className={`flex flex-1 items-center justify-center rounded-2xl ${cardBgClass} border border-[var(--border)] ml-1`}
          style={{ marginRight: GAP, maxWidth: ACTION_W }}
          aria-label="Open profile"
          onClick={() => {
            onProfile()
            void animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 })
          }}
        >
          <span className="text-3xl leading-none text-[#2563eb]" aria-hidden>
            ◉
          </span>
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 z-0 flex items-stretch pr-1" style={{ width: maxX + 8 }}>
        <button
          type="button"
          className={`flex flex-1 items-center justify-center rounded-2xl ${cardBgClass} border border-[var(--border)] mr-1`}
          style={{ marginLeft: GAP, maxWidth: ACTION_W }}
          aria-label="Delete conversation"
          onClick={() => {
            onDelete()
            void animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 })
          }}
        >
          <span className="text-2xl font-bold text-red-600" aria-hidden>
            🗑
          </span>
        </button>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: minX, right: maxX }}
        dragElastic={0.12}
        style={{ x }}
        className="relative z-10"
        onDragEnd={(_, info) => {
          const ox = info.offset.x
          if (ox > SWIPE_COMMIT) {
            onProfile()
            if (navigator.vibrate) navigator.vibrate(12)
          } else if (ox < -SWIPE_COMMIT) {
            onDelete()
            if (navigator.vibrate) navigator.vibrate(12)
          }
          void animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 })
        }}
      >
        <button
          type="button"
          className="w-full text-left"
          onClick={() => {
            if (longPressConsumed.current) {
              longPressConsumed.current = false
              return
            }
            onOpen()
          }}
          onPointerDown={onPointerDown}
          onPointerUp={clearLong}
          onPointerLeave={clearLong}
          onPointerCancel={clearLong}
        >
          <Card className={`p-4 rounded-none border-x-0 border-t border-b border-[var(--border)] ${cardBgClass} hover:opacity-[0.98] transition-opacity flex items-start gap-3`}>
            <ChatAvatar name={c.otherUser.name} avatarUrl={c.otherUser.avatarUrl} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[var(--text)] truncate">
                  {c.otherUser.displayName ?? c.otherUser.name}
                </p>
                {c.lastMessageAt ? (
                  <span className="text-[11px] text-[var(--text-muted)] shrink-0">{formatShortTime(c.lastMessageAt)}</span>
                ) : null}
              </div>
              {(() => {
                const st = lastStatusLabel(c.lastMessageStatus)
                return st.text ? <p className={`text-[11px] font-semibold mt-0.5 ${st.className}`}>{st.text}</p> : null
              })()}
              {c.lastMessagePreview ? (
                <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{c.lastMessagePreview}</p>
              ) : (
                <p className="text-sm text-[var(--text-muted)] mt-1">No messages yet</p>
              )}
              {c.isLocked ? (
                <p className="text-[11px] text-[var(--text-muted)] mt-1">Locked — sending paused</p>
              ) : null}
            </div>
          </Card>
        </button>
      </motion.div>
    </div>
  )
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
  /** Only one dropdown expanded at a time (`null` = both collapsed). */
  const [openChatPanel, setOpenChatPanel] = useState<'activity' | 'people' | null>('activity')
  const [includeArchived, setIncludeArchived] = useState(false)
  const [menuConvo, setMenuConvo] = useState<ConversationListItem | null>(null)
  const [listTagMode, setListTagMode] = useState(false)
  const [listTagDraft, setListTagDraft] = useState('')
  const [settingsBusy, setSettingsBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const [convRes, matchRes, tripRes] = await Promise.all([
        listConversations(includeArchived),
        listChatMatches(),
        listChatRecentTrips(),
      ])
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
      setError(null)
    } catch (e) {
      setError(friendlyErrorMessage(e))
    } finally {
      setLoading(false)
    }
    void refreshUnread()
  }, [includeArchived, refreshUnread])

  useEffect(() => {
    setLoading(true)
    void load()
  }, [load])

  useSyncGlobalLoading(loading)

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

  const runSettings = async (fn: () => Promise<void>) => {
    setSettingsBusy(true)
    try {
      await fn()
      await load()
    } catch (e) {
      setError(friendlyErrorMessage(e))
    } finally {
      setSettingsBusy(false)
    }
  }

  const cardBg = 'bg-[var(--bg-elevated)]'

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
        <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenChatPanel((prev) => (prev === 'activity' ? null : 'activity'))}
            className="w-full flex items-center justify-between gap-2 text-left font-semibold text-[var(--text)] min-h-[44px] px-4 py-3"
          >
            Recent activity
            <motion.span
              className="text-xs text-[var(--text-muted)] inline-block"
              animate={{ rotate: openChatPanel === 'activity' ? 180 : 0 }}
              transition={{ duration: PANEL_DURATION, ease: PANEL_EASE }}
            >
              ▼
            </motion.span>
          </button>
          <motion.div
            className="overflow-hidden border-t border-[var(--border)]"
            initial={false}
            animate={{ height: openChatPanel === 'activity' ? 'auto' : 0 }}
            transition={{
              height: {
                duration: openChatPanel === 'activity' ? PANEL_DURATION : PANEL_CLOSE_DURATION,
                ease: openChatPanel === 'activity' ? PANEL_EASE : PANEL_CLOSE_HEIGHT_EASE,
              },
            }}
          >
            <motion.div
              initial={false}
              animate={{ opacity: openChatPanel === 'activity' ? 1 : 0 }}
              transition={{
                opacity: {
                  duration: openChatPanel === 'activity' ? PANEL_OPEN_FADE : 0,
                  ease: PANEL_EASE,
                },
              }}
            >
              <div className="px-4 py-4 space-y-4">
                {activities.map((row) => (
                  <div key={row.id} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                    <p className="text-xs text-[var(--text-muted)]">{formatShortTime(row.at)}</p>
                    <p className="font-semibold text-[var(--text)] mt-1">{row.summary}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{row.who}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      ) : null}

      {!loading && safeMatches.length > 0 ? (
        <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenChatPanel((prev) => (prev === 'people' ? null : 'people'))}
            className="w-full flex items-center justify-between gap-2 text-left font-semibold text-[var(--text)] min-h-[44px] px-4 py-3"
          >
            People you can message
            <motion.span
              className="text-xs text-[var(--text-muted)] inline-block"
              animate={{ rotate: openChatPanel === 'people' ? 180 : 0 }}
              transition={{ duration: PANEL_DURATION, ease: PANEL_EASE }}
            >
              ▼
            </motion.span>
          </button>
          <motion.div
            className="overflow-hidden border-t border-[var(--border)]"
            initial={false}
            animate={{ height: openChatPanel === 'people' ? 'auto' : 0 }}
            transition={{
              height: {
                duration: openChatPanel === 'people' ? PANEL_DURATION : PANEL_CLOSE_DURATION,
                ease: openChatPanel === 'people' ? PANEL_EASE : PANEL_CLOSE_HEIGHT_EASE,
              },
            }}
          >
            <motion.div
              initial={false}
              animate={{ opacity: openChatPanel === 'people' ? 1 : 0 }}
              transition={{
                opacity: {
                  duration: openChatPanel === 'people' ? PANEL_OPEN_FADE : 0,
                  ease: PANEL_EASE,
                },
              }}
            >
              <div className="p-4 grid gap-3">
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
          </motion.div>
        </div>
      ) : null}

      {!loading ? (
        <button
          type="button"
          onClick={() => setIncludeArchived((a) => !a)}
          className="text-sm font-semibold text-[var(--brand)] hover:underline"
        >
          {includeArchived ? 'Hide archived' : 'Show archived'}
        </button>
      ) : null}

      {!loading && safeConversations.length > 0 ? (
        <section className="space-y-2 w-full">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] px-1">Conversations</h2>
          <div className="w-full -mx-4 sm:mx-0 sm:max-w-3xl">
            {safeConversations.map((c) => (
              <SwipeConversationRow
                key={c.id}
                c={c}
                cardBgClass={cardBg}
                onOpen={() =>
                  openThread(c.id, {
                    id: c.otherUserId,
                    name: c.otherUser.name,
                    displayName: c.otherUser.displayName,
                    avatarUrl: c.otherUser.avatarUrl,
                  })
                }
                onProfile={() =>
                  navigate(`/profile/user/${encodeURIComponent(c.otherUserId)}`)
                }
                onDelete={() => {
                  if (deletingId) return
                  if (window.confirm('Delete this conversation for both of you?')) void removeConversation(c.id)
                }}
                onLongPressStart={() => {
                  setMenuConvo(c)
                  setListTagMode(false)
                  setListTagDraft(c.mySettings?.listTag ?? '')
                }}
                onLongPressEnd={() => {
                  /* keep menu open */
                }}
              />
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

      {menuConvo ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
          role="dialog"
          aria-modal
          onClick={() => setMenuConvo(null)}
        >
          <div
            className="flex flex-col gap-3 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-4 border-[var(--border)]">
              <p className="font-bold text-[var(--text)] truncate">{menuConvo.otherUser.displayName ?? menuConvo.otherUser.name}</p>
              <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-4">
                {menuConvo.lastMessagePreview ?? 'No messages yet.'}
              </p>
            </Card>
            <Card className="p-0 overflow-hidden border-[var(--border)]">
              {listTagMode ? (
                <div className="p-4 space-y-3">
                  <label className="block text-sm font-semibold text-[var(--text)]">List name</label>
                  <input
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)]"
                    value={listTagDraft}
                    onChange={(e) => setListTagDraft(e.target.value)}
                    placeholder="e.g. Work"
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setListTagMode(false)}>
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      disabled={settingsBusy}
                      onClick={() =>
                        void runSettings(async () => {
                          await patchConversationSettings(menuConvo.id, { listTag: listTagDraft.trim() || null })
                          setMenuConvo(null)
                          setListTagMode(false)
                        })
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {(
                    [
                      {
                        label: 'Mark as unread',
                        run: () => postConversationMarkUnread(menuConvo.id),
                      },
                      { label: 'Archive', run: () => patchConversationSettings(menuConvo.id, { archived: true }) },
                      { label: 'Mute', run: () => patchConversationSettings(menuConvo.id, { muted: true }) },
                      {
                        label: menuConvo.isLocked ? 'Unlock chat' : 'Lock chat',
                        run: () => postConversationLock(menuConvo.id, !menuConvo.isLocked),
                      },
                      { label: 'Add to favorites', run: () => patchConversationSettings(menuConvo.id, { favorite: true }) },
                      { label: 'Add to list', action: 'list' as const },
                      { label: 'Clear chat', run: () => clearConversationHistory(menuConvo.id) },
                      { label: 'Delete chat', action: 'delete' as const },
                    ] as const
                  ).map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        disabled={settingsBusy}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-[var(--bg-subtle)] transition-colors ${
                          item.label === 'Delete chat' ? 'text-red-600 font-bold' : 'text-[var(--text)]'
                        }`}
                        onClick={() => {
                          if ('action' in item && item.action === 'list') {
                            setListTagMode(true)
                            return
                          }
                          if ('action' in item && item.action === 'delete') {
                            setMenuConvo(null)
                            void removeConversation(menuConvo.id)
                            return
                          }
                          void runSettings(async () => {
                            if ('run' in item) await item.run()
                            setMenuConvo(null)
                          })
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  )
}
