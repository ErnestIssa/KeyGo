export type UserRole = 'owner' | 'driver'

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  displayName?: string
  role: UserRole
  avatarUrl?: string
  /** 0–5 display rating from API */
  ratingAverage?: number
  /** Collected at signup */
  phone?: string
}

export type TripStatus = 'pending' | 'accepted' | 'completed'

export interface TripParty {
  id: string
  name: string
  email: string
}

export type TripVehicleLocation = {
  latitude: number
  longitude: number
  heading?: number
  recordedAt: string
}

export interface Trip {
  id: string
  pickupLocation: string
  dropoffLocation: string
  pickupLatitude?: number
  pickupLongitude?: number
  dropoffLatitude?: number
  dropoffLongitude?: number
  vehicleLocation?: TripVehicleLocation
  carDescription: string
  paymentAmount: number
  status: TripStatus
  createdAt: string
  owner?: TripParty
  driver?: TripParty
  /** From API — server-authoritative action flags */
  allowedActions?: { accept: boolean; complete: boolean }
}
