'use client';

import { ReactNode } from 'react';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { AuthProvider } from '@/context/AuthContext';
import { TwoFactorProvider } from '@/context/TwoFactorContext';
import { WalletProvider } from '@/context/WalletContext';
import { ChatProvider } from '@/context/ChatContext';
import { BookingProvider } from '@/context/BookingContext';
import { DiscountsProvider } from '@/context/DiscountsContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import AppLayout from '@/components/layout/AppLayout';
import MainLayout from '@/components/layout/MainLayout';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <NotificationsProvider>
        <AuthProvider>
          <TwoFactorProvider>
            <WalletProvider>
              <ChatProvider>
                <BookingProvider>
                  <DiscountsProvider>
                    <MainLayout>
                      <AppLayout>{children}</AppLayout>
                    </MainLayout>
                  </DiscountsProvider>
                </BookingProvider>
              </ChatProvider>
            </WalletProvider>
          </TwoFactorProvider>
        </AuthProvider>
      </NotificationsProvider>
    </ErrorBoundary>
  );
} 