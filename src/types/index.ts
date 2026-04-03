export type UserRole = 'owner' | 'driver'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  /** 0–5 display rating from API */
  ratingAverage?: number
}

export type TripStatus = 'pending' | 'accepted' | 'completed'

export interface TripParty {
  id: string
  name: string
  email: string
}

export interface Trip {
  id: string
  pickupLocation: string
  dropoffLocation: string
  carDescription: string
  paymentAmount: number
  status: TripStatus
  createdAt: string
  owner?: TripParty
  driver?: TripParty
  /** From API — server-authoritative action flags */
  allowedActions?: { accept: boolean; complete: boolean }
}
