'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authenticatedApi } from '@/utils/api'
import { config } from '@/config'
import { useNotifications } from './NotificationsContext'

interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'provider' | 'admin'
  is2FAEnabled: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    name: string
    role: 'customer' | 'provider'
  }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { addNotification } = useNotifications()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const { data } = await authenticatedApi<User>(
        config.api.endpoints.user.profile,
        token
      )
      setUser(data)
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data } = await authenticatedApi<{ token: string; user: User }>(
        config.api.endpoints.auth.login,
        null,
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      )

      localStorage.setItem('token', data.token)
      setUser(data.user)
      router.push('/dashboard')
      addNotification('success', 'Successfully logged in')
    } catch (error) {
      addNotification('error', 'Failed to login')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: {
    email: string
    password: string
    name: string
    role: 'customer' | 'provider'
  }) => {
    try {
      setIsLoading(true)
      await authenticatedApi(
        config.api.endpoints.auth.register,
        null,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      )
      router.push('/auth/login')
      addNotification('success', 'Registration successful')
    } catch (error) {
      addNotification('error', 'Failed to register')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (token) {
        await authenticatedApi(config.api.endpoints.auth.logout, token, {
          method: 'POST',
        })
      }
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      router.push('/auth/login')
      addNotification('success', 'Successfully logged out')
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data: updatedUser } = await authenticatedApi<User>(
        config.api.endpoints.user.update,
        token,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      )

      setUser(updatedUser)
      addNotification('success', 'Profile updated successfully')
    } catch (error) {
      addNotification('error', 'Failed to update profile')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 