export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isVerified: boolean;
  rating: number;
  totalTrips: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarRequest {
  id: string;
  ownerId: string;
  driverId?: string;
  title: string;
  description: string;
  pickupLocation: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  dropoffLocation: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  proposedPayment: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  scheduledTime?: Date;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
}

export interface Trip {
  id: string;
  requestId: string;
  driverId: string;
  startTime: Date;
  endTime?: Date;
  route: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  }[];
  status: 'started' | 'in_progress' | 'completed' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'location';
}

export interface Payment {
  id: string;
  requestId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  stripePaymentIntentId?: string;
  swishTransactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Review {
  id: string;
  requestId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}
