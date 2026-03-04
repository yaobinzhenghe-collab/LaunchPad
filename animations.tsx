import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.25 }
};

export const popAnimation = {
  scale: [1, 1.2, 0.9, 1.1, 1],
  transition: { duration: 0.4, ease: "easeInOut" }
};

export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { duration: 0.2, ease: "easeOut" }
};

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  "data-testid"?: string;
}

export function AnimatedCard({ children, className = "", delay = 0, onClick, "data-testid": testId }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function StaggerGrid({ children, className = "", "data-testid": testId }: StaggerGridProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className={className}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function StaggerItem({ children, className = "", "data-testid": testId }: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  "data-testid"?: string;
}

export function AnimatedButton({ children, className = "", onClick, disabled, "data-testid": testId }: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </motion.button>
  );
}

export function LikeAnimation({ isLiked }: { isLiked: boolean }) {
  return (
    <motion.div
      animate={isLiked ? popAnimation : {}}
      style={{ display: "flex", alignItems: "center" }}
    >
      {/* This wrapper applies the pop effect */}
    </motion.div>
  );
}
