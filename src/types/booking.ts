export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  date: Date;
  timeSlot: TimeSlot;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  details: Record<string, any>;
}

export interface BookingNotification {
  id: string;
  bookingId: string;
  type: 'confirmation' | 'reminder' | 'status_update';
  message: string;
  sentAt: Date;
  read: boolean;
} 