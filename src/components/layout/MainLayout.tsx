import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FuturisticParticleCanvas } from '../ui/FuturisticParticleCanvas';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen relative flex flex-col justify-between font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Royal Futuristic Living Ambient Background Canvas */}
      <div className="royal-futuristic-canvas">
        <div className="royal-orb-sapphire w-[720px] h-[720px] -top-40 -left-40 bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400" />
        <div className="royal-orb-magenta w-[620px] h-[620px] top-64 -right-28 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-400" />
        <div className="royal-orb-gold w-[680px] h-[680px] -bottom-48 left-1/4 bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200" />
        <div className="royal-orb-emerald w-[560px] h-[560px] bottom-10 right-20 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300" />
      </div>

      {/* Cyber Grid Overlay with perspective depth */}
      <div className="cyber-grid" />

      {/* Continuous Conic Radar Beam Sweep */}
      <div className="radar-beam" />

      {/* Interactive Constellation Particle Field */}
      <FuturisticParticleCanvas />

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
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => alert("🤖 RoboBuddy AI Study Coach is ready! Aligned to your current NCERT Class curriculum.")}
          className="flex items-center gap-3.5 px-4.5 py-3 rounded-full bg-slate-900/90 text-white backdrop-blur-2xl border border-white/30 shadow-[0_16px_40px_rgba(15,23,42,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.4)] hover:bg-slate-950 transition-all cursor-pointer group active-click-pulse"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-400 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/50 group-hover:rotate-12 transition-transform">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left pr-2">
            <div className="text-xs font-black leading-none flex items-center gap-1.5">
              <span>AI Study Buddy</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium">Ask doubt or hint</span>
          </div>
        </button>
      </motion.aside>
    </div>
  );
};
