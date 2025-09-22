'use client';

import { LucideIcon } from 'lucide-react';
import { designTokens, cx } from '@/lib/design-system';

export type IconSize = keyof typeof designTokens.icons;
export type IconColor = 'primary' | 'secondary' | 'muted' | 'disabled' | 'accent' | 'success' | 'warning' | 'error' | 'white';

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  className?: string;
}

const colorMap: Record<IconColor, string> = {
  primary: designTokens.colors.text.primary,
  secondary: designTokens.colors.text.secondary,
  muted: designTokens.colors.text.muted,
  disabled: designTokens.colors.text.disabled,
  accent: designTokens.colors.text.accent,
  success: designTokens.colors.text.success,
  warning: designTokens.colors.text.warning,
  error: designTokens.colors.text.error,
  white: 'text-white',
};

export function Icon({ 
  icon: IconComponent, 
  size = 'md', 
  color = 'muted', 
  className 
}: IconProps) {
  return (
    <IconComponent 
      className={cx(
        designTokens.icons[size],
        colorMap[color],
        className
      )} 
    />
  );
}

// Pre-configured icon variants for common use cases
export const IconButton = ({ 
  icon: IconComponent, 
  size = 'md', 
  color = 'muted', 
  onClick,
  className,
  ...props 
}: IconProps & { onClick?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    onClick={onClick}
    className={cx(
      'inline-flex items-center justify-center transition-colors rounded-lg',
      size === 'sm' ? 'p-1' : size === 'lg' ? 'p-3' : 'p-2',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      className
    )}
    {...props}
  >
    <Icon icon={IconComponent} size={size} color={color} />
  </button>
);

// Avatar with consistent sizing
export const Avatar = ({ 
  icon: IconComponent, 
  size = 'md', 
  className,
  gradient = false 
}: { 
  icon: LucideIcon; 
  size?: 'xs' | 'sm' | 'md' | 'lg'; 
  className?: string;
  gradient?: boolean;
}) => {
  const sizeMap = {
    xs: designTokens.icons.sm,
    sm: designTokens.icons.md, 
    md: designTokens.icons.lg,
    lg: designTokens.icons.xl
  };

  const containerSizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={cx(
      containerSizeMap[size],
      'rounded-full flex items-center justify-center flex-shrink-0',
      gradient 
        ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
        : 'bg-gray-100 dark:bg-gray-700',
      className
    )}>
      <Icon 
        icon={IconComponent} 
        size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'} 
        color={gradient ? 'white' : 'muted'} 
      />
    </div>
  );
};