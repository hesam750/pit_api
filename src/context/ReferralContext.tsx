'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Referral {
  id: string
  code: string
  referrerId: string
  refereeId: string
  status: 'pending' | 'completed'
  reward: number
  createdAt: string
}

interface ReferralContextType {
  referrals: Referral[]
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt'>) => void
  updateReferralStatus: (id: string, status: 'pending' | 'completed') => void
  getReferralCode: () => string
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined)

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referrals, setReferrals] = useState<Referral[]>([])

  const addReferral = (referral: Omit<Referral, 'id' | 'createdAt'>) => {
    const newReferral = {
      ...referral,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    setReferrals(prev => [...prev, newReferral])
  }

  const updateReferralStatus = (id: string, status: 'pending' | 'completed') => {
    setReferrals(prev =>
      prev.map(referral =>
        referral.id === id ? { ...referral, status } : referral
      )
    )
  }

  const getReferralCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase()
  }

  return (
    <ReferralContext.Provider
      value={{
        referrals,
        addReferral,
        updateReferralStatus,
        getReferralCode,
      }}
    >
      {children}
    </ReferralContext.Provider>
  )
}

export function useReferral() {
  const context = useContext(ReferralContext)
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider')
  }
  return context
} 