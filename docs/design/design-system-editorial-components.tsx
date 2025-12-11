/**
 * Opus Editorial Component Library - Reference Implementation
 *
 * These are reusable editorial components from the Replit version.
 * Use these as inspiration for building your own component library.
 */

import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "framer-motion";
import { type ReactNode, forwardRef } from "react";

// ============================================================================
// TYPOGRAPHY COMPONENTS
// ============================================================================

/**
 * Editorial Heading Component
 *
 * Large, elegant headings using the Fraunces display font.
 * Supports motion animations via Framer Motion.
 */
interface EditorialHeadingProps extends MotionProps {
  level?: 1 | 2 | 3 | 4;
  className?: string;
  children: ReactNode;
}

export const EditorialHeading = motion(
  forwardRef<HTMLHeadingElement, EditorialHeadingProps>(
    ({ level = 1, className, children, ...props }, ref) => {
      const Component = `h${level}` as keyof JSX.IntrinsicElements;
      const sizeClasses = {
        1: "text-editorial-6xl md:text-editorial-7xl font-display font-light tracking-tight",
        2: "text-editorial-4xl md:text-editorial-5xl font-display font-light",
        3: "text-editorial-2xl md:text-editorial-3xl font-display font-light",
        4: "text-editorial-xl font-display",
      };

      return (
        <Component
          ref={ref}
          className={cn(sizeClasses[level], "text-charcoal", className)}
          {...props}
        >
          {children}
        </Component>
      );
    }
  )
);

EditorialHeading.displayName = "EditorialHeading";

/**
 * Editorial Label Component
 *
 * Small, uppercase labels for categorization and section headers.
 * Uses extreme letter spacing for refined appearance.
 */
export const EditorialLabel = motion(
  forwardRef<HTMLParagraphElement, MotionProps & { className?: string; children: ReactNode }>(
    ({ className, children, ...props }, ref) => (
      <p
        ref={ref}
        className={cn(
          "text-editorial-xs font-medium tracking-extreme uppercase text-stone",
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  )
);

EditorialLabel.displayName = "EditorialLabel";

/**
 * Editorial Text Component
 *
 * Long-form body text using Crimson Pro editorial font.
 * Generous line-height for improved readability.
 */
export const EditorialText = motion(
  forwardRef<HTMLParagraphElement, MotionProps & { className?: string; children: ReactNode }>(
    ({ className, children, ...props }, ref) => (
      <p
        ref={ref}
        className={cn(
          "text-editorial-lg font-editorial leading-relaxed text-graphite",
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  )
);

EditorialText.displayName = "EditorialText";

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

/**
 * Breathing Container
 *
 * Provides generous padding that adapts to screen size.
 * Core principle: let content breathe.
 */
export const BreathingContainer = motion(
  forwardRef<HTMLDivElement, MotionProps & { className?: string; children: ReactNode }>(
    ({ className, children, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("px-8 py-16 md:px-16 md:py-24 lg:px-32 lg:py-32", className)}
        {...props}
      >
        {children}
      </div>
    )
  )
);

BreathingContainer.displayName = "BreathingContainer";

/**
 * Editorial Section
 *
 * Standard section container with optional label and heading.
 */
interface EditorialSectionProps {
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const EditorialSection = ({
  label,
  title,
  children,
  className,
}: EditorialSectionProps) => (
  <section className={cn("mb-24", className)}>
    {label && <EditorialLabel className="mb-6">{label}</EditorialLabel>}
    {title && (
      <EditorialHeading level={2} className="mb-12">
        {title}
      </EditorialHeading>
    )}
    {children}
  </section>
);

// ============================================================================
// VISUAL COMPONENTS
// ============================================================================

/**
 * Progress Line Component
 *
 * Minimal progress indicator using a thin line.
 * Animates from 0 to target percentage.
 */
interface ProgressLineProps {
  progress: number; // 0-100
  className?: string;
  animated?: boolean;
}

export const ProgressLine = ({ progress, className, animated = true }: ProgressLineProps) => (
  <div className={cn("h-px bg-pearl relative overflow-hidden", className)}>
    <motion.div
      className="absolute left-0 top-0 h-full bg-charcoal"
      initial={animated ? { width: 0 } : { width: `${progress}%` }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
  </div>
);

/**
 * Progress Indicator
 *
 * Circular progress indicator with percentage text.
 */
interface ProgressIndicatorProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProgressIndicator = ({
  progress,
  size = "md",
  className,
}: ProgressIndicatorProps) => {
  const sizeClasses = {
    sm: "w-16 h-16 text-xs",
    md: "w-24 h-24 text-sm",
    lg: "w-32 h-32 text-base",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-pearl"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * 45}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
          animate={{
            strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100),
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-sage-deep"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-charcoal">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Stagger Container
 *
 * Container that staggers the animation of its children.
 * Use with Framer Motion's variants.
 */
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Fade In Up
 *
 * Standard fade and slide up animation.
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Fade In
 *
 * Simple fade in animation.
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

/**
 * Slide In From Left
 *
 * Horizontal slide animation.
 */
export const slideInFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example: Section with staggered children
 *
 * <motion.section variants={staggerContainer} initial="initial" animate="animate">
 *   <EditorialLabel className="mb-6">YOUR NORTH STAR</EditorialLabel>
 *   <EditorialHeading level={1} variants={fadeInUp}>
 *     Build products that matter
 *   </EditorialHeading>
 *   <EditorialText variants={fadeInUp}>
 *     Your vision description goes here...
 *   </EditorialText>
 * </motion.section>
 */

/**
 * Example: Progress indicator
 *
 * <ProgressLine progress={75} className="mb-4" />
 * <p className="text-sm text-stone">75% complete</p>
 */

/**
 * Example: Breathing space
 *
 * <BreathingContainer>
 *   <EditorialSection label="WEEK 1" title="Purpose">
 *     <EditorialText>Content goes here...</EditorialText>
 *   </EditorialSection>
 * </BreathingContainer>
 */
