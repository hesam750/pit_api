'use client'

import { motion } from 'framer-motion'
import { useDiscounts } from '@/context/DiscountsContext'
import { GiftIcon, TagIcon } from '@heroicons/react/24/outline'

export default function ActiveOffers() {
  const { getActiveDiscounts, getActiveCampaigns } = useDiscounts()
  const activeDiscounts = getActiveDiscounts()
  const activeCampaigns = getActiveCampaigns()

  return (
    <div className="space-y-6">
      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <GiftIcon className="h-5 w-5 text-red-500 mr-2" />
            Active Campaigns
          </h3>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {campaign.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {campaign.description}
                </p>
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Valid until: {new Date(campaign.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Discounts */}
      {activeDiscounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <TagIcon className="h-5 w-5 text-red-500 mr-2" />
            Available Discounts
          </h3>
          <div className="space-y-4">
            {activeDiscounts.map((discount) => (
              <div
                key={discount.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Code: {discount.code}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {discount.type === 'percentage'
                        ? `${discount.value}% off`
                        : `$${discount.value} off`}
                    </p>
                    {discount.minPurchase && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Min. purchase: ${discount.minPurchase}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Valid until: {new Date(discount.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
} 