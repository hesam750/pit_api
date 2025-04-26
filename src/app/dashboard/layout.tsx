import { ReactNode } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import SOSButton from '@/components/SOSButton'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <SOSButton />
    </div>
  )
} 