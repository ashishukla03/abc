import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FuturisticParticleCanvas } from '../ui/FuturisticParticleCanvas';
import { ToastNotification } from '../ui/ToastNotification';
import { AITutorModal } from '../modals/AITutorModal';
import { useAppStore } from '../../store/useAppStore';

export const MainLayout: React.FC = () => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  return (
    <div
      className={`min-h-screen relative flex flex-col justify-between font-sans selection:bg-indigo-500/30 selection:text-cyan-200 transition-colors duration-500 ${
        isDark ? 'text-slate-100 bg-[#060813]' : 'text-slate-900 bg-[#F4F7FB]'
      }`}
    >
      {/* Living Ambient Background Canvas */}
      <div className="royal-futuristic-canvas">
        {isDark ? (
          <>
            {/* Deep Cosmic Obsidian Gradients */}
            <div className="absolute inset-0 bg-radial from-indigo-950/60 via-[#060813] to-[#030408]" />
            <div className="royal-orb-sapphire w-[720px] h-[720px] -top-40 -left-40 bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 opacity-30 mix-blend-screen" />
            <div className="royal-orb-magenta w-[620px] h-[620px] top-64 -right-28 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 opacity-25 mix-blend-screen" />
            <div className="royal-orb-gold w-[680px] h-[680px] -bottom-48 left-1/4 bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 opacity-20 mix-blend-screen" />
            <div className="royal-orb-emerald w-[560px] h-[560px] bottom-10 right-20 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 opacity-25 mix-blend-screen" />
          </>
        ) : (
          <>
            <div className="royal-orb-sapphire w-[720px] h-[720px] -top-40 -left-40 bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400" />
            <div className="royal-orb-magenta w-[620px] h-[620px] top-64 -right-28 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-400" />
            <div className="royal-orb-gold w-[680px] h-[680px] -bottom-48 left-1/4 bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200" />
            <div className="royal-orb-emerald w-[560px] h-[560px] bottom-10 right-20 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300" />
          </>
        )}
      </div>

      {/* Cyber Grid Overlay */}
      <div
        className={`cyber-grid ${
          isDark
            ? 'opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_70%,transparent_100%)]'
            : ''
        }`}
      />

      {/* Continuous Conic Radar Beam Sweep */}
      <div className={`radar-beam ${isDark ? 'opacity-30' : 'opacity-15'}`} />

      {/* Interactive Constellation Particle Field */}
      <FuturisticParticleCanvas />

      {/* Floating System Toast Notifications */}
      <ToastNotification />

      {/* App Shell Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <TopNavbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-20">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Study Buddy with VisionOS Glass & Dynamic Spring Motion */}
      <motion.aside
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.4 }}
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          onClick={() => setIsAITutorOpen(true)}
          className="flex items-center gap-3.5 px-4.5 py-3 rounded-full bg-slate-900/90 text-white backdrop-blur-3xl border border-white/25 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1.5px_1px_rgba(255,255,255,0.3)] hover:border-cyan-400/50 transition-all cursor-pointer group"
          title="Open AI STEM Tutor"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-400 to-teal-300 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/40 group-hover:rotate-180 transition-transform duration-700">
            <Bot className="w-4 h-4 font-bold" />
          </div>
          <div className="text-left pr-2">
            <div className="text-xs font-black leading-none flex items-center gap-1.5">
              <span className="text-white">AI Study Buddy</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-[10px] text-cyan-300 font-medium">Ask doubt or 3D hint</span>
          </div>
        </button>
      </motion.aside>

      {/* AI Tutor Interactive Modal */}
      <AITutorModal isOpen={isAITutorOpen} onClose={() => setIsAITutorOpen(false)} />
    </div>
  );
};
