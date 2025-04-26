export type PaymentMethod = 'wallet' | 'credit_card' | 'bank_transfer' | 'upi';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund';

export interface PaymentMethodDetails {
  id: string;
  type: PaymentMethod;
  isDefault: boolean;
  lastFourDigits?: string;
  expiryDate?: string;
  bankName?: string;
  upiId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  paymentMethodId?: string;
  description: string;
  referenceId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodId?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface WithdrawalRequest {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodId: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: TransactionStatus;
  message: string;
  redirectUrl?: string;
} 