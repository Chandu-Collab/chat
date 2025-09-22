# Theme System Documentation

This chat application implements a comprehensive theme system with support for light, dark, and system modes.

## Architecture

### ThemeProvider (`/src/contexts/theme-context.tsx`)
The core theme context that manages theme state and applies CSS classes.

**Features:**
- Three theme modes: `light`, `dark`, `system`
- Automatic system preference detection
- Local storage persistence
- Real-time system preference changes

### Theme Hooks (`/src/hooks/use-theme.ts`)

#### `useTheme()`
```tsx
const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
```

#### `useIsDark()` / `useIsLight()`
```tsx
const isDark = useIsDark();
const isLight = useIsLight();
```

#### `useThemeColors()`
```tsx
const { background, surface, text, hover } = useThemeColors();
```

### ThemeToggle Component (`/src/components/theme-toggle.tsx`)

**Variants:**
- `default`: Standard button with icon
- `compact`: Smaller button for tight spaces
- `dropdown`: Dropdown menu with all three options

**Usage:**
```tsx
<ThemeToggle variant="dropdown" showLabel={true} />
```

### CSS Custom Properties (`/src/app/globals.css`)

**Available variables:**
```css
:root {
  --background: #ffffff;
  --foreground: #1f1f1f;
  --surface: #f8f9fa;
  --primary: #1976d2;
  --accent: #4285f4;
  --text-primary: #1f1f1f;
  --text-secondary: #5f6368;
  --border: #dadce0;
  --radius: 12px;
  --shadow: ...;
}
```

### Theme Utilities (`/src/lib/theme-utils.ts`)

**CSS-in-JS support:**
```tsx
import { themeVars, themeStyles } from '@/lib/theme-utils';

const style = {
  backgroundColor: themeVars.surface,
  ...themeStyles.card
};
```

### Themed Components (`/src/components/themed-components.tsx`)

Pre-built components that automatically adapt to theme:

```tsx
<ThemedCard variant="elevated">
  <ThemedButton variant="primary" size="md">
    Click me
  </ThemedButton>
</ThemedCard>
```

## Usage Examples

### Basic Theme Toggle
```tsx
import { ThemeToggle } from '@/components/theme-toggle';

function Header() {
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

### Theme-Aware Component
```tsx
import { useTheme, useThemeColors } from '@/hooks/use-theme';

function MyComponent() {
  const { actualTheme } = useTheme();
  const colors = useThemeColors();
  
  return (
    <div className={`${colors.background} ${colors.text}`}>
      Current theme: {actualTheme}
    </div>
  );
}
```

### Using CSS Variables
```tsx
function StyledComponent() {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)'
    }}>
      Themed content
    </div>
  );
}
```

### Conditional Styling
```tsx
import { useIsDark } from '@/hooks/use-theme';

function ConditionalComponent() {
  const isDark = useIsDark();
  
  return (
    <div className={isDark ? 'special-dark-style' : 'special-light-style'}>
      Theme-dependent content
    </div>
  );
}
```

## Theme Switching Modes

1. **Light**: Force light mode
2. **Dark**: Force dark mode  
3. **System**: Follow system preference (default)

The toggle button cycles through: Light → Dark → System → Light...

## Customization

### Adding New Theme Variables
1. Add to `:root` and `.dark` in `globals.css`
2. Export from `themeVars` in `theme-utils.ts`
3. Add to `useThemeColors()` if needed

### Custom Theme Colors
```css
:root {
  --custom-accent: #ff6b6b;
}

.dark {
  --custom-accent: #ff8e8e;
}
```

## Best Practices

1. **Use CSS variables** for colors that need to change with theme
2. **Use Tailwind's dark: variants** for simple cases
3. **Use theme hooks** for complex conditional logic
4. **Test both themes** during development
5. **Use semantic color names** (surface, accent) instead of literal ones (gray-100)

## Integration

The theme system is automatically available throughout the app via the ThemeProvider in `layout.tsx`. No additional setup required for new components.