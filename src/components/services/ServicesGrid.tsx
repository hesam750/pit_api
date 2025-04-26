'use client'

import { Service, services } from '@/data/services'
import ServiceCard from './ServiceCard'
import { useState } from 'react'

interface ServicesGridProps {
  showPopularOnly?: boolean
  className?: string
}

export default function ServicesGrid({
  showPopularOnly = false,
  className = '',
}: ServicesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredServices = services.filter((service) => {
    if (showPopularOnly && !service.isPopular) return false
    if (selectedCategory && service.category !== selectedCategory) return false
    return true
  })

  const categories = Array.from(new Set(services.map((s) => s.category)))

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Services
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
} 