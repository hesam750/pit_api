'use client'

import { useTheme } from '@/context/ThemeContext'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@/components/ui/Tooltip'

export default function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
      <Tooltip content="Light theme">
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-md transition-colors ${
            theme === 'light'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'
          }`}
          aria-label="Light theme"
        >
          <SunIcon className="w-5 h-5" />
        </button>
      </Tooltip>

      <Tooltip content="Dark theme">
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-md transition-colors ${
            theme === 'dark'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'
          }`}
          aria-label="Dark theme"
        >
          <MoonIcon className="w-5 h-5" />
        </button>
      </Tooltip>

      <Tooltip content="System theme">
        <button
          onClick={() => setTheme('system')}
          className={`p-2 rounded-md transition-colors ${
            theme === 'system'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'
          }`}
          aria-label="System theme"
        >
          <ComputerDesktopIcon className="w-5 h-5" />
        </button>
      </Tooltip>

      {theme === 'system' && (
        <span className="sr-only">
          Currently using {resolvedTheme} theme based on system preferences
        </span>
      )}
    </div>
  )
} 