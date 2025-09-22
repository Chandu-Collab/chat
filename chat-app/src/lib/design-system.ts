// Design System Tokens - Consistent sizes and typography across the platform

export const designTokens = {
  // Icon Sizes - Standardized across all components
  icons: {
    xs: 'h-3 w-3',        // 12px - Very small icons, badges
    sm: 'h-4 w-4',        // 16px - Small icons, inline text icons
    md: 'h-5 w-5',        // 20px - Standard icons, buttons
    lg: 'h-6 w-6',        // 24px - Larger buttons, navigation
    xl: 'h-8 w-8',        // 32px - Header icons, prominent features
    '2xl': 'h-10 w-10',   // 40px - Hero sections, main branding
    '3xl': 'h-12 w-12',   // 48px - Large decorative icons
  },

  // Typography Scale - Consistent text sizing
  typography: {
    // Font sizes
    text: {
      xs: 'text-xs',      // 12px
      sm: 'text-sm',      // 14px  
      base: 'text-base',  // 16px
      lg: 'text-lg',      // 18px
      xl: 'text-xl',      // 20px
      '2xl': 'text-2xl',  // 24px
      '3xl': 'text-3xl',  // 30px
      '4xl': 'text-4xl',  // 36px
    },

    // Font weights
    weight: {
      light: 'font-light',     // 300
      normal: 'font-normal',   // 400
      medium: 'font-medium',   // 500
      semibold: 'font-semibold', // 600
      bold: 'font-bold',       // 700
    },

    // Line heights
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    }
  },

  // Color System - Semantic color usage
  colors: {
    // Text colors
    text: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-600 dark:text-gray-300',
      muted: 'text-gray-500 dark:text-gray-400',
      disabled: 'text-gray-400 dark:text-gray-600',
      accent: 'text-blue-600 dark:text-blue-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
    },

    // Background colors
    bg: {
      primary: 'bg-white dark:bg-gray-900',
      secondary: 'bg-gray-50 dark:bg-gray-800',
      surface: 'bg-white dark:bg-gray-800',
      muted: 'bg-gray-100 dark:bg-gray-700',
      accent: 'bg-blue-600 hover:bg-blue-700',
      success: 'bg-green-600 hover:bg-green-700',
      warning: 'bg-yellow-600 hover:bg-yellow-700',
      error: 'bg-red-600 hover:bg-red-700',
    },

    // Border colors
    border: {
      default: 'border-gray-200 dark:border-gray-700',
      muted: 'border-gray-100 dark:border-gray-800',
      accent: 'border-blue-200 dark:border-blue-800',
      success: 'border-green-200 dark:border-green-800',
      warning: 'border-yellow-200 dark:border-yellow-800',
      error: 'border-red-200 dark:border-red-800',
    }
  },

  // Spacing - Consistent spacing values
  spacing: {
    none: '0',
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '3rem',    // 48px
  },

  // Border radius
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',     // 2px
    md: 'rounded-md',     // 6px
    lg: 'rounded-lg',     // 8px
    xl: 'rounded-xl',     // 12px
    '2xl': 'rounded-2xl', // 16px
    '3xl': 'rounded-3xl', // 24px
    full: 'rounded-full',
  },

  // Shadows
  shadow: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }
} as const;

// Component-specific presets for common combinations
export const componentPresets = {
  // Button variations
  button: {
    primary: `${designTokens.typography.text.sm} ${designTokens.typography.weight.medium} px-4 py-2 ${designTokens.colors.bg.accent} text-white ${designTokens.radius.lg} ${designTokens.shadow.md}`,
    secondary: `${designTokens.typography.text.sm} ${designTokens.typography.weight.medium} px-4 py-2 ${designTokens.colors.bg.secondary} ${designTokens.colors.text.primary} ${designTokens.radius.lg} border ${designTokens.colors.border.default}`,
    ghost: `${designTokens.typography.text.sm} ${designTokens.typography.weight.medium} px-4 py-2 hover:${designTokens.colors.bg.secondary} ${designTokens.colors.text.primary} ${designTokens.radius.lg}`,
  },

  // Card variations
  card: {
    default: `${designTokens.colors.bg.surface} border ${designTokens.colors.border.default} ${designTokens.radius.lg} ${designTokens.shadow.sm}`,
    elevated: `${designTokens.colors.bg.surface} ${designTokens.radius.lg} ${designTokens.shadow.lg}`,
  },

  // Icon button variations
  iconButton: {
    sm: `p-1.5 hover:${designTokens.colors.bg.secondary} ${designTokens.radius.md} transition-colors`,
    md: `p-2 hover:${designTokens.colors.bg.secondary} ${designTokens.radius.lg} transition-colors`,
    lg: `p-3 hover:${designTokens.colors.bg.secondary} ${designTokens.radius.lg} transition-colors`,
  },

  // Input variations
  input: {
    default: `${designTokens.typography.text.sm} px-3 py-2 ${designTokens.colors.bg.surface} border ${designTokens.colors.border.default} ${designTokens.radius.lg} focus:border-blue-500 focus:ring-2 focus:ring-blue-200`,
  },

  // Avatar variations
  avatar: {
    xs: `${designTokens.icons.md} ${designTokens.radius.full}`,
    sm: `${designTokens.icons.lg} ${designTokens.radius.full}`,
    md: `${designTokens.icons.xl} ${designTokens.radius.full}`,
    lg: `${designTokens.icons['2xl']} ${designTokens.radius.full}`,
  }
};

// Helper function to combine classes
export const cx = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};