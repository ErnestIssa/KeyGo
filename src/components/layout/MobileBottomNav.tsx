import { NavLink, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { User } from '../../types'
import { IconActivity, IconCar, IconHome, IconMyTrips, IconProfile } from './navIcons'

function isTripDetailPath(pathname: string) {
  return /^\/trips\/(?!new$|available$|mine$)[^/]+$/.test(pathname)
}

type Props = {
  user: User | null
}

export function MobileBottomNav({ user }: Props) {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()

  const isOwner = user?.role === 'owner'
  const centerTo = isOwner ? '/trips/new' : '/trips/available'
  const centerLabel = isOwner ? 'Create' : 'Browse'

  const homeActive = pathname === '/home'
  const mineActive = pathname === '/trips/mine' || isTripDetailPath(pathname)
  const centerActive = isOwner ? pathname === '/trips/new' : pathname === '/trips/available'
  const activityActive = pathname === '/activity'
  const profileActive = pathname === '/profile'

  const itemClass = (active: boolean) =>
    [
      'flex flex-col items-center justify-end gap-0.5 flex-1 min-w-0 min-h-[3.25rem] pt-1',
      'text-[10px] sm:text-[11px] font-semibold transition-colors rounded-xl',
      active ? 'text-[var(--brand)]' : 'text-[var(--text-muted)] active:bg-[var(--bg-subtle)]',
    ].join(' ')

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.25)]"
      style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))' }}
      aria-label="Main navigation"
    >
      <div className="flex w-full items-end justify-between px-1 sm:px-2 pt-1">
        <NavLink to="/home" end className={() => itemClass(homeActive)} aria-current={homeActive ? 'page' : undefined}>
          <motion.span
            className="inline-flex text-current"
            whileTap={reduceMotion ? {} : { scale: 0.9 }}
          >
            <IconHome className="w-[1.375rem] h-[1.375rem] sm:w-6 sm:h-6 shrink-0" />
          </motion.span>
          <span className="truncate max-w-full text-center leading-tight px-0.5">Home</span>
        </NavLink>

        <NavLink
          to="/trips/mine"
          className={() => itemClass(mineActive)}
          aria-current={mineActive ? 'page' : undefined}
        >
          <motion.span className="inline-flex text-current" whileTap={reduceMotion ? {} : { scale: 0.9 }}>
            <IconMyTrips className="w-[1.375rem] h-[1.375rem] sm:w-6 sm:h-6 shrink-0" />
          </motion.span>
          <span className="truncate max-w-full text-center leading-tight px-0.5">My trips</span>
        </NavLink>

        <div className="flex flex-col items-center flex-1 min-w-[3.75rem] max-w-[5rem] -mt-6 relative z-10 px-0.5">
          <NavLink
            to={centerTo}
            className="flex flex-col items-center gap-1 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            aria-current={centerActive ? 'page' : undefined}
          >
            <motion.span
              className={[
                'flex h-[3.25rem] w-[3.25rem] sm:h-14 sm:w-14 items-center justify-center rounded-2xl text-white',
                'bg-[var(--brand)] border-2 border-[var(--brand-hover)]/40',
                'shadow-[0_10px_28px_rgba(29,78,216,0.42)]',
              ].join(' ')}
              whileTap={reduceMotion ? {} : { scale: 0.88 }}
            >
              <span className="inline-flex">
                <IconCar className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.75} />
              </span>
            </motion.span>
            <span
              className={[
                'text-[10px] sm:text-[11px] font-bold text-center leading-tight truncate max-w-full',
                centerActive ? 'text-[var(--brand)]' : 'text-[var(--text-muted)]',
              ].join(' ')}
            >
              {centerLabel}
            </span>
          </NavLink>
        </div>

        <NavLink
          to="/activity"
          className={() => itemClass(activityActive)}
          aria-current={activityActive ? 'page' : undefined}
        >
          <motion.span className="inline-flex text-current" whileTap={reduceMotion ? {} : { scale: 0.9 }}>
            <IconActivity className="w-[1.375rem] h-[1.375rem] sm:w-6 sm:h-6 shrink-0" />
          </motion.span>
          <span className="truncate max-w-full text-center leading-tight px-0.5">Activity</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={() => itemClass(profileActive)}
          aria-current={profileActive ? 'page' : undefined}
        >
          <motion.span className="inline-flex text-current" whileTap={reduceMotion ? {} : { scale: 0.9 }}>
            <IconProfile className="w-[1.375rem] h-[1.375rem] sm:w-6 sm:h-6 shrink-0" />
          </motion.span>
          <span className="truncate max-w-full text-center leading-tight px-0.5">Profile</span>
        </NavLink>
      </div>
    </nav>
  )
}
