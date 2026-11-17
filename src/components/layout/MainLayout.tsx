import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen relative flex flex-col justify-between font-sans">
      {/* Living Aurora Mesh Canvas */}
      <div className="aurora-mesh">
        <div className="aurora-orb w-[600px] h-[600px] -top-40 -left-40 bg-indigo-400" />
        <div className="aurora-orb w-[500px] h-[500px] top-60 -right-20 bg-teal-300" />
        <div className="aurora-orb w-[550px] h-[550px] -bottom-40 left-1/3 bg-amber-300" />
        <div className="aurora-orb w-[450px] h-[450px] bottom-10 right-10 bg-purple-400" />
      </div>

      {/* App Shell Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <TopNavbar />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-16">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Study Buddy Widget */}
      <motion.aside
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => alert("🤖 RoboBuddy AI Study Coach is ready! Aligned to your current NCERT Class curriculum.")}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900/90 text-white backdrop-blur-xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.3)] hover:bg-slate-950 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-bold leading-none flex items-center gap-1.5">
              <span>AI Study Buddy</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Ask doubt or hint</span>
          </div>
        </button>
      </motion.aside>
    </div>
  );
};
