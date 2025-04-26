'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDiscounts } from '@/context/DiscountsContext'
import { TagIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface DiscountInputProps {
  serviceId: string
  providerId: string
  onDiscountApplied: (discount: {
    code: string
    value: number
    type: 'percentage' | 'fixed'
  } | null) => void
}

export default function DiscountInput({
  serviceId,
  providerId,
  onDiscountApplied,
}: DiscountInputProps) {
  const { validateDiscount } = useDiscounts()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const [message, setMessage] = useState('')

  const handleApplyDiscount = () => {
    const discount = validateDiscount(code, serviceId, providerId)
    if (discount) {
      setStatus('valid')
      setMessage('Discount applied successfully!')
      onDiscountApplied({
        code: discount.code,
        value: discount.value,
        type: discount.type,
      })
    } else {
      setStatus('invalid')
      setMessage('Invalid or expired discount code')
      onDiscountApplied(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <TagIcon className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter discount code"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={handleApplyDiscount}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Apply
        </button>
      </div>

      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center space-x-2 ${
            status === 'valid' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status === 'valid' ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <XCircleIcon className="h-5 w-5" />
          )}
          <span className="text-sm">{message}</span>
        </motion.div>
      )}
    </div>
  )
} 