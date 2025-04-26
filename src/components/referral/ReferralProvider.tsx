'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'

// Types
interface Referral {
  id: string
  email: string
  status: 'pending' | 'completed'
  date: Date
  reward: number
}

interface ReferralContextType {
  referralCode: string
  totalEarnings: number
  availableCredit: number
  referrals: Referral[]
  shareReferralLink: () => void
  copyReferralCode: () => void
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined)

// Mock data for demonstration
const mockReferrals: Referral[] = [
  {
    id: '1',
    email: 'friend1@example.com',
    status: 'completed',
    date: new Date('2024-01-15'),
    reward: 10,
  },
  {
    id: '2',
    email: 'friend2@example.com',
    status: 'pending',
    date: new Date('2024-01-20'),
    reward: 10,
  },
]

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referralCode] = useState('PITSTOP123') // In a real app, this would come from the backend
  const [totalEarnings] = useState(20) // In a real app, this would be calculated from referrals
  const [availableCredit] = useState(15) // In a real app, this would be calculated from used credits
  const [referrals] = useState<Referral[]>(mockReferrals)

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`
    if (navigator.share) {
      navigator.share({
        title: 'Join PitStop',
        text: 'Get $10 off your first service with PitStop!',
        url: referralLink,
      })
    } else {
      navigator.clipboard.writeText(referralLink)
      // Show a toast notification that the link was copied
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    // Show a toast notification that the code was copied
  }

  return (
    <ReferralContext.Provider
      value={{
        referralCode,
        totalEarnings,
        availableCredit,
        referrals,
        shareReferralLink,
        copyReferralCode,
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