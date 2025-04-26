'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  XMarkIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const emergencyTypes = [
  'Flat tire',
  'Engine failure',
  'Out of fuel',
  'Battery issue',
  'Other',
]

export default function SOSButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')

  // Mock location - in a real app, this would use browser geolocation
  useEffect(() => {
    setLocation('123 Main St, City, State')
  }, [])

  const handleSubmit = () => {
    if (!selectedType) return

    setIsSubmitted(true)
    
    // Mock submission - in a real app, this would send to your backend
    setTimeout(() => {
      setIsOpen(false)
      setIsSubmitted(false)
      setSelectedType('')
      setDescription('')
      // Optional: Redirect to booking tracker or chat
      // router.push('/dashboard/tracker')
    }, 5000)
  }

  return (
    <>
      {/* Floating SOS Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white"
        onClick={() => setIsOpen(true)}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-blue-600 rounded-full"
        />
        <ExclamationTriangleIcon className="h-8 w-8 relative z-10" />
      </motion.button>

      {/* SOS Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => !isSubmitted && setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                {!isSubmitted ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        We're here to help!
                      </h2>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Location */}
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {location}
                        </span>
                      </div>

                      {/* Emergency Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type of Emergency
                        </label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select emergency type</option>
                          {emergencyTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Additional Details (Optional)
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Please provide any additional details about your emergency..."
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleSubmit}
                        disabled={!selectedType}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                          !selectedType
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        Request Emergency Help
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Help is on the way!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your emergency request has been received. A service provider will contact you shortly.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 