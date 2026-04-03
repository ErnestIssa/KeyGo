import { useState } from 'react'
import { motion } from 'framer-motion'
import { switchRole, ApiError } from '../../lib/api'
import {
  ROLE_CONFIRM_DRIVER,
  ROLE_CONFIRM_OWNER,
  ROLE_INFO_DRIVER_BODY,
  ROLE_INFO_DRIVER_TITLE,
  ROLE_INFO_OWNER_BODY,
  ROLE_INFO_OWNER_TITLE,
} from '../../lib/roleModeCopy'
import type { User, UserRole } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'

type AppRole = UserRole

type Props = {
  user: User | null
  onSwitched: (user: User) => void
}

function InfoIcon({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--brand)] text-[10px] font-extrabold text-[var(--brand)] hover:bg-[var(--brand-soft)] transition-colors"
      aria-label={label}
    >
      i
    </button>
  )
}

export function RoleModePanel({ user, onSwitched }: Props) {
  const [confirmTarget, setConfirmTarget] = useState<AppRole | null>(null)
  const [infoOpen, setInfoOpen] = useState<AppRole | null>(null)
  const [busy, setBusy] = useState(false)

  if (!user || (user.role !== 'owner' && user.role !== 'driver')) return null

  const active: AppRole = user.role

  const openConfirm = (target: AppRole) => {
    if (target === active) return
    setConfirmTarget(target)
  }

  const runSwitch = async () => {
    if (!confirmTarget) return
    setBusy(true)
    try {
      const { user: next } = await switchRole(confirmTarget)
      setConfirmTarget(null)
      onSwitched(next)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not update role'
      window.alert(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Modal
        open={infoOpen !== null}
        title={infoOpen === 'owner' ? ROLE_INFO_OWNER_TITLE : ROLE_INFO_DRIVER_TITLE}
        onClose={() => setInfoOpen(null)}
        footer={
          <div className="px-5 pb-5 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setInfoOpen(null)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
          {infoOpen === 'owner' ? ROLE_INFO_OWNER_BODY : infoOpen === 'driver' ? ROLE_INFO_DRIVER_BODY : null}
        </div>
      </Modal>

      <Modal
        open={confirmTarget !== null}
        title="Switch role mode?"
        onClose={() => !busy && setConfirmTarget(null)}
        footer={
          <div className="px-5 pb-5 pt-2 flex flex-col gap-2">
            <Button type="button" variant="primary" fullWidth loading={busy} onClick={() => void runSwitch()}>
              Confirm switch
            </Button>
            <Button type="button" variant="secondary" fullWidth disabled={busy} onClick={() => setConfirmTarget(null)}>
              Cancel
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
          {confirmTarget === 'owner' ? ROLE_CONFIRM_OWNER : confirmTarget === 'driver' ? ROLE_CONFIRM_DRIVER : null}
        </p>
      </Modal>

      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-2 ml-1">Role mode</p>
        <Card className="p-4 space-y-4">
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            One account — switch between listing relocations (Owner) and completing them (Driver). Your email and password stay the same; the server updates your active mode.
          </p>

          <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-1 min-h-[5.5rem]">
            <motion.div
              className="absolute top-1 bottom-1 rounded-xl bg-[var(--brand-soft)] border border-[var(--brand)] pointer-events-none"
              initial={false}
              style={{ width: 'calc(50% - 6px)' }}
              animate={{ left: active === 'owner' ? 4 : 'calc(50% + 2px)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            />
            <div className="relative grid grid-cols-2 gap-0 z-[1]">
              <button
                type="button"
                onClick={() => openConfirm('owner')}
                className="flex flex-col items-stretch gap-1 px-3 py-3 text-left rounded-xl min-h-[4.75rem] justify-center hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-base font-extrabold ${active === 'owner' ? 'text-[var(--brand)]' : 'text-[var(--text)]'}`}>
                    Owner
                  </span>
                  <InfoIcon label="About Owner mode" onClick={() => setInfoOpen('owner')} />
                </span>
                <span className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-2">Post trips & manage listings</span>
              </button>
              <button
                type="button"
                onClick={() => openConfirm('driver')}
                className="flex flex-col items-stretch gap-1 px-3 py-3 text-left rounded-xl min-h-[4.75rem] justify-center hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-base font-extrabold ${active === 'driver' ? 'text-[var(--brand)]' : 'text-[var(--text)]'}`}>
                    Driver
                  </span>
                  <InfoIcon label="About Driver mode" onClick={() => setInfoOpen('driver')} />
                </span>
                <span className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-2">Browse & accept relocations</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Active:{' '}
            <span className="font-bold capitalize text-[var(--brand)]">{active}</span>
          </p>
        </Card>
      </div>
    </>
  )
}
