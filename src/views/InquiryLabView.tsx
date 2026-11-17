import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw, Volume2, Sparkles, CheckCircle2, Sliders, Info, Layers, Eye, Droplet, Pi, Activity } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { CURRICULUM_DATABASE } from '../data/curriculumData';

export const InquiryLabView: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { completeLab, addXP } = useSessionStore();

  // Find the topic across curriculum database
  let foundTopic: any = null;
  let foundSubject: any = null;

  Object.values(CURRICULUM_DATABASE).forEach((cur) => {
    cur.subjects.forEach((sub) => {
      sub.chapters.forEach((ch) => {
        const t = ch.topics.find((item) => item.id === topicId);
        if (t) {
          foundTopic = t;
          foundSubject = sub;
        }
      });
    });
  });

  const topic = foundTopic || {
    id: 'p7-ch13-t1',
    title: 'Sound Detective: Pitch vs Frequency Oscilloscope',
    shortDesc: 'Vary frequency and amplitude to observe continuous sound wave transformations.',
    ncertCode: 'NCERT Cl 7/8 Science Ch 13',
    labModuleId: 'sound-wave'
  };

  const moduleId = topic.labModuleId || 'sound-wave';

  // Common completion state
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFinishLab = () => {
    setIsCompleted(true);
    completeLab(topic.id, (foundSubject?.category || 'physics') as any);
  };

  // --- 1. Sound Wave Lab State ---
  const [frequency, setFrequency] = useState(440); // 110 - 880 Hz
  const [amplitude, setAmplitude] = useState(50); // 10 - 100
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleSound = () => {
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gain.gain.setValueAtTime(amplitude / 500, audioCtx.currentTime);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();

        setTimeout(() => {
          osc.stop();
          audioCtx.close();
          setIsPlayingAudio(false);
        }, 800);
      } catch (e) {
        setTimeout(() => setIsPlayingAudio(false), 800);
      }
    }
  };

  // --- 2. Fractions Pizza/Chapati Lab State ---
  const [totalSlices, setTotalSlices] = useState<number>(4);
  const [selectedSlices, setSelectedSlices] = useState<number>(2);

  // --- 3. Optics Snell's Law Lab State ---
  const [incidenceAngle, setIncidenceAngle] = useState(30); // 0 to 80 deg
  const n1 = 1.0; // Air
  const n2 = 1.52; // Crown Glass
  const radI = (incidenceAngle * Math.PI) / 180;
  // Snell: sin(r) = (n1/n2)*sin(i)
  const sinR = (n1 / n2) * Math.sin(radI);
  const radR = Math.asin(Math.min(1, sinR));
  const refractionAngle = Math.round((radR * 180) / Math.PI);
  // Glass to air critical angle
  const criticalAngle = Math.round((Math.asin(n1 / n2) * 180) / Math.PI); // ~41 deg

  // --- 4. Chemistry pH Indicator Lab State ---
  const [selectedLiquid, setSelectedLiquid] = useState<'lemon' | 'vinegar' | 'water' | 'soap' | 'bleach'>('lemon');
  const liquidData = {
    lemon: { name: 'Fresh Lemon Juice', ph: 2.2, type: 'Strong Acid', color: '#EF4444', turmeric: '#EAB308', litmus: '#DC2626' },
    vinegar: { name: 'Vinegar (Dilute Acetic Acid)', ph: 3.0, type: 'Weak Acid', color: '#F97316', turmeric: '#FACC15', litmus: '#EA580C' },
    water: { name: 'Pure Distilled Water', ph: 7.0, type: 'Neutral', color: '#10B981', turmeric: '#FDE047', litmus: '#8B5CF6' },
    soap: { name: 'Bathing Soap / Detergent', ph: 9.5, type: 'Mild Base', color: '#3B82F6', turmeric: '#991B1B', litmus: '#2563EB' },
    bleach: { name: 'Lime Water / Bleach', ph: 12.5, type: 'Strong Base', color: '#8B5CF6', turmeric: '#7F1D1D', litmus: '#1D4ED8' }
  };

  // --- 5. Riemann Sum Calculus Lab State ---
  const [partitionsN, setPartitionsN] = useState<number>(8);
  // Curve: f(x) = x^2 from 0 to 2. Exact integral = 8/3 ≈ 2.6667
  const deltaX = 2 / partitionsN;
  let riemannSum = 0;
  for (let i = 0; i < partitionsN; i++) {
    const xMid = (i + 0.5) * deltaX;
    riemannSum += Math.pow(xMid, 2) * deltaX;
  }
  const exactIntegral = 8 / 3;
  const integralError = Math.abs(riemannSum - exactIntegral);

  // SVG Sound wave path
  const waveWidth = 540;
  const waveHeight = 160;
  const centerY = waveHeight / 2;
  const cycles = (frequency / 110) * 2;
  const ampPixels = (amplitude / 100) * (waveHeight * 0.4);
  let pathD = `M 0 ${centerY}`;
  for (let x = 0; x <= waveWidth; x += 3) {
    const angle = (x / waveWidth) * cycles * 2 * Math.PI;
    const y = centerY - Math.sin(angle) * ampPixels;
    pathD += ` L ${x} ${y.toFixed(2)}`;
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header */}
      <div className="glass-panel rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Subject
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
              Interactive STEM Inquiry Lab
            </span>
            <span className="text-xs font-mono font-medium text-slate-400">{topic.ncertCode}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">{topic.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" /> Lab Completed (+150 XP)
            </div>
          ) : (
            <button
              onClick={handleFinishLab}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Finish & Log Lab Discovery
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Lab Module Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Canvas Visualizer (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[440px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header of Canvas */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Live Dynamic Simulation Rig</span>
            </div>
            <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
              Module: {moduleId.toUpperCase()}
            </div>
          </div>

          {/* --- VIEW 1: SOUND WAVE OSCILLOSCOPE --- */}
          {moduleId === 'sound-wave' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-xl bg-slate-950 rounded-2xl p-4 shadow-inner border border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <svg width="100%" height="160" viewBox={`0 0 ${waveWidth} ${waveHeight}`} className="relative z-10 overflow-visible">
                  <line x1="0" y1={centerY} x2={waveWidth} y2={centerY} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1={waveWidth / 2} y1="0" x2={waveWidth / 2} y2={waveHeight} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                    className="drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  />
                </svg>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>Frequency: {frequency} Hz</span>
                  <span>Wavelength: {(343 / frequency).toFixed(2)} m</span>
                  <span>Amplitude: {amplitude}%</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleToggleSound}
                  disabled={isPlayingAudio}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4" /> {isPlayingAudio ? 'Synthesizing Tone...' : 'Play Audible Sine Tone'}
                </button>
              </div>
            </div>
          )}

          {/* --- VIEW 2: FRACTIONS PIZZA/CHAPATI CUTTER --- */}
          {moduleId === 'fractions' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-lg">
                {/* SVG Visual Pie */}
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {Array.from({ length: totalSlices }).map((_, i) => {
                      const sliceAngle = 360 / totalSlices;
                      const startAngle = (i * sliceAngle * Math.PI) / 180;
                      const endAngle = (((i + 1) * sliceAngle) * Math.PI) / 180;
                      const x1 = 50 + 45 * Math.cos(startAngle);
                      const y1 = 50 + 45 * Math.sin(startAngle);
                      const x2 = 50 + 45 * Math.cos(endAngle);
                      const y2 = 50 + 45 * Math.sin(endAngle);
                      const isSelected = i < selectedSlices;

                      return (
                        <path
                          key={i}
                          d={`M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`}
                          fill={isSelected ? '#F59E0B' : '#F1F5F9'}
                          stroke="#CBD5E1"
                          strokeWidth="1.5"
                          className="transition-colors duration-200 cursor-pointer hover:opacity-90"
                          onClick={() => setSelectedSlices(i + 1)}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-xs font-black text-amber-600">
                      {selectedSlices}/{totalSlices}
                    </div>
                  </div>
                </div>

                {/* Mathematical Fraction Comparison */}
                <div className="space-y-3 bg-amber-50/80 border border-amber-200 p-5 rounded-2xl flex-1">
                  <div className="text-xs font-bold text-amber-900 uppercase">Fraction Analysis</div>
                  <div className="text-3xl font-black text-amber-600 font-mono">
                    {selectedSlices} / {totalSlices}
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    Decimal Value: <span className="font-mono text-indigo-600">{(selectedSlices / totalSlices).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    Percentage: <span className="font-bold text-emerald-600">{((selectedSlices / totalSlices) * 100).toFixed(0)}%</span> of the whole roti.
                    {selectedSlices / totalSlices === 0.5 && (
                      <span className="block mt-1 font-bold text-amber-800">✨ Exactly One Half (1/2)!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW 3: OPTICS SNELL'S LAW & TIR --- */}
          {moduleId === 'optics' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-lg bg-slate-900 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
                <svg viewBox="0 0 400 240" className="w-full h-48">
                  {/* Interface Boundary: Air (top) and Glass (bottom) */}
                  <rect x="0" y="0" width="400" height="120" fill="#0f172a" />
                  <rect x="0" y="120" width="400" height="120" fill="#1e293b" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="200" y1="20" x2="200" y2="220" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Incident Ray in Air (from top left to origin at 200,120) */}
                  {(() => {
                    const rayLen = 100;
                    const originX = 200;
                    const originY = 120;
                    const startX = originX - rayLen * Math.sin(radI);
                    const startY = originY - rayLen * Math.cos(radI);

                    // Refracted Ray into Glass
                    const endX = originX + rayLen * Math.sin(radR);
                    const endY = originY + rayLen * Math.cos(radR);

                    return (
                      <g>
                        {/* Incident laser */}
                        <line x1={startX} y1={startY} x2={originX} y2={originY} stroke="#EF4444" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        {/* Refracted laser */}
                        <line x1={originX} y1={originY} x2={endX} y2={endY} stroke="#10B981" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <circle cx={originX} cy={originY} r="4" fill="#FBBF24" />
                      </g>
                    );
                  })()}

                  <text x="15" y="30" fill="#94a3b8" fontSize="11" fontFamily="monospace">Medium 1: Air (n₁ = 1.00)</text>
                  <text x="15" y="225" fill="#38bdf8" fontSize="11" fontFamily="monospace">Medium 2: Dense Glass (n₂ = 1.52)</text>
                </svg>

                <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Incidence Angle (i): <b className="text-red-400">{incidenceAngle}°</b></span>
                  <span>Refraction Angle (r): <b className="text-emerald-400">{refractionAngle}°</b></span>
                  <span>sin(i)/sin(r) = 1.52</span>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW 4: CHEMISTRY PH INDICATOR TEST TUBES --- */}
          {moduleId === 'ph-indicator' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-lg">
                {/* Visual Test Tube */}
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-48 border-4 border-slate-300 rounded-b-full rounded-t-md p-1 bg-white/50 backdrop-blur-md shadow-lg relative flex flex-col justify-end overflow-hidden">
                    <motion.div
                      className="w-full rounded-b-full transition-colors duration-500 shadow-inner"
                      style={{ height: '70%', backgroundColor: liquidData[selectedLiquid].turmeric }}
                      animate={{ scale: [0.98, 1, 0.98] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 font-bold">
                      TURMERIC
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-bold text-slate-700">Turmeric Reagent</div>
                </div>

                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-48 border-4 border-slate-300 rounded-b-full rounded-t-md p-1 bg-white/50 backdrop-blur-md shadow-lg relative flex flex-col justify-end overflow-hidden">
                    <motion.div
                      className="w-full rounded-b-full transition-colors duration-500 shadow-inner"
                      style={{ height: '70%', backgroundColor: liquidData[selectedLiquid].litmus }}
                      animate={{ scale: [0.98, 1, 0.98] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 font-bold">
                      LITMUS
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-bold text-slate-700">Litmus Reagent</div>
                </div>

                {/* pH Scale Indicator readout */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex-1 space-y-2">
                  <div className="text-xs font-bold uppercase text-slate-500">Liquid Sample Profile</div>
                  <div className="text-base font-black text-slate-800">{liquidData[selectedLiquid].name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: liquidData[selectedLiquid].color }}>
                      pH {liquidData[selectedLiquid].ph}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{liquidData[selectedLiquid].type}</span>
                  </div>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                    Observation: {liquidData[selectedLiquid].ph < 7 ? 'Acids keep turmeric bright yellow.' : 'Alkaline bases turn yellow turmeric deep red!'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW 5: RIEMANN SUM CALCULUS --- */}
          {moduleId === 'calculus' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-lg bg-slate-900 rounded-2xl p-4 border border-slate-800 relative">
                <svg viewBox="0 0 320 180" className="w-full h-44">
                  {/* Axes */}
                  <line x1="30" y1="150" x2="300" y2="150" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="30" y1="20" x2="30" y2="150" stroke="#64748b" strokeWidth="1.5" />

                  {/* Riemann Rectangles */}
                  {Array.from({ length: partitionsN }).map((_, i) => {
                    const rectW = 250 / partitionsN;
                    const xL = 30 + i * rectW;
                    const xVal = ((i + 0.5) / partitionsN) * 2;
                    const yVal = Math.pow(xVal, 2); // 0 to 4
                    const rectH = (yVal / 4) * 120;
                    const yT = 150 - rectH;

                    return (
                      <rect
                        key={i}
                        x={xL}
                        y={yT}
                        width={rectW - 1}
                        height={rectH}
                        fill="#F59E0B"
                        opacity="0.6"
                        stroke="#D97706"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Smooth curve f(x) = x^2 */}
                  <path
                    d={`M 30 150 Q 155 140 280 30`}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="3"
                  />
                </svg>

                <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Partitions N: <b className="text-amber-400">{partitionsN}</b></span>
                  <span>Riemann Sum: <b className="text-amber-400">{riemannSum.toFixed(4)}</b></span>
                  <span>Exact ∫: <b className="text-cyan-400">{exactIntegral.toFixed(4)}</b></span>
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="text-[11px] text-slate-500 font-medium pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Offline Web-Audio & Vector Graphics Engine</span>
            <span>NCERT Lab Standard</span>
          </div>
        </div>

        {/* Right Column: Interactive Sliders & Scientific Variables */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" /> Lab Variables Control
            </h3>

            {/* Variable Controls for Sound */}
            {moduleId === 'sound-wave' && (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Frequency (Pitch)</span>
                    <span className="font-mono text-cyan-600">{frequency} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="110"
                    max="880"
                    step="10"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>110 Hz (Low Bass)</span>
                    <span>880 Hz (High Treble)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Amplitude (Loudness)</span>
                    <span className="font-mono text-indigo-600">{amplitude}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={amplitude}
                    onChange={(e) => setAmplitude(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Variable Controls for Fractions */}
            {moduleId === 'fractions' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Total Denominator Slices</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[2, 4, 8].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          setTotalSlices(n);
                          if (selectedSlices > n) setSelectedSlices(n);
                        }}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          totalSlices === n
                            ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {n} Slices
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Shaded Slices (Numerator)</span>
                    <span className="font-mono text-amber-600">{selectedSlices} of {totalSlices}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={totalSlices}
                    value={selectedSlices}
                    onChange={(e) => setSelectedSlices(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Variable Controls for Optics */}
            {moduleId === 'optics' && (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Incident Laser Angle (i)</span>
                    <span className="font-mono text-red-500">{incidenceAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="1"
                    value={incidenceAngle}
                    onChange={(e) => setIncidenceAngle(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0° (Normal incidence)</span>
                    <span>80° (Grazing ray)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  Notice that when light enters dense glass, the ray bends <b>towards the normal</b> (r &lt; i).
                </div>
              </div>
            )}

            {/* Variable Controls for pH Indicator */}
            {moduleId === 'ph-indicator' && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-700">Choose Household Reagent</label>
                <div className="space-y-2">
                  {(['lemon', 'vinegar', 'water', 'soap', 'bleach'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedLiquid(key)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                        selectedLiquid === key
                          ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{liquidData[key].name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10">pH {liquidData[key].ph}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variable Controls for Calculus */}
            {moduleId === 'calculus' && (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Number of Partitions (N)</span>
                    <span className="font-mono text-amber-600">{partitionsN} slices</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    step="4"
                    value={partitionsN}
                    onChange={(e) => setPartitionsN(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>N=4 (Rough sum)</span>
                    <span>N=64 (Near exact ∫)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-mono">
                  Approximation Error: {integralError.toFixed(5)}
                </div>
              </div>
            )}
          </div>

          {/* Scientific Concept Explainer Callout */}
          <div className="glass-panel rounded-3xl p-6 bg-gradient-to-br from-indigo-50/50 to-white/70 border border-indigo-100">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600" /> Scientific Core Takeaway
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {topic.shortDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
