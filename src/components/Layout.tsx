import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api, ApiError } from '../lib/api'
import { clearSession, getStoredUser, getToken, setSession } from '../lib/authStorage'
import { useSyncGlobalLoading } from '../context/LoadingOverlayContext'
import { useTheme } from '../theme/ThemeContext'
import type { User } from '../types'
import { ChatUnreadProvider } from '../context/ChatUnreadContext'
import { DesktopChrome } from './layout/DesktopChrome'
import { MobileBottomNav } from './layout/MobileBottomNav'

export default function Layout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = getStoredUser()
  const isHomeMap = pathname === '/home'
  const { theme, toggleTheme } = useTheme()
  const [profileSyncing, setProfileSyncing] = useState(() => Boolean(getToken()))

  useSyncGlobalLoading(profileSyncing)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setProfileSyncing(false)
      return
    }
    const ac = new AbortController()
    api<{ user: User }>('/users/profile', { signal: ac.signal })
      .then((res) => {
        if (ac.signal.aborted) return
        if (getToken() !== token) return
        setSession(token, res.user)
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearSession()
          navigate('/', { replace: true })
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setProfileSyncing(false)
      })
    return () => {
      ac.abort()
      setProfileSyncing(false)
    }
  }, [navigate])

  return (
    <ChatUnreadProvider>
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-[var(--bg-page)] text-[var(--text)] transition-colors lg:h-auto lg:max-h-none lg:min-h-[100dvh] lg:overflow-visible">
      {/* Mobile / tablet: slim top bar */}
      <motion.header
        initial={false}
        className="lg:hidden max-lg:pointer-events-auto max-lg:absolute max-lg:inset-x-0 max-lg:top-0 max-lg:z-[55] z-50 border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-md safe-pt"
      >
        <div className="flex h-12 sm:h-14 items-center justify-between gap-3 px-4 sm:px-5">
          <Link
            to="/home"
            className="font-bold text-[var(--text)] tracking-tight text-base sm:text-lg shrink-0 min-h-[44px] min-w-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] rounded-lg"
          >
            Key<span className="text-[var(--accent)]">Go</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="text-xs sm:text-sm font-semibold text-[var(--brand)] min-h-[44px] px-2 rounded-lg hover:bg-[var(--brand-soft)]"
            >
              Account
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center text-base shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </motion.header>

      <DesktopChrome />

      <main
        className="flex-1 min-h-0 w-full min-w-0 max-lg:absolute max-lg:inset-0 max-lg:z-0 flex flex-col overflow-y-auto overscroll-y-contain max-lg:px-0 max-lg:pt-0 max-lg:pb-0 [scroll-padding-top:calc(3.5rem+env(safe-area-inset-top)+10px)] [scroll-padding-bottom:calc(4.5rem+env(safe-area-inset-bottom)+12px)] lg:relative lg:overflow-visible lg:px-8 xl:px-12 2xl:px-16 lg:pt-8 lg:pb-10 lg:[scroll-padding-top:0] lg:[scroll-padding-bottom:0]"
      >
        <div
          className={[
            'w-full max-w-none flex min-h-full flex-1 flex-col lg:min-h-0 lg:px-0 lg:pt-0 lg:pb-0',
            isHomeMap
              ? 'max-lg:min-h-0 max-lg:px-0 max-lg:pt-0 max-lg:pb-[calc(4.5rem+env(safe-area-inset-bottom)+12px)]'
              : 'max-lg:px-4 max-lg:pt-[calc(3.5rem+env(safe-area-inset-top)+10px)] max-lg:pb-[calc(4.5rem+env(safe-area-inset-bottom)+12px)]',
          ].join(' ')}
        >
          <Outlet />
        </div>
      </main>

      <MobileBottomNav user={user} />
    </div>
    </ChatUnreadProvider>
  )
}
