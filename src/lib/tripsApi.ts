import { api } from './api'
import type { Trip } from '../types'

export type UpdateVehicleLocationBody = {
  latitude: number
  longitude: number
  heading?: number
}

/** PATCH /api/trips/:id/vehicle-location — assigned driver, accepted trip only. */
export async function updateTripVehicleLocation(
  tripId: string,
  body: UpdateVehicleLocationBody
): Promise<{ trip: Trip }> {
  return api<{ trip: Trip }>(`/trips/${encodeURIComponent(tripId)}/vehicle-location`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
