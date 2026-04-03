import type { ReactNode } from 'react'
import { MapPlaceholder } from './MapPlaceholder'

type Props = {
  map?: ReactNode
  topBar?: ReactNode
  bottomSheet?: ReactNode
  floatingActions?: ReactNode
}

/**
 * Full-bleed map host: map layer + overlay slots (top bar, bottom sheet, FAB).
 * Bottom padding clears the mobile nav pill; matches `Layout` scroll padding.
 */
export function HomeMapLayout({ map, topBar, bottomSheet, floatingActions }: Props) {
  const bottomPad = 'calc(4.5rem + env(safe-area-inset-bottom, 0px) + 20px)'

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 lg:min-h-[min(70vh,52rem)]">
      <div className="absolute inset-0 z-0">{map ?? <MapPlaceholder />}</div>

      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col"
        style={{ paddingBottom: bottomPad }}
      >
        <div className="pointer-events-none flex w-full shrink-0 flex-col pt-[max(0.5rem,env(safe-area-inset-top))]">
          {topBar != null ? (
            <div className="pointer-events-auto px-4">{topBar}</div>
          ) : (
            <div className="min-h-[44px] w-full shrink-0" aria-hidden />
          )}
        </div>

        <div className="min-h-0 flex-1" />

        <div className="pointer-events-none w-full shrink-0 px-4">
          {bottomSheet != null ? (
            <div className="pointer-events-auto">{bottomSheet}</div>
          ) : (
            <div className="min-h-14 w-full shrink-0" aria-hidden />
          )}
        </div>
      </div>

      {floatingActions != null ? (
        <div
          className="pointer-events-none absolute right-4 z-20"
          style={{ bottom: `calc(${bottomPad} + 0.5rem)` }}
        >
          <div className="pointer-events-auto">{floatingActions}</div>
        </div>
      ) : null}
    </div>
  )
}
