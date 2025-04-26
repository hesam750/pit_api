'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: 'How does PitStop work?',
    answer: 'PitStop connects you with professional car service providers who come to your location. Simply book a service through our platform, and a qualified technician will arrive at your specified time and location to perform the service.',
  },
  {
    question: 'What services do you offer?',
    answer: 'We offer a range of mobile car services including car wash, oil change, tire service, and emergency roadside assistance. Our service providers are trained professionals who can handle various car maintenance needs.',
  },
  {
    question: 'How do I book a service?',
    answer: 'Booking a service is easy! Just select the service you need, choose your preferred date and time, provide your location, and complete the booking. You can do this through our website or mobile app.',
  },
  {
    question: 'Are your service providers qualified?',
    answer: 'Yes, all our service providers are thoroughly vetted, background checked, and certified professionals. They have the necessary training and experience to provide high-quality car services.',
  },
  {
    question: 'What areas do you service?',
    answer: 'We currently service major metropolitan areas. You can check if we\'re available in your area by entering your location during the booking process.',
  },
  {
    question: 'How do I pay for services?',
    answer: 'We accept various payment methods including credit cards, debit cards, and digital wallets. Payment is processed securely through our platform after the service is completed.',
  },
  {
    question: 'What if I need to cancel or reschedule?',
    answer: 'You can cancel or reschedule your appointment up to 2 hours before the scheduled time through your account dashboard or by contacting our customer support.',
  },
  {
    question: 'Do you offer emergency services?',
    answer: 'Yes, we offer emergency roadside assistance for situations like flat tires, dead batteries, and lockouts. You can request emergency assistance through our app or website.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="text-lg font-semibold">{faq.question}</span>
                  <ChevronDownIcon
                    className={`h-6 w-6 text-gray-500 transform transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact our support team
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  )
} 