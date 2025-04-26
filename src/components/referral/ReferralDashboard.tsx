'use client'

import { useReferral } from './ReferralProvider'
import { motion } from 'framer-motion'
import {
  ShareIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export default function ReferralDashboard() {
  const {
    referralCode,
    totalEarnings,
    availableCredit,
    referrals,
    shareReferralLink,
    copyReferralCode,
  } = useReferral()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral Code</h3>
          <div className="mt-2 flex items-center space-x-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{referralCode}</p>
            <button
              onClick={copyReferralCode}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            ${totalEarnings}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Credit</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            ${availableCredit}
          </p>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Invite Friends & Earn
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Share your referral code with friends and earn $10 for each friend who joins and completes
          their first service.
        </p>
        <button
          onClick={shareReferralLink}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ShareIcon className="h-5 w-5 mr-2" />
          Share Referral Link
        </button>
      </div>

      {/* Referral History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Referral History
        </h3>
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(referral.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {referral.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {referral.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(referral.status)}`}
                >
                  {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  +${referral.reward}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 