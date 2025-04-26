'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-12">Terms & Conditions</h1>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                Welcome to PitStop. These Terms and Conditions govern your use of our platform and services.
                By accessing or using our platform, you agree to be bound by these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>"Platform" refers to the PitStop website and mobile application.</li>
                <li>"Service Provider" refers to the professional car service providers registered on our platform.</li>
                <li>"User" refers to any individual or entity using our platform.</li>
                <li>"Services" refers to the car maintenance and repair services offered through our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide accurate and complete information when creating an account.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Use the platform in compliance with all applicable laws and regulations.</li>
                <li>Treat service providers with respect and professionalism.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Service Provider Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide services in a professional and timely manner.</li>
                <li>Maintain all necessary licenses and certifications.</li>
                <li>Use appropriate tools and equipment for service delivery.</li>
                <li>Adhere to safety standards and best practices.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Booking and Cancellation</h2>
              <p className="text-gray-600">
                Users may book services through our platform. Cancellations must be made at least 2 hours before the scheduled service time.
                Late cancellations may be subject to fees as specified in our cancellation policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
              <p className="text-gray-600">
                All payments for services must be made through our secure payment system.
                We accept various payment methods as specified on our platform.
                Prices are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Liability</h2>
              <p className="text-gray-600">
                PitStop acts as a platform connecting users with service providers.
                We are not responsible for the quality of services provided by service providers.
                Users should verify the credentials and qualifications of service providers before booking services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Privacy</h2>
              <p className="text-gray-600">
                We collect and process personal information in accordance with our Privacy Policy.
                By using our platform, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms and Conditions at any time.
                Changes will be effective immediately upon posting on our platform.
                Continued use of the platform after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-gray-600">
                For questions or concerns regarding these Terms and Conditions, please contact us at:
                <br />
                Email: legal@pitstop.com
                <br />
                Phone: +1 (555) 123-4567
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  )
} 