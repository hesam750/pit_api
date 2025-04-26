export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    endpoints: {
      auth: {
        login: '/auth/login',
        register: '/auth/register',
        verify: '/auth/verify',
        resetPassword: '/auth/reset-password',
      },
      user: {
        profile: '/user/profile',
        update: '/user/update',
      },
      booking: {
        create: '/booking/create',
        list: '/booking/list',
        details: '/booking/:id',
        cancel: '/booking/:id/cancel',
      },
      wallet: {
        balance: '/wallet/balance',
        transactions: '/wallet/transactions',
        addFunds: '/wallet/add-funds',
      },
      chat: {
        messages: '/chat/messages',
        send: '/chat/send',
      },
      sos: {
        request: '/sos/request',
        status: '/sos/status',
      },
    },
  },
  features: {
    enable2FA: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
    enableChat: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
    enableWallet: process.env.NEXT_PUBLIC_ENABLE_WALLET === 'true',
    enableSOS: process.env.NEXT_PUBLIC_ENABLE_SOS === 'true',
  },
  payment: {
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    currency: 'USD',
  },
  map: {
    apiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
    defaultLocation: {
      lat: 51.5074,
      lng: -0.1278,
    },
  },
  notifications: {
    enablePush: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
    enableEmail: process.env.NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS === 'true',
  },
} 