'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Discount {
  id: string
  code: string
  percentage: number
  validUntil: string
  isActive: boolean
}

interface DiscountsContextType {
  discounts: Discount[]
  addDiscount: (discount: Omit<Discount, 'id'>) => void
  removeDiscount: (id: string) => void
  toggleDiscount: (id: string) => void
}

const DiscountsContext = createContext<DiscountsContextType | undefined>(undefined)

export function DiscountsProvider({ children }: { children: ReactNode }) {
  const [discounts, setDiscounts] = useState<Discount[]>([])

  const addDiscount = (discount: Omit<Discount, 'id'>) => {
    const newDiscount = {
      ...discount,
      id: Math.random().toString(36).substr(2, 9),
    }
    setDiscounts(prev => [...prev, newDiscount])
  }

  const removeDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(discount => discount.id !== id))
  }

  const toggleDiscount = (id: string) => {
    setDiscounts(prev =>
      prev.map(discount =>
        discount.id === id
          ? { ...discount, isActive: !discount.isActive }
          : discount
      )
    )
  }

  return (
    <DiscountsContext.Provider
      value={{
        discounts,
        addDiscount,
        removeDiscount,
        toggleDiscount,
      }}
    >
      {children}
    </DiscountsContext.Provider>
  )
}

export function useDiscounts() {
  const context = useContext(DiscountsContext)
  if (context === undefined) {
    throw new Error('useDiscounts must be used within a DiscountsProvider')
  }
  return context
} 