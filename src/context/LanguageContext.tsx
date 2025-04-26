'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface LanguageContextType {
  isRTL: boolean
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isRTL, setIsRTL] = useState(false)

  const toggleLanguage = () => {
    setIsRTL(prev => !prev)
    // Update content direction without affecting navigation
    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.style.direction = !isRTL ? 'rtl' : 'ltr'
      mainContent.style.textAlign = !isRTL ? 'right' : 'left'
    }
  }

  return (
    <LanguageContext.Provider value={{ isRTL, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 