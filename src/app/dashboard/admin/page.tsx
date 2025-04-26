'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

// Mock data for demonstration
const mockStats = {
  totalUsers: 1250,
  activeProviders: 85,
  pendingVerifications: 12,
  activeSOS: 3,
  unresolvedReports: 8,
  totalBookings: 450,
  totalRevenue: 12500,
}

const mockRecentActivity = [
  {
    id: 1,
    type: 'verification',
    title: 'New Provider Verification',
    description: 'John Doe submitted verification documents',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: 2,
    type: 'sos',
    title: 'Emergency Request',
    description: 'Flat tire assistance needed',
    time: '1 hour ago',
    status: 'active',
  },
  {
    id: 3,
    type: 'report',
    title: 'User Report',
    description: 'Service quality complaint',
    time: '30 minutes ago',
    status: 'unresolved',
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'active':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'unresolved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage platform operations and monitor activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Providers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.activeProviders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active SOS</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.activeSOS}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${mockStats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <button className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Verify Providers</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mockStats.pendingVerifications} pending</p>
            </div>
          </div>
        </button>

        <button className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage SOS</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mockStats.activeSOS} active requests</p>
            </div>
          </div>
        </button>

        <button className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BellIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Handle Reports</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mockStats.unresolvedReports} unresolved</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {mockRecentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {activity.type === 'verification' && (
                    <ShieldCheckIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                  {activity.type === 'sos' && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                  {activity.type === 'report' && (
                    <BellIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(activity.status)}`}
                >
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 