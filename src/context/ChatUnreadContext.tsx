import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import { getChatUnreadCount } from '../lib/api'
import { getToken } from '../lib/authStorage'

export type ChatUnreadContextValue = {
  unreadCount: number
  refreshUnread: () => Promise<void>
}

const ChatUnreadContext = createContext<ChatUnreadContextValue | null>(null)

export function ChatUnreadProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnread = useCallback(async () => {
    if (!getToken()) {
      setUnreadCount(0)
      return
    }
    try {
      const n = await getChatUnreadCount()
      setUnreadCount(n)
    } catch {
      setUnreadCount(0)
    }
  }, [])

  useEffect(() => {
    void refreshUnread()
  }, [pathname, refreshUnread])

  useEffect(() => {
    if (!getToken()) return
    const id = window.setInterval(() => void refreshUnread(), 28000)
    return () => window.clearInterval(id)
  }, [pathname, refreshUnread])

  const value = useMemo(() => ({ unreadCount, refreshUnread }), [unreadCount, refreshUnread])

  return <ChatUnreadContext.Provider value={value}>{children}</ChatUnreadContext.Provider>
}

export function useChatUnread(): ChatUnreadContextValue {
  const ctx = useContext(ChatUnreadContext)
  if (!ctx) {
    throw new Error('useChatUnread must be used within ChatUnreadProvider')
  }
  return ctx
}
