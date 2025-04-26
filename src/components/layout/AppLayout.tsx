'use client'

import { ReactNode } from 'react'
import Navigation from '@/components/Navigation'
import { Toaster } from 'react-hot-toast'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster position="bottom-right" />
    </div>
  )
} 