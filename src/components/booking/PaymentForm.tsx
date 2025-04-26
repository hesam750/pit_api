'use client';

import { useState } from 'react';
import { PaymentMethod } from '@/types/booking';

interface PaymentFormProps {
  amount: number;
  onPaymentComplete: (paymentMethod: PaymentMethod) => void;
}

export default function PaymentForm({ amount, onPaymentComplete }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod['type']>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentMethod: PaymentMethod = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedMethod,
      details: {
        cardNumber,
        expiryDate,
        cvv,
      },
    };

    onPaymentComplete(paymentMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod['type'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>

      {selectedMethod === 'credit_card' || selectedMethod === 'debit_card' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-600">
            {selectedMethod === 'paypal'
              ? 'You will be redirected to PayPal to complete your payment'
              : 'Please use the following bank details for your transfer'}
          </p>
          {selectedMethod === 'bank_transfer' && (
            <div className="mt-4 text-left">
              <p className="text-sm text-gray-500">Bank Name: Example Bank</p>
              <p className="text-sm text-gray-500">Account Number: 1234567890</p>
              <p className="text-sm text-gray-500">Sort Code: 12-34-56</p>
            </div>
          )}
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Amount</span>
          <span className="text-lg font-semibold">${amount.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Pay Now
      </button>
    </form>
  );
} 