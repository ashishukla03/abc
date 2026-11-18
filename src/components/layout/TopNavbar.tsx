import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  BookOpen,
  Sparkles,
  GraduationCap,
  ChevronDown,
  Moon,
  Sun,
  FileCheck,
  School,
  User,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TopNavbar: React.FC = () => {
  const { user, currentClass, setCurrentClass, theme, toggleTheme } = useAppStore();

  const classOptions = [5, 6, 7, 8, 9, 10, 11, 12];

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Compass, end: true },
    { to: '/courses', label: 'Subjects', icon: BookOpen },
    { to: '/exams', label: 'Mock Exams', icon: FileCheck },
    { to: '/school', label: 'School Hub', icon: School },
  ];

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-7xl px-3 sm:px-6 mb-6">
      <div className="bg-slate-900/80 backdrop-blur-3xl backdrop-saturate-[1.8] border border-white/[0.16] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8),inset_0_1.5px_1px_rgba(255,255,255,0.2)] rounded-3xl p-3 sm:px-6 transition-all duration-300 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Class Selector */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          <NavLink to="/" className="flex items-center gap-2.5 font-black text-lg tracking-tight group">
            <motion.div
              whileHover={{ rotate: 18, scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-[0_8px_25px_rgba(79,70,229,0.6)] border border-white/30 shrink-0"
            >
              <Compass className="w-5 h-5 drop-shadow-md" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-slate-900 shadow-sm animate-ping" />
            </motion.div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent font-black tracking-tight text-sm sm:text-base leading-tight">
                  Gramin PocketLab
                </span>
                <span className="text-[9px] bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 text-cyan-300 font-extrabold px-1.5 py-0.5 rounded-full border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)] hidden sm:inline-block">
                  VisionOS
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-0.5">
                Quantum STEM Engine
              </span>
            </div>
          </NavLink>

          {/* Dynamic Class Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-2xl border border-white/15 bg-slate-800/80 backdrop-blur-xl text-slate-200 shadow-inner">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <label htmlFor="class-selector" className="text-[11px] font-bold text-slate-300 hidden sm:inline">
              Grade:
            </label>
            <div className="relative">
              <select
                id="class-selector"
                value={currentClass}
                onChange={(e) => setCurrentClass(Number(e.target.value))}
                className="appearance-none font-black text-xs rounded-xl px-2.5 py-1 pr-6 border border-white/20 bg-slate-950 text-white cursor-pointer hover:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors"
                title="Select NCERT Grade Band"
              >
                {classOptions.map((c) => (
                  <option key={c} value={c} className="bg-slate-950 text-white font-bold">
                    Class {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation Routes */}
        <nav className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/35 border border-white/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl border border-white/15 bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 hover:text-white shadow-sm transition-all cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* User Profile Pill Link */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 pl-2 border-l border-white/15 transition-all ${
                isActive ? 'opacity-100 scale-105' : 'hover:opacity-90'
              }`
            }
          >
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.xp} XP</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl border border-white/15 bg-slate-800/80 text-xs font-bold text-slate-200 shadow-sm hover:border-cyan-400/50">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-[10px]">
                {user.avatar || '🎓'}
              </div>
              <span className="font-semibold max-w-[90px] sm:max-w-[120px] truncate hidden sm:inline">
                {user.name}
              </span>
            </div>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
