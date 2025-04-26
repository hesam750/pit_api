'use client'

import { useState } from 'react'

interface NotificationSettingsProps {
  initialSettings?: {
    bookingNotifications: boolean
    messageNotifications: boolean
    statusNotifications: boolean
    pushNotifications: boolean
    emailNotifications: boolean
  }
}

export default function NotificationSettings({ initialSettings }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    bookingNotifications: initialSettings?.bookingNotifications ?? true,
    messageNotifications: initialSettings?.messageNotifications ?? true,
    statusNotifications: initialSettings?.statusNotifications ?? true,
    pushNotifications: initialSettings?.pushNotifications ?? true,
    emailNotifications: initialSettings?.emailNotifications ?? false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const CustomSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`${
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage how you receive notifications from PitStop
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Booking Notifications</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive notifications about your bookings
            </p>
          </div>
          <CustomSwitch
            checked={settings.bookingNotifications}
            onChange={() => handleToggle('bookingNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Message Notifications</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified about new messages
            </p>
          </div>
          <CustomSwitch
            checked={settings.messageNotifications}
            onChange={() => handleToggle('messageNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Status Updates</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive updates about service status
            </p>
          </div>
          <CustomSwitch
            checked={settings.statusNotifications}
            onChange={() => handleToggle('statusNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive push notifications on your device
            </p>
          </div>
          <CustomSwitch
            checked={settings.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive notifications via email
            </p>
          </div>
          <CustomSwitch
            checked={settings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
          />
        </div>
      </div>
    </div>
  )
} 