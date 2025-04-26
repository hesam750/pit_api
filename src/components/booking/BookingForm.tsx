'use client';

import { useState } from 'react';
import { Service, TimeSlot, Booking } from '@/types/booking';
import { format } from 'date-fns';

interface BookingFormProps {
  services: Service[];
  onSubmit: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function BookingForm({ services, onSubmit }: BookingFormProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTimeSlot) return;

    onSubmit({
      serviceId: selectedService.id,
      customerId: 'current-user-id', // This should come from auth context
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      status: 'pending',
      paymentStatus: 'pending',
      totalAmount: selectedService.price,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Service</label>
        <select
          value={selectedService?.id || ''}
          onChange={(e) => {
            const service = services.find(s => s.id === e.target.value);
            setSelectedService(service || null);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Choose a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - ${service.price}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Select Date</label>
        <input
          type="date"
          value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          min={format(new Date(), 'yyyy-MM-dd')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Select Time Slot</label>
        <select
          value={selectedTimeSlot ? format(selectedTimeSlot.startTime, 'HH:mm') : ''}
          onChange={(e) => {
            // This would be populated with actual available time slots
            const timeSlot: TimeSlot = {
              startTime: new Date(selectedDate!),
              endTime: new Date(selectedDate!),
              isAvailable: true,
            };
            setSelectedTimeSlot(timeSlot);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Choose a time slot</option>
          {/* Time slots would be dynamically generated here */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={!selectedService || !selectedDate || !selectedTimeSlot}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        Book Now
      </button>
    </form>
  );
} 