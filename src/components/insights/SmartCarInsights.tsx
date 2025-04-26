'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  WrenchIcon,
  Battery0Icon,
  BeakerIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface MaintenanceItem {
  id: string
  type: 'oil' | 'battery' | 'tire' | 'brake' | 'filter' | 'other'
  name: string
  status: 'good' | 'needs_attention' | 'urgent'
  lastServiceDate: Date
  nextServiceDate: Date
  mileage: number
  description: string
}

interface VehicleHealth {
  overall: 'good' | 'needs_attention' | 'urgent'
  engine: 'good' | 'needs_attention' | 'urgent'
  transmission: 'good' | 'needs_attention' | 'urgent'
  brakes: 'good' | 'needs_attention' | 'urgent'
  tires: 'good' | 'needs_attention' | 'urgent'
}

const mockMaintenanceItems: MaintenanceItem[] = [
  {
    id: '1',
    type: 'oil',
    name: 'Engine Oil Change',
    status: 'needs_attention',
    lastServiceDate: new Date('2023-12-01'),
    nextServiceDate: new Date('2024-03-01'),
    mileage: 45000,
    description: 'Next oil change due in 500 miles or by March 1st',
  },
  {
    id: '2',
    type: 'battery',
    name: 'Battery Check',
    status: 'good',
    lastServiceDate: new Date('2023-11-15'),
    nextServiceDate: new Date('2024-05-15'),
    mileage: 45000,
    description: 'Battery health is good, next check due in 6 months',
  },
  {
    id: '3',
    type: 'tire',
    name: 'Tire Rotation',
    status: 'urgent',
    lastServiceDate: new Date('2023-09-01'),
    nextServiceDate: new Date('2024-01-01'),
    mileage: 45000,
    description: 'Tire rotation overdue, schedule service soon',
  },
]

const mockVehicleHealth: VehicleHealth = {
  overall: 'needs_attention',
  engine: 'good',
  transmission: 'good',
  brakes: 'needs_attention',
  tires: 'urgent',
}

export default function SmartCarInsights() {
  const [maintenanceItems] = useState<MaintenanceItem[]>(mockMaintenanceItems)
  const [vehicleHealth] = useState<VehicleHealth>(mockVehicleHealth)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircleIcon className="h-5 w-5" />
      case 'needs_attention':
        return <ExclamationCircleIcon className="h-5 w-5" />
      case 'urgent':
        return <ClockIcon className="h-5 w-5" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'oil':
        return <BeakerIcon className="h-5 w-5" />
      case 'battery':
        return <Battery0Icon className="h-5 w-5" />
      default:
        return <WrenchIcon className="h-5 w-5" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Vehicle Health Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Vehicle Health Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(vehicleHealth).map(([key, status]) => (
            <div
              key={key}
              className={`p-4 rounded-lg ${getStatusColor(status)}`}
            >
              <div className="flex items-center space-x-2">
                {getStatusIcon(status)}
                <span className="font-medium capitalize">
                  {key.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Maintenance Schedule
        </h3>
        <div className="space-y-4">
          {maintenanceItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Last service: {item.lastServiceDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    <span className="ml-1">
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Service History
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mileage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {maintenanceItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.lastServiceDate.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.mileage.toLocaleString()} miles
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      <span className="ml-1">
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
} 