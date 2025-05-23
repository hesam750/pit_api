# 🚗 PitStop - Car Services Marketplace

A modern, responsive web application for booking and managing car services. PitStop connects car owners with professional service providers, offering a seamless experience for all automotive needs.

## 🌟 Features

- **Customer Dashboard**: Book services, track bookings, and manage vehicle history
- **Service Provider Panel**: Manage services, handle bookings, and track earnings
- **Real-time Booking System**: Instant service booking with flexible scheduling
- **Wallet Integration**: Secure payment processing and transaction history
- **SOS Emergency Button**: Quick access to roadside assistance
- **In-app Chat**: Direct communication between customers and providers
- **Service History Tracking**: Comprehensive vehicle maintenance records
- **Provider Verification**: Rigorous verification process for service providers

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps Integration**: Leaflet (mocked for development)
- **State Management**: React Context API
- **Icons**: Heroicons
- **Development**: ESLint, Prettier

## 📁 Project Structure

```
pitstop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard routes
│   │   │   ├── customer/       # Customer dashboard
│   │   │   └── provider/       # Provider dashboard
│   │   ├── booking/            # Booking flow
│   │   ├── chat/               # Chat interface
│   │   ├── sos/                # Emergency services
│   │   └── profile/            # User profiles
│   ├── components/             # Reusable components
│   │   ├── common/             # Shared components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   └── forms/              # Form components
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
└── package.json                # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- PostgreSQL 14.x or higher
- Redis 6.x or higher
- SMTP Server (for emails)
- SMS Gateway (for SMS)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pitstop.git
   cd pitstop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update environment variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/pit"

   # Redis
   REDIS_URL="redis://localhost:6379"
   REDIS_TOKEN="your-redis-token"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Email
   SMTP_HOST="smtp.example.com"
   SMTP_PORT=587
   SMTP_USER="your-email@example.com"
   SMTP_PASSWORD="your-password"

   # SMS
   SMS_PROVIDER="your-provider"
   SMS_API_KEY="your-api-key"
   SMS_API_SECRET="your-api-secret"

   # Other
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗺 Key Routes

- `/` - Landing page
- `/login` - User authentication
- `/register` - New user registration
- `/dashboard/customer` - Customer dashboard
  - `/dashboard/customer/bookings` - Booking history
  - `/dashboard/customer/wallet` - Wallet management
  - `/dashboard/customer/vehicles` - Vehicle management
- `/dashboard/provider` - Service provider dashboard
  - `/dashboard/provider/services` - Service management
  - `/dashboard/provider/bookings` - Booking management
  - `/dashboard/provider/wallet` - Earnings and transactions
  - `/dashboard/provider/verification` - Provider verification
- `/dashboard/admin` - Admin dashboard
  - `/dashboard/admin/verifications` - Provider verification management
  - `/dashboard/admin/sos` - Emergency requests management
  - `/dashboard/admin/reports` - User reports and complaints
  - `/dashboard/admin/services` - Service and pricing management
  - `/dashboard/admin/analytics` - Platform analytics and metrics
- `/booking` - Service booking flow
- `/chat` - In-app messaging
- `/sos` - Emergency services
- `/profile` - User profile management

## 🎯 Feature Modules

### Booking System
- Service selection and scheduling
- Real-time availability
- Flexible payment options
- Booking confirmation and tracking

### Vehicle Service History
- Comprehensive service records
- Maintenance reminders
- Service history export
- Vehicle profile management

### Wallet System
- Secure payment processing
- Transaction history
- Withdrawal requests
- Payment method management

### Authentication
- Email/password login
- Social authentication
- Password recovery
- Session management

### Chat System
- Real-time messaging
- File sharing
- Message history
- Notification system

### SOS Help System
- Emergency service request
- Location sharing
- Quick response
- Status tracking

### Provider Verification
- Document upload
- Background checks
- Service area setup
- Profile verification

### Admin Panel
- **Provider Verification Management**
  - Review and approve/reject service providers
  - Document verification
  - Background check status
  - Service area validation

- **Emergency Services Management**
  - Monitor SOS requests
  - Assign emergency responders
  - Track response times
  - Incident resolution tracking

- **User Reports & Complaints**
  - Review user-submitted reports
  - Handle complaints
  - Issue resolution tracking
  - User communication

- **Service & Pricing Control**
  - Manage service categories
  - Set pricing guidelines
  - Configure service options
  - Update service availability

- **Analytics Dashboard**
  - User growth metrics
  - Booking statistics
  - Revenue analytics
  - Service provider performance
  - Customer satisfaction metrics

- **Access Control**
  - Role-based permissions
  - Admin user management
  - Activity logging
  - Security settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Heroicons](https://heroicons.com/) - Icon library
- [Leaflet](https://leafletjs.com/) - Maps library

## 📞 Support

For support, email support@pitstop.com or join our Slack channel.

---

Built with ❤️ by the PitStop Team#   p i t _ a p i  
 