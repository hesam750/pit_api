'use client'

import { Service } from '@/data/services'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface ServiceCardProps {
  service: Service
  className?: string
}

export default function ServiceCard({ service, className = '' }: ServiceCardProps) {
  const router = useRouter()

  const handleBookNow = () => {
    router.push(`/booking?service=${service.id}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-4xl">{service.icon}</div>
          {service.isPopular && (
            <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
              Popular
            </span>
          )}
        </div>
        
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          {service.title}
        </h3>
        
        <p className="mt-2 text-gray-600">{service.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Price Range</p>
            <p className="text-lg font-semibold text-gray-900">
              {service.price.min} - {service.price.max} {service.price.currency}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-sm font-medium text-gray-900">
              {service.estimatedTime}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleBookNow}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  )
} 