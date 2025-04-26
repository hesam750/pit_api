'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTwoFactor } from '@/context/TwoFactorContext'
import { EnvelopeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

interface OTPVerificationProps {
  onVerified: () => void
}

export default function OTPVerification({ onVerified }: OTPVerificationProps) {
  const { sendOTP, verifyOTP } = useTwoFactor()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email'>('sms')
  const [isSending, setIsSending] = useState(false)

  const handleSendOTP = async () => {
    try {
      setIsSending(true)
      await sendOTP(selectedMethod)
    } catch (error) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleVerifyOTP = async () => {
    try {
      const isValid = await verifyOTP(otp)
      if (isValid) {
        onVerified()
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedMethod('sms')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              selectedMethod === 'sms'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <DevicePhoneMobileIcon className="h-5 w-5" />
            <span>SMS</span>
          </button>
          <button
            onClick={() => setSelectedMethod('email')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              selectedMethod === 'email'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <EnvelopeIcon className="h-5 w-5" />
            <span>Email</span>
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleSendOTP}
            disabled={isSending}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Send OTP'}
          </button>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600"
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            onClick={handleVerifyOTP}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  )
} 