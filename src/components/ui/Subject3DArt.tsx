import React from 'react';
import { motion } from 'framer-motion';

export interface Subject3DArtProps {
  type: 'physics' | 'chemistry' | 'biology' | 'math' | 'avatar' | 'buddy';
  size?: number;
  className?: string;
}

export const Subject3DArt: React.FC<Subject3DArtProps> = ({
  type,
  size = 80,
  className = ''
}) => {
  return (
    <motion.div
      animate={{ y: [-3, 3, -3] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.08, rotate: 2 }}
      className={`subject-3d-container ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {type === 'physics' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="38" fill="rgba(37,99,235,0.15)" />
          <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(-35 50 50)" stroke="#3B82F6" strokeWidth="2.5" />
          <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(35 50 50)" stroke="#6366F1" strokeWidth="2.5" />
          <circle cx="20" cy="30" r="4.5" fill="#67E8F9" />
          <circle cx="80" cy="33" r="4" fill="#C4B5FD" />
          <circle cx="50" cy="50" r="11" fill="#1D4ED8" />
          <circle cx="48" cy="46" r="3" fill="#FFFFFF" opacity="0.8" />
        </svg>
      )}
      {type === 'chemistry' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="18" rx="16" ry="7" fill="#F0ABFC" opacity="0.35" />
          <path d="M43 20 L43 38 L21 78 C18 84 22 90 29 90 L71 90 C78 90 82 84 79 78 L57 38 L57 20 Z" fill="rgba(243, 232, 255, 0.5)" stroke="#C084FC" strokeWidth="2.5" />
          <path d="M29 74 L37 54 C44 52 56 52 63 54 L71 74 C75 82 72 87 67 87 L33 87 C28 87 25 82 29 74 Z" fill="#9333EA" />
          <circle cx="48" cy="22" r="3.2" fill="#E879F9" />
          <circle cx="55" cy="14" r="4.2" fill="#C026D3" />
        </svg>
      )}
      {type === 'biology' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="38" fill="rgba(16,185,129,0.15)" />
          <line x1="32" y1="22" x2="68" y2="28" stroke="#34D399" strokeWidth="3" />
          <circle cx="32" cy="22" r="5" fill="#10B981" />
          <circle cx="68" cy="28" r="4.5" fill="#14B8A6" />
          <circle cx="50" cy="50" r="5.5" fill="#059669" />
          <path d="M70 65 C80 55 88 45 86 31 C72 33 62 41 56 55 Z" fill="#22C55E" />
        </svg>
      )}
      {type === 'math' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="48" cy="50" r="38" fill="rgba(245,158,11,0.15)" />
          <polygon points="46,18 72,34 32,38" fill="#FDE68A" stroke="#FEF3C7" strokeWidth="1.2" />
          <polygon points="32,38 72,34 54,68" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1.2" />
          <polygon points="46,18 32,38 18,52" fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d="M16 38 C20 38 32 37.5 36 37.5 M20 38 L18 52 M30 38 L32 52" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      )}
      {type === 'avatar' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" fill="rgba(37, 99, 235, 0.12)" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" />
          <ellipse cx="50" cy="42" rx="26" ry="24" fill="#1E293B" />
          <circle cx="50" cy="48" r="22" fill="#FDBA74" />
          <ellipse cx="42" cy="48" rx="3.5" ry="4.5" fill="#0F172A" />
          <ellipse cx="58" cy="48" rx="3.5" ry="4.5" fill="#0F172A" />
          <path d="M43 56 C46 60 54 60 57 56" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M22 88 C24 74 36 70 50 70 C64 70 76 74 78 88 Z" fill="#2563EB" />
        </svg>
      )}
      {type === 'buddy' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#818CF8" opacity="0.25" />
          <line x1="50" y1="24" x2="50" y2="14" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="12" r="5" fill="#06B6D4" />
          <rect x="20" y="24" width="60" height="54" rx="22" fill="#EEF2FF" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="28" y="38" width="44" height="26" rx="10" fill="#0F172A" />
          <ellipse cx="40" cy="50" rx="4.5" ry="6" fill="#22D3EE" />
          <ellipse cx="60" cy="50" rx="4.5" ry="6" fill="#22D3EE" />
        </svg>
      )}
    </motion.div>
  );
};

