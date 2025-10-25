import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { type ReactNode, forwardRef } from "react";

// Animation Variants (exported for use in other components)
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

// Editorial Heading Component with Framer Motion
interface EditorialHeadingProps extends Omit<HTMLMotionProps<"h1">, "ref"> {
  level?: 1 | 2 | 3 | 4;
  children: ReactNode;
}

export const EditorialHeading = forwardRef<HTMLHeadingElement, EditorialHeadingProps>(
  ({ level = 1, children, className, ...props }, ref) => {
    const Tag = motion[`h${level}` as keyof typeof motion] as any;
    const sizeClasses = {
      1: "editorial-heading-xl",
      2: "editorial-heading-lg", 
      3: "editorial-heading-md",
      4: "text-editorial-xl font-display"
    };
    
    return (
      <Tag
        ref={ref}
        className={cn(sizeClasses[level], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

EditorialHeading.displayName = "EditorialHeading";

// Editorial Label Component
export const EditorialLabel = forwardRef<HTMLParagraphElement, HTMLMotionProps<"p">>(
  ({ className, children, ...props }, ref) => (
    <motion.p 
      ref={ref}
      className={cn("editorial-label", className)}
      {...props}
    >
      {children}
    </motion.p>
  )
);

EditorialLabel.displayName = "EditorialLabel";

// Editorial Text Component
export const EditorialText = forwardRef<HTMLParagraphElement, HTMLMotionProps<"p">>(
  ({ className, children, ...props }, ref) => (
    <motion.p 
      ref={ref}
      className={cn("editorial-body", className)}
      {...props}
    >
      {children}
    </motion.p>
  )
);

EditorialText.displayName = "EditorialText";

// Progress Line Component
interface ProgressLineProps {
  progress: number;
  className?: string;
  animated?: boolean;
}

export const ProgressLine = ({ progress, className, animated = true }: ProgressLineProps) => (
  <div className={cn("h-px bg-border relative overflow-hidden", className)}>
    <motion.div
      className="absolute left-0 top-0 h-full bg-foreground"
      initial={animated ? { width: 0 } : { width: `${progress}%` }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
  </div>
);

// Breathing Container
export const BreathingContainer = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, children, ...props }, ref) => (
    <motion.div 
      ref={ref}
      className={cn("breathing-space", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
);

BreathingContainer.displayName = "BreathingContainer";

// Legacy components for backward compatibility
export const EditorialSection: React.FC<{
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}> = ({ label, title, children, className }) => (
  <motion.section 
    className={cn("space-y-8", className)}
    variants={staggerContainer}
    initial="initial"
    animate="animate"
  >
    {label && <EditorialLabel>{label}</EditorialLabel>}
    {title && <EditorialHeading level={2}>{title}</EditorialHeading>}
    <motion.div variants={fadeInUp}>{children}</motion.div>
  </motion.section>
);

export const ProgressIndicator: React.FC<{
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}> = ({ value, max = 100, className, showLabel = false }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <ProgressLine progress={percentage} />
    </div>
  );
};

export const BreathingSpace: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("breathing-space", className)}>
    {children}
  </div>
);
