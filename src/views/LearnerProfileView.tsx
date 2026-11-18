import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Award,
  Flame,
  Zap,
  Target,
  BookOpen,
  Sparkles,
  Trophy,
  CheckCircle2,
  Share2,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { CompetencyRadar } from '../components/ui/CompetencyRadar';
import { GLASS_CARD_FORMULA } from '../components/ui/AppleGlassCard';
import { Interactive3DCard } from '../components/ui/Interactive3DCard';

export const LearnerProfileView: React.FC = () => {
  const { user, currentClass, addXP, updateCompetency, unlockBadge } = useAppStore();

  const xpForNextLevel = user.level * 250;
  const xpCurrentLevelBase = (user.level - 1) * 250;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((user.xp - xpCurrentLevelBase) / (xpForNextLevel - xpCurrentLevelBase)) * 100))
  );

  const handleSimulateQuest = () => {
    addXP(100, 'Alkali Alchemist Quest');
    unlockBadge({
      id: `b-alkali-${Date.now()}`,
      title: 'Alkali Alchemist',
      icon: '🧪',
      desc: 'Achieved 95% precision on pH Indicator Color Bench',
    });
    updateCompetency('Chemistry', 98);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Profile Overview Glass Card */}
      <Interactive3DCard
        className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white p-6 sm:p-8`}
        glowColor="rgba(99, 102, 241, 0.35)"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-indigo-500/40 border border-white/30 shrink-0">
              {user.avatar || '👨‍🎓'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  Level {user.level} Scholar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {user.school} • Class {currentClass} NCERT Session
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/10 text-center min-w-[90px]">
              <span className="text-2xl font-black text-cyan-300 font-mono block">
                {user.xp.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total XP</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/10 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-2xl font-black text-amber-400 font-mono">
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                <span>{user.streakDays || 14}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Day Streak</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/10 text-center min-w-[90px]">
              <span className="text-2xl font-black text-emerald-400 font-mono block">
                {user.completedLabsCount || 5}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Labs Done</span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Level {user.level} Progression</span>
            <span className="text-cyan-400 font-mono">
              {user.xp} / {xpForNextLevel} XP ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 border border-white/10 overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            />
          </div>
        </div>
      </Interactive3DCard>

      {/* Grid: Radar vs Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dynamic Competency Mastery Radar */}
        <div className="lg:col-span-6">
          <Interactive3DCard
            className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white flex flex-col justify-between space-y-4`}
            glowColor="rgba(99, 102, 241, 0.35)"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span>Competency Mastery Radar</span>
              </h2>
              <span className="text-xs font-mono text-cyan-300 font-bold bg-slate-800 px-2.5 py-1 rounded-xl border border-white/10">
                Live State
              </span>
            </div>

            <div className="py-4 flex justify-center items-center">
              <CompetencyRadar competencies={user.competencies} size={300} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 text-xs text-slate-300 leading-relaxed text-center">
              Scores dynamically calculate from verified diagnostic tests, timed mock examinations, and hands-on 3D inquiry lab simulations.
            </div>
          </Interactive3DCard>
        </div>

        {/* Badges & Achievements */}
        <div className="lg:col-span-6 space-y-6">
          <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white space-y-5`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Earned Badges & Milestones</span>
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {user.badges?.length || 4} Unlocked
              </span>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(user.badges || []).map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-slate-800/70 border border-white/10 hover:border-cyan-400/40 shadow-sm flex items-start gap-3 transition-all hover:scale-[1.02]"
                >
                  <span className="text-3xl shrink-0 p-1 rounded-xl bg-slate-900/80 border border-white/10">
                    {b.icon}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-white">{b.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight">{b.desc}</p>
                    <span className="text-[9px] text-cyan-400 font-bold block pt-1">
                      {b.earnedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Milestone Quest */}
            <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-400/30 text-xs text-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black flex items-center gap-1.5 text-cyan-300">
                  <Zap className="w-4 h-4 text-amber-400" /> Next Milestone Quest:
                </span>
                <button
                  onClick={handleSimulateQuest}
                  className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                >
                  Simulate Quest (+100 XP)
                </button>
              </div>
              <p className="text-slate-300">
                Score 90% or higher on the Chemistry pH Color Chamber to unlock the <strong>Alkali Alchemist</strong> badge!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerProfileView;
