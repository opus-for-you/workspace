# Opus Design Guidelines - Editorial Magazine Aesthetic

## Design Philosophy

Opus embraces a **refined editorial magazine aesthetic** that prioritizes clean typography, generous whitespace, and sophisticated minimalism. The design draws inspiration from high-end print publications, creating a professional reading experience for young professionals managing their work and personal lives.

## Color System

### Editorial Neutrals
The foundation of our color palette consists of sophisticated grayscale tones:

- **Ink** `#0A0A0A` (hsl(0, 0%, 4%)) - Darkest text, reserved for emphasis
- **Charcoal** `#1C1C1C` (hsl(0, 0%, 11%)) - Primary text color
- **Graphite** `#4F4F4F` (hsl(0, 0%, 31%)) - Secondary text
- **Stone** `#8A8A8A` (hsl(0, 0%, 54%)) - Tertiary text, labels
- **Fog** `#B8B8B8` (hsl(0, 0%, 72%)) - Subtle text, hints
- **Pearl** `#E8E8E8` (hsl(0, 0%, 91%)) - Borders, dividers
- **Alabaster** `#F5F5F5` (hsl(0, 0%, 96%)) - Subtle backgrounds
- **Ivory** `#FAFAFA` (hsl(0, 0%, 98%)) - Main background
- **Pure** `#FFFFFF` (hsl(0, 0%, 100%)) - Cards, elevated surfaces

### Sage Green - Brand Accent
Sage green serves as our primary brand color, evoking growth, balance, and sophistication:

- **Sage Deep** `#1B4332` (hsl(160, 42%, 17%)) - Primary actions, focus states
- **Sage Medium** `#2D5F4F` (hsl(160, 35%, 30%)) - Hover states
- **Sage Default** `#52796F` (hsl(160, 20%, 40%)) - Secondary elements
- **Sage Light** `#8FA39B` (hsl(160, 15%, 50%)) - Disabled states
- **Sage Pale** `#A7BBB5` (hsl(160, 10%, 60%)) - Subtle accents
- **Sage Soft** `#E8F0ED` (hsl(160, 20%, 93%)) - Background tints

### Warm Accents
Used sparingly for emphasis and visual interest:

- **Rust** `#A8594E` (hsl(3, 40%, 48%)) - Destructive actions, alerts
- **Sand** `#C4A86D` (hsl(33, 44%, 60%)) - Highlights, callouts
- **Cream** `#F5F3F0` (hsl(30, 29%, 95%)) - Warm backgrounds
- **Bone** `#F9F8F6` (hsl(30, 29%, 97%)) - Subtle warm tint

## Typography System

### Four-Tier Font Hierarchy

1. **Display Font: Fraunces** (Serif)
   - Used for: Page titles, large headings (h1, h2)
   - Sizes: 36px - 80px
   - Weight: 200-300 (Light to Book)
   - Characteristics: Elegant, contemporary serif with optical sizing

2. **Editorial Font: Crimson Pro** (Serif)
   - Used for: Article-style content, pull quotes, feature headings
   - Sizes: 18px - 32px
   - Weight: 300-500
   - Characteristics: Readable serif for longer text passages

3. **Body Font: Inter** (Sans-serif)
   - Used for: Body text, UI elements, navigation, forms
   - Sizes: 14px - 18px
   - Weight: 400-600
   - Characteristics: Clean, highly legible at all sizes

4. **Mono Font: JetBrains Mono** (Monospace)
   - Used for: Data display, metrics, numbers, dates
   - Sizes: 12px - 16px
   - Weight: 400-500
   - Characteristics: Balanced monospace with programming ligatures

### Typography Scale

```
Display XL: clamp(3rem, 8vw, 5rem) / 1.05 / -0.02em / 300
Display LG: clamp(2.5rem, 6vw, 4rem) / 1.1 / -0.02em / 300
Display MD: clamp(2rem, 5vw, 3rem) / 1.2 / -0.01em / 300
Heading 1: 2.25rem (36px) / 1.25 / -0.01em / 300
Heading 2: 1.875rem (30px) / 1.3 / normal / 300
Heading 3: 1.5rem (24px) / 1.35 / normal / 400
Body Large: 1.125rem (18px) / 1.6 / normal / 400
Body: 1rem (16px) / 1.6 / normal / 400
Body Small: 0.875rem (14px) / 1.5 / normal / 400
Label: 0.75rem (12px) / 1.4 / 0.08em / 600 (uppercase)
```

### Letter Spacing

- **Tighter**: -0.02em (Display headings)
- **Tight**: -0.01em (Large headings)
- **Normal**: 0em (Body text)
- **Wide**: 0.02em (Buttons)
- **Wider**: 0.05em (Small text)
- **Widest**: 0.08em (Section labels)
- **Extreme**: 0.12em (Special emphasis)

## Layout & Spacing

