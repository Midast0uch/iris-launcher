import { ReactNode } from "react";
import { motion } from "framer-motion";

type TransitionVariant = "fade" | "slide-up" | "slide-left" | "scale" | "blur";

interface PageTransitionProps {
  children: ReactNode;
  variant?: TransitionVariant;
  className?: string;
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(10px)", y: 8 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, filter: "blur(6px)", y: -8 },
  },
};

export function PageTransition({ 
  children, 
  variant = "slide-up",
  className = ""
}: PageTransitionProps) {
  const v = variants[variant];

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation helper
export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.2 }
  },
};
