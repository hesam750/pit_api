'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  PaymentMethod,
  Transaction,
  Wallet,
  PaymentMethodDetails,
  PaymentRequest,
  WithdrawalRequest,
  PaymentResponse,
} from '@/types/payment';

interface PaymentContextType {
  wallet: Wallet | null;
  paymentMethods: PaymentMethodDetails[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addPaymentMethod: (method: Omit<PaymentMethodDetails, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  makePayment: (request: PaymentRequest) => Promise<PaymentResponse>;
  withdrawFunds: (request: WithdrawalRequest) => Promise<PaymentResponse>;
  getTransactions: (page?: number, limit?: number) => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDetails[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      refreshWallet();
      fetchPaymentMethods();
      getTransactions();
    }
  }, [user]);

  const refreshWallet = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment/wallet');
      if (!response.ok) throw new Error('Failed to fetch wallet');
      const data = await response.json();
      setWallet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment/methods');
      if (!response.ok) throw new Error('Failed to fetch payment methods');
      const data = await response.json();
      setPaymentMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethodDetails, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method),
      });
      if (!response.ok) throw new Error('Failed to add payment method');
      await fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removePaymentMethod = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/payment/methods/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove payment method');
      await fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove payment method');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const makePayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Payment failed');
      const data = await response.json();
      await refreshWallet();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (request: WithdrawalRequest): Promise<PaymentResponse> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Withdrawal failed');
      const data = await response.json();
      await refreshWallet();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactions = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/payment/transactions?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        wallet,
        paymentMethods,
        transactions,
        isLoading,
        error,
        addPaymentMethod,
        removePaymentMethod,
        makePayment,
        withdrawFunds,
        getTransactions,
        refreshWallet,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
} 