'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { authenticatedApi } from '@/utils/api'
import { config } from '@/config'
import { useNotifications } from './NotificationsContext'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

interface Booking {
  id: string
  serviceId: string
  userId: string
  providerId: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  scheduledDate: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
  service?: Service
}

interface BookingContextType {
  bookings: Booking[]
  isLoading: boolean
  getBookings: () => Promise<void>
  createBooking: (data: {
    serviceId: string
    providerId: string
    scheduledDate: Date
    notes?: string
  }) => Promise<void>
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>
  cancelBooking: (bookingId: string) => Promise<void>
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification } = useNotifications()

  const getBookings = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data } = await authenticatedApi<{ bookings: Booking[] }>(
        config.api.endpoints.booking.list,
        token
      )
      setBookings(data.bookings)
    } catch (error) {
      addNotification('error', 'Failed to fetch bookings')
    } finally {
      setIsLoading(false)
    }
  }

  const createBooking = async (data: {
    serviceId: string
    providerId: string
    scheduledDate: Date
    notes?: string
  }) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data: newBooking } = await authenticatedApi<{ booking: Booking }>(
        config.api.endpoints.booking.create,
        token,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      )

      setBookings((prev) => [...prev, newBooking.booking])
      addNotification('success', 'Booking created successfully')
    } catch (error) {
      addNotification('error', 'Failed to create booking')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data: updatedBooking } = await authenticatedApi<{ booking: Booking }>(
        `${config.api.endpoints.booking.update}/${bookingId}`,
        token,
        {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }
      )

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? updatedBooking.booking : booking
        )
      )
      addNotification('success', 'Booking status updated')
    } catch (error) {
      addNotification('error', 'Failed to update booking status')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const cancelBooking = async (bookingId: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      await authenticatedApi(
        `${config.api.endpoints.booking.cancel}/${bookingId}`,
        token,
        {
          method: 'POST',
        }
      )

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      )
      addNotification('success', 'Booking cancelled successfully')
    } catch (error) {
      addNotification('error', 'Failed to cancel booking')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        isLoading,
        getBookings,
        createBooking,
        updateBookingStatus,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
} 