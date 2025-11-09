/**
 * Opus Editorial Design System - Tailwind Config Reference
 *
 * This is a reference implementation of the Opus editorial design system
 * in Tailwind CSS format. Use this as inspiration for applying the design
 * system to your current Tailwind configuration.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // shadcn/ui base colors (keep for component compatibility)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Opus Editorial Palette - Neutrals
        ink: "#0A0A0A",
        charcoal: "#1C1C1C",
        graphite: "#505050",
        stone: "#8A8A8A",
        fog: "#B8B8B8",
        pearl: "#E8E8E8",
        alabaster: "#F4F4F4",
        ivory: "#FAFAFA",
        pure: "#FFFFFF",

        // Opus Editorial Palette - Brand Colors
        sage: {
          DEFAULT: "#52796F",
          deep: "#1B4332",
          medium: "#2D5F4F",
          light: "#8FA39B",
          soft: "#E8F0ED"
        },

        warm: {
          rust: "#A84843",
          sand: "#D4A574",
          cream: "#F5F2ED"
        },

        // shadcn/ui semantic colors (keep for component compatibility)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        editorial: ["Crimson Pro", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Monaco", "monospace"],
      },

      fontSize: {
        // Standard sizes
        "2xs": "0.625rem",

        // Editorial scale with custom line-heights
        "editorial-xs": ["0.75rem", { letterSpacing: "0.12em" }],
        "editorial-sm": ["0.875rem", { letterSpacing: "0.08em" }],
        "editorial-base": ["1rem", { lineHeight: "1.8" }],
        "editorial-lg": ["1.125rem", { lineHeight: "1.75" }],
        "editorial-xl": ["1.25rem", { lineHeight: "1.6" }],
        "editorial-2xl": ["1.5rem", { lineHeight: "1.4" }],
        "editorial-3xl": ["1.875rem", { lineHeight: "1.3" }],
        "editorial-4xl": ["2.25rem", { lineHeight: "1.2" }],
        "editorial-5xl": ["3rem", { lineHeight: "1.1" }],
        "editorial-6xl": ["3.75rem", { lineHeight: "1.05" }],
        "editorial-7xl": ["4.5rem", { lineHeight: "1" }],
      },

      letterSpacing: {
        extreme: "0.12em",
        wider: "0.08em",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        // shadcn/ui animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        // Opus editorial animations
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "rise": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        // shadcn/ui animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Opus editorial animations
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-in": "slide-in-from-left 0.3s ease-out",
        "rise": "rise 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;

/**
 * CSS Variables to add to your index.css:
 *
 * @layer base {
 *   :root {
 *     --background: 0 0% 100%;
 *     --foreground: 0 0% 11%;
 *     --card: 0 0% 100%;
 *     --card-foreground: 0 0% 11%;
 *     --popover: 0 0% 100%;
 *     --popover-foreground: 0 0% 11%;
 *     --primary: 164 44% 20%;
 *     --primary-foreground: 0 0% 98%;
 *     --secondary: 0 0% 96%;
 *     --secondary-foreground: 0 0% 11%;
 *     --muted: 0 0% 96%;
 *     --muted-foreground: 0 0% 45%;
 *     --accent: 0 0% 96%;
 *     --accent-foreground: 0 0% 11%;
 *     --destructive: 0 53% 46%;
 *     --destructive-foreground: 0 0% 98%;
 *     --border: 0 0% 91%;
 *     --input: 0 0% 91%;
 *     --ring: 164 44% 20%;
 *     --radius: 0.5rem;
 *   }
 * }
 */
