import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Flame, Zap, Target, BookOpen } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { CompetencyRadar } from '../components/ui/CompetencyRadar';

export const LearnerProfileView: React.FC = () => {
  const { userProfile, competencyScores, selectedClass } = useSessionStore();

  return (
    <div className="space-y-8">
      {/* Profile Overview Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-4xl shadow-md border border-indigo-200">
            {userProfile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{userProfile.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Level {userProfile.level} Scholar
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{userProfile.school} • Class {selectedClass}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-2xl font-extrabold text-indigo-600 font-mono">{userProfile.xp}</span>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Total XP</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-extrabold text-amber-500 font-mono">{userProfile.streakDays}</span>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Day Streak</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">{userProfile.completedLabsCount}</span>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Labs Done</span>
          </div>
        </div>
      </div>

      {/* Grid: Radar vs Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Competency Radar */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Competency Mastery Radar
            </h2>
            <span className="text-xs font-mono text-indigo-600 font-bold">Dynamic State</span>
          </div>

          <div className="py-2">
            <CompetencyRadar scores={competencyScores} size={280} />
          </div>

          <p className="text-xs text-slate-500 text-center max-w-sm">
            Scores update in real-time as you complete diagnostic topic quizzes and hands-on inquiry labs.
          </p>
        </div>

        {/* Badges & Achievements */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Earned Badges & Milestones
            </h2>
            <span className="text-xs font-bold text-slate-500">{userProfile.badges.length} Unlocked</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {userProfile.badges.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-white/70 border border-white shadow-sm flex items-center gap-3">
                <span className="text-3xl">{b.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Earned {b.earnedAt}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 text-xs text-indigo-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Zap className="w-4 h-4 text-indigo-600" /> Next Milestone Quest:
            </span>
            <p>Score 90% or higher on the Chemistry pH Color Lab to unlock the <strong>Alkali Alchemist</strong> badge!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

