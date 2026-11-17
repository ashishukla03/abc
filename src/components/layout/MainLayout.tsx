import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen relative flex flex-col justify-between font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Living VisionOS Aurora Mesh Canvas */}
      <div className="aurora-mesh">
        <div className="aurora-orb-indigo w-[680px] h-[680px] -top-36 -left-36 bg-gradient-to-tr from-indigo-500 to-blue-400" />
        <div className="aurora-orb-cyan w-[580px] h-[580px] top-48 -right-24 bg-gradient-to-tr from-teal-400 to-cyan-300" />
        <div className="aurora-orb-amber w-[620px] h-[620px] -bottom-36 left-1/4 bg-gradient-to-tr from-amber-400 to-yellow-200" />
        <div className="aurora-orb-purple w-[520px] h-[520px] bottom-16 right-16 bg-gradient-to-tr from-purple-500 to-pink-400" />
      </div>

      {/* Subtle Dot Grid Canvas for Depth */}
      <div className="mesh-grid-pattern" />

      {/* App Shell Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <TopNavbar />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-20">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Study Buddy with Apple VisionOS Glass & Spring Motion */}
      <motion.aside
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.06, y: -4 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => alert("🤖 RoboBuddy AI Study Coach is ready! Aligned to your current NCERT Class curriculum.")}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-slate-900/85 text-white backdrop-blur-2xl border border-white/25 shadow-[0_16px_40px_rgba(15,23,42,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-400 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 group-hover:rotate-12 transition-transform">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left pr-2">
            <div className="text-xs font-extrabold leading-none flex items-center gap-1.5">
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
