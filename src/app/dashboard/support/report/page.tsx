'use client'

import { motion } from 'framer-motion'
import ReportProblem from '@/components/support/ReportProblem'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ReportProblemPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Report a Problem
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submit an issue or complaint about your service
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-600 dark:text-blue-400">
              Our support team is available 24/7 to help you. For immediate assistance, please call{' '}
              <a href="tel:+1234567890" className="font-medium hover:underline">
                +1 (234) 567-890
              </a>
              .
            </p>
          </div>

          {/* Report Form */}
          <ReportProblem />
        </motion.div>
      </div>
    </div>
  )
} 