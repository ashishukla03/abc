import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, BookOpen, School, FileCheck, Bot, User, Flame, Wifi } from 'lucide-react';
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
      <div className="glass-panel rounded-2xl px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Stage Selector */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2.5 text-indigo-700 font-extrabold text-lg tracking-tight group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
              Gramin PocketLab
            </span>
          </NavLink>

          {/* Stage Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 backdrop-blur-md rounded-xl border border-white/60">
            {stages.map((st) => {
              const isSelected = curriculumStage === st.key;
              return (
                <button
                  key={st.key}
                  onClick={() => setCurriculumStage(st.key)}
                  className={`relative px-3 py-1 text-xs font-bold rounded-lg transition-colors z-10 ${
                    isSelected ? 'text-indigo-950 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeStagePill"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10 border border-slate-200/60"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Nav Links */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`
            }
          >
            <Compass className="w-4 h-4" />
            <span>Question Worlds</span>
          </NavLink>

          <NavLink
            to={`/class/${selectedClass}/subjects`}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses</span>
          </NavLink>

          <NavLink
            to="/hub"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`
            }
          >
            <School className="w-4 h-4" />
            <span>School Hub</span>
          </NavLink>

          <NavLink
            to="/mock-exams"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`
            }
          >
            <FileCheck className="w-4 h-4" />
            <span>Mock Exams</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`
            }
          >
            <User className="w-4 h-4" />
            <span>Learner Model</span>
          </NavLink>
        </nav>

        {/* Telemetry & User Status */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Offline Ready
          </span>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="text-xl" role="img" aria-label="avatar">{userProfile.avatar}</span>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-none">{userProfile.name}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{userProfile.xp} XP • Lvl {userProfile.level}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
