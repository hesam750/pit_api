'use client'

import { useEffect, useState } from 'react'
import { useNotifications } from '@/context/NotificationsContext'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Notifications() {
  const { notifications, removeNotification } = useNotifications()
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([])

  useEffect(() => {
    // Show new notifications with a delay
    const newNotifications = notifications
      .filter(n => !visibleNotifications.includes(n.id))
      .map(n => n.id)

    if (newNotifications.length > 0) {
      const timer = setTimeout(() => {
        setVisibleNotifications(prev => [...prev, ...newNotifications])
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [notifications, visibleNotifications])

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`${
            visibleNotifications.includes(notification.id)
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
          } transform transition-all duration-300 ease-in-out`}
        >
          <div
            className={`flex items-center justify-between p-4 rounded-lg shadow-lg min-w-[300px] ${
              notification.type === 'success'
                ? 'bg-green-500'
                : notification.type === 'error'
                ? 'bg-red-500'
                : notification.type === 'warning'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
          >
            <p className="text-white">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 