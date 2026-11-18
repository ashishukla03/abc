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
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        y: [-4, 4, -4],
        rotateZ: [-1.5, 1.5, -1.5],
      }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.15, rotateZ: 6 }}
      className={`relative inline-flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {type === 'physics' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id="physGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="38" fill="url(#physGlow)" opacity="0.4" />
          <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(-35 50 50)" stroke="#38BDF8" strokeWidth="2.5" />
          <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(35 50 50)" stroke="#818CF8" strokeWidth="2.5" />
          <circle cx="20" cy="30" r="4.5" fill="#67E8F9" filter="drop-shadow(0 0 6px #38BDF8)" />
          <circle cx="80" cy="33" r="4" fill="#C4B5FD" filter="drop-shadow(0 0 6px #A855F7)" />
          <circle cx="50" cy="50" r="12" fill="#2563EB" />
          <circle cx="47" cy="46" r="3.5" fill="#FFFFFF" opacity="0.9" />
        </svg>
      )}

      {type === 'chemistry' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="18" rx="16" ry="7" fill="#F0ABFC" opacity="0.4" />
          <path
            d="M43 20 L43 38 L21 78 C18 84 22 90 29 90 L71 90 C78 90 82 84 79 78 L57 38 L57 20 Z"
            fill="rgba(147, 51, 234, 0.25)"
            stroke="#C084FC"
            strokeWidth="2.5"
          />
          <path
            d="M29 74 L37 54 C44 52 56 52 63 54 L71 74 C75 82 72 87 67 87 L33 87 C28 87 25 82 29 74 Z"
            fill="url(#chemFluid)"
          />
          <defs>
            <linearGradient id="chemFluid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C026D3" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>
          </defs>
          <circle cx="48" cy="22" r="3.5" fill="#E879F9" filter="drop-shadow(0 0 4px #E879F9)" />
          <circle cx="55" cy="14" r="4.5" fill="#F0ABFC" filter="drop-shadow(0 0 4px #F0ABFC)" />
        </svg>
      )}

      {type === 'biology' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="38" fill="rgba(16,185,129,0.2)" />
          <line x1="32" y1="22" x2="68" y2="28" stroke="#34D399" strokeWidth="3" />
          <circle cx="32" cy="22" r="5.5" fill="#10B981" filter="drop-shadow(0 0 6px #10B981)" />
          <circle cx="68" cy="28" r="5" fill="#14B8A6" filter="drop-shadow(0 0 6px #14B8A6)" />
          <circle cx="50" cy="50" r="6" fill="#059669" />
          <path d="M70 65 C80 55 88 45 86 31 C72 33 62 41 56 55 Z" fill="#22C55E" opacity="0.8" />
        </svg>
      )}

      {type === 'math' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="48" cy="50" r="38" fill="rgba(245,158,11,0.2)" />
          <polygon points="46,18 72,34 32,38" fill="#FDE68A" stroke="#FEF3C7" strokeWidth="1.2" />
          <polygon points="32,38 72,34 54,68" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1.2" />
          <polygon points="46,18 32,38 18,52" fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path
            d="M16 38 C20 38 32 37.5 36 37.5 M20 38 L18 52 M30 38 L32 52"
            stroke="#B45309"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {type === 'buddy' && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#818CF8" opacity="0.25" />
          <line x1="50" y1="24" x2="50" y2="14" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="12" r="5" fill="#06B6D4" filter="drop-shadow(0 0 6px #06B6D4)" />
          <rect x="20" y="24" width="60" height="54" rx="22" fill="#1E1B4B" stroke="#818CF8" strokeWidth="2" />
          <rect x="28" y="38" width="44" height="26" rx="10" fill="#020617" />
          <ellipse cx="40" cy="50" rx="4.5" ry="6" fill="#22D3EE" filter="drop-shadow(0 0 4px #22D3EE)" />
          <ellipse cx="60" cy="50" rx="4.5" ry="6" fill="#22D3EE" filter="drop-shadow(0 0 4px #22D3EE)" />
        </svg>
      )}
    </motion.div>
  );
};

export default Subject3DArt;
