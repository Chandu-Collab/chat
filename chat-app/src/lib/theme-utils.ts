// Theme utility functions for working with CSS custom properties

export const themeVars = {
  // Core colors
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  surface: 'var(--surface)',
  surfaceHover: 'var(--surface-hover)',
  
  // Primary colors
  primary: 'var(--primary)',
  primaryHover: 'var(--primary-hover)',
  secondary: 'var(--secondary)',
  secondaryHover: 'var(--secondary-hover)',
  
  // Accent colors
  accent: 'var(--accent)',
  accentHover: 'var(--accent-hover)',
  
  // Status colors
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  
  // Text colors
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  
  // Layout
  border: 'var(--border)',
  radius: 'var(--radius)',
  shadow: 'var(--shadow)',
  shadowHover: 'var(--shadow-hover)',
} as const;

export const getThemeVar = (variable: keyof typeof themeVars): string => {
  return themeVars[variable];
};

// CSS-in-JS style objects for common theme patterns
export const themeStyles = {
  card: {
    backgroundColor: themeVars.surface,
    border: `1px solid ${themeVars.border}`,
    borderRadius: themeVars.radius,
    boxShadow: themeVars.shadow,
  },
  
  button: {
    backgroundColor: themeVars.primary,
    color: themeVars.background,
    borderRadius: themeVars.radius,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
  
  buttonHover: {
    backgroundColor: themeVars.primaryHover,
    boxShadow: themeVars.shadowHover,
    transform: 'translateY(-1px)',
  },
  
  input: {
    backgroundColor: themeVars.surface,
    border: `1px solid ${themeVars.border}`,
    borderRadius: themeVars.radius,
    color: themeVars.textPrimary,
  },
} as const;