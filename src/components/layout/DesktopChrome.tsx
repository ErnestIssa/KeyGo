import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { clearSession, getStoredUser } from '../../lib/authStorage'
import { useTheme } from '../../theme/ThemeContext'
import { IconActivity, IconCar, IconHome, IconMyTrips, IconProfile } from './navIcons'

function isTripDetailPath(pathname: string) {
  return /^\/trips\/(?!new$|available$|mine$)[^/]+$/.test(pathname)
}

const linkBase =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors min-h-[44px] border border-transparent'
const linkIdle = 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]'
const linkActive = 'text-[var(--brand)] bg-[var(--brand-soft)] border-[var(--border)]'

export function DesktopChrome() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = getStoredUser()
  const { theme, toggleTheme } = useTheme()
  const isOwner = user?.role === 'owner'

  const mineSectionActive = pathname === '/trips/mine' || isTripDetailPath(pathname)
  const createActive = isOwner ? pathname === '/trips/new' : pathname === '/trips/available'
  const profileSectionActive = pathname === '/profile' || pathname.startsWith('/profile/')

  return (
    <header className="hidden lg:flex shrink-0 flex-col border-b border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="w-full flex items-center justify-between gap-6 px-8 xl:px-12 2xl:px-16 min-h-[4.25rem] py-2">
        <NavLink
          to="/home"
          className="font-bold text-[var(--text)] tracking-tight text-xl shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] rounded-lg"
        >
          Key<span className="text-[var(--accent)]">Go</span>
        </NavLink>

        <nav
          className="flex flex-1 items-center justify-center gap-1 xl:gap-2 flex-wrap lg:px-4"
          aria-label="Primary"
        >
          <DesktopNavLink to="/home" end label="Home" icon={<IconHome className="w-[1.125rem] h-[1.125rem]" />} />
          <DesktopNavLink
            to="/trips/mine"
            label="My trips"
            icon={<IconMyTrips className="w-[1.125rem] h-[1.125rem]" />}
            alsoActive={mineSectionActive}
          />
          {isOwner ? (
            <DesktopNavLink
              to="/trips/new"
              label="Create trip"
              icon={<IconCar className="w-[1.125rem] h-[1.125rem]" />}
              highlight
              alsoActive={createActive}
            />
          ) : (
            <DesktopNavLink
              to="/trips/available"
              label="Available trips"
              icon={<IconCar className="w-[1.125rem] h-[1.125rem]" />}
              highlight
              alsoActive={createActive}
            />
          )}
          <DesktopNavLink
            to="/activity"
            label="Activity"
            icon={<IconActivity className="w-[1.125rem] h-[1.125rem]" />}
          />
          <DesktopNavLink
            to="/profile"
            label="Profile"
            icon={<IconProfile className="w-[1.125rem] h-[1.125rem]" />}
            alsoActive={profileSectionActive}
          />
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm min-h-[44px] min-w-[44px] text-[var(--text)] hover:bg-[var(--bg-subtle)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            onClick={() => {
              clearSession()
              navigate('/', { replace: true })
            }}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)] min-h-[44px] border border-transparent hover:border-[var(--danger)]/20"
          >
            Log out
          </button>
        </div>
      </div>
      <p className="hidden xl:block text-center text-[11px] text-[var(--text-muted)] pb-2.5 px-8 border-t border-[var(--border)]/50 bg-[var(--bg-subtle)]/25 leading-relaxed">
        Desktop — full workspace for setup and planning. Use your phone with the bottom bar when you&apos;re on the go.
      </p>
    </header>
  )
}

function DesktopNavLink({
  to,
  end,
  label,
  icon,
  highlight,
  alsoActive,
}: {
  to: string
  end?: boolean
  label: string
  icon: ReactNode
  highlight?: boolean
  alsoActive?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => {
        const on = isActive || alsoActive
        return [
          linkBase,
          on ? linkActive : linkIdle,
          highlight && on ? 'ring-2 ring-[var(--brand)]/30' : '',
        ]
          .filter(Boolean)
          .join(' ')
      }}
    >
      <span className="inline-flex items-center gap-2">
        <span className="opacity-90">{icon}</span>
        {label}
      </span>
    </NavLink>
  )
}
