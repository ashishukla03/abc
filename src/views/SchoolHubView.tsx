import React from 'react';
import { motion } from 'framer-motion';
import { School, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { LiveTimetable } from '../components/ui/LiveTimetable';

export const SchoolHubView: React.FC = () => {
  const { userProfile, selectedClass, getCurrentCurriculum } = useSessionStore();
  const curriculum = getCurrentCurriculum();

  return (
    <div className="space-y-8">
      {/* School Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              🏫
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{userProfile.school}</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official {userProfile.board} • Class {selectedClass}-B • Academic Session 2026-2027
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Term 1 Summative Active
          </span>
        </div>
      </div>

      {/* Grid: Timetable & Exam Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Period Timetable */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Today's Class Timetable</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Live Clock Sync</span>
          </div>

          <LiveTimetable />
        </div>

        {/* Exam Countdowns & Syllabus Checklist */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900">Exam & Assessment Countdowns</h2>
              </div>
            </div>

            <div className="space-y-3">
              {curriculum.mockExams.map((exam) => (
                <div key={exam.id} className="p-4 rounded-2xl bg-white/70 border border-white shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{exam.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Syllabus: {exam.syllabus}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-rose-600 font-mono">{exam.urgencyDays}</span>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Days Left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

