'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'compact' | 'dropdown';
  showLabel?: boolean;
}

export function ThemeToggle({ variant = 'default', showLabel = false }: ThemeToggleProps) {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
            "flex items-center gap-2"
          )}
          title={`Current theme: ${theme}`}
        >
          {actualTheme === 'dark' ? (
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          )}
          {showLabel && (
            <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
              {theme}
            </span>
          )}
        </button>

        {/* Dropdown menu */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[120px]">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                theme === 'light' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              )}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                theme === 'dark' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              )}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                theme === 'system' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              )}
            >
              <Monitor className="h-4 w-4" />
              System
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        title={`Theme: ${theme} (Click to cycle)`}
      >
        {theme === 'system' ? (
          <Monitor className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
        ) : actualTheme === 'dark' ? (
          <Moon className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
        "flex items-center gap-2",
        showLabel && "px-3"
      )}
      title={`Theme: ${theme} (${actualTheme})`}
    >
      {theme === 'system' ? (
        <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      ) : actualTheme === 'dark' ? (
        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      )}
      {showLabel && (
        <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
          {theme}
        </span>
      )}
    </button>
  );
}