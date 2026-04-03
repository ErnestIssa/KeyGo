import { HomeMapLayout } from '../components/map/HomeMapLayout'

/**
 * Home: map-first shell. Overlay slots in `HomeMapLayout` are empty until live tracking UI ships.
 */
export default function HomePage() {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <HomeMapLayout />
    </div>
  )
}
