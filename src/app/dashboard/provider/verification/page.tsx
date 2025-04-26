'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ClockIcon,
  MapPinIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

type VerificationStatus = 'incomplete' | 'pending' | 'approved' | 'rejected'
type BusinessType = 'mechanic' | 'carwash' | 'tire' | 'detailing' | 'other'

const businessTypes = [
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'carwash', label: 'Car Wash' },
  { value: 'tire', label: 'Tire Service' },
  { value: 'detailing', label: 'Auto Detailing' },
  { value: 'other', label: 'Other' },
]

const mockDocuments = [
  {
    id: 1,
    name: 'Business License',
    status: 'pending',
    date: '2024-01-15',
  },
  {
    id: 2,
    name: 'Resume/CV',
    status: 'pending',
    date: '2024-01-20',
  },
]

export default function VerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('incomplete')
  const [formData, setFormData] = useState({
    businessType: '' as BusinessType,
    experience: '',
    resume: '',
    workingHours: {
      from: '',
      to: '',
    },
    phone: '',
    address: '',
    location: {
      lat: 35.6892,
      lng: 51.3890,
    },
  })
  const [documents, setDocuments] = useState(mockDocuments)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Mock submission
    setTimeout(() => {
      setVerificationStatus('pending')
      setIsSubmitting(false)
    }, 1500)
  }

  const isFormComplete = () => {
    return (
      formData.businessType &&
      formData.experience &&
      formData.workingHours.from &&
      formData.workingHours.to &&
      formData.phone &&
      formData.address &&
      documents.every((doc) => doc.status !== 'pending')
    )
  }

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5" />
      case 'pending':
        return <ArrowPathIcon className="h-5 w-5 animate-spin" />
      case 'rejected':
        return <ExclamationCircleIcon className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg ${getStatusColor(verificationStatus)}`}>
        <div className="flex items-center space-x-2">
          {getStatusIcon(verificationStatus)}
          <span className="font-medium">
            {verificationStatus === 'incomplete' && 'Verification Incomplete'}
            {verificationStatus === 'pending' && 'Verification Pending Review'}
            {verificationStatus === 'approved' && 'Verification Approved'}
            {verificationStatus === 'rejected' && 'Verification Rejected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Business Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Business Type
            </h3>
            <select
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
              disabled={verificationStatus === 'pending'}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Work Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Work Experience
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  disabled={verificationStatus === 'pending'}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resume Description
                </label>
                <textarea
                  value={formData.resume}
                  onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  disabled={verificationStatus === 'pending'}
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief description of your experience and qualifications..."
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Working Hours
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From
                </label>
                <input
                  type="time"
                  value={formData.workingHours.from}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workingHours: { ...formData.workingHours, from: e.target.value },
                    })
                  }
                  disabled={verificationStatus === 'pending'}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To
                </label>
                <input
                  type="time"
                  value={formData.workingHours.to}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workingHours: { ...formData.workingHours, to: e.target.value },
                    })
                  }
                  disabled={verificationStatus === 'pending'}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={verificationStatus === 'pending'}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={verificationStatus === 'pending'}
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Map Location */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Service Location
            </h3>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Map integration would go here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Latitude: {formData.location.lat}, Longitude: {formData.location.lng}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Required Documents
            </h3>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <DocumentIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-gray-900 dark:text-white">{doc.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded on {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        doc.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      {doc.status === 'pending' ? 'Pending Review' : 'Verified'}
                    </span>
                    <button
                      disabled={verificationStatus === 'pending'}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!isFormComplete() || verificationStatus === 'pending' || isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium ${
            !isFormComplete() || verificationStatus === 'pending' || isSubmitting
              ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </motion.div>
  )
} 