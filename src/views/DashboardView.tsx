import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  ArrowRight,
  Zap,
  Target,
  BookOpen,
  Layers,
  Award,
  Atom,
  Film,
  Activity,
  Compass,
  FileCheck,
  School,
  Bot,
  User,
  Sun,
  RotateCw,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { CompetencyRadar } from '../components/ui/CompetencyRadar';
import { QuantumHoloCore3D } from '../components/ui/QuantumHoloCore3D';
import { Spatial3DViewer } from '../components/ui/Spatial3DViewer';
import { Interactive3DCard } from '../components/ui/Interactive3DCard';
import { CinematicFilmModal } from '../components/ui/CinematicFilmModal';
import { AITutorModal } from '../components/modals/AITutorModal';
import { GLASS_CARD_FORMULA } from '../components/ui/AppleGlassCard';
import { ncertCurriculum } from '../data/curriculumData';

export const DashboardView: React.FC = () => {
  const { user, currentClass, updateCompetency, addXP } = useAppStore();
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [active3DEngine, setActive3DEngine] = useState<'holo' | 'spatial'>('spatial');

  const subjectsForClass = ncertCurriculum[currentClass] || [];
  const subjectList = Array.isArray(subjectsForClass)
    ? subjectsForClass
    : subjectsForClass.subjects || [];

  const xpForNextLevel = user.level * 250;
  const xpCurrentLevelBase = (user.level - 1) * 250;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((user.xp - xpCurrentLevelBase) / (xpForNextLevel - xpCurrentLevelBase)) * 100))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 text-white"
    >
      {/* Hero Welcome Glass Card */}
      <Interactive3DCard
        className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white`}
        glowColor="rgba(56, 189, 248, 0.35)"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/25 via-cyan-500/25 to-teal-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-black shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Learner Model • Active NCERT Session</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
                {user.name}
              </span>
              !
            </h1>
            <p className="text-sm font-semibold flex items-center gap-2 text-slate-300 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span>{user.school}</span>
              <span className="opacity-40">•</span>
              <span className="text-cyan-400 font-bold">Class {currentClass} Scholar</span>
              <span className="opacity-40">•</span>
              <span className="text-amber-400 font-bold">Level {user.level}</span>
            </p>

            {/* Quick XP Progress Pill */}
            <div className="pt-2 max-w-md space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>XP to Level {user.level + 1}</span>
                <span className="text-cyan-300 font-mono">{user.xp} / {xpForNextLevel} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Watch Film Button */}
            <button
              onClick={() => setIsFilmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Film className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Overview Film</span>
            </button>

            {/* Total XP Card Link */}
            <Link
              to="/profile"
              className="px-5 py-3 rounded-2xl border border-white/15 bg-slate-800/80 hover:bg-slate-800 backdrop-blur-xl shadow-lg flex items-center gap-3.5 transition-all hover:scale-105 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/30 to-orange-500/30 border border-amber-400/40 text-amber-300 flex items-center justify-center font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <Trophy className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total XP</div>
                <div className="text-xl font-black tracking-tight text-white">{user.xp.toLocaleString()}</div>
              </div>
            </Link>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-sm shadow-[0_8px_25px_rgba(79,70,229,0.45)] border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Interactive3DCard>

      {/* QUICK LAUNCH BENTO GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/courses"
          className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 hover:border-cyan-400/50 shadow-md transition-all hover:translate-y-[-2px] group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">Class Subjects</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Explore chapter timelines & 3D labs</p>
        </Link>

        <Link
          to="/exams"
          className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 hover:border-purple-400/50 shadow-md transition-all hover:translate-y-[-2px] group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors">Mock Exams</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Board-calibrated timed simulators</p>
        </Link>

        <Link
          to="/school"
          className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 hover:border-emerald-400/50 shadow-md transition-all hover:translate-y-[-2px] group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <School className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">School Hub</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Live timetable & daily study tasks</p>
        </Link>

        <button
          onClick={() => setIsAITutorOpen(true)}
          className="p-4 rounded-2xl bg-slate-900/70 border border-white/15 hover:border-cyan-400/50 shadow-md transition-all hover:translate-y-[-2px] text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">AI STEM Tutor</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Instant doubt solver & formulas</p>
        </button>
      </div>

      {/* 3D SPATIAL SHOWCASE SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-ping" />
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Atom className="w-5 h-5 text-cyan-400" />
              <span>Interactive 3D Spatial Canvas Engine</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-white/15">
            <button
              onClick={() => setActive3DEngine('spatial')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                active3DEngine === 'spatial'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Spatial Physics & Chemistry Models</span>
            </button>
            <button
              onClick={() => setActive3DEngine('holo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                active3DEngine === 'holo'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Quantum Holo-Core</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas Switcher */}
        {active3DEngine === 'spatial' ? (
          <Spatial3DViewer height={360} initialModel="prism-rainbow" />
        ) : (
          <QuantumHoloCore3D height={360} />
        )}
      </div>

      {/* Grid: Mathematical Competency Radar & Active Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Mathematical Competency Radar */}
        <div className="lg:col-span-7">
          <Interactive3DCard
            className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white`}
            glowColor="rgba(99, 102, 241, 0.35)"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500/25 to-cyan-500/25 border border-indigo-400/40 text-cyan-300 flex items-center justify-center">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Mathematical Competency Radar</h2>
                  <p className="text-xs font-medium text-slate-400">
                    Calculated from diagnostic checks, mock exams, and inquiry labs
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                Live Vector Matrix
              </span>
            </div>

            {/* SVG Radar Display */}
            <div className="py-2 flex justify-center items-center">
              <CompetencyRadar competencies={user.competencies} size={310} />
            </div>

            {/* Interactive score adjustment test panel */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs font-black mb-2 flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>Simulate Real-Time Mastery Gain (Updates Global Store):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(user.competencies).map((subj) => (
                  <button
                    key={subj}
                    onClick={() => updateCompetency(subj, 95)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-white/20 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Boost {subj} (+XP)
                  </button>
                ))}
              </div>
            </div>
          </Interactive3DCard>
        </div>

        {/* Right Column: Class Snapshot & Subject Overview */}
        <div className="lg:col-span-5">
          <Interactive3DCard
            className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white flex flex-col justify-between`}
            glowColor="rgba(6, 182, 212, 0.35)"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/25 to-teal-500/25 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">Class {currentClass} NCERT</h2>
                    <p className="text-xs font-medium text-slate-400">
                      {subjectList.length} syllabus modules active
                    </p>
                  </div>
                </div>
                <Link to="/courses" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                  View All →
                </Link>
              </div>

              {/* Subject preview list */}
              <div className="space-y-3">
                {subjectList.slice(0, 4).map((subject: any) => (
                  <Link
                    key={subject.id}
                    to={`/subject/${subject.id}`}
                    className="p-3.5 rounded-2xl border border-white/10 bg-slate-800/60 hover:bg-slate-800/95 flex items-center justify-between transition-all hover:translate-x-1.5 group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${
                          subject.colorTint || 'bg-indigo-500/20'
                        } border border-white/20 flex items-center justify-center text-sm font-black text-cyan-300 shadow-sm`}
                      >
                        {subject.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-100 group-hover:text-cyan-400 transition-colors">
                          {subject.name}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">
                          {subject.chapters?.length || 1} Chapters • 3D Inquiry Lab
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                to="/courses"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Subject Bento Grid</span>
              </Link>
            </div>
          </Interactive3DCard>
        </div>
      </div>

      {/* Cinematic Film Modal Component */}
      <CinematicFilmModal isOpen={isFilmOpen} onClose={() => setIsFilmOpen(false)} />

      {/* AI Tutor Modal */}
      <AITutorModal isOpen={isAITutorOpen} onClose={() => setIsAITutorOpen(false)} />
    </motion.div>
  );
};

export default DashboardView;
