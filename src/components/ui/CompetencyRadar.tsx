import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export interface CompetencyRadarProps {
  competencies: Record<string, number>;
  size?: number;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ competencies, size = 320 }) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  const center = size / 2;
  const radius = size * 0.38;

  const subjects = Object.keys(competencies);
  const total = subjects.length;

  const getCoordinates = (index: number, distance: number) => {
    const angleRad = (index * 2 * Math.PI) / total - Math.PI / 2;
    return {
      x: center + distance * Math.cos(angleRad),
      y: center + distance * Math.sin(angleRad),
    };
  };

  const rings = [0.25, 0.5, 0.75, 1.0];

  const vertices = subjects.map((subject, index) => {
    const rawScore = competencies[subject] ?? 70;
    const normalizedScore = Math.max(10, Math.min(100, rawScore));
    const distance = (normalizedScore / 100) * radius;
    const coords = getCoordinates(index, distance);
    return { subject, score: rawScore, ...coords };
  });

  const polygonPointsString = vertices.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radarFillGradDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="radarFillGradLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.08" />
          </radialGradient>
          <filter id="vertexGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={isDark ? '#22D3EE' : '#4F46E5'} floodOpacity="0.9" />
          </filter>
        </defs>

        {/* Concentric grid web */}
        {rings.map((ringScale, idx) => {
          const ringPoints = Array.from({ length: total })
            .map((_, i) => {
              const c = getCoordinates(i, radius * ringScale);
              return `${c.x.toFixed(1)},${c.y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <polygon
              key={`ring-${idx}`}
              points={ringPoints}
              fill={
                isDark
                  ? idx % 2 === 0
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.015)'
                  : idx % 2 === 0
                  ? 'rgba(255,255,255,0.45)'
                  : 'rgba(241,245,249,0.25)'
              }
              stroke={isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(148, 163, 184, 0.35)'}
              strokeWidth="1"
              strokeDasharray={idx < 3 ? '3,3' : undefined}
            />
          );
        })}

        {/* Spokes from center to outer bounds */}
        {subjects.map((_, i) => {
          const end = getCoordinates(i, radius);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke={isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(148, 163, 184, 0.35)'}
              strokeWidth="1.2"
            />
          );
        })}

        {/* Dynamic Mathematical Competency Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          points={polygonPointsString}
          fill={isDark ? 'url(#radarFillGradDark)' : 'url(#radarFillGradLight)'}
          stroke={isDark ? '#22D3EE' : '#4F46E5'}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Vertices points and labels */}
        {vertices.map((v, i) => {
          const labelCoords = getCoordinates(i, radius + 28);
          return (
            <g key={`vertex-${v.subject}`}>
              <circle
                cx={v.x}
                cy={v.y}
                r="5.5"
                fill={isDark ? '#22D3EE' : '#4F46E5'}
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="url(#vertexGlow)"
              />

              <text
                x={labelCoords.x}
                y={labelCoords.y - 4}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[11px] font-extrabold tracking-tight ${
                  isDark ? 'fill-slate-200' : 'fill-slate-800'
                }`}
              >
                {v.subject}
              </text>
              <text
                x={labelCoords.x}
                y={labelCoords.y + 10}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[10px] font-black ${
                  isDark ? 'fill-cyan-400' : 'fill-indigo-600'
                }`}
              >
                {v.score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
