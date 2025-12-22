// Type definitions for Keygo app

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  licenseNumber?: string
  role?: 'owner' | 'driver' | 'both'
}

export interface Request {
  id: string
  ownerId: string
  driverId?: string
  from: string
  to: string
  date: string
  time: string
  notes?: string
  insuranceCompany: string
  deductibleAmount: number
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
}

export interface AgreementState {
  driverAcknowledged: boolean
  ownerAcknowledged: boolean
}

export interface Message {
  id: string
  requestId: string
  senderId: string
  content: string
  timestamp: string
}

export interface Rating {
  id: string
  requestId: string
  fromUserId: string
  toUserId: string
  rating: number
  comment?: string
  createdAt: string
}

