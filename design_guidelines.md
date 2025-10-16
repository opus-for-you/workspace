# Opus Design System - Classical Organic Aesthetic

## Design Philosophy

**Classical Oil Painting Meets Modern Design**
- Inspired by the layered depth and rich textures of classical oil paintings
- Organic, flowing shapes instead of rigid geometric boxes
- Borderless design with elevation through shadows
- Muted color palette with a strong dark forest green accent for personality

## Core Principles

### 1. Organic Shapes
- **No hard borders or sharp rectangular boxes**
- Irregular, natural border-radius values (16px/24px/32px combined)
- Blob-like containers with soft, flowing edges
- Asymmetric rounded corners for visual interest

### 2. Layered Depth (Chiaroscuro-inspired)
- **No borders** - depth comes from shadows and background elevation
- Multiple shadow layers for painterly depth:
  - Close shadows: subtle definition
  - Mid shadows: elevation
  - Far shadows: dramatic depth
- Background color shifts for hierarchy (ivory → alabaster → pure white)

### 3. Simplified Typography
- **Only 2 fonts**:
  - **Fraunces**: Display headings only (36-48px)
  - **Inter**: Everything else (body 16px, labels 14px, small 12px)
- **Dropped**: Crimson Pro, JetBrains Mono (too much variety)
- Clear size hierarchy: Large/Medium/Small only

### 4. Color Strategy

**Muted Foundation:**
- Ivory (#FAFAFA) - main background
- Alabaster (#F4F4F4) - elevated surfaces
- Pure White (#FFFFFF) - highest elevation
- Charcoal (#1C1C1C) - primary text
- Graphite (#505050) - secondary text
- Stone (#8A8A8A) - tertiary text

**Dark Forest Green Accent (#1B4332):**
- The ONLY accent color for personality
- Used sparingly on:
  - Call-to-action buttons
  - Active/selected states
  - Progress indicators
  - Important icons
- Creates focal points in the muted palette

### 5. Art & Texture
- Subtle canvas/paper texture overlays
- Organic blob shapes as decorative elements
- Gradient overlays for depth
- Classical painting-inspired visual rhythm

---

## Visual Elements

### Cards & Containers
```
Background: Pure white with organic shapes
Elevation: Layered shadows only (no borders!)
Border-radius: Asymmetric (24px 32px 24px 16px)
Shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)
Texture: Subtle canvas overlay
```

### Typography Scale
```
Display Heading: Fraunces 48px, weight 300
Section Heading: Fraunces 36px, weight 300
Body Text: Inter 16px, weight 400
Label Text: Inter 14px, weight 500
Small Text: Inter 12px, weight 400
```

### Spacing System (8px grid)
```
Tight: 8px
Comfortable: 16px
Generous: 24px
Spacious: 32px
Extra Spacious: 48px
```

### Shadow System (Painterly Depth)
```
Close: 0 1px 3px rgba(0,0,0,0.04)
Near: 0 2px 8px rgba(0,0,0,0.06)
Mid: 0 4px 16px rgba(0,0,0,0.08)
Far: 0 8px 24px rgba(0,0,0,0.10)
Deep: 0 16px 48px rgba(0,0,0,0.12)
```

### Interactive States
```
Default: Base color
Hover: Dark green glow (0 0 0 8px rgba(27,67,50,0.1))
Active: Darker green + deeper shadow
Focus: Dark green ring (2px)
```

---

## Component Patterns

### Dashboard Cards
- Organic rounded shapes with asymmetric corners
- Layered shadows for depth (NO borders)
- Pure white backgrounds with subtle canvas texture
- Dark green accent on interactive elements only
- Generous padding (24px-32px)

### Buttons
```
Primary: 
  - bg-[#1B4332] (dark forest green)
  - text-white
  - Organic rounded (16px)
  - Shadow: 0 4px 12px rgba(27,67,50,0.2)
  - Hover: Deeper shadow + slight scale

Secondary:
  - bg-alabaster
  - text-[#1B4332]
  - Same organic rounding
  - Subtle shadow

Ghost:
  - Transparent background
  - text-[#1B4332]
  - No shadow, only on hover
```

### Forms & Inputs
- Clean inputs with subtle shadow only (no borders)
- Labels in Inter 14px above inputs
- Dark green focus glow
- Organic rounded corners (12px)
- Background: pure white or alabaster

### Empty States
- Large organic blob shapes as decorative backgrounds
- Muted illustrations with green accents
- Generous whitespace (64px+ padding)
- Centered content with flowing composition

---

## Page-Specific Designs

### Dashboard
- Hero section with organic card shapes
- Asymmetric grid layout
- Dark green accents on active elements
- Layered shadows create depth hierarchy
- Generous spacing between sections (48px)

### Task Lists
- Flowing organic item containers
- Dark green for in-progress tasks
- Layered shadows increase on hover
- No borders, only elevation changes

### Weekly Review
- Large organic text areas
- Canvas texture backgrounds
- Dark green submit button
- Soft, irregular shapes throughout

---

## Implementation Guidelines

### CSS Architecture
```css
/* Remove ALL borders */
border: none !important;

/* Use organic shapes */
border-radius: 24px 32px 24px 16px; /* Asymmetric */

/* Layered shadows for depth */
box-shadow: 
  0 1px 3px rgba(0,0,0,0.04),
  0 4px 16px rgba(0,0,0,0.06);

/* Dark green accent */
--accent: #1B4332;

/* Subtle texture */
background-image: url('data:image/svg+xml,...'); /* Canvas pattern */
```

### Color Variables
```css
:root {
  /* Primary accent - THE personality color */
  --forest-green: #1B4332;
  --forest-green-light: #2D5F4F;
  --forest-green-dark: #0D3B2E;
  
  /* Remove all other accent colors */
  /* Use only muted neutrals + forest green */
}
```

### Component Classes
```css
.organic-card {
  background: white;
  border-radius: 24px 32px 24px 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  padding: 32px;
}

.organic-button-primary {
  background: #1B4332;
  color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(27,67,50,0.2);
}
```

---

## Brand Voice Through Design

The classical organic design communicates:
- **Sophistication** - Through painterly depth and organic shapes
- **Personality** - Through strategic dark green accents
- **Clarity** - Through simplified typography (2 fonts only)
- **Artfulness** - Through texture overlays and flowing forms
- **Calm** - Through muted neutrals and borderless design

This creates a productivity tool that feels like a classical painting come to life - organic, sophisticated, and intentionally crafted with artistic sensibility.
