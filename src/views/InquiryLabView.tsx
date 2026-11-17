import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
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

  // Default fallback if directly navigated
  const topic = foundTopic || {
    id: 'p7-ch13-t1',
    title: 'Sound Detective: Pitch vs Frequency Oscilloscope',
    shortDesc: 'Vary frequency and amplitude to observe continuous sound wave transformations.',
    ncertCode: 'NCERT Cl 8 Science Ch 13',
    labModuleId: 'sound-wave'
  };

  const [frequency, setFrequency] = useState(440); // 110 - 880 Hz
  const [amplitude, setAmplitude] = useState(50); // 10 - 100
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Audio synthesis using Web Audio API
  const handleToggleSound = () => {
    if (!isPlaying) {
      setIsPlaying(true);
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
          setIsPlaying(false);
        }, 800);
      } catch (e) {
        setTimeout(() => setIsPlaying(false), 800);
      }
    }
  };

  const handleFinishLab = () => {
    setIsCompleted(true);
    completeLab(topic.id, (foundSubject?.category || 'physics') as any);
  };

  // Generate dynamic SVG sine wave path
  const width = 600;
  const height = 180;
  const centerY = height / 2;
  const cycles = (frequency / 110) * 2;
  const ampPixels = (amplitude / 100) * (height * 0.4);

  let pathD = `M 0 ${centerY}`;
  for (let x = 0; x <= width; x += 3) {
    const angle = (x / width) * cycles * 2 * Math.PI;
    const y = centerY - Math.sin(angle) * ampPixels;
    pathD += ` L ${x} ${y.toFixed(2)}`;
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="glass-panel rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Subject
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Interactive Inquiry Lab
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{topic.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
            {topic.ncertCode}
          </span>
          <button
            onClick={handleFinishLab}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02] cursor-pointer'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Lab Mastered (+40 XP)' : 'Mark Lab Completed'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Oscilloscope Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualizer Canvas */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-800">Live Waveform Oscilloscope Visualizer</h3>
            </div>
            <button
              onClick={handleToggleSound}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>{isPlaying ? 'Playing Tone...' : 'Auditory Verification (Play Tone)'}</span>
            </button>
          </div>

          {/* SVG Waveform Display */}
          <div className="w-full bg-slate-950 rounded-2xl p-4 shadow-inner relative overflow-hidden border border-slate-800">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible relative z-10">
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>

              {/* Centerline */}
              <line x1="0" y1={centerY} x2={width} y2={centerY} stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Dynamic Wave */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#waveGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Readout Telemetry */}
            <div className="mt-2 flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>FREQUENCY: {frequency} Hz (Pitch)</span>
              <span>AMPLITUDE: {amplitude}% (Loudness)</span>
              <span>CYCLES: {cycles.toFixed(1)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Essential Invariant Concept:
            </span>
            <p>
              Frequency dictates <strong>Pitch</strong> (how shrill the sound is). Amplitude dictates <strong>Loudness</strong> (volume). Changing the volume does <em>not</em> change pitch!
            </p>
          </div>
        </div>

        {/* Real-time Sliders & Controls */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
            Experimental Controls
          </h3>

          {/* Frequency Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Pitch / Frequency (Hz)</span>
              <span className="font-mono text-indigo-600">{frequency} Hz</span>
            </div>
            <input
              type="range"
              min="110"
              max="880"
              step="10"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>110 Hz (Low Bass)</span>
              <span>440 Hz (Middle A)</span>
              <span>880 Hz (High)</span>
            </div>
          </div>

          {/* Amplitude Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Loudness / Amplitude (%)</span>
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
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Whisper)</span>
              <span>50% (Speaking)</span>
              <span>100% (Maximum)</span>
            </div>
          </div>

          {/* Presets */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700">Quick Test Cases:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setFrequency(220); setAmplitude(80); }}
                className="p-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Deep Drum (220Hz, 80%)
              </button>
              <button
                onClick={() => { setFrequency(880); setAmplitude(25); }}
                className="p-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Mosquito Buzz (880Hz, 25%)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
