'use client';

import { useState, useEffect } from 'react';
import { BookingNotification } from '@/types/booking';
import { format } from 'date-fns';

interface NotificationCenterProps {
  notifications: BookingNotification[];
  onMarkAsRead: (notificationId: string) => void;
}

export default function NotificationCenter({ notifications, onMarkAsRead }: NotificationCenterProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const getNotificationIcon = (type: BookingNotification['type']) => {
    switch (type) {
      case 'confirmation':
        return '✓';
      case 'reminder':
        return '⏰';
      case 'status_update':
        return '🔄';
      default:
        return '📢';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="divide-y">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {format(new Date(notification.sentAt), 'PPP p')}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 