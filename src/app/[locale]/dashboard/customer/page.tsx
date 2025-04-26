'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationsContext'
import { t } from '@/utils/i18n'
import { useParams } from 'next/navigation'
import {
  CarIcon,
  UserCircleIcon,
  CogIcon,
  BellIcon,
  WalletIcon,
  ChatBubbleLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import ServicesGrid from '@/components/services/ServicesGrid'

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('services')
  const router = useRouter()
  const { user, logout } = useAuth()
  const { addNotification } = useNotifications()
  const params = useParams()
  const locale = params.locale as string

  const handleLogout = async () => {
    try {
      await logout()
      router.push(`/${locale}/auth/login`)
    } catch (error) {
      addNotification({
        type: 'error',
        message: t('auth.logout.error', locale),
      })
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServicesGrid />
      case 'bookings':
        return <div>{t('dashboard.customer.bookings', locale)}</div>
      case 'wallet':
        return <div>{t('dashboard.customer.wallet', locale)}</div>
      case 'chat':
        return <div>{t('dashboard.customer.chat', locale)}</div>
      default:
        return <ServicesGrid />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('dashboard.customer.title', locale)}
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    id="user-menu-button"
                  >
                    <span className="sr-only">{t('dashboard.customer.openUserMenu', locale)}</span>
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('services')}
              className={`${
                activeTab === 'services'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <CarIcon className="h-5 w-5 inline-block mr-2" />
              {t('dashboard.customer.services', locale)}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`${
                activeTab === 'bookings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <CogIcon className="h-5 w-5 inline-block mr-2" />
              {t('dashboard.customer.bookings', locale)}
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`${
                activeTab === 'wallet'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <WalletIcon className="h-5 w-5 inline-block mr-2" />
              {t('dashboard.customer.wallet', locale)}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`${
                activeTab === 'chat'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5 inline-block mr-2" />
              {t('dashboard.customer.chat', locale)}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">{renderContent()}</div>
      </main>
    </div>
  )
} 