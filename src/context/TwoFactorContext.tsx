'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { authenticatedApi } from '@/utils/api'
import { config } from '@/config'
import { useNotifications } from './NotificationsContext'

interface TwoFactorContextType {
  isEnabled: boolean
  isLoading: boolean
  setup2FA: () => Promise<{ secret: string; qrCode: string }>
  verify2FA: (code: string) => Promise<void>
  disable2FA: (code: string) => Promise<void>
}

const TwoFactorContext = createContext<TwoFactorContextType | undefined>(undefined)

export function TwoFactorProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification } = useNotifications()

  const setup2FA = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data } = await authenticatedApi<{ secret: string; qrCode: string }>(
        config.api.endpoints.auth.setup2FA,
        token,
        {
          method: 'POST',
        }
      )

      addNotification('success', '2FA setup initiated')
      return data
    } catch (error) {
      addNotification('error', 'Failed to setup 2FA')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verify2FA = async (code: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      await authenticatedApi(
        config.api.endpoints.auth.verify2FA,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ code }),
        }
      )

      setIsEnabled(true)
      addNotification('success', '2FA enabled successfully')
    } catch (error) {
      addNotification('error', 'Failed to verify 2FA code')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disable2FA = async (code: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      await authenticatedApi(
        config.api.endpoints.auth.disable2FA,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ code }),
        }
      )

      setIsEnabled(false)
      addNotification('success', '2FA disabled successfully')
    } catch (error) {
      addNotification('error', 'Failed to disable 2FA')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TwoFactorContext.Provider
      value={{
        isEnabled,
        isLoading,
        setup2FA,
        verify2FA,
        disable2FA,
      }}
    >
      {children}
    </TwoFactorContext.Provider>
  )
}

export function useTwoFactor() {
  const context = useContext(TwoFactorContext)
  if (context === undefined) {
    throw new Error('useTwoFactor must be used within a TwoFactorProvider')
  }
  return context
} 