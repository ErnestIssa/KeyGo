import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { BrandedLoading } from '../components/ui/BrandedLoading'

type LoadingOverlayContextValue = {
  begin: () => void
  end: () => void
}

const LoadingOverlayContext = createContext<LoadingOverlayContextValue | null>(null)

export function LoadingOverlayProvider({ children }: { children: ReactNode }) {
  const depthRef = useRef(0)
  const [visible, setVisible] = useState(false)

  const begin = useCallback(() => {
    depthRef.current += 1
    if (depthRef.current === 1) setVisible(true)
  }, [])

  const end = useCallback(() => {
    depthRef.current = Math.max(0, depthRef.current - 1)
    if (depthRef.current === 0) setVisible(false)
  }, [])

  const value = useMemo(() => ({ begin, end }), [begin, end])

  return (
    <LoadingOverlayContext.Provider value={value}>
      {children}
      {visible ? <BrandedLoading fullscreen /> : null}
    </LoadingOverlayContext.Provider>
  )
}

export function useLoadingOverlay(): LoadingOverlayContextValue {
  const ctx = useContext(LoadingOverlayContext)
  if (!ctx) throw new Error('useLoadingOverlay must be used within LoadingOverlayProvider')
  return ctx
}

export function useSyncGlobalLoading(loading: boolean) {
  const { begin, end } = useLoadingOverlay()
  useEffect(() => {
    if (!loading) return
    begin()
    return () => end()
  }, [loading, begin, end])
}
