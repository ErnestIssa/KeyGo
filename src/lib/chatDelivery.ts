import type { ChatMessage } from './api'

const DELIVERED_AFTER_MS = 2500

/** Live peer read cursor for outgoing bubbles (matches server `outgoingMessageUiStatus`). */
export function outgoingDeliveryStatus(
  messageCreatedAtIso: string,
  peerLastReadAtIso: string | null | undefined
): NonNullable<ChatMessage['deliveryStatus']> {
  if (peerLastReadAtIso) {
    const peer = new Date(peerLastReadAtIso).getTime()
    const sent = new Date(messageCreatedAtIso).getTime()
    if (!Number.isNaN(peer) && !Number.isNaN(sent) && peer >= sent) {
      return 'read'
    }
  }
  const age = Date.now() - new Date(messageCreatedAtIso).getTime()
  if (age >= DELIVERED_AFTER_MS) {
    return 'delivered'
  }
  return 'sent'
}
