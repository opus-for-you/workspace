// Design System Constants - Opus Editorial Brand Foundation
export const design = {
  colors: {
    // Primary Palette - Sophisticated Neutrals
    ink: '#0A0A0A',
    charcoal: '#1C1C1C',
    graphite: '#505050',
    stone: '#8A8A8A',
    fog: '#B8B8B8',
    pearl: '#E8E8E8',
    alabaster: '#F4F4F4',
    ivory: '#FAFAFA',
    pure: '#FFFFFF',
    
    // Accent Colors - Muted & Professional
    sage: {
      deep: '#1B4332',    // Primary brand color
      medium: '#2D5F4F',
      light: '#52796F',
      pale: '#8FA39B',
      soft: '#E8F0ED'
    },
    warm: {
      rust: '#A84843',
      sand: '#D4A574',
      cream: '#F5F2ED',
      bone: '#FAF8F3'
    },
    cool: {
      ocean: '#2C5282',
      sky: '#E1EBF4'
    }
  },
  
  typography: {
    fonts: {
      display: '"Fraunces", "Libre Baskerville", Georgia, serif',
      editorial: '"Crimson Pro", "Libre Baskerville", Georgia, serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace'
    },
    sizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
    },
    leading: {
      tight: 1.1,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    },
    tracking: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
      widest: '0.08em',
      extreme: '0.12em'
    }
  },
  
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    2: '0.5rem',      // 8px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
    40: '10rem',      // 160px
    48: '12rem',      // 192px
    56: '14rem',      // 224px
    64: '16rem',      // 256px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)'
  },
  
  animation: {
    duration: {
      instant: '75ms',
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
      slower: '700ms',
      lazy: '1000ms'
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }
} as const;
