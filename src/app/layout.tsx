'use client'

import { Inter, Vazirmatn } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeContext'
import { NotificationsProvider } from '@/context/NotificationsContext'
import Notifications from '@/components/common/Notifications'
import { AuthProvider } from '@/context/AuthContext'
import { TwoFactorProvider } from '@/context/TwoFactorContext'
import { WalletProvider } from '@/context/WalletContext'
import { ChatProvider } from '@/context/ChatContext'
import { BookingProvider } from '@/context/BookingContext'
import { DiscountsProvider } from '@/context/DiscountsContext'
import { ReferralProvider } from '@/components/referral/ReferralProvider'
import { LanguageProvider } from '@/context/LanguageContext'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import Navigation from '@/components/common/Navigation'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${vazirmatn.variable} font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`} suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider>
            <NotificationsProvider>
              <AuthProvider>
                <TwoFactorProvider>
                  <WalletProvider>
                    <ChatProvider>
                      <BookingProvider>
                        <DiscountsProvider>
                          <ReferralProvider>
                            <LanguageProvider>
                              <div className="fixed top-0 left-0 right-0 z-50">
                                <Navigation />
                              </div>
                              <main className="min-h-screen pt-16">
                                {children}
                              </main>
                              <Notifications />
                              <Toaster 
                                position="bottom-right"
                                toastOptions={{
                                  className: 'dark:bg-gray-800 dark:text-white'
                                }}
                              />
                            </LanguageProvider>
                          </ReferralProvider>
                        </DiscountsProvider>
                      </BookingProvider>
                    </ChatProvider>
                  </WalletProvider>
                </TwoFactorProvider>
              </AuthProvider>
            </NotificationsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
