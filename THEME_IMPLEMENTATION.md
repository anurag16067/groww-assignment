# Theme System Implementation Guide

## Overview
FinBoard features a complete light/dark theme switching system with persistence, smooth transitions, and system preference detection.

## Features

### ✅ Core Features
- **Light/Dark Mode Toggle**: Switch between themes with a single click
- **Redux State Management**: Theme state managed in Redux store
- **localStorage Persistence**: Theme preference persists across sessions
- **System Preference Detection**: Automatically detects OS dark mode preference
- **Smooth Transitions**: 200ms smooth color transitions on theme change
- **No Flash on Load**: Theme applied before render to prevent white flash
- **Mobile Support**: Updates meta theme-color for mobile browsers
- **Export/Import**: Theme included in dashboard export/import

## Implementation Details

### 1. Tailwind Configuration
**File**: `tailwind.config.js`

```javascript
export default {
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
    },
  },
}
```

### 2. Redux State Management
**File**: `src/state/dashboardSlice.js`

#### Initial Theme Loading
```javascript
const getInitialTheme = () => {
  // 1. Check localStorage
  const savedTheme = localStorage.getItem('finboard_theme');
  if (savedTheme) return savedTheme;
  
  // 2. Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // 3. Default to light
  return 'light';
};
```

#### Theme Actions
- `toggleTheme()`: Toggles between light and dark, persists to localStorage
- `setTheme(theme)`: Sets specific theme ('light' or 'dark'), persists to localStorage

#### Theme Selector
```javascript
const theme = useSelector(selectTheme);
```

### 3. Persistence Layer
**File**: `src/utils/dashboardStorage.js`

#### Storage Key
```javascript
THEME: 'finboard_theme'
```

#### Methods
- `saveTheme(theme)`: Save theme to localStorage
- `loadTheme()`: Load theme from localStorage with fallback to system preference
- Theme included in `exportDashboard()` and `importDashboard()`

### 4. Smooth Transitions
**File**: `src/App.css`

```css
/* Global smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Custom scrollbar for dark mode */
::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-lg;
}
```

### 5. Flash Prevention
**File**: `index.html`

```html
<script>
  // Apply theme before React renders
  (function() {
    const theme = localStorage.getItem('finboard_theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

### 6. Theme Application
**File**: `src/App.jsx`

```javascript
useEffect(() => {
  const root = document.documentElement;
  
  // Apply theme class
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Update mobile meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', 
      theme === 'dark' ? '#111827' : '#ffffff'
    );
  }
}, [theme]);
```

## Usage

### Toggle Theme
```javascript
import { useDispatch } from 'react-redux';
import { toggleTheme } from './state/dashboardSlice';

function ThemeToggle() {
  const dispatch = useDispatch();
  
  return (
    <button onClick={() => dispatch(toggleTheme())}>
      Toggle Theme
    </button>
  );
}
```

### Set Specific Theme
```javascript
import { useDispatch } from 'react-redux';
import { setTheme } from './state/dashboardSlice';

// Set to dark
dispatch(setTheme('dark'));

// Set to light
dispatch(setTheme('light'));
```

### Access Current Theme
```javascript
import { useSelector } from 'react-redux';
import { selectTheme } from './state/dashboardSlice';

function MyComponent() {
  const theme = useSelector(selectTheme);
  
  return (
    <div>Current theme: {theme}</div>
  );
}
```

## Styling Guidelines

### Using Tailwind Dark Mode Classes
```jsx
// Background colors
<div className="bg-white dark:bg-gray-800">

// Text colors
<p className="text-gray-900 dark:text-white">

// Border colors
<div className="border-gray-200 dark:border-gray-700">

// Hover states
<button className="hover:bg-gray-100 dark:hover:bg-gray-700">

