'use client';

import { useState } from 'react';
import { usePayment } from '@/context/PaymentContext';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function Wallet() {
  const { wallet, paymentMethods, isLoading, makePayment, withdrawFunds } = usePayment();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      if (action === 'deposit') {
        await makePayment({
          amount: numericAmount,
          paymentMethod: selectedMethod as any,
          description: 'Wallet deposit',
        });
      } else {
        await withdrawFunds({
          amount: numericAmount,
          paymentMethod: selectedMethod as any,
          paymentMethodId: selectedMethod,
          description: 'Wallet withdrawal',
        });
      }
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Wallet Balance</h2>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              ${wallet?.balance.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="rounded-full bg-green-100 p-3">
            <BanknotesIcon className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Transaction Form */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex space-x-4">
          <button
            onClick={() => setAction('deposit')}
            className={`flex-1 rounded-lg px-4 py-2 text-center ${
              action === 'deposit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PlusIcon className="mx-auto h-5 w-5" />
            <span className="mt-1 block text-sm font-medium">Deposit</span>
          </button>
          <button
            onClick={() => setAction('withdraw')}
            className={`flex-1 rounded-lg px-4 py-2 text-center ${
              action === 'withdraw'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowDownTrayIcon className="mx-auto h-5 w-5" />
            <span className="mt-1 block text-sm font-medium">Withdraw</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a payment method</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.type === 'credit_card'
                    ? `Credit Card (****${method.lastFourDigits})`
                    : method.type === 'bank_transfer'
                    ? `Bank Transfer (${method.bankName})`
                    : method.type === 'upi'
                    ? `UPI (${method.upiId})`
                    : 'Wallet'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {action === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </button>
        </form>
      </div>

      {/* Add Payment Method Button */}
      <button
        onClick={() => {/* TODO: Implement add payment method modal */}}
        className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <CreditCardIcon className="h-5 w-5" />
        <span>Add Payment Method</span>
      </button>
    </div>
  );
} 