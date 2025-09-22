'use client';

import { useTheme, useThemeColors } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface ThemedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function ThemedCard({ children, className, variant = 'default' }: ThemedCardProps) {
  const { actualTheme } = useTheme();
  const colors = useThemeColors();

  const variantStyles = {
    default: cn(
      colors.surface,
      colors.border,
      'border rounded-lg'
    ),
    elevated: cn(
      colors.background,
      'shadow-lg rounded-lg',
      actualTheme === 'dark' ? 'shadow-gray-900/20' : 'shadow-gray-200'
    ),
    outlined: cn(
      'border-2',
      colors.border,
      'rounded-lg bg-transparent'
    )
  };

  return (
    <div className={cn(variantStyles[variant], className)}>
      {children}
    </div>
  );
}

interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function ThemedButton({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: ThemedButtonProps) {
  const { actualTheme } = useTheme();
  const colors = useThemeColors();

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    secondary: cn(
      colors.surface,
      colors.hover,
      colors.text,
      'border',
      colors.border
    ),
    ghost: cn(
      colors.hover,
      colors.text,
      'bg-transparent'
    )
  };

  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-200',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}