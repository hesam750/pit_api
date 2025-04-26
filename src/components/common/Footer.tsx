'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              PitStop
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your trusted partner for automotive services.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/repair"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive('/services/repair') ? 'text-primary-600 dark:text-primary-400' : ''
                  }`}
                >
                  Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/services/maintenance"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive('/services/maintenance') ? 'text-primary-600 dark:text-primary-400' : ''
                  }`}
                >
                  Maintenance
                </Link>
              </li>
              <li>
                <Link
                  href="/services/emergency"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive('/services/emergency') ? 'text-primary-600 dark:text-primary-400' : ''
                  }`}
                >
                  Emergency
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive('/about') ? 'text-primary-600 dark:text-primary-400' : ''
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive('/contact') ? 'text-primary-600 dark:text-primary-400' : ''
                  }`}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive('/privacy') ? 'text-primary-600 dark:text-primary-400' : ''
                  }`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive('/terms') ? 'text-primary-600 dark:text-primary-400' : ''
                  }`}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-300">
                support@pitstop.com
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                +1 (555) 123-4567
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                123 Automotive Street<br />
                San Francisco, CA 94107
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © {new Date().getFullYear()} PitStop. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 