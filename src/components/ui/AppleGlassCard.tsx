import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export const GLASS_CARD_FORMULA =
  'bg-slate-900/60 backdrop-blur-3xl backdrop-saturate-[1.8] border border-white/[0.14] shadow-[0_16px_45px_-10px_rgba(0,0,0,0.75),inset_0_1.5px_1px_rgba(255,255,255,0.18)] rounded-3xl p-6 transition-all duration-300 text-slate-100';

export type GlassVariant = 'default' | 'physics' | 'chemistry' | 'biology' | 'math' | 'darkSlate' | 'amber';

export interface AppleGlassCardProps extends HTMLMotionProps<'article'> {
  children: ReactNode;
  variant?: GlassVariant;
  interactive?: boolean;
  className?: string;
  glowColor?: string;
}

const variantTints: Record<GlassVariant, string> = {
  default: '',
  physics: 'bg-blue-950/30 border-blue-400/35 shadow-[0_0_30px_rgba(59,130,246,0.15)]',
  chemistry: 'bg-purple-950/30 border-purple-400/35 shadow-[0_0_30px_rgba(168,85,247,0.15)]',
  biology: 'bg-emerald-950/30 border-emerald-400/35 shadow-[0_0_30px_rgba(16,185,129,0.15)]',
  math: 'bg-amber-950/30 border-amber-400/35 shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  darkSlate: 'bg-slate-950/80 border-slate-700/80 shadow-[0_0_30px_rgba(0,0,0,0.9)]',
  amber: 'bg-amber-950/35 border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
};

export const AppleGlassCard: React.FC<AppleGlassCardProps> = ({
  children,
  variant = 'default',
  interactive = true,
  className = '',
  style,
  ...rest
}) => {
  const tint = variantTints[variant];

  return (
    <motion.article
      whileHover={interactive ? { y: -4, scale: 1.015, transition: { duration: 0.25 } } : undefined}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      style={style}
      className={`${GLASS_CARD_FORMULA} ${tint} ${className}`}
      {...rest}
    >
      {children}
    </motion.article>
  );
};
