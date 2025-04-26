'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Service, services } from '@/data/services'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const serviceId = searchParams.get('service')
    if (serviceId) {
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        setSelectedService(service)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/booking')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement booking submission
    console.log('Booking submitted:', {
      service: selectedService,
      date,
      time,
      notes,
    })
  }

  if (!selectedService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Service Selected</h1>
          <p className="text-gray-600 mb-4">
            Please select a service to book an appointment.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Book Your Service</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {selectedService.title}
              </h2>
              <p className="text-gray-600 mb-4">{selectedService.description}</p>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-500">Price Range</p>
                  <p className="text-lg font-semibold">
                    {selectedService.price.min} - {selectedService.price.max}{' '}
                    {selectedService.price.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Time</p>
                  <p className="text-sm font-medium">
                    {selectedService.estimatedTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-4xl">{selectedService.icon}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Any special requirements or notes for the service provider..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  )
} 