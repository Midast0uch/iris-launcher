import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LiquidIconProps {
  children: ReactNode;
  color?: "primary" | "success" | "accent" | "warning" | "destructive" | "neutral";
  size?: "sm" | "md" | "lg" | "xl";
  bounce?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-12 w-12 rounded-xl",
  xl: "h-16 w-16 rounded-2xl",
};

const iconSizeMap = {
  sm: "[&>svg]:h-4 [&>svg]:w-4",
  md: "[&>svg]:h-5 [&>svg]:w-5",
  lg: "[&>svg]:h-6 [&>svg]:w-6",
  xl: "[&>svg]:h-8 [&>svg]:w-8",
};

const colorMap = {
  primary: "liquid-icon liquid-icon-primary",
  success: "liquid-icon liquid-icon-success",
  accent: "liquid-icon liquid-icon-accent",
  warning: "liquid-icon liquid-icon-warning",
  destructive: "liquid-icon liquid-icon-destructive",
  neutral: "liquid-icon",
};

const textColorMap = {
  primary: "text-primary",
  success: "text-success",
  accent: "text-accent",
  warning: "text-warning",
  destructive: "text-destructive",
  neutral: "text-foreground",
};

export function LiquidIcon({
  children,
  color = "primary",
  size = "md",
  bounce = true,
  className = "",
}: LiquidIconProps) {
  return (
    <motion.div
      className={`${sizeMap[size]} ${colorMap[color]} ${iconSizeMap[size]} ${textColorMap[color]} flex items-center justify-center ${className}`}
      initial={bounce ? { scale: 0.3, opacity: 0 } : undefined}
      animate={bounce ? { scale: 1, opacity: 1 } : undefined}
      transition={
        bounce
          ? {
              type: "spring",
              stiffness: 400,
              damping: 15,
              mass: 0.8,
            }
          : undefined
      }
      whileHover={{
        scale: 1.1,
        transition: { type: "spring", stiffness: 500, damping: 15 },
      }}
      whileTap={{ scale: 0.92 }}
    >
      {children}
    </motion.div>
  );
}
