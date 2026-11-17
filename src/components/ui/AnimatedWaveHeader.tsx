import React from 'react';
import { motion } from 'framer-motion';

export interface AnimatedWaveHeaderProps {
  frequency?: number;
  amplitude?: number;
  isPlaying?: boolean;
  title?: string;
  subtitle?: string;
}

export const AnimatedWaveHeader: React.FC<AnimatedWaveHeaderProps> = ({
  frequency = 440,
  amplitude = 50,
  isPlaying = true,
  title = 'Sound Wave Oscilloscope & Pitch Invariant',
  subtitle = 'Live Interactive STEM Waveform Synthesizer'
}) => {
  return (
    <div
      style={{
        borderRadius: '20px',
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        border: '1.5px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 16px 40px -10px rgba(15, 23, 42, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        color: '#F8FAFC',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="animated-wave-header-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#60A5FA' }}>
            ACOUSTIC HARMONICS ENGINE
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0', color: '#FFFFFF' }}>{title}</h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0 0' }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '6px 12px', borderRadius: '9999px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3B82F6', fontSize: '12px', fontWeight: 700, color: '#93C5FD' }}>
            {frequency} Hz
          </span>
          <span style={{ padding: '6px 12px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', fontSize: '12px', fontWeight: 700, color: '#6EE7B7' }}>
            {amplitude}% Amp
          </span>
        </div>
      </div>

      <div style={{ height: '70px', position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="70" viewBox="0 0 600 70" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="waveHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#38BDF8" />
              <stop offset="50%" stop-color="#818CF8" />
              <stop offset="100%" stop-color="#34D399" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 0 35 Q 75 10, 150 35 T 300 35 T 450 35 T 600 35"
            fill="none"
            stroke="url(#waveHeaderGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            animate={isPlaying ? { d: [
              'M 0 35 Q 75 10, 150 35 T 300 35 T 450 35 T 600 35',
              'M 0 35 Q 75 60, 150 35 T 300 35 T 450 35 T 600 35',
              'M 0 35 Q 75 10, 150 35 T 300 35 T 450 35 T 600 35'
            ]} : undefined}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </div>
  );
};