// Complex combinations
<div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
```

### Color Palette Recommendations

#### Light Mode
- Background: `bg-white`, `bg-gray-50`, `bg-gray-100`
- Text: `text-gray-900`, `text-gray-800`, `text-gray-700`
- Borders: `border-gray-200`, `border-gray-300`
- Accent: `bg-blue-600`, `text-blue-600`

#### Dark Mode
- Background: `dark:bg-gray-900`, `dark:bg-gray-800`, `dark:bg-gray-700`
- Text: `dark:text-white`, `dark:text-gray-100`, `dark:text-gray-200`
- Borders: `dark:border-gray-700`, `dark:border-gray-600`
- Accent: `dark:bg-blue-500`, `dark:text-blue-400`

## Testing

### Manual Testing Checklist
- [ ] Toggle theme using the button
- [ ] Theme persists after page reload
- [ ] Theme applies immediately on load (no flash)
- [ ] Smooth transitions between themes
- [ ] Export dashboard includes theme
- [ ] Import dashboard restores theme
- [ ] System preference detection works
- [ ] Mobile meta theme-color updates
- [ ] All UI components render correctly in both themes
- [ ] Scrollbars styled correctly in both themes

### Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Theme Not Persisting
**Issue**: Theme resets on page reload
**Solution**: Check localStorage is available and not blocked

```javascript
// Test localStorage
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage available');
} catch (e) {
  console.error('localStorage blocked');
}
```

### White Flash on Load
**Issue**: Brief white flash before dark theme applies
**Solution**: Inline script in `index.html` should run before React

### Transitions Too Slow/Fast
**Issue**: Theme transitions feel wrong
**Solution**: Adjust transition duration in `App.css`

```css
* {
  transition-duration: 150ms; /* Try different values */
}
```

### Missing Dark Mode Styles
**Issue**: Some components don't have dark mode styles
**Solution**: Add `dark:` variants to Tailwind classes

```jsx
// Before
<div className="bg-white">

// After
<div className="bg-white dark:bg-gray-800">
```

## Best Practices

### 1. Always Provide Dark Mode Variants
```jsx
// ✅ Good
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// ❌ Bad
<div className="bg-white text-gray-900">
```

### 2. Use Semantic Color Names
```jsx
// ✅ Good - adapts to theme
<button className="bg-primary-600 dark:bg-primary-500">

// ❌ Bad - hardcoded color
<button style={{ backgroundColor: '#2563eb' }}>
```

### 3. Test Both Themes
Always test your UI in both light and dark modes during development.

### 4. Consider Contrast
Ensure sufficient contrast in both themes for accessibility:
- Light mode: Dark text on light background
- Dark mode: Light text on dark background

### 5. Use CSS Variables for Custom Colors
```css
:root {
  --color-primary: #2563eb;
}

.dark {
  --color-primary: #3b82f6;
}
```

## Future Enhancements

### Potential Features
- [ ] Auto theme switching based on time of day
- [ ] Custom theme colors (user-defined palettes)
- [ ] High contrast mode for accessibility
- [ ] Multiple theme variants (blue, purple, green)
- [ ] Animated theme transition effects
- [ ] Per-widget theme overrides
- [ ] Schedule automatic theme switching

## API Reference

### Redux Actions
```typescript
// Toggle between light and dark
dispatch(toggleTheme())

// Set specific theme
dispatch(setTheme('light' | 'dark'))
```

### Redux Selectors
```typescript
// Get current theme
const theme = useSelector(selectTheme)
// Returns: 'light' | 'dark'
```

### Storage Utilities
```typescript
// Save theme
DashboardStorage.saveTheme(theme: 'light' | 'dark'): boolean

// Load theme
DashboardStorage.loadTheme(): 'light' | 'dark'

// Export dashboard (includes theme)
DashboardStorage.exportDashboard(): DashboardConfig

// Import dashboard (restores theme)
DashboardStorage.importDashboard(config: DashboardConfig)
```

## Performance Notes

- Theme transitions use CSS transitions (GPU-accelerated)
- localStorage operations are synchronous but fast (<1ms)
- Initial theme detection happens before React hydration
- Theme changes trigger only necessary re-renders via Redux

## Accessibility

- Theme preference respects system settings
- Sufficient color contrast in both modes
- Focus indicators visible in both themes
- No motion for users with `prefers-reduced-motion`

## Support

For issues or questions about the theme system:
1. Check this documentation
2. Review the implementation files listed above
3. Test in different browsers
4. Check browser console for errors
