# Design System Standards

## Icon Standardization

All icons across the platform now follow consistent sizing and usage patterns.

### Icon Sizes
- **xs**: `h-3 w-3` (12px) - Very small icons, badges, inline indicators
- **sm**: `h-4 w-4` (16px) - Small icons, buttons, form elements
- **md**: `h-5 w-5` (20px) - Standard icons, navigation, toolbars
- **lg**: `h-6 w-6` (24px) - Larger buttons, section headers
- **xl**: `h-8 w-8` (32px) - Header icons, prominent features
- **2xl**: `h-10 w-10` (40px) - Hero sections, main branding
- **3xl**: `h-12 w-12` (48px) - Large decorative icons

### Usage with Icon Component
```tsx
import { Icon, Avatar, IconButton } from '@/components/ui/icon';
import { MessageSquare, Plus, Settings } from 'lucide-react';

// Standard icon usage
<Icon icon={MessageSquare} size="md" color="primary" />

// Avatar with icon
<Avatar icon={MessageSquare} size="sm" gradient />

// Icon button
<IconButton 
  icon={Plus} 
  size="md" 
  color="accent"
  onClick={handleClick}
/>
```

## Typography Standardization

All text across the platform uses consistent sizing and weight patterns.

### Text Sizes
- **xs**: `text-xs` (12px) - Captions, helper text, timestamps
- **sm**: `text-sm` (14px) - Body text, labels, descriptions
- **base**: `text-base` (16px) - Primary content, paragraphs
- **lg**: `text-lg` (18px) - Emphasized content, subtitles
- **xl**: `text-xl` (20px) - Section headers
- **2xl**: `text-2xl` (24px) - Page headers
- **3xl**: `text-3xl` (30px) - Large headers
- **4xl**: `text-4xl` (36px) - Hero headers

### Font Weights
- **light**: `font-light` (300) - Large headings, elegant text
- **normal**: `font-normal` (400) - Body text, default weight
- **medium**: `font-medium` (500) - Emphasis, labels
- **semibold**: `font-semibold` (600) - Strong emphasis
- **bold**: `font-bold` (700) - Heavy emphasis, alerts

### Usage with Typography Component
```tsx
import { Typography, Heading, Label, Caption } from '@/components/ui/typography';

// Standard text
<Typography size="sm" weight="medium" color="primary">
  Button Label
</Typography>

// Headings (auto-configured)
<Heading level={1}>Page Title</Heading>
<Heading level={3}>Section Title</Heading>

// Pre-configured variants
<Label>Form Label</Label>
<Caption>Helper text or timestamps</Caption>
```

## Color System

### Semantic Colors
- **primary**: Main text color (dark/light aware)
- **secondary**: Secondary text, subtitles
- **muted**: Helper text, placeholders
- **disabled**: Inactive elements
- **accent**: Brand colors, highlights
- **success**: Success states, confirmations
- **warning**: Warnings, alerts
- **error**: Errors, destructive actions
- **white**: Always white (for dark backgrounds)

## Component Standards Applied

### Before (Inconsistent)
```tsx
// Different icon sizes everywhere
<MessageSquare className="h-4 w-4" />
<Plus className="h-5 w-5" />
<Settings className="h-6 w-6" />

// Inconsistent text styling
<h1 className="text-xl font-light">Title</h1>
<span className="text-sm text-gray-500">Label</span>
<div className="text-xs opacity-70">Timestamp</div>
```

### After (Standardized)
```tsx
// Consistent icon usage
<Icon icon={MessageSquare} size="sm" color="primary" />
<Icon icon={Plus} size="md" color="white" />
<Icon icon={Settings} size="sm" color="muted" />

// Consistent typography
<Heading level={1}>Title</Heading>
<Label>Label</Label>
<Caption>Timestamp</Caption>
```

## Updated Components

### ✅ Sidebar (`/components/sidebar.tsx`)
- Header with Avatar component
- Standardized icon buttons
- Consistent typography for titles and labels
- Proper icon sizing throughout

### ✅ Chat Interface (`/components/chat-interface.tsx`)
- Hero section with Avatar
- Consistent headings and descriptions
- Standardized quick action buttons

### ✅ Message Bubble (`/components/message-bubble.tsx`)
- Avatar components for both AI and user
- Standardized timestamps with Caption
- Consistent icon sizes for actions

### ✅ Main Page (`/components/page.tsx`)
- Header with Avatar branding
- Consistent app title typography

## Files Added
- `/lib/design-system.ts` - Design tokens and presets
- `/components/ui/icon.tsx` - Standardized Icon, Avatar, IconButton
- `/components/ui/typography.tsx` - Typography, Heading, Label, Caption

## Benefits
1. **Consistent Visual Hierarchy**: All text follows the same sizing scale
2. **Uniform Icon Sizes**: No more random icon sizes across components  
3. **Theme Integration**: All components work seamlessly with light/dark modes
4. **Maintainability**: Changes to design tokens update the entire app
5. **Developer Experience**: Clear component APIs with semantic props
6. **Accessibility**: Consistent sizing improves screen reader experience

## Migration Guide
Replace direct Lucide icons and text elements with standardized components:

```tsx
// Old way
<MessageSquare className="h-5 w-5 text-gray-500" />
<p className="text-sm font-medium text-gray-900">Label</p>

// New way  
<Icon icon={MessageSquare} size="md" color="muted" />
<Typography size="sm" weight="medium" color="primary">Label</Typography>
```