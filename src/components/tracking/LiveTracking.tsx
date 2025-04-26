'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { MapPinIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/outline'

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/map/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
  ),
})

interface Location {
  lat: number
  lng: number
  timestamp: number
}

interface ServiceProvider {
  id: string
  name: string
  vehicle: string
  phone: string
  location: Location
  eta: number // in minutes
}

export default function LiveTracking() {
  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockProvider: ServiceProvider = {
      id: '1',
      name: 'John Smith',
      vehicle: 'Toyota Camry',
      phone: '+1 (555) 123-4567',
      location: {
        lat: 37.7749,
        lng: -122.4194,
        timestamp: Date.now(),
      },
      eta: 15,
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      setProvider((prev) => {
        if (!prev) return mockProvider
        return {
          ...prev,
          location: {
            ...prev.location,
            lat: prev.location.lat + 0.001,
            lng: prev.location.lng + 0.001,
            timestamp: Date.now(),
          },
          eta: Math.max(0, prev.eta - 1),
        }
      })
    }, 10000) // Update every 10 seconds

    setProvider(mockProvider)
    setIsLoading(false)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <p className="text-yellow-600 dark:text-yellow-400">
          No service provider assigned yet
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Map Display */}
      <div className="h-[400px] rounded-lg overflow-hidden">
        <Map
          center={[provider.location.lat, provider.location.lng]}
          zoom={15}
          markers={[
            {
              position: [provider.location.lat, provider.location.lng],
              title: provider.name,
              description: provider.vehicle,
            },
          ]}
        />
      </div>

      {/* Provider Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TruckIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Service Provider</p>
              <p className="font-medium text-gray-900 dark:text-white">{provider.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle</p>
              <p className="font-medium text-gray-900 dark:text-white">{provider.vehicle}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <ClockIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Arrival</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {provider.eta} minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <div className="flex justify-center">
        <a
          href={`tel:${provider.phone}`}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Call Service Provider
        </a>
      </div>
    </motion.div>
  )
} 