# Opus Documentation

This directory contains all documentation for the Opus project.

## Directory Structure

```
docs/
├── README.md                         # This file
├── opus-framework-5-pillars.md       # Core philosophy and framework
├── roadmap.md                        # Project roadmap and future plans
├── design/                           # Design system and UI components
│   ├── design-system-reference.md
│   ├── design-system-tailwind-config.ts
│   └── design-system-editorial-components.tsx
└── technical/                        # Technical documentation
    ├── ai-prompts-reference.json
    ├── api_endpoints.md
    ├── architecture.md
    ├── mobile-mvp-plan.md
    ├── push-notifications-setup.md
    └── setup_guide.md
```

## Quick Links

### Philosophy & Framework
- **[Opus Framework: 5 Pillars](./opus-framework-5-pillars.md)** - Core conceptual framework (Purpose, Rhythm, Network, Structure, Method)
- **[Roadmap](./roadmap.md)** - Project vision and future features

### Design System
- **[Design System Reference](./design/design-system-reference.md)** - Color palette, typography, animations
- **[Tailwind Config](./design/design-system-tailwind-config.ts)** - Complete Tailwind configuration
- **[Editorial Components](./design/design-system-editorial-components.tsx)** - Reusable React components

### Technical Docs
- **[Architecture](./technical/architecture.md)** - System architecture overview
- **[API Endpoints](./technical/api_endpoints.md)** - Backend API documentation
- **[Mobile MVP Plan](./technical/mobile-mvp-plan.md)** - Mobile implementation details
- **[AI Prompts Reference](./technical/ai-prompts-reference.json)** - AI prompt templates and strategies
- **[Setup Guide](./technical/setup_guide.md)** - Development environment setup
- **[Push Notifications](./technical/push-notifications-setup.md)** - Push notification configuration

## For New Contributors

Start with these docs in order:

1. **[Opus Framework: 5 Pillars](./opus-framework-5-pillars.md)** - Understand the philosophy
2. **[Architecture](./technical/architecture.md)** - Learn the tech stack
3. **[Setup Guide](./technical/setup_guide.md)** - Get your dev environment running
4. **[Design System Reference](./design/design-system-reference.md)** - Understand the visual language

## Design System Usage

The Opus design system emphasizes:
- **Editorial elegance** - Large, thoughtful typography using Fraunces and Crimson Pro
- **Breathing space** - Generous padding and margins
- **Minimal color** - Primarily grayscale with sage green accents
- **Smooth animations** - Subtle, refined transitions

See the [Design System Reference](./design/design-system-reference.md) for complete guidelines.

## AI Implementation

The app uses a hybrid AI approach:
- **Claude (Anthropic)** - Primary for coaching, empathy, goal generation
- **OpenAI GPT-4** - Primary for structured tasks, scheduling
- **Fallback system** - Graceful degradation if AI services fail

See [AI Prompts Reference](./technical/ai-prompts-reference.json) for prompt templates.

## Questions?

See [CLAUDE.md](../CLAUDE.md) in the project root for comprehensive implementation guidance.
