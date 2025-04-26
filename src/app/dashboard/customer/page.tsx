'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TruckIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  CogIcon,
  BellIcon,
  WalletIcon,
  ChatBubbleLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import ReferralDashboard from '@/components/referral/ReferralDashboard'
import LiveTracking from '@/components/tracking/LiveTracking'
import Link from 'next/link'
import ServicesGrid from '@/components/services/ServicesGrid'

// Mock data
const mockServices = [
  {
    id: 1,
    name: 'Car Wash',
    description: 'Professional exterior and interior cleaning',
    price: 25,
    duration: '30 mins',
  },
  {
    id: 2,
    name: 'Oil Change',
    description: 'Full synthetic oil change with filter',
    price: 45,
    duration: '45 mins',
  },
  {
    id: 3,
    name: 'Tire Replacement',
    description: 'Professional tire installation and balancing',
    price: 80,
    duration: '1 hour',
  },
  {
    id: 4,
    name: 'Brake Service',
    description: 'Brake pad replacement and inspection',
    price: 120,
    duration: '2 hours',
  },
]

const mockBookings = [
  {
    id: 1,
    service: 'Car Wash',
    date: '2024-02-15',
    time: '10:00 AM',
    status: 'completed',
    provider: 'AutoCare Pro',
    price: 25,
  },
  {
    id: 2,
    service: 'Oil Change',
    date: '2024-02-20',
    time: '02:30 PM',
    status: 'confirmed',
    provider: 'QuickLube',
    price: 45,
  },
]

const mockCars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    plate: 'ABC123',
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    plate: 'XYZ789',
  },
]

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<'book' | 'history' | 'cars'>('book')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof mockServices[0] | null>(null)
  const [bookingData, setBookingData] = useState({
    car: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    paymentMethod: 'online',
  })

  const handleBookService = (service: typeof mockServices[0]) => {
    setSelectedService(service)
    setIsBookingModalOpen(true)
  }

  const handleBookingSubmit = () => {
    // Mock booking submission
    setIsBookingModalOpen(false)
    setBookingData({
      car: '',
      date: '',
      time: '',
      location: '',
      notes: '',
      paymentMethod: 'online',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-7xl mx-auto"
          >
            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('book')}
                className={`pb-2 px-4 ${
                  activeTab === 'book'
                    ? 'text-red-600 border-b-2 border-red-600 dark:text-red-400 dark:border-red-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Book a Service
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2 px-4 ${
                  activeTab === 'history'
                    ? 'text-red-600 border-b-2 border-red-600 dark:text-red-400 dark:border-red-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Booking History
              </button>
              <button
                onClick={() => setActiveTab('cars')}
                className={`pb-2 px-4 ${
                  activeTab === 'cars'
                    ? 'text-red-600 border-b-2 border-red-600 dark:text-red-400 dark:border-red-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                My Cars
              </button>
            </div>

            {/* Book a Service Section */}
            {activeTab === 'book' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {mockServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Starting from</span>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ${service.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookService(service)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Booking History Section */}
            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {mockBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {booking.service}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{booking.provider}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{booking.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{booking.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCardIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">${booking.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* My Cars Section */}
            {activeTab === 'cars' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {mockCars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <TruckIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {car.year} {car.make} {car.model}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">Plate: {car.plate}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        View Service History
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Booking Modal */}
            {isBookingModalOpen && selectedService && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Book {selectedService.name}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Car
                      </label>
                      <select
                        value={bookingData.car}
                        onChange={(e) => setBookingData({ ...bookingData, car: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select a car</option>
                        {mockCars.map((car) => (
                          <option key={car.id} value={car.id}>
                            {car.year} {car.make} {car.model}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Time
                        </label>
                        <input
                          type="time"
                          value={bookingData.time}
                          onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={bookingData.location}
                          onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                          placeholder="Enter address or use current location"
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <MapPinIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        rows={3}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment Method
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="online"
                            checked={bookingData.paymentMethod === 'online'}
                            onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Online Payment</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="cash"
                            checked={bookingData.paymentMethod === 'cash'}
                            onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Cash on Delivery</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        onClick={() => setIsBookingModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBookingSubmit}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/insights"
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Smart Car Insights
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View vehicle health & maintenance
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/dashboard/support/report"
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Report a Problem
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submit issues or complaints
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          {/* ... existing code ... */}

          {/* Active Booking */}
          {activeTab === 'history' && mockBookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Active Service
              </h2>
              <LiveTracking />
            </motion.div>
          )}

          {/* Referral Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Refer & Earn
            </h2>
            <ReferralDashboard />
          </div>

          {/* Recent Bookings */}
          {/* ... existing code ... */}
        </div>
      </div>
    </div>
  )
} 