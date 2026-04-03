/**
 * Map / tracking shapes — keep aligned with `KeyGoMobile/lib/map/types.ts`.
 * WGS84 for Mapbox (`mapbox-gl` / `@rnmapbox/maps`).
 */

export type LatLng = {
  latitude: number
  longitude: number
}

export type LatLngHeading = LatLng & {
  heading?: number
}

export type VehicleLocationSample = LatLngHeading & {
  recordedAt: string
}

export type LngLatBounds = {
  west: number
  south: number
  east: number
  north: number
}

export type MapRegion = {
  center: LatLng
  zoom: number
  pitch?: number
  bearing?: number
}
