# Opus Design Guidelines - Editorial System

## Design Approach: Magazine Editorial Aesthetic

**Selected Approach**: Editorial Typography-First Design  
**Justification**: Opus serves young professionals who appreciate refined, magazine-quality interfaces. The editorial approach emphasizes thoughtful content hierarchy through typography, generous whitespace, and minimal visual elements. This creates a calm, focused environment for reflection and planning.

**Core Principles**:
- Typography drives hierarchy and visual interest
- Minimal borders (primarily bottom borders for section separation)
- Generous whitespace and breathing room
- Serif display fonts for editorial impact
- Monospace numerals for metrics and data
- Light, clean backgrounds (ivory/white)
- Hover interactions through subtle border color changes

---

## Color Palette

### Editorial Light Mode (Primary)

**Neutrals** (HSL format for Tailwind):
- **Ink**: 0 0% 4% (#0A0A0A - darkest text)
- **Charcoal**: 0 0% 11% (#1C1C1C - primary text, dark elements)
- **Graphite**: 0 0% 31% (#505050 - secondary text)
- **Stone**: 0 0% 54% (#8A8A8A - tertiary text, labels)
- **Fog**: 0 0% 72% (#B8B8B8 - subtle text)
- **Pearl**: 0 0% 91% (#E8E8E8 - borders, dividers)
- **Alabaster**: 0 0% 96% (#F4F4F4 - subtle backgrounds)
- **Ivory**: 0 0% 98% (#FAFAFA - main background)
- **Pure**: 0 0% 100% (#FFFFFF - cards, elevated surfaces)

**Accent Colors**:
- **Forest**: 156 44% 20% (#1B4332 - success, growth)
- **Sage**: 171 22% 39% (#52796F - calm actions)
- **Rust**: 4 42% 46% (#A84843 - warnings, attention)
- **Sand**: 35 48% 64% (#D4A574 - warm highlights)
- **Ocean**: 208 50% 35% (#2C5282 - primary actions, links)

### Dark Mode (Optional)
Uses inverted neutral scale with same accent colors for consistency.

---

## Typography

### Font Families

**Display/Editorial** (Google Fonts):
- **Fraunces** - Serif display font for headlines, hero text, large numbers
- Fallback: 'Libre Baskerville', Georgia, serif
- Usage: Page titles, section headers, metric displays, quotes

**Body/Interface** (System fonts):
- **Inter** - Sans-serif for all UI text, forms, content
- Fallback: -apple-system, BlinkMacSystemFont, sans-serif
- Usage: Paragraphs, buttons, labels, navigation

**Monospace/Data** (Developer fonts):
- **JetBrains Mono** - For numbers, dates, code, metrics
- Fallback: 'SF Mono', Monaco, monospace
- Usage: Dates, priorities, percentages, data points

### Typography Scale

**Headlines** (Fraunces serif):
- Hero/Onboarding: `clamp(2.5rem, 8vw, 4.5rem)` font-light tracking-tighter
- Dashboard Title: `clamp(2rem, 5vw, 3.5rem)` font-light tracking-tight
- Section Headers: text-2xl md:text-3xl font-light

**Body Text** (Inter):
- Primary: text-base md:text-lg leading-relaxed
- Secondary: text-sm md:text-base text-graphite
- Labels/Meta: text-xs tracking-widest uppercase text-stone

**Data/Numbers** (JetBrains Mono):
- Large Metrics: text-4xl md:text-5xl font-light
- Priorities: text-xl md:text-2xl font-extralight text-fog
- Dates/Times: text-sm text-stone

### Letter Spacing
- Uppercase labels: tracking-[0.08em]
- Headlines: tracking-tight (-0.02em)
- Navigation: tracking-[0.02em]
- Body text: tracking-normal

---

## Layout System

### Spacing Philosophy
**Editorial breathing room** - More generous than typical productivity apps:
- Small: 1rem (p-4, gap-4) - between list items
- Medium: 1.5rem (p-6, gap-6) - card padding
- Large: 4rem (p-16, gap-16) - section spacing
- Extra: 6rem (p-24) - hero/onboarding spacing

### Container Strategy
- **Editorial Content**: max-w-3xl (forms, onboarding, reflection)
- **Dashboard Grid**: max-w-7xl with editorial 2:1 column ratio
- **Full Width**: Main content areas with px-8 md:px-16 horizontal padding

### Grid Patterns
- **Dashboard**: grid-cols-1 lg:grid-cols-3 gap-16 (2/3 + 1/3 split)
- **Lists**: Single column, full width with bottom borders
- **Metrics Grid**: grid-cols-1 md:grid-cols-2 gap-12
- **Cards**: Minimal, mostly replaced by bottom-bordered sections

---

## Component Library

### Navigation (Minimal Top Bar)
- **Structure**: Horizontal flex with logo + nav links + menu
- **Styling**: 
  - Border bottom: 1px solid pearl
  - Logo: Fraunces font-light text-2xl text-charcoal
  - Links: Inter text-sm tracking-[0.02em]
  - Active: text-charcoal (not stone)
  - Hover: color transition to charcoal
- **No background color** - transparent over ivory

### Section Headers
- **Style**: Bottom border (1px solid pearl) with pb-4
- **Typography**: text-sm tracking-widest uppercase text-charcoal
- **Optional**: Flex justify-between with metadata (date/count) in stone

### Content Lists
- **Items**: 
  - Bottom border divider (1px solid pearl) with pb-6
  - Hover: border color transitions to charcoal
  - No background changes
  - Flex layout with mono priority numbers + content
- **Numbers**: JetBrains Mono text-2xl text-fog font-extralight
- **Spacing**: space-y-6 between items

### Forms & Inputs
- **Text Inputs**: 
  - Transparent background
  - Bottom border only (1px solid fog)
  - Focus: border-charcoal transition
  - No rounded corners or heavy backgrounds
  - text-lg leading-relaxed
  - Placeholder: "..." (minimal)

### Buttons
- **Primary**: 
  - bg-charcoal text-pure
  - px-6 py-3
  - text-xs tracking-widest uppercase
  - Hover: inverts to bg-pure text-charcoal with 1px border
- **Secondary**: 
  - Transparent with text-stone
  - Hover: text-charcoal transition
  - Often just text links with arrow icons

### Cards/Elevated Surfaces
- **Sidebar Cards**:
  - bg-pure (white on ivory background)
  - border: 1px solid pearl
  - Padding: p-6
  - No rounded corners or minimal rounding
- **Replace heavy cards with bottom-bordered sections** in main content

### Progress Indicators
- **Linear Progress**:
  - 1px height background in pearl
  - Fill in charcoal
  - No rounded ends
  - Used for onboarding steps, goal progress

### Metrics Display
- **Large Numbers**: Fraunces text-5xl font-light text-charcoal
- **Unit Labels**: text-xs tracking-widest text-stone
- **Context**: text-sm text-graphite below metric

---

## Page-Specific Designs

### Onboarding (Editorial Full Screen)
- **Layout**: Centered content, max-w-3xl
- **Progress**: 1px line indicator at top
- **Question**: Fraunces hero size with category label above
- **Input**: Transparent textarea with bottom border only
- **Navigation**: Minimal BACK/CONTINUE buttons at bottom
- **Step Counter**: Centered at page bottom

### Dashboard (Editorial Grid)
- **Hero Section**: 
  - Label: "YOUR NORTH STAR" in stone
  - Statement: Fraunces large text in charcoal (max-w-900px)
- **Content**: 2/3 main + 1/3 sidebar split
- **Main Column**: 
  - "THIS WEEK" section with dated tasks
  - "CURRENT CHAPTER" metrics grid
- **Sidebar**: 
  - Reflection prompt card
  - Energy patterns
  - Upcoming items list

### Connections Page
- **View**: Editorial list with bottom borders
- **Items**: Name (large) + relationship + last contact
- **Metadata**: text-sm text-stone with bullet separators

### Tasks & Goals
- **List View**: Priority number + title + metadata
- **Typography hierarchy**: Large serif titles, mono priorities
- **Hover**: Border darkening, no background changes

### Weekly Review
- **Layout**: Centered, max-w-3xl
- **Sections**: Bottom-bordered with uppercase labels
- **Inputs**: Minimal textarea with bottom borders
- **Historical**: Timeline with subtle left border indicators

---

## Interactions & Animations

**Minimal & Intentional**:
- Border color transitions: duration-200 (fog → charcoal on hover)
- Text color transitions: duration-200 (stone → charcoal on hover)
- Button inversion: background/color swap on hover
- Arrow icons: translate-x-1 on hover
- NO background color changes on cards
- NO elevation/shadow changes
- NO complex animations

### Hover States
- **List Items**: Border bottom darkens (pearl → charcoal)
- **Navigation Links**: Text color darkens (stone → charcoal)
- **Buttons**: Invert colors with border
- **Icons**: Slight translation (1-2px)

---

## Responsive Behavior

- **Breakpoints**: Mobile-first (base → md:768px → lg:1024px)
- **Typography**: clamp() for fluid scaling
- **Padding**: px-8 on mobile → px-16 on desktop
- **Grid**: Single column on mobile, editorial splits on desktop
- **Navigation**: Same minimal bar, menu button for mobile

---

## Brand Voice Through Design

The editorial design communicates:
- **Thoughtfulness** - Through generous whitespace and typography
- **Clarity** - Through minimal borders and clean hierarchy  
- **Sophistication** - Through serif fonts and magazine layouts
- **Focus** - Through light backgrounds and calm colors
- **Professionalism** - Through editorial polish and restraint

This creates a productivity tool that feels like reading a well-designed magazine - calm, focused, and intentionally crafted for deep work and reflection.