### Whitespace Scale
Generous breathing room is essential to the editorial aesthetic:

```
2xs: 0.125rem (2px)
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
4xl: 6rem (96px)
```

### Container Patterns

**Section Spacing**: Use `gap-8` or larger between major sections
**Card Padding**: `p-6` or `p-8` for breathing room
**List Items**: `gap-4` minimum between items
**Form Fields**: `gap-6` between field groups

## Components

### Cards
```css
.editorial-card {
  background: white;
  border: 1px solid pearl (#E8E8E8);
  border-radius: 0.5rem (8px);
  padding: 1.5rem - 2rem;
}
```

### Metrics Display
- Large number: Fraunces 48px, light weight, charcoal
- Unit label: Uppercase, 10px, wide tracking (0.08em), stone color
- Layout: Number stacked above label, left-aligned

### Section Headers
- Style: Uppercase
- Size: 12px
- Tracking: 0.08em (widest)
- Color: Stone (#8A8A8A)
- Weight: 600 (Semibold)

### Priority Numbers
- Font: JetBrains Mono
- Size: 14px
- Format: 01, 02, 03... (padded)
- Color: Stone

### Hover Interactions
- Subtle translate effect: `translate-x-1` (4px right)
- Smooth transition: `transition-transform duration-200`
- Elevation effect: Apply `.hover-elevate` utility

## Borders & Dividers

### Border Philosophy
Minimal, intentional borders create subtle separation without visual noise:

- **Default border**: 1px solid Pearl (#E8E8E8)
- **Focus ring**: 2px solid Sage Deep
- **Dividers**: Pearl (#E8E8E8)

### When to Use Borders
- Cards and elevated surfaces
- Form inputs (default state)
- Table cells (subtle)
- Between distinct sections

### When to Skip Borders
- Adjacent cards with equal backgrounds
- Within grouped elements
- When whitespace provides sufficient separation

## Interactive States

### Button Hierarchy
1. **Primary**: Charcoal background, ivory text
2. **Secondary**: Alabaster background, charcoal text
3. **Accent**: Sage Deep background, pure text
4. **Destructive**: Rust background, pure text
5. **Ghost**: Transparent, hover elevates

### State Colors
- **Hover**: Apply `.hover-elevate` (subtle background lift)
- **Active**: Apply `.active-elevate-2` (stronger lift)
- **Focus**: Sage Deep ring, 2px offset
- **Disabled**: Opacity 50%, no interactions

## Animations

### Timing Functions
- **Ease-out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Entry animations
- **Ease-in**: `cubic-bezier(0.4, 0, 1, 1)` - Exit animations
- **Spring**: For interactive feedback

### Animation Library
```css
.animate-fade-in: fadeIn 0.5s ease-out
.animate-slide-up: slideUp 0.3s ease-out
.animate-scale-in: scaleIn 0.2s ease-out
.animate-progress: progress 1s ease-out
```

### Animation Guidelines
- Keep durations brief (200-500ms)
- Use sparingly for meaningful transitions
- Respect user motion preferences

## Accessibility

### Color Contrast
All text meets WCAG AA standards:
- Charcoal on Ivory: 15.8:1 (AAA)
- Graphite on Ivory: 7.8:1 (AAA)
- Stone on Ivory: 3.8:1 (AA)
- Sage Deep on Pure: 9.5:1 (AAA)

### Focus Indicators
- Visible 2px ring in Sage Deep
- 2px offset for clarity
- Never remove focus indicators

### Font Sizes
- Minimum body text: 14px
- Minimum interactive targets: 44x44px
- Line height: 1.5+ for body text

## Dark Mode

When dark mode is implemented:
- Invert the grayscale (Ivory → Charcoal background)
- Adjust Sage colors for sufficient contrast
- Maintain WCAG AA compliance
- Use slightly reduced opacity for borders

## Design Tokens Reference

### Tailwind Classes
```
Section Title: .section-title
Editorial Number: .editorial-number (48px Fraunces)
Editorial Label: .editorial-label (uppercase, tracked)
Priority Number: .priority-number (mono font)
Metric Card: .metric-card
Editorial Card: .editorial-card
Priority Item: .priority-item (with hover translate)
```

### CSS Variables
```
--font-sans: Inter
--font-serif: Fraunces (display)
--font-editorial: Crimson Pro
--font-mono: JetBrains Mono
--radius: 0.5rem (8px)
```

## Implementation Notes

1. **Headings**: All h1 elements automatically use Fraunces display font
2. **Numbers**: Use mono font for data consistency
3. **Spacing**: Prefer gap utilities over margin for consistent rhythm
4. **Borders**: Use Pearl color consistently across all bordered elements
5. **Cards**: Always include subtle border on white cards for definition
6. **Animation**: Apply sparingly, favor subtlety over drama

---

*Last updated: October 2025 - Editorial Magazine System v1.2*
