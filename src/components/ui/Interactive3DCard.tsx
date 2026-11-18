import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  depth?: number;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.4)',
  onClick,
  depth = 12,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -depth;
    const rotY = ((x - centerX) / centerX) * depth;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div style={{ perspective: 1200 }} className="relative h-full group/3d">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{
          rotateX,
          rotateY,
          scale: glarePos.opacity > 0 ? 1.018 : 1,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative overflow-hidden transition-shadow duration-300 will-change-transform ${className}`}
      >
        {/* Prismatic Specular Glare Follower */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 mix-blend-overlay"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35), transparent 70%)`,
          }}
        />

        {/* Ambient colored edge glow */}
        <div
          className="absolute -inset-1 rounded-3xl opacity-0 group-hover/3d:opacity-100 transition-opacity duration-500 blur-xl -z-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 65%)`,
          }}
        />

        {/* Inner Content Layer with subtle Z elevation */}
        <div style={{ transform: 'translateZ(18px)', transformStyle: 'preserve-3d' }} className="h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Interactive3DCard;
