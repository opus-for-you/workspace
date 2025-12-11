# Opus Editorial Design System

A comprehensive design system for Opus, emphasizing editorial elegance, breathing space, and thoughtful typography.

## Color Palette

### Neutrals (Grayscale)
```css
--ink: #0A0A0A;        /* Deepest black */
--charcoal: #1C1C1C;   /* Primary text */
--graphite: #505050;   /* Secondary text */
--stone: #8A8A8A;      /* Tertiary text / subtle elements */
--fog: #B8B8B8;        /* Disabled / muted elements */
--pearl: #E8E8E8;      /* Borders / dividers */
--alabaster: #F4F4F4;  /* Light backgrounds */
--ivory: #FAFAFA;      /* Primary background */
--pure: #FFFFFF;       /* Cards / elevated surfaces */
```

### Brand Colors (Earth Tones)
```css
--sage-deep: #1B4332;    /* Primary action / forest green */
--sage-medium: #2D5F4F;  /* Secondary green */
--sage-light: #52796F;   /* Accent green */
--sage-soft: #8FA39B;    /* Light sage */
--sage-whisper: #E8F0ED; /* Sage tint */

--rust: #A84843;         /* Error / destructive actions */
--sand: #D4A574;         /* Warning / highlight */
--cream: #F5F2ED;        /* Warm background variant */
```

## Typography

### Font Families
```css
--font-display: 'Fraunces', 'Georgia', serif;
--font-editorial: 'Crimson Pro', 'Georgia', serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
```

### Font Sizes & Line Heights
```css
/* Editorial Scale - Expressive, large type */
--text-editorial-xs: 0.75rem;    /* 12px, tracking: 0.12em */
--text-editorial-sm: 0.875rem;   /* 14px, tracking: 0.08em */
--text-editorial-base: 1rem;     /* 16px, line-height: 1.8 */
--text-editorial-lg: 1.125rem;   /* 18px, line-height: 1.75 */
--text-editorial-xl: 1.25rem;    /* 20px, line-height: 1.6 */
--text-editorial-2xl: 1.5rem;    /* 24px, line-height: 1.4 */
--text-editorial-3xl: 1.875rem;  /* 30px, line-height: 1.3 */
--text-editorial-4xl: 2.25rem;   /* 36px, line-height: 1.2 */
--text-editorial-5xl: 3rem;      /* 48px, line-height: 1.1 */
--text-editorial-6xl: 3.75rem;   /* 60px, line-height: 1.05 */
--text-editorial-7xl: 4.5rem;    /* 72px, line-height: 1 */
```

### Letter Spacing
```css
--tracking-extreme: 0.12em;  /* Labels, small caps */
--tracking-wider: 0.08em;    /* Section headers */
--tracking-tight: -0.02em;   /* Large display text */
```

## Component Patterns

### Editorial Heading Styles
```css
.editorial-heading-xl {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--charcoal);
}

.editorial-heading-lg {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  line-height: 1.2;
  color: var(--charcoal);
}

.editorial-heading-md {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 300;
  line-height: 1.3;
  color: var(--charcoal);
}
```

### Editorial Label (Category/Section Headers)
```css
.editorial-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--stone);
}
```

### Editorial Body Text
```css
.editorial-body {
  font-family: var(--font-editorial);
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--graphite);
}
```

### Breathing Space
```css
.breathing-space {
  padding: 4rem 2rem;
}

@media (min-width: 768px) {
  .breathing-space {
    padding: 6rem 4rem;
  }
}

@media (min-width: 1024px) {
  .breathing-space {
    padding: 8rem 8rem;
  }
}
```

## Animations

### Keyframes
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-from-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Animation Classes
```css
.animate-rise {
  animation: rise 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

## Design Principles

### 1. Generous White Space
- Use padding liberally (4rem, 6rem, 8rem for sections)
- Let content breathe
- Avoid cramming elements together

### 2. Editorial Typography
- Use Fraunces (display serif) for headings
- Use Crimson Pro for longer-form editorial content
- Use Inter for UI elements and body text
- Generous line-height (1.75-1.8) for readability

### 3. Minimal Color Usage
- Rely on grayscale for most elements
- Use sage green sparingly for primary actions
- Rust/sand only for warnings/errors

### 4. Subtle Borders
- Use --pearl (#E8E8E8) for most dividers
- 1px borders, not heavy
- Create visual hierarchy through spacing, not heavy borders

### 5. Smooth Transitions
- All color/opacity changes: 200-300ms
- Transforms: cubic-bezier(0.34, 1.56, 0.64, 1) for bounce
- ease-out for entrances

## Font Loading

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400&family=Crimson+Pro:wght@300;400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet">
```

### CSS
```css
body {
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Usage Examples

### Section Header with Label
```jsx
<div className="mb-16">
  <p className="editorial-label mb-6">YOUR NORTH STAR</p>
  <h1 className="editorial-heading-xl max-w-5xl">
    Build products that bridge human needs with technological possibility.
  </h1>
</div>
```

### Card with Breathing Space
```jsx
<div className="bg-pure border border-pearl rounded-lg p-8 breathing-space">
  <h3 className="editorial-heading-md mb-4">Weekly Reflection</h3>
  <p className="editorial-body">Your reflection content...</p>
</div>
```

### Subtle Hover Interaction
```css
.card {
  transition: all 0.3s ease;
  border: 1px solid var(--pearl);
}

.card:hover {
  border-color: var(--stone);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
```
