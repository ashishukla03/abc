import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Activity,
  Flame,
  Award,
  Atom,
  Eye,
  Zap,
  Sun,
  TestTube,
  Layers,
  Compass,
  PieChart,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { CURRICULUM_DATABASE, TopicActivity } from '../data/curriculumData';
import { GLASS_CARD_FORMULA } from '../components/ui/AppleGlassCard';
import { Interactive3DCard } from '../components/ui/Interactive3DCard';
import { QuantumHoloCore3D } from '../components/ui/QuantumHoloCore3D';
import { Spatial3DViewer } from '../components/ui/Spatial3DViewer';
import { TopicQuizModal } from '../components/modals/TopicQuizModal';

export type LabModuleType = 'sound-wave' | 'optics' | 'ph-indicator' | 'electric-circuit' | 'fractions' | 'calculus' | 'cell-explorer';

export const InquiryLabView: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { markTopicStatus, updateCompetency, getTopicStatus, currentClass, addXP } = useAppStore();

  let foundTopic: TopicActivity | null = null;
  let foundSubject: any = null;

  for (const cur of Object.values(CURRICULUM_DATABASE)) {
    for (const sub of cur.subjects) {
      for (const ch of sub.chapters) {
        const t = ch.topics.find((item) => item.id === topicId);
        if (t) {
          foundTopic = t;
          foundSubject = sub;
          break;
        }
      }
      if (foundTopic) break;
    }
    if (foundTopic) break;
  }

  const topic: TopicActivity = foundTopic || {
    id: topicId || 'p10-ch12-t1',
    title: 'Sound & Electromagnetic Wave Inquiry Oscilloscope',
    shortDesc: 'Observe continuous harmonic wave transformations by modulating frequency, amplitude, and phase.',
    durationMinutes: 15,
    ncertCode: 'NCERT STEM Lab',
    hasInquiryLab: true,
    status: 'ready_to_learn',
    testQuestions: [],
  };

  // Determine initial module from topic metadata or keywords
  const determineInitialModule = (): LabModuleType => {
    if (topic.labModuleId) return topic.labModuleId as LabModuleType;
    const title = (topic.title + ' ' + (topic.shortDesc || '')).toLowerCase();
    if (title.includes('optic') || title.includes('light') || title.includes('refraction') || title.includes('reflection')) return 'optics';
    if (title.includes('acid') || title.includes('base') || title.includes('ph') || title.includes('turmeric') || title.includes('chem')) return 'ph-indicator';
    if (title.includes('circuit') || title.includes('current') || title.includes('ohm') || title.includes('electric')) return 'electric-circuit';
    if (title.includes('fraction') || title.includes('part') || title.includes('decimal')) return 'fractions';
    if (title.includes('calculus') || title.includes('derivative') || title.includes('integral')) return 'calculus';
    if (title.includes('cell') || title.includes('organelle') || title.includes('plant') || title.includes('bio')) return 'cell-explorer';
    return 'sound-wave';
  };

  const [activeModule, setActiveModule] = useState<LabModuleType>(determineInitialModule());
  const [show3DHolo, setShow3DHolo] = useState<boolean>(false);
  const [spatialEngine, setSpatialEngine] = useState<'spatial' | 'holo'>('spatial');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const currentStatus = getTopicStatus(topic.id, 'ready');
  const [labCompleted, setLabCompleted] = useState<boolean>(currentStatus === 'mastered');
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  // ==========================================
  // 1. SOUND WAVE OSCILLOSCOPE SIMULATION STATE
  // ==========================================
  const [frequency, setFrequency] = useState<number>(3); // 1 to 8 Hz
  const [amplitude, setAmplitude] = useState<number>(50); // 10 to 80 px
  const [phaseOffset, setPhaseOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPhaseOffset((prev) => (prev + 0.08) % (2 * Math.PI));
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleSound = () => {
    if (isAudioActive) {
      setIsAudioActive(false);
    } else {
      setIsAudioActive(true);
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency * 110, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          setTimeout(() => {
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
            setTimeout(() => {
              osc.stop();
              ctx.close();
              setIsAudioActive(false);
            }, 1200);
          }, 1000);
        }
      } catch (e) {
        setIsAudioActive(false);
      }
    }
  };

  // ==========================================
  // 2. RAY OPTICS & SNELL'S LAW SIMULATION STATE
  // ==========================================
  const [incidenceAngle, setIncidenceAngle] = useState<number>(35); // degrees
  const [opticsMode, setOpticsMode] = useState<'air-to-glass' | 'glass-to-air'>('glass-to-air');
  const n1 = opticsMode === 'air-to-glass' ? 1.0 : 1.5;
  const n2 = opticsMode === 'air-to-glass' ? 1.5 : 1.0;
  // Critical Angle for TIR (denser to rarer only)
  const criticalAngleDeg = n1 > n2 ? Math.asin(n2 / n1) * (180 / Math.PI) : null;
  const isTIR = criticalAngleDeg !== null && incidenceAngle >= criticalAngleDeg;
  // Refracted Angle via Snell's Law
  const sinR = (n1 / n2) * Math.sin((incidenceAngle * Math.PI) / 180);
  const refractedAngleDeg = !isTIR && sinR <= 1 ? Math.asin(sinR) * (180 / Math.PI) : null;

  // ==========================================
  // 3. CHEMISTRY pH INDICATOR SIMULATION STATE
  // ==========================================
  const [pHValue, setPHValue] = useState<number>(7.0);
  const [selectedIndicator, setSelectedIndicator] = useState<'turmeric' | 'litmus' | 'phenolphthalein' | 'universal'>('turmeric');

  const getSolutionColor = () => {
    if (selectedIndicator === 'turmeric') {
      // Turmeric is yellow in acid/neutral (pH <= 7.8), deep red in base (pH > 7.8)
      if (pHValue >= 8.2) return 'rgba(185, 28, 28, 0.85)'; // deep reddish-brown
      if (pHValue >= 7.5) return 'rgba(217, 119, 6, 0.85)'; // amber-orange transition
      return 'rgba(234, 179, 8, 0.85)'; // bright yellow
    }
    if (selectedIndicator === 'litmus') {
      if (pHValue < 6.8) return 'rgba(239, 68, 68, 0.85)'; // red in acid
      if (pHValue > 7.4) return 'rgba(59, 130, 246, 0.85)'; // blue in base
      return 'rgba(168, 85, 247, 0.8)'; // purple in neutral
    }
    if (selectedIndicator === 'phenolphthalein') {
      if (pHValue >= 8.5) return 'rgba(236, 72, 153, 0.88)'; // vivid pink/magenta
      return 'rgba(241, 245, 249, 0.25)'; // colorless
    }
    // Universal indicator
    if (pHValue < 3) return 'rgba(239, 68, 68, 0.85)'; // red
    if (pHValue < 6) return 'rgba(249, 115, 22, 0.85)'; // orange
    if (pHValue <= 8) return 'rgba(34, 197, 94, 0.85)'; // green (neutral)
    if (pHValue <= 11) return 'rgba(59, 130, 246, 0.85)'; // blue
    return 'rgba(147, 51, 234, 0.85)'; // purple/violet
  };

  // ==========================================
  // 4. OHM'S LAW ELECTRIC CIRCUIT STATE
  // ==========================================
  const [circuitVoltage, setCircuitVoltage] = useState<number>(12); // Volts
  const [circuitResistance, setCircuitResistance] = useState<number>(6); // Ohms
  const circuitCurrent = circuitVoltage / (circuitResistance || 1); // Amperes
  const circuitPower = circuitVoltage * circuitCurrent; // Watts

  // ==========================================
  // 5. FRACTIONS GEOMETRY SLICE STATE
  // ==========================================
  const [fractionNum, setFractionNum] = useState<number>(3);
  const [fractionDenom, setFractionDenom] = useState<number>(4);

  // ==========================================
  // 6. CELL ORGANELLE EXPLORER STATE
  // ==========================================
  const [cellType, setCellType] = useState<'plant' | 'animal'>('plant');
  const [activeOrganelle, setActiveOrganelle] = useState<string>('nucleus');

  const organellesData: Record<string, { title: string; desc: string; function: string }> = {
    nucleus: {
      title: 'Nucleus & Chromatin',
      desc: 'Double-membrane command center containing genomic DNA.',
      function: 'Directs transcription, enzyme synthesis, and cell division.',
    },
    chloroplast: {
      title: 'Chloroplast (Plastid)',
      desc: 'Double-membraned organelle packed with green thylakoids and chlorophyll.',
      function: 'Captures photons to synthesize glucose via Photosynthesis (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂).',
    },
    mitochondria: {
      title: 'Mitochondria (Powerhouse)',
      desc: 'Folded inner cristae membranes with ATP synthase complexes.',
      function: 'Performs Krebs Cycle & oxidative phosphorylation to generate cellular energy (ATP).',
    },
    cellwall: {
      title: 'Cellulose Cell Wall',
      desc: 'Rigid outer polysaccharide layer encasing the plasma membrane.',
      function: 'Provides structural rigidity and withstands osmotic turgor pressure.',
    },
    vacuole: {
      title: 'Large Central Vacuole',
      desc: 'Liquid-filled tonoplast sac occupying up to 90% of plant cell volume.',
      function: 'Stores nutrients, regulates cellular pH, and maintains turgidity.',
    },
  };

  const handleCompleteMastery = () => {
    markTopicStatus(topic.id, 'mastered');
    updateCompetency(foundSubject?.name || 'Physics', 98);
    addXP(100, '3D Lab Mastery');
    setLabCompleted(true);
  };

  // 3-Step Graduated Hints for active module
  const hintsByModule: Record<LabModuleType, Array<{ level: number; title: string; content: string }>> = {
    'sound-wave': [
      { level: 1, title: 'Intuition: Pitch vs Loudness', content: 'Striking a fork harder increases Amplitude (volume), NOT Frequency. Frequency dictates how many cycles occur each second.' },
      { level: 2, title: 'The Wave Speed Relationship', content: 'Wave speed v = f · λ is constant in a given medium. If frequency f doubles, wavelength λ is cut in half!' },
      { level: 3, title: 'Energy Scaling Law', content: 'Wave kinetic energy flux scales with E ∝ f² · A². Resonant frequency amplification concentrates acoustic power at specific harmonics.' },
    ],
    'optics': [
      { level: 1, title: 'Intuition: The Bending of Rays', content: 'When light moves into an optically rarer medium (glass into air), it speeds up and bends AWAY from the normal line.' },
      { level: 2, title: 'Snell’s Law Calculation', content: 'n₁ · sin(θ₁) = n₂ · sin(θ₂). When sin(θ₂) exceeds 1, light cannot refract across the boundary at all.' },
      { level: 3, title: 'Critical Angle & Total Internal Reflection', content: 'For glass (n=1.5) to air (n=1.0), the critical angle is θ_c = arcsin(1/1.5) ≈ 41.8°. Any incident angle greater than this undergoes 100% Total Internal Reflection with zero light leakage!' },
    ],
    'ph-indicator': [
      { level: 1, title: 'Intuition: Natural Color Sensors', content: 'Turmeric paper is a natural yellow indicator. It stays yellow in acids (lemon juice), but turns deep red when touched by alkaline bases (soap).' },
      { level: 2, title: 'Molecular Mechanism', content: 'Curcumin pigment undergoes deprotonation above pH 8.0, transforming its chemical chromophore into a deep reddish quinoid structure.' },
      { level: 3, title: 'Neutralization Principle', content: 'Adding an acid (H⁺) to a red soap-stained turmeric cloth neutralizes the base, driving the equilibrium back to bright yellow curcumin!' },
    ],
    'electric-circuit': [
      { level: 1, title: 'Intuition: Voltage Pushes Electrons', content: 'Voltage is electrical pressure. Resistance acts like a constriction in a water pipe that impedes current flow.' },
      { level: 2, title: 'Ohm’s Law Equation', content: 'V = I · R. If you increase resistance while voltage remains constant at 12V, current (Amperes) drops in inverse proportion.' },
      { level: 3, title: 'Power Dissipation', content: 'Electrical power P = V · I = I² · R. Lamp brightness depends on power in Watts dissipated across the filament.' },
    ],
    'fractions': [
      { level: 1, title: 'Intuition: Slicing the Whole', content: 'The denominator shows how many equal pieces make up one whole. The numerator tells you how many pieces you have.' },
      { level: 2, title: 'Equivalent Fractions', content: '2/4, 3/6, and 4/8 all represent the exact same amount of space (50%) as 1/2!' },
      { level: 3, title: 'Decimal & Percentage Conversion', content: 'Divide the numerator by the denominator: 3 / 4 = 0.75 = 75% of the total unit.' },
    ],
    'calculus': [
      { level: 1, title: 'Intuition: Slope at a Single Point', content: 'A straight line has a constant slope, but a curve changes steepness at every instant.' },
      { level: 2, title: 'The Secant to Tangent Transition', content: 'As the gap Δx shrinks to zero, the secant line passing through two points morphs into the instantaneous tangent line.' },
      { level: 3, title: 'Formal Derivative Limit', content: 'f\'(x) = lim (Δx → 0) [f(x + Δx) - f(x)] / Δx. For f(x) = x², f\'(x) = 2x.' },
    ],
    'cell-explorer': [
      { level: 1, title: 'Intuition: The Plant Armor', content: 'Plants stand upright without bones because each plant cell is encased in a rigid cellulose cell wall!' },
      { level: 2, title: 'Energy Converters: Chloroplasts vs Mitochondria', content: 'Chloroplasts capture sunlight to build glucose (photosynthesis), while mitochondria break down glucose to generate ATP energy.' },
      { level: 3, title: 'Turgor Pressure & Vacuoles', content: 'The large central vacuole absorbs water, creating hydrostatic pressure against the cell wall that prevents wilting.' },
    ],
  };

  const activeHints = hintsByModule[activeModule] || hintsByModule['sound-wave'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8 text-white"
    >
      {/* Breadcrumb & Lab Header Glass Card */}
      <Interactive3DCard
        className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white`}
        glowColor="rgba(6, 182, 212, 0.35)"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border border-white/15 bg-slate-800/80 text-cyan-300 hover:bg-slate-700 shadow-sm transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Syllabus Timeline</span>
            </button>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                {topic.ncertCode || 'NCERT INQUIRY LAB'}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Class {currentClass} • Interactive STEM 3D Sandbox
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{topic.title}</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-2xl">
              {topic.shortDesc}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Take Topic Diagnostic Test */}
            {topic.testQuestions && topic.testQuestions.length > 0 && (
              <button
                onClick={() => setIsQuizModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-indigo-300 hover:text-white border border-indigo-400/40 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Diagnostic Quiz ({topic.testQuestions.length} Qs)</span>
              </button>
            )}

            {/* 3D Core View Toggle */}
            <button
              onClick={() => setShow3DHolo(!show3DHolo)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                show3DHolo
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-white/20'
                  : 'bg-slate-800 text-cyan-300 border-white/15 hover:bg-slate-700'
              }`}
            >
              <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{show3DHolo ? 'Hide 3D Core' : 'View 3D Core'}</span>
            </button>

            {/* Mark Mastered */}
            {labCompleted ? (
              <div className="px-4 py-2.5 rounded-2xl bg-amber-400/20 border border-amber-300/50 text-amber-300 font-black text-xs flex items-center gap-2 shadow-sm">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Mastered (+100 XP)</span>
              </div>
            ) : (
              <button
                onClick={handleCompleteMastery}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Mastered & Earn XP</span>
              </button>
            )}
          </div>
        </div>
      </Interactive3DCard>

      {/* Optional Interactive 3D Spatial Canvas */}
      <AnimatePresence>
        {show3DHolo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                3D Spatial Lab Visualization:
              </span>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/15">
                <button
                  onClick={() => setSpatialEngine('spatial')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    spatialEngine === 'spatial'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D Spatial Apparatus
                </button>
                <button
                  onClick={() => setSpatialEngine('holo')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    spatialEngine === 'holo'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quantum Holo Core
                </button>
              </div>
            </div>

            {spatialEngine === 'spatial' ? (
              <Spatial3DViewer
                height={320}
                initialModel={
                  activeModule === 'optics'
                    ? 'prism-rainbow'
                    : activeModule === 'ph-indicator'
                    ? 'molecule-h2o'
                    : activeModule === 'cell-explorer'
                    ? 'dna-helix'
                    : activeModule === 'electric-circuit'
                    ? 'magnetic-dipole'
                    : 'solar-system'
                }
              />
            ) : (
              <QuantumHoloCore3D height={320} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAB MODULE SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1 shrink-0">
          <Layers className="w-4 h-4" /> Switch Virtual Lab:
        </span>
        {[
          { id: 'sound-wave', label: 'Sound Waves', icon: Activity },
          { id: 'optics', label: 'Ray Optics & TIR', icon: Sun },
          { id: 'ph-indicator', label: 'Chemistry pH Reagents', icon: TestTube },
          { id: 'electric-circuit', label: 'Ohm’s Circuit V=IR', icon: Zap },
          { id: 'fractions', label: 'Fractions Geometry', icon: PieChart },
          { id: 'cell-explorer', label: 'Cell Organelle 3D', icon: Atom },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id as LabModuleType)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/30 border border-white/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* ACTIVE LAB SIMULATION BENCH                               */}
      {/* ========================================================= */}
      <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white overflow-hidden`}>
        {/* ========================================================= */}
        {/* 1. SOUND WAVE OSCILLOSCOPE                                */}
        {/* ========================================================= */}
        {activeModule === 'sound-wave' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Harmonic Oscilloscope • Continuous Sine Wave
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  f = {frequency} Hz | A = {amplitude} px | λ = {(100 / frequency).toFixed(1)} cm
                </span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1 rounded-xl border border-white/15 bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer"
                >
                  {isPlaying ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>

            {/* Oscilloscope Canvas */}
            <div className="relative w-full rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden p-2">
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.4) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <svg viewBox="0 0 800 240" className="w-full h-48 sm:h-64 overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="35%" stopColor="#38BDF8" />
                    <stop offset="70%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#F472B6" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="120" x2="800" y2="120" stroke="rgba(148, 163, 184, 0.25)" strokeDasharray="4,4" strokeWidth="1.5" />
                <path
                  d={Array.from({ length: 201 }, (_, i) => {
                    const x = i * 4;
                    const normX = (x / 800) * 2 * Math.PI * frequency;
                    const y = 120 - amplitude * Math.sin(normX + phaseOffset);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y.toFixed(2)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#waveLineGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span>Frequency (Pitch)</span>
                  <span className="text-cyan-400 font-mono">{frequency} Hz</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span>Amplitude (Loudness)</span>
                  <span className="text-cyan-400 font-mono">{amplitude} px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="75"
                  step="5"
                  value={amplitude}
                  onChange={(e) => setAmplitude(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2 flex flex-col justify-between">
                <div className="flex justify-between text-xs font-black">
                  <span>Harmonic Sound Probe</span>
                  <span className="text-slate-400 text-[11px]">Audio API</span>
                </div>
                <button
                  onClick={toggleSound}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    isAudioActive
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/15'
                  }`}
                >
                  {isAudioActive ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
                  <span>{isAudioActive ? 'Playing Sine Tone...' : 'Play Acoustic Sine Tone'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. RAY OPTICS & SNELL'S LAW REFRACTION / TIR BENCH       */}
        {/* ========================================================= */}
        {activeModule === 'optics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Ray Optics Bench • Refraction & Total Internal Reflection (TIR)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isTIR
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                }`}>
                  {isTIR ? '🚨 TOTAL INTERNAL REFLECTION (TIR)' : 'Refraction Active'}
                </span>
              </div>
            </div>

            {/* Interactive Ray Optics Graphical Bench */}
            <div className="relative w-full rounded-2xl bg-slate-950/95 border border-amber-500/30 p-4 overflow-hidden">
              <svg viewBox="0 0 600 300" className="w-full h-56 sm:h-72">
                <defs>
                  <linearGradient id="incidentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>
                  <linearGradient id="refractedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                  <linearGradient id="tirGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#FB7185" />
                  </linearGradient>
                </defs>

                {/* Medium Backgrounds */}
                <rect x="0" y="0" width="600" height="150" fill={opticsMode === 'glass-to-air' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.4)'} />
                <rect x="0" y="150" width="600" height="150" fill={opticsMode === 'glass-to-air' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(30, 41, 59, 0.7)'} />

                {/* Boundary Interface & Labels */}
                <line x1="0" y1="150" x2="600" y2="150" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6,4" />
                <line x1="300" y1="20" x2="300" y2="280" stroke="rgba(255,255,255,0.3)" strokeDasharray="3,3" strokeWidth="1.5" />

                <text x="20" y="40" fill="#94A3B8" fontSize="12" fontWeight="bold">
                  {opticsMode === 'glass-to-air' ? 'Medium 1: Glass (n₁ = 1.50) [Optically Denser]' : 'Medium 1: Air (n₁ = 1.00)'}
                </text>
                <text x="20" y="270" fill="#94A3B8" fontSize="12" fontWeight="bold">
                  {opticsMode === 'glass-to-air' ? 'Medium 2: Air (n₂ = 1.00) [Optically Rarer]' : 'Medium 2: Glass (n₂ = 1.50)'}
                </text>

                {/* Light Source & Incident Ray */}
                {(() => {
                  const radI = (incidenceAngle * Math.PI) / 180;
                  const length = 160;
                  const startX = 300 - length * Math.sin(radI);
                  const startY = 150 - length * Math.cos(radI);

                  return (
                    <>
                      {/* Laser Pointer Emitting Node */}
                      <circle cx={startX} cy={startY} r="8" fill="#F59E0B" className="animate-pulse" />
                      <line x1={startX} y1={startY} x2="300" y2="150" stroke="url(#incidentGrad)" strokeWidth="4" strokeLinecap="round" />
                    </>
                  );
                })()}

                {/* Normal Angle Arc */}
                <path d="M 300 110 A 40 40 0 0 0 280 120" fill="none" stroke="#FBBF24" strokeWidth="2" />
                <text x="250" y="115" fill="#FBBF24" fontSize="11" fontWeight="bold">θ₁ = {incidenceAngle}°</text>

                {/* Refracted Ray or TIR Reflected Ray */}
                {isTIR ? (
                  // Total Internal Reflection Ray
                  (() => {
                    const radI = (incidenceAngle * Math.PI) / 180;
                    const length = 160;
                    const endX = 300 + length * Math.sin(radI);
                    const endY = 150 - length * Math.cos(radI);
                    return (
                      <>
                        <line x1="300" y1="150" x2={endX} y2={endY} stroke="url(#tirGrad)" strokeWidth="4.5" strokeLinecap="round" />
                        <text x="320" y="100" fill="#FB7185" fontSize="11" fontWeight="bold">100% TIR Reflection (θ_r = {incidenceAngle}°)</text>
                      </>
                    );
                  })()
                ) : (
                  // Refracted Ray into Medium 2
                  refractedAngleDeg !== null && (() => {
                    const radR = (refractedAngleDeg * Math.PI) / 180;
                    const length = 150;
                    const endX = 300 + length * Math.sin(radR);
                    const endY = 150 + length * Math.cos(radR);
                    return (
                      <>
                        <line x1="300" y1="150" x2={endX} y2={endY} stroke="url(#refractedGrad)" strokeWidth="4" strokeLinecap="round" />
                        <text x="320" y="200" fill="#38BDF8" fontSize="11" fontWeight="bold">θ₂ = {refractedAngleDeg.toFixed(1)}°</text>
                      </>
                    );
                  })()
                )}

                {/* Interface Impact Point Spark */}
                <circle cx="300" cy="150" r="5" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Optics Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span>Incident Angle (θ₁)</span>
                  <span className="text-amber-400 font-mono">{incidenceAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="85"
                  value={incidenceAngle}
                  onChange={(e) => setIncidenceAngle(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Normal (0°)</span>
                  <span>Grazing (85°)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span>Optical Interface Mode</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpticsMode('glass-to-air')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      opticsMode === 'glass-to-air'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                        : 'bg-slate-800 text-slate-400 border-white/10'
                    }`}
                  >
                    Glass → Air (TIR)
                  </button>
                  <button
                    onClick={() => setOpticsMode('air-to-glass')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      opticsMode === 'air-to-glass'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                        : 'bg-slate-800 text-slate-400 border-white/10'
                    }`}
                  >
                    Air → Glass
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-xs space-y-1">
                <span className="text-cyan-400 font-black">Physics Diagnostic:</span>
                <p className="text-[11px] text-slate-300">
                  {criticalAngleDeg ? (
                    <>Critical Angle θ_c = <strong>{criticalAngleDeg.toFixed(1)}°</strong>. At θ₁ &gt; θ_c, light undergoes complete Total Internal Reflection!</>
                  ) : (
                    <>Light transitions into denser medium; angle of refraction bends towards normal.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. CHEMISTRY pH INDICATOR & TITRATION BENCH              */}
        {/* ========================================================= */}
        {activeModule === 'ph-indicator' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Chemistry Lab • Natural Turmeric & Litmus Acid-Base Indicators
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                pH = {pHValue.toFixed(1)} | [H⁺] = 10⁻{pHValue.toFixed(1)} M
              </span>
            </div>

            {/* Virtual Chemical Beaker & Reagent Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Beaker Graphic */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/90 border border-purple-500/30">
                <div className="relative w-40 h-52 border-4 border-t-0 border-white/60 rounded-b-3xl overflow-hidden flex items-end justify-center shadow-xl">
                  {/* Graduated markings */}
                  <div className="absolute left-2 top-8 w-4 h-0.5 bg-white/40" />
                  <div className="absolute left-2 top-16 w-6 h-0.5 bg-white/40" />
                  <div className="absolute left-2 top-24 w-4 h-0.5 bg-white/40" />
                  <div className="absolute left-2 top-32 w-6 h-0.5 bg-white/40" />

                  {/* Liquid inside beaker */}
                  <motion.div
                    animate={{ backgroundColor: getSolutionColor() }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-36 rounded-b-2xl relative shadow-inner flex items-center justify-center"
                  >
                    <div className="absolute top-2 w-full h-2 bg-white/20 rounded-full" />
                    <span className="text-white font-black text-sm drop-shadow-md">
                      pH {pHValue.toFixed(1)}
                    </span>
                  </motion.div>
                </div>
                <div className="text-center mt-3 text-xs font-bold text-slate-300">
                  {pHValue < 6.8 ? 'Acidic Solution (H⁺ excess)' : pHValue > 7.4 ? 'Alkaline Base (OH⁻ excess)' : 'Neutral Solution (Pure Water)'}
                </div>
              </div>

              {/* Indicator Controls & Household Presets */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span>Solution pH Level</span>
                    <span className="text-purple-400 font-mono font-bold">{pHValue.toFixed(1)} / 14.0</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="0.1"
                    value={pHValue}
                    onChange={(e) => setPHValue(Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Strong Acid (pH 0)</span>
                    <span>Neutral (pH 7)</span>
                    <span>Strong Base (pH 14)</span>
                  </div>
                </div>

                {/* Reagent Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300">Selected Indicator Reagent:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'turmeric', label: 'Natural Turmeric (Curcumin)' },
                      { id: 'litmus', label: 'Litmus Paper (Red/Blue)' },
                      { id: 'phenolphthalein', label: 'Phenolphthalein' },
                      { id: 'universal', label: 'Universal Indicator' },
                    ].map((ind) => (
                      <button
                        key={ind.id}
                        onClick={() => setSelectedIndicator(ind.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                          selectedIndicator === ind.id
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                            : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        {ind.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Household Presets */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-300">Real-World NCERT Samples:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Lemon Juice', ph: 2.2 },
                      { label: 'Vinegar', ph: 2.8 },
                      { label: 'Pure Water', ph: 7.0 },
                      { label: 'Baking Soda', ph: 8.5 },
                      { label: 'Soap Solution', ph: 10.0 },
                      { label: 'Lime Water', ph: 11.5 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setPHValue(item.ph)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/15 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
                      >
                        {item.label} (pH {item.ph})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. OHM'S LAW ELECTRIC CIRCUIT V = IR                     */}
        {/* ========================================================= */}
        {activeModule === 'electric-circuit' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Virtual Circuit Board • Ohm’s Law V = I × R
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs font-bold text-cyan-400">
                <span>V = {circuitVoltage}V</span> | <span>R = {circuitResistance}Ω</span> | <span>I = {circuitCurrent.toFixed(2)}A</span>
              </div>
            </div>

            {/* Interactive Circuit Schematic */}
            <div className="relative w-full rounded-2xl bg-slate-950/95 border border-amber-500/30 p-6 overflow-hidden">
              <svg viewBox="0 0 600 240" className="w-full h-52 sm:h-64">
                {/* Copper Wires */}
                <rect x="80" y="40" width="440" height="160" fill="none" stroke="#F59E0B" strokeWidth="3" rx="16" />

                {/* Battery on Left */}
                <rect x="65" y="100" width="30" height="40" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" rx="6" />
                <line x1="72" y1="110" x2="88" y2="110" stroke="#EF4444" strokeWidth="3" />
                <line x1="76" y1="130" x2="84" y2="130" stroke="#38BDF8" strokeWidth="2" />
                <text x="50" y="95" fill="#38BDF8" fontSize="11" fontWeight="bold">{circuitVoltage}V Battery</text>

                {/* Resistor on Top */}
                <rect x="250" y="30" width="100" height="20" fill="#78350F" stroke="#FDE68A" strokeWidth="2" rx="4" />
                <text x="270" y="24" fill="#FDE68A" fontSize="11" fontWeight="bold">{circuitResistance} Ω Resistor</text>

                {/* Lamp on Right */}
                <circle
                  cx="520"
                  cy="120"
                  r="24"
                  fill={`rgba(251, 191, 36, ${Math.min(1, Math.max(0.1, circuitPower / 40))})`}
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  className={circuitCurrent > 0.1 ? 'animate-pulse' : ''}
                />
                <text x="505" y="125" fill="#FFFFFF" fontSize="12" fontWeight="bold">💡</text>
                <text x="490" y="165" fill="#FBBF24" fontSize="10" fontWeight="bold">{circuitPower.toFixed(1)}W Lamp</text>

                {/* Digital Ammeter on Bottom */}
                <rect x="250" y="185" width="100" height="30" fill="#0F172A" stroke="#34D399" strokeWidth="2" rx="6" />
                <text x="268" y="205" fill="#34D399" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  {circuitCurrent.toFixed(2)} A
                </text>
              </svg>
            </div>

            {/* Circuit Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span>Battery Potential Difference (Voltage)</span>
                  <span className="text-cyan-400 font-mono">{circuitVoltage} Volts</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={circuitVoltage}
                  onChange={(e) => setCircuitVoltage(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span>Conductor Resistance (R)</span>
                  <span className="text-amber-400 font-mono">{circuitResistance} Ohms</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={circuitResistance}
                  onChange={(e) => setCircuitResistance(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. FRACTIONS GEOMETRY SLICES BENCH                        */}
        {/* ========================================================= */}
        {activeModule === 'fractions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Mathematics Fractions Sandbox • Visual Geometric Slices
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {fractionNum} / {fractionDenom} = {((fractionNum / fractionDenom) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Pie Chart Display */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/90 border border-amber-500/30">
                <svg viewBox="0 0 200 200" className="w-44 h-44">
                  <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.08)" stroke="#F59E0B" strokeWidth="2" />
                  {/* Slices */}
                  {Array.from({ length: fractionDenom }, (_, idx) => {
                    const startAngle = (idx * 2 * Math.PI) / fractionDenom - Math.PI / 2;
                    const endAngle = ((idx + 1) * 2 * Math.PI) / fractionDenom - Math.PI / 2;
                    const x1 = 100 + 80 * Math.cos(startAngle);
                    const y1 = 100 + 80 * Math.sin(startAngle);
                    const x2 = 100 + 80 * Math.cos(endAngle);
                    const y2 = 100 + 80 * Math.sin(endAngle);
                    const isFilled = idx < fractionNum;

                    return (
                      <path
                        key={idx}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} Z`}
                        fill={isFilled ? '#F59E0B' : 'transparent'}
                        stroke="#0F172A"
                        strokeWidth="2"
                        className="transition-all"
                      />
                    );
                  })}
                </svg>
                <div className="text-center mt-3 text-sm font-black text-amber-300">
                  {fractionNum} of {fractionDenom} equal partitions taken
                </div>
              </div>

              {/* Fraction Sliders */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span>Numerator (Parts Taken)</span>
                    <span className="text-amber-400 font-mono">{fractionNum}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={fractionDenom}
                    value={fractionNum}
                    onChange={(e) => setFractionNum(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span>Denominator (Total Partitions)</span>
                    <span className="text-cyan-400 font-mono">{fractionDenom}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={fractionDenom}
                    onChange={(e) => {
                      const newDenom = Number(e.target.value);
                      setFractionDenom(newDenom);
                      if (fractionNum > newDenom) setFractionNum(newDenom);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-xs space-y-1">
                  <span className="text-cyan-400 font-black">Equivalent Form:</span>
                  <p className="text-[11px] text-slate-300">
                    Decimal Value: <strong>{(fractionNum / fractionDenom).toFixed(3)}</strong> • Fraction Percentage: <strong>{((fractionNum / fractionDenom) * 100).toFixed(1)}%</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. CELL ORGANELLE EXPLORER                                */}
        {/* ========================================================= */}
        {activeModule === 'cell-explorer' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Biology 3D Sandbox • Plant vs Animal Cell Structure
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCellType('plant')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                    cellType === 'plant' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Plant Cell
                </button>
                <button
                  onClick={() => setCellType('animal')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                    cellType === 'animal' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Animal Cell
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Organelle Click Palette */}
              <div className="md:col-span-5 flex flex-wrap gap-2">
                {Object.entries(organellesData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setActiveOrganelle(key)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      activeOrganelle === key
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md'
                        : 'bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{data.title}</div>
                    <div className="text-[10px] text-slate-300 truncate">{data.desc}</div>
                  </button>
                ))}
              </div>

              {/* Organelle Deep Dive Card */}
              <div className="md:col-span-7 p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Organelle Profile
                  </span>
                  <h3 className="text-lg font-black text-white">{organellesData[activeOrganelle]?.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {organellesData[activeOrganelle]?.desc}
                </p>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">Biological Function:</span>
                  <p className="text-xs text-slate-200">
                    {organellesData[activeOrganelle]?.function}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3-STEP GRADUATED HINTS ACCORDION */}
      <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white`}>
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black">
            <HelpCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-base font-black">3-Step Graduated Inquiry Hints</h2>
            <p className="text-xs font-medium text-slate-400">
              Scaffolded prompts from initial conceptual spark to complete mathematical derivation
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {activeHints.map((hint, idx) => {
            const isOpen = activeHintIndex === idx;

            return (
              <motion.div
                key={hint.level}
                layout
                className="rounded-2xl border border-white/15 bg-slate-800/60 overflow-hidden"
              >
                <button
                  onClick={() => setActiveHintIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/90 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-black flex items-center justify-center shadow-md">
                      {hint.level}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold">{hint.title}</span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-4 pt-1 text-xs sm:text-sm font-medium border-t border-white/10 bg-slate-900/40 text-slate-300 leading-relaxed"
                    >
                      {hint.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Topic Diagnostic Quiz Modal Trigger */}
      {topic.testQuestions && topic.testQuestions.length > 0 && (
        <TopicQuizModal
          activity={topic}
          subjectCategory={foundSubject?.category || 'physics'}
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default InquiryLabView;
