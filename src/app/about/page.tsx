'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/common/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            About PitStop
          </h1>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <p>
              PitStop is a revolutionary platform that connects vehicle owners with trusted service providers,
              making car maintenance and repairs more accessible, transparent, and efficient.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
              Our Mission
            </h2>
            <p>
              We aim to transform the automotive service industry by providing a seamless, user-friendly platform
              that ensures quality service, fair pricing, and complete transparency.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
              Our Vision
            </h2>
            <p>
              To become the leading platform for automotive services, setting new standards for customer
              satisfaction and service provider excellence.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
              Why Choose PitStop?
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verified and trusted service providers</li>
              <li>Transparent pricing and service details</li>
              <li>Real-time tracking of service progress</li>
              <li>Secure payment system</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
} 