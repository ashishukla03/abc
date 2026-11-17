import React, { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export const bentoContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

export const bentoItemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
  columns?: number;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className = '',
  columns = 3
}) => {
  return (
    <motion.div
      variants={bentoContainerVariants}
      initial="hidden"
      animate="visible"
      className={`bento-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${columns === 2 ? '360px' : '280px'}, 1fr))`,
        gap: '20px'
      }}
    >
      {children}
    </motion.div>
  );
};

export interface LiquidPillProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  layoutId?: string;
}

export const LiquidPill: React.FC<LiquidPillProps> = ({
  active,
  onClick,
  children,
  layoutId = 'active-pill'
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '8px 18px',
        borderRadius: '9999px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '13.5px',
        fontWeight: active ? 700 : 500,
        color: active ? '#FFFFFF' : '#475569',
        outline: 'none'
      }}
    >
      {active && (
        <motion.div
          layoutId={layoutId}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            zIndex: 0
          }}
        />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
};

