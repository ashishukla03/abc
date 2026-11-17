import React from 'react';
import { motion } from 'framer-motion';

interface CompetencyRadarProps {
  scores: {
    physics: number;
    math: number;
    chemistry: number;
    biology: number;
    social: number;
    computing: number;
  };
  size?: number;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ scores, size = 260 }) => {
  const center = size / 2;
  const radius = size * 0.38;

  const axes = [
    { key: 'physics', label: 'Physics', angle: -90, color: '#2563EB' },
    { key: 'chemistry', label: 'Chemistry', angle: -30, color: '#7C3AED' },
    { key: 'biology', label: 'Biology', angle: 30, color: '#059669' },
    { key: 'math', label: 'Math', angle: 90, color: '#D97706' },
    { key: 'computing', label: 'Coding', angle: 150, color: '#0D9488' },
    { key: 'social', label: 'Social', angle: 210, color: '#E11D48' },
  ];

  // Convert polar coordinates to Cartesian
  const getCoordinates = (angleDeg: number, distance: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: center + distance * Math.cos(angleRad),
      y: center + distance * Math.sin(angleRad),
    };
  };

  // Generate web rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Generate polygon points
  const points = axes.map((axis) => {
    const score = (scores as any)[axis.key] || 50;
    const dist = (score / 100) * radius;
    const coord = getCoordinates(axis.angle, dist);
    return `${coord.x},${coord.y}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.10" />
          </radialGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Web Rings */}
        {rings.map((ringFactor, i) => {
          const ringPoints = axes.map((a) => {
            const coord = getCoordinates(a.angle, radius * ringFactor);
            return `${coord.x},${coord.y}`;
          }).join(' ');

          return (
            <polygon
              key={i}
              points={ringPoints}
              fill="none"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeDasharray={i === rings.length - 1 ? undefined : '3 3'}
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines */}
        {axes.map((a, i) => {
          const end = getCoordinates(a.angle, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(148, 163, 184, 0.35)"
              strokeWidth="1"
            />
          );
        })}

        {/* Animated Data Polygon */}
        <motion.polygon
          points={points}
          fill="url(#radarFillGrad)"
          stroke="#4F46E5"
          strokeWidth="2.5"
          filter="url(#radarGlow)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Vertex Dots & Value Labels */}
        {axes.map((axis, i) => {
          const score = (scores as any)[axis.key] || 50;
          const dist = (score / 100) * radius;
          const coord = getCoordinates(axis.angle, dist);
          const labelCoord = getCoordinates(axis.angle, radius + 22);

          return (
            <g key={i}>
              <motion.circle
                cx={coord.x}
                cy={coord.y}
                r="4.5"
                fill={axis.color}
                stroke="#FFFFFF"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              />
              <text
                x={labelCoord.x}
                y={labelCoord.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-bold fill-slate-600 select-none tracking-tight"
              >
                {axis.label}
              </text>
              <text
                x={labelCoord.x}
                y={labelCoord.y + 11}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-extrabold fill-indigo-600 select-none font-mono"
              >
                {score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

