# Opus Design Guidelines

## Design Approach: Modern Productivity System

**Selected Approach**: Design System-Based (Linear + Notion inspired)  
**Justification**: Opus is a utility-focused productivity tool requiring information density, clear hierarchy, and consistent patterns. Young professionals need efficient task management without visual distractions.

**Core Principles**:
- Clarity over decoration
- Information density with breathing room
- Scannable data hierarchies
- Purposeful micro-interactions
- Professional yet approachable aesthetics

---

## Color Palette

### Dark Mode (Primary)
- **Background**: 222 14% 8% (deep charcoal)
- **Surface**: 222 12% 12% (elevated panels)
- **Surface Elevated**: 222 10% 16% (cards, modals)
- **Border**: 222 8% 24% (subtle dividers)
- **Text Primary**: 210 12% 92% (high contrast)
- **Text Secondary**: 210 8% 65% (muted content)
- **Primary Brand**: 210 85% 58% (vibrant blue - trust & productivity)
- **Success**: 142 76% 45% (goal completion, positive actions)
- **Warning**: 38 92% 50% (overdue tasks, attention needed)
- **Accent**: 280 65% 60% (subtle purple for highlights)

### Light Mode (Secondary)
- **Background**: 0 0% 98%
- **Surface**: 0 0% 100%
- **Text Primary**: 222 20% 12%
- **Primary Brand**: 210 100% 48%

---

## Typography

**Font Families** (via Google Fonts CDN):
- **Primary**: Inter (UI text, body, forms)
- **Accent**: JetBrains Mono (code, dates, metrics)

**Hierarchy**:
- **Hero/Dashboard Title**: text-3xl md:text-4xl font-bold tracking-tight
- **Section Headers**: text-xl md:text-2xl font-semibold
- **Card Titles**: text-lg font-medium
- **Body Text**: text-sm md:text-base
- **Captions/Meta**: text-xs md:text-sm text-secondary
- **Monospace Data**: font-mono text-sm (dates, numbers, status)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Tight spacing: p-2, gap-2 (form elements, tags)
- Standard spacing: p-4, gap-4 (cards, lists)
- Section spacing: p-6 md:p-8, gap-6 (page sections)
- Page margins: p-8 md:p-12 (main containers)

**Container Strategy**:
- Max width: max-w-7xl (dashboard, lists)
- Narrow content: max-w-4xl (forms, weekly review)
- Full width: w-full (data tables, kanban boards)

**Grid Patterns**:
- Dashboard cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- Task lists: Single column with max-w-4xl
- Connections grid: grid-cols-1 md:grid-cols-2 gap-3

---

## Component Library

### Navigation
- **Top Navigation Bar**: Sticky header with logo, main nav links, user avatar
- **Mobile**: Hamburger menu with slide-out drawer
- **Active States**: Border-bottom indicator (border-b-2 border-primary)

### Dashboard Cards
- Rounded corners: rounded-lg
- Elevation: bg-surface border border-border
- Padding: p-6
- Hover: hover:border-primary/50 transition-colors
- Header: Flex row with icon, title, action button
- Content: Metric displays, mini charts, quick actions

### Task/Goal Lists
- **List Items**: 
  - Checkbox + title + metadata (due date, priority)
  - Hover background: hover:bg-surface-elevated
  - Status indicators: Color-coded badges (rounded-full px-2 py-1)
- **Grouping**: Separate by status/date with subtle dividers

### Forms
- **Input Fields**: 
  - Dark background: bg-surface-elevated
  - Border: border border-border focus:border-primary
  - Padding: px-4 py-3
  - Rounded: rounded-md
- **Buttons**:
  - Primary: bg-primary text-white px-6 py-2.5 rounded-md
  - Secondary: border border-border hover:bg-surface-elevated
  - Danger: bg-warning/10 text-warning border-warning

### Data Display
- **Tables**: Minimal design with hover rows, sticky headers
- **Cards**: Compact information cards with icon + title + metadata
- **Progress Bars**: Thin (h-1.5), rounded-full, gradient fills for visual interest
- **Badges/Tags**: Small rounded-full pills with category colors

### Modals/Dialogs
- **Overlay**: bg-black/60 backdrop-blur-sm
- **Panel**: bg-surface-elevated rounded-xl shadow-2xl max-w-2xl
- **Slide-in animations**: From right for forms, from center for confirmations

### Icons
- **Library**: Heroicons (CDN)
- **Sizes**: w-5 h-5 (inline), w-6 h-6 (headers), w-8 h-8 (empty states)
- **Color**: text-secondary (default), text-primary (active/selected)

---

## Page-Specific Designs

### Dashboard
- **Header**: Welcome message + quick stats (4 metric cards in grid)
- **Sections**: Upcoming tasks (list), Goal progress (cards with progress bars), Connection reminders (compact cards)
- **Layout**: Single column on mobile, 2-column on desktop with 2:1 ratio

### Connections Page
- **View Toggle**: List vs Grid view
- **Cards**: Photo placeholder + name + relationship + last contact date
- **Actions**: Quick "Log interaction" button, edit/delete icons
- **Search/Filter**: Top bar with search input + filter dropdowns

### Tasks & Goals
- **Kanban View Option**: Drag-and-drop columns (To Do, In Progress, Done)
- **List View**: Checkbox + title + due date + goal tag + priority indicator
- **Quick Add**: Floating action button (bottom right on mobile)

### Weekly Review
- **Form Layout**: Single column, max-w-3xl centered
- **Sections**: Date picker, rich text areas for wins/lessons/next steps
- **AI Prompt**: Button to "Generate reflection prompts" (placeholder)
- **History**: Timeline view of past reviews (left border indicator)

---

## Animations

**Minimal & Purposeful**:
- Page transitions: Fade-in (opacity) only
- Hover states: transition-colors duration-200
- Modal entry: Scale + fade (from 95% to 100%)
- Task completion: Checkbox check animation (CSS only)
- NO scroll-triggered animations
- NO decorative particles/effects

---

## Images

**Dashboard Hero (Optional)**:
- Abstract geometric pattern or gradient mesh background
- Subtle, non-distracting, in brand colors
- Height: 200px on desktop, 120px on mobile
- Overlay: text-white with semi-transparent background

**Empty States**:
- Illustration style: Line art, monochrome (primary color)
- Placement: Centered in empty task lists, connections grid
- Message: Encouraging call-to-action text below

**User Avatars**:
- Circular with colored fallback (initials on colored background)
- Sizes: w-8 h-8 (nav), w-12 h-12 (connections), w-16 h-16 (profile)

---

## Responsive Behavior

- **Breakpoints**: Mobile-first (base → md:768px → lg:1024px)
- **Navigation**: Full nav on desktop, hamburger on mobile
- **Cards**: Stack to single column below md
- **Tables**: Horizontal scroll on mobile with sticky first column
- **Modals**: Full screen on mobile, centered panel on desktop

This design creates a professional, efficient productivity tool that young professionals will enjoy using daily while maintaining clarity and reducing cognitive load.