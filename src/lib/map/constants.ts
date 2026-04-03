import type { LatLng, MapRegion } from './types'

export const DEFAULT_MAP_CENTER: LatLng = {
  latitude: 39.8283,
  longitude: -98.5795,
}

export const DEFAULT_MAP_ZOOM = 3.5

export const DEFAULT_MAP_REGION: MapRegion = {
  center: DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
}
