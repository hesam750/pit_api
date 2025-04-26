'use client'

import { motion } from 'framer-motion'
import SmartCarInsights from '@/components/insights/SmartCarInsights'
import { ArrowLeftIcon, TruckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Smart Car Insights
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitor your vehicle's health and maintenance needs
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TruckIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Toyota Camry 2020
              </span>
            </div>
          </div>

          {/* Insights Dashboard */}
          <SmartCarInsights />
        </motion.div>
      </div>
    </div>
  )
} 