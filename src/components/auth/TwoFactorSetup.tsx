'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTwoFactor } from '@/context/TwoFactorContext'
import { ShieldCheckIcon, QrCodeIcon } from '@heroicons/react/24/outline'

export default function TwoFactorSetup() {
  const { setup2FA, verify2FA, is2FASetupComplete } = useTwoFactor()
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')

  const handleSetup = async () => {
    try {
      await setup2FA()
    } catch (error) {
      setError('Failed to setup 2FA. Please try again.')
    }
  }

  const handleVerify = async () => {
    try {
      const isValid = await verify2FA(verificationCode)
      if (!isValid) {
        setError('Invalid verification code. Please try again.')
      }
    } catch (error) {
      setError('Failed to verify code. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ShieldCheckIcon className="h-6 w-6 text-red-500" />
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
      </div>

      {!is2FASetupComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Enhance your account security by enabling two-factor authentication.
            You'll need to scan a QR code with your authenticator app.
          </p>
          <button
            onClick={handleSetup}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <QrCodeIcon className="h-5 w-5" />
            <span>Setup 2FA</span>
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Please enter the verification code from your authenticator app.
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <button
              onClick={handleVerify}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Verify Code
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
} 