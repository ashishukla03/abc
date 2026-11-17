import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type GlassVariant = 'default' | 'physics' | 'chemistry' | 'biology' | 'math' | 'darkSlate' | 'amber';

export interface AppleGlassCardProps extends HTMLMotionProps<'article'> {
  children: ReactNode;
  variant?: GlassVariant;
  interactive?: boolean;
  className?: string;
  glowColor?: string;
}

const variantStyles: Record<GlassVariant, { bg: string; border: string; glow: string }> = {
  default: {
    bg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 247, 255, 0.75) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    glow: 'rgba(37, 99, 235, 0.12)'
  },
  physics: {
    bg: 'linear-gradient(135deg, rgba(238, 242, 255, 0.90) 0%, rgba(224, 242, 254, 0.82) 100%)',
    border: '1.5px solid rgba(59, 130, 246, 0.35)',
    glow: 'rgba(37, 99, 235, 0.22)'
  },
  chemistry: {
    bg: 'linear-gradient(135deg, rgba(250, 245, 255, 0.90) 0%, rgba(253, 242, 248, 0.82) 100%)',
    border: '1.5px solid rgba(168, 85, 247, 0.35)',
    glow: 'rgba(147, 51, 234, 0.22)'
  },
  biology: {
    bg: 'linear-gradient(135deg, rgba(236, 253, 245, 0.90) 0%, rgba(240, 253, 250, 0.82) 100%)',
    border: '1.5px solid rgba(16, 185, 129, 0.35)',
    glow: 'rgba(16, 185, 129, 0.22)'
  },
  math: {
    bg: 'linear-gradient(135deg, rgba(254, 243, 199, 0.90) 0%, rgba(255, 247, 237, 0.82) 100%)',
    border: '1.5px solid rgba(245, 158, 11, 0.35)',
    glow: 'rgba(217, 119, 6, 0.22)'
  },
  darkSlate: {
    bg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    border: '1.5px solid rgba(71, 85, 105, 0.5)',
    glow: 'rgba(16, 185, 129, 0.25)'
  },
  amber: {
    bg: 'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(254, 249, 195, 0.85) 100%)',
    border: '1.5px solid rgba(245, 158, 11, 0.4)',
    glow: 'rgba(245, 158, 11, 0.25)'
  }
};

export const AppleGlassCard: React.FC<AppleGlassCardProps> = ({
  children,
  variant = 'default',
  interactive = true,
  className = '',
  style,
  ...rest
}) => {
  const v = variantStyles[variant];

  return (
    <motion.article
      whileHover={interactive ? { y: -5, scale: 1.012, transition: { duration: 0.25, ease: 'easeOut' } } : undefined}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      style={{
        background: v.bg,
        border: v.border,
        boxShadow: `0 16px 40px -10px ${v.glow}, inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(79, 70, 229, 0.08)`,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      className={`apple-glass-card glass-sheen ${className}`}
      {...rest}
    >
      {children}
    </motion.article>
  );
};
