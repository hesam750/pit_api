'use client';

import { Booking } from '@/types/booking';
import { format } from 'date-fns';

interface BookingStatusProps {
  booking: Booking;
  onCancel?: () => void;
}

export default function BookingStatus({ booking, onCancel }: BookingStatusProps) {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
          <p className="text-sm text-gray-500">
            Booking ID: {booking.id}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{format(new Date(booking.date), 'PPP')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Time</p>
          <p className="font-medium">
            {format(new Date(booking.timeSlot.startTime), 'p')} - {format(new Date(booking.timeSlot.endTime), 'p')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment Status</p>
          <p className="font-medium">
            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-medium">${booking.totalAmount.toFixed(2)}</p>
        </div>
        {booking.notes && (
          <div>
            <p className="text-sm text-gray-500">Notes</p>
            <p className="font-medium">{booking.notes}</p>
          </div>
        )}
      </div>

      {booking.status === 'pending' && onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
} 