'use client';

import { designTokens, cx } from '@/lib/design-system';

export type TextSize = keyof typeof designTokens.typography.text;
export type TextWeight = keyof typeof designTokens.typography.weight;
export type TextColor = keyof typeof designTokens.colors.text;
export type TextElement = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TypographyProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  className?: string;
  as?: TextElement;
}

export function Typography({ 
  children, 
  size = 'base', 
  weight = 'normal', 
  color = 'primary',
  className,
  as: Component = 'p'
}: TypographyProps) {
  return (
    <Component 
      className={cx(
        designTokens.typography.text[size],
        designTokens.typography.weight[weight],
        designTokens.colors.text[color],
        className
      )}
    >
      {children}
    </Component>
  );
}

// Pre-configured typography variants
export const Heading = ({ 
  children, 
  level = 1, 
  className 
}: { 
  children: React.ReactNode; 
  level?: 1 | 2 | 3 | 4; 
  className?: string; 
}) => {
  const variants = {
    1: { size: '4xl' as TextSize, weight: 'light' as TextWeight, as: 'h1' as TextElement },
    2: { size: '2xl' as TextSize, weight: 'normal' as TextWeight, as: 'h2' as TextElement },
    3: { size: 'xl' as TextSize, weight: 'medium' as TextWeight, as: 'h3' as TextElement },
    4: { size: 'lg' as TextSize, weight: 'medium' as TextWeight, as: 'h4' as TextElement },
  };

  const variant = variants[level];
  
  return (
    <Typography
      size={variant.size}
      weight={variant.weight}
      color="primary"
      as={variant.as}
      className={cx('tracking-tight', className)}
    >
      {children}
    </Typography>
  );
};

export const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Typography 
    size="sm" 
    weight="medium" 
    color="secondary" 
    className={className}
  >
    {children}
  </Typography>
);

export const Caption = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Typography 
    size="xs" 
    weight="normal" 
    color="muted" 
    className={className}
  >
    {children}
  </Typography>
);