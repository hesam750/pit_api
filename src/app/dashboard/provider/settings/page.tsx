'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTwoFactor } from '@/context/TwoFactorContext'
import TwoFactorSetup from '@/components/auth/TwoFactorSetup'
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline'

export default function SecuritySettings() {
  const { is2FAEnabled, disable2FA } = useTwoFactor()
  const [showDisableConfirmation, setShowDisableConfirmation] = useState(false)

  const handleDisable2FA = async () => {
    try {
      await disable2FA()
      setShowDisableConfirmation(false)
    } catch (error) {
      console.error('Failed to disable 2FA:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {is2FAEnabled
                  ? '2FA is currently enabled for your account'
                  : 'Add an extra layer of security to your account'}
              </p>
            </div>
            {is2FAEnabled ? (
              <button
                onClick={() => setShowDisableConfirmation(true)}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700"
              >
                <ShieldExclamationIcon className="h-5 w-5" />
                <span>Disable 2FA</span>
              </button>
            ) : null}
          </div>

          {!is2FAEnabled && <TwoFactorSetup />}

          {showDisableConfirmation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to disable two-factor authentication? This
                will make your account less secure.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDisable2FA}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Yes, Disable 2FA
                </button>
                <button
                  onClick={() => setShowDisableConfirmation(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 