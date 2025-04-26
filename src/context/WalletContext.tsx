'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { authenticatedApi } from '@/utils/api'
import { config } from '@/config'
import { useNotifications } from './NotificationsContext'

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
}

interface WalletContextType {
  balance: number
  transactions: Transaction[]
  isLoading: boolean
  addFunds: (amount: number) => Promise<void>
  getTransactions: () => Promise<void>
  getBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification } = useNotifications()

  const getBalance = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data } = await authenticatedApi<{ balance: number }>(
        config.api.endpoints.wallet.balance,
        token
      )
      setBalance(data.balance)
    } catch (error) {
      addNotification('error', 'Failed to fetch wallet balance')
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactions = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const { data } = await authenticatedApi<{ transactions: Transaction[] }>(
        config.api.endpoints.wallet.transactions,
        token
      )
      setTransactions(data.transactions)
    } catch (error) {
      addNotification('error', 'Failed to fetch transactions')
    } finally {
      setIsLoading(false)
    }
  }

  const addFunds = async (amount: number) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      await authenticatedApi(
        config.api.endpoints.wallet.addFunds,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ amount }),
        }
      )

      await getBalance()
      await getTransactions()
      addNotification('success', 'Funds added successfully')
    } catch (error) {
      addNotification('error', 'Failed to add funds')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        addFunds,
        getTransactions,
        getBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 