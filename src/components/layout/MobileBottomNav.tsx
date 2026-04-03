import { useRef, type MouseEvent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { User } from '../../types'
import { IconActivity, IconHome, IconKeyGoLogo, IconMyTrips, IconProfile } from './navIcons'

function isTripDetailPath(pathname: string) {
  return /^\/trips\/(?!new$|available$|mine$)[^/]+$/.test(pathname)
}

/** Exactly one tab can be active; order avoids overlapping matches. */
function getMobileNavSelection(
  pathname: string,
  isOwner: boolean
): 'home' | 'mine' | 'center' | 'activity' | 'profile' | null {
  if (pathname === '/home') return 'home'
  if (pathname === '/activity') return 'activity'
  if (pathname === '/profile' || pathname.startsWith('/profile/')) return 'profile'
  if (isOwner ? pathname === '/trips/new' : pathname === '/trips/available') return 'center'
  if (pathname === '/trips/mine' || isTripDetailPath(pathname)) return 'mine'
  return null
}

const NAV_INTERACTION_LOCK_MS = 260

function navTapFeedback() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(12)
  }
}

type Props = {
  user: User | null
}

export function MobileBottomNav({ user }: Props) {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const navInteractionLockRef = useRef(false)

  const onNavLinkClick = (e: MouseEvent) => {
    if (navInteractionLockRef.current) {
      e.preventDefault()
      return
    }
    navInteractionLockRef.current = true
    window.setTimeout(() => {
      navInteractionLockRef.current = false
    }, NAV_INTERACTION_LOCK_MS)
    navTapFeedback()
  }

  const isOwner = user?.role === 'owner'
  const centerTo = isOwner ? '/trips/new' : '/trips/available'
  const centerLabel = isOwner ? 'Create' : 'Browse'

  const navSel = getMobileNavSelection(pathname, isOwner)
  const homeActive = navSel === 'home'
  const mineActive = navSel === 'mine'
  const centerActive = navSel === 'center'
  const activityActive = navSel === 'activity'
  const profileActive = navSel === 'profile'

  /** Match native tab highlight + scene fade (~640ms) */
  const navEase = 'duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
  const tapTransition = reduceMotion ? { duration: 0 } : { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const }

  const tabClass = (isActive: boolean) =>
    [
      'flex flex-col items-center justify-end gap-px flex-1 min-w-0 min-h-[3rem] rounded-2xl px-2 py-1.5 transition-[background-color,color] ',
      navEase,
      isActive
        ? 'text-[var(--brand)] bg-[var(--brand-soft)]'
        : 'text-[var(--text-muted)] bg-transparent active:bg-[var(--bg-subtle)]',
    ].join(' ')

  const iconClass = 'w-7 h-7 sm:w-8 sm:h-8 shrink-0'

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-[60] pointer-events-none flex justify-center px-3"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <nav
        className="pointer-events-auto w-full max-w-[min(100%,calc(100vw-1.5rem))] rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-elevated)]/85 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.14)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.38)]"
        aria-label="Main navigation"
      >
      <div className="flex w-full items-end justify-between px-3 pt-1.5 pb-2">
        <NavLink
          to="/home"
          end
          onClick={onNavLinkClick}
          className={tabClass(homeActive)}
          aria-current={homeActive ? 'page' : undefined}
        >
          <motion.span
            className="inline-flex text-current"
            whileTap={reduceMotion ? {} : { scale: 0.96, transition: tapTransition }}
          >
            <IconHome className={iconClass} />
          </motion.span>
          <span className="truncate max-w-full text-center leading-tight px-0.5 text-[10px] sm:text-[11px] font-semibold">
            Home
          </span>
        </NavLink>

        <NavLink
          to="/trips/mine"
          onClick={onNavLinkClick}
          className={tabClass(mineActive)}
          aria-current={mineActive ? 'page' : undefined}
        >
          <motion.span className="inline-flex text-current" whileTap={reduceMotion ? {} : { scale: 0.96, transition: tapTransition }}>
            <IconMyTrips className={iconClass} />
          </motion.span>
          <span className="truncate max-w-full text-center leading-tight px-0.5 text-[10px] sm:text-[11px] font-semibold">
            My trips
          </span>
        </NavLink>

        <div className="flex flex-col items-center justify-end flex-1 min-w-[3.75rem] max-w-[5.5rem] relative z-10 px-2 py-1.5 min-h-[3rem]">
          <NavLink
            to={centerTo}
            onClick={onNavLinkClick}
            aria-label={isOwner ? 'Create trip' : 'Browse trips'}
            className={[
              'flex flex-col items-center justify-end gap-px w-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] px-1 py-1 transition-[background-color] ',
              navEase,
              centerActive ? 'bg-[var(--brand-soft)]' : 'bg-transparent',
            ].join(' ')}
            aria-current={centerActive ? 'page' : undefined}
          >
            <motion.span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--accent)]"
              whileTap={reduceMotion ? {} : { scale: 0.96, transition: tapTransition }}
            >
              <IconKeyGoLogo className="block h-10 w-10 shrink-0" />
            </motion.span>
            <span className="shrink-0 truncate max-w-full text-center leading-tight px-0.5 text-[10px] sm:text-[11px] font-bold text-[var(--accent)]">
              {centerLabel}
            </span>
          </NavLink>
        </div>

        <NavLink
          to="/activity"
          onClick={onNavLinkClick}
          className={tabClass(activityActive)}
          aria-current={activityActive ? 'page' : undefined}
        >
          <motion.span className="inline-flex text-current" whileTap={reduceMotion ? {} : { scale: 0.96, transition: tapTransition }}>
            <IconActivity className={iconClass} />
          </motion.span>
          <span className="truncate max-w-full text-center leading-tight px-0.5 text-[10px] sm:text-[11px] font-semibold">
            Activity
          </span>
        </NavLink>

        <NavLink
          to="/profile"
          onClick={onNavLinkClick}
          className={tabClass(profileActive)}
          aria-current={profileActive ? 'page' : undefined}
        >
          <motion.span className="inline-flex text-current" whileTap={reduceMotion ? {} : { scale: 0.96, transition: tapTransition }}>
            <IconProfile className={iconClass} />
          </motion.span>
          <span className="truncate max-w-full text-center leading-tight px-0.5 text-[10px] sm:text-[11px] font-semibold">
            Profile
          </span>
        </NavLink>
      </div>
      </nav>
    </div>
  )
}
