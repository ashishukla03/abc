import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, BookOpen, School, FileCheck, Bot, User, Flame, Wifi, Sparkles, Crown } from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore';

export const TopNavbar: React.FC = () => {
  const { curriculumStage, selectedClass, setCurriculumStage, setSelectedClass, userProfile } = useSessionStore();

  const stages: { key: 'Prep' | 'Middle' | 'Sec' | 'Senior'; label: string; classRange: number }[] = [
    { key: 'Prep', label: 'Prep (Cl 5)', classRange: 5 },
    { key: 'Middle', label: 'Middle (6–8)', classRange: 7 },
    { key: 'Sec', label: 'Sec (9–10)', classRange: 10 },
    { key: 'Senior', label: 'Senior (11–12)', classRange: 12 },
  ];

  return (
    <header className="sticky top-3 z-40 mx-auto max-w-7xl px-4 sm:px-6 mb-6">
      <div className="glass-header rounded-2xl px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Stage Selector */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-3 text-indigo-700 font-black text-lg tracking-tight group">
            <motion.div
              whileHover={{ rotate: 18, scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)]"
            >
              <Compass className="w-5 h-5 drop-shadow-md" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white shadow-sm" />
            </motion.div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent font-black tracking-tight text-base leading-tight">
                  Gramin PocketLab
                </span>
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
              <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest leading-none mt-0.5">
                Royal K-12 STEM Edition
              </span>
            </div>
          </NavLink>

          {/* Royal Glass Animated Stage Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/5 backdrop-blur-xl rounded-xl border border-white/80 shadow-inner">
            {stages.map((st) => {
              const isSelected = curriculumStage === st.key;
              return (
                <motion.button
                  key={st.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurriculumStage(st.key)}
                  className={`relative px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors z-10 cursor-pointer active-click-pulse ${
                    isSelected ? 'text-indigo-950 font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeStagePill"
                      className="absolute inset-0 bg-white rounded-lg shadow-[0_4px_16px_rgba(79,70,229,0.14),inset_0_1.5px_1px_rgba(255,255,255,1)] -z-10 border border-indigo-100"
                      transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                    />
                  )}
                  {st.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Global Nav Links with tactile hover lifts and click ripple */}
        <nav className="flex items-center gap-1.5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active-click-pulse ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-600/35 font-extrabold scale-[1.02]'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:scale-[1.03]'
              }`
            }
          >
            <Compass className="w-4 h-4" />
            <span>Question Worlds</span>
          </NavLink>

          <NavLink
            to={`/class/${selectedClass}/subjects`}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active-click-pulse ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-600/35 font-extrabold scale-[1.02]'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:scale-[1.03]'
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses</span>
          </NavLink>

          <NavLink
            to="/hub"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active-click-pulse ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-600/35 font-extrabold scale-[1.02]'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:scale-[1.03]'
              }`
            }
          >
            <School className="w-4 h-4" />
            <span>School Hub</span>
          </NavLink>

          <NavLink
            to="/mock-exams"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active-click-pulse ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-600/35 font-extrabold scale-[1.02]'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:scale-[1.03]'
              }`
            }
          >
            <FileCheck className="w-4 h-4" />
            <span>Mock Exams</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active-click-pulse ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-600/35 font-extrabold scale-[1.02]'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:scale-[1.03]'
              }`
            }
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </NavLink>
        </nav>

        {/* User Badges & Streak */}
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-300/80 text-amber-900 text-xs font-black shadow-sm cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-500 animate-pulse fill-amber-500" />
            <span>{userProfile.streakDays}d Streak</span>
          </motion.div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-300/80 text-emerald-800 text-xs font-black">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Offline Sync</span>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-200 text-indigo-950 text-xs font-black font-mono shadow-sm"
          >
            {userProfile.totalXp} XP
          </motion.div>
        </div>
      </div>
    </header>
  );
};
