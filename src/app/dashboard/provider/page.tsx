'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon, XMarkIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

const serviceRequests = [
  {
    id: 1,
    customer: 'John Doe',
    service: 'Mobile Carwash',
    date: '2024-04-20',
    time: '10:00 AM',
    address: '123 Main St, City',
    status: 'Pending',
  },
  {
    id: 2,
    customer: 'Jane Smith',
    service: 'Oil Change',
    date: '2024-04-21',
    time: '02:00 PM',
    address: '456 Oak Ave, Town',
    status: 'Pending',
  },
]

const earnings = {
  today: '$250',
  thisWeek: '$1,250',
  thisMonth: '$5,000',
}

export default function ProviderDashboard() {
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)

  const handleAccept = (id: number) => {
    // In a real app, this would update the backend
    console.log(`Accepted request ${id}`)
  }

  const handleReject = (id: number) => {
    // In a real app, this would update the backend
    console.log(`Rejected request ${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Service Provider Dashboard</h1>

          {/* Earnings Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Earnings Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Today's Earnings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{earnings.today}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <CalendarIcon className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{earnings.thisWeek}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{earnings.thisMonth}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Service Requests */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Service Requests</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {serviceRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {request.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {request.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {request.date} at {request.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {request.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAccept(request.id)}
                            className="p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(request.id)}
                            className="p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full hover:bg-red-200 dark:hover:bg-red-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  )
} 