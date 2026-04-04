import { getToken, setSession } from './authStorage'
import { getApiOrigin } from './apiOrigin'
import type { User } from '../types'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** These routes must not send a stale JWT — avoids odd failures on public auth. */
function isPublicAuthPath(path: string): boolean {
  const base = path.split('?')[0]
  return (
    base === '/users/register' ||
    base === '/users/login' ||
    base === '/users/demo-login'
  )
}

function friendlyMessage(path: string, status: number, serverMessage: string): string {
  if (status === 0) {
    return 'Could not reach the server. Check your network and that VITE_API_URL matches your deployed API.'
  }
  if (status === 401 && basePath(path) === '/users/login') {
    return "We couldn’t sign you in. Check your email and password, create an account, or use a demo account below."
  }
  return serverMessage || `Request failed (${status})`
}

function basePath(path: string): string {
  return path.split('?')[0]
}

function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  const origin = getApiOrigin()
  if (origin) return `${origin}/api${p}`
  return `/api${p}`
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token && !isPublicAuthPath(path)) {
    headers.Authorization = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(apiUrl(path), { ...options, headers })
  } catch {
    const msg = friendlyMessage(path, 0, '')
    throw new ApiError(msg, 0)
  }

  const data = (await res.json().catch(() => ({}))) as { error?: string }

  if (!res.ok) {
    const msg = friendlyMessage(path, res.status, data.error || '')
    throw new ApiError(msg, res.status)
  }
  return data as T
}

/** PATCH /api/users/role — `{ role: "owner" | "driver" }` */
export async function switchRole(role: 'owner' | 'driver'): Promise<{ user: User; token: string }> {
  const data = await api<{ user: User; token: string }>('/users/role', {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
  setSession(data.token, data.user)
  return data
}

/** POST /api/users/avatar — `{ image: dataUrl }` */
export async function uploadAvatar(imageDataUrl: string): Promise<{ user: User }> {
  return api<{ user: User }>('/users/avatar', {
    method: 'POST',
    body: JSON.stringify({ image: imageDataUrl }),
  })
}

/** --- Chat (matched users only) --- */

export type ChatUserPreview = {
  id: string
  name: string
  displayName?: string
  email?: string
  avatarUrl?: string
}

export type ConversationListItem = {
  id: string
  participants: string[]
  otherUser: ChatUserPreview
  otherUserId: string
  createdAt: string
  updatedAt: string
  lastMessageAt?: string
  lastMessagePreview?: string
  lastMessageSenderId?: string
  lastMessageStatus?: 'sent' | 'delivered' | 'read' | 'received'
}

export type ChatMessage = {
  id: string
  conversationId: string
  senderId: string
  text: string
  createdAt: string
  senderDisplayName?: string
  senderName?: string
  senderAvatarUrl?: string
  isUnread?: boolean
  deliveryStatus?: 'sent' | 'delivered' | 'read'
}

export async function createConversation(participantId: string) {
  return api<{ conversation: { id: string; participants: string[]; createdAt: string; updatedAt: string } }>(
    '/conversations',
    { method: 'POST', body: JSON.stringify({ participantId }) },
  )
}

export async function listConversations() {
  return api<{ conversations: ConversationListItem[] }>('/conversations', { method: 'GET' })
}

export async function deleteConversation(conversationId: string) {
  await api(`/conversations/${encodeURIComponent(conversationId)}`, { method: 'DELETE' })
}

export type PublicUserProfile = {
  id: string
  name: string
  displayName?: string
  role: string
  avatarUrl?: string
  ratingAverage?: number
}

export async function getPublicUser(userId: string) {
  return api<{ user: PublicUserProfile }>(`/users/public/${encodeURIComponent(userId)}`, { method: 'GET' })
}

export async function postChatMessage(conversationId: string, text: string) {
  return api<{ message: ChatMessage }>('/messages', {
    method: 'POST',
    body: JSON.stringify({ conversationId, text }),
  })
}

export async function listChatMessages(conversationId: string) {
  return api<{ messages: ChatMessage[]; peerLastReadAt?: string | null }>(
    `/messages/${encodeURIComponent(conversationId)}`,
    { method: 'GET' },
  )
}

export async function markConversationRead(conversationId: string) {
  await api(`/conversations/${encodeURIComponent(conversationId)}/read`, { method: 'POST' })
}

export async function getChatUnreadCount(): Promise<number> {
  const { total } = await api<{ total: number }>('/chat/unread-count', { method: 'GET' })
  return total
}

export async function listChatMatches() {
  return api<{ matches: { user: ChatUserPreview; conversationId: string | null }[] }>('/chat/matches', {
    method: 'GET',
  })
}

export type ChatRecentTripRow = {
  id: string
  status: string
  pickupLocation: string
  dropoffLocation: string
  updatedAt: string
  createdAt: string
  paymentAmount: number
  owner?: { name?: string }
  driver?: { name?: string }
}

export type ChatActivityLogRow = {
  id: string
  tripId: string
  at: string
  who: string
  summary: string
}

export async function listChatRecentTrips() {
  return api<{ trips: ChatRecentTripRow[]; activities?: ChatActivityLogRow[] }>('/chat/recent-trips', {
    method: 'GET',
  })
}
