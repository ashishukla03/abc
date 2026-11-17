import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, ArrowLeft, Play, Sparkles, Layers, GraduationCap } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Subject3DArt } from '../components/ui/Subject3DArt';

export const ClassSubjectsView: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const { selectedClass, setSelectedClass, getCurrentCurriculum } = useSessionStore();

  const numClass = Number(classId) || selectedClass;
  const curriculum = getCurrentCurriculum();

  return (
    <div className="space-y-6">
      {/* Header with Royal Opalescent Glass */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-header rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-indigo-600 mb-2 transition-colors cursor-pointer active-click-pulse"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Question Worlds
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Class {numClass} Enrolled Subjects
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-950 border border-indigo-200">
              {curriculum.standardBoard}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Browse verified NCERT board syllabus, interactive virtual simulations, and chapter test banks.
          </p>
        </div>

        {/* Quick Class Selector Dropdown / Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/5 rounded-2xl border border-white/80">
          {[5, 6, 7, 8, 9, 10, 11, 12].map((lvl) => (
            <motion.button
              key={lvl}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setSelectedClass(lvl);
                navigate(`/class/${lvl}/subjects`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer active-click-pulse ${
                selectedClass === lvl
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
              }`}
            >
              Cl {lvl}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curriculum.subjects.map((sub, idx) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.45 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-7 rounded-3xl border ${sub.colorTheme.border} ${sub.colorTheme.bgTint} glass-panel shadow-glass flex flex-col justify-between cursor-pointer active-click-pulse`}
            onClick={() => navigate(`/subject/${sub.id}`)}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border ${sub.colorTheme.badgeBg}`}>
                    {sub.category.toUpperCase()} • CLASS {numClass}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{sub.name}</h3>
                </div>
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Subject3DArt category={sub.category as any} size={64} />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Course Chapters:</span>
                <div className="space-y-2">
                  {sub.chapters.map((ch) => (
                    <div key={ch.id} className="p-3.5 rounded-2xl bg-white/80 border border-white/90 text-xs flex items-center justify-between shadow-sm">
                      <span className="font-extrabold text-slate-800">Ch {ch.number}: {ch.title}</span>
                      <span className="text-[11px] font-mono font-black text-indigo-600 px-2 py-0.5 rounded-md bg-indigo-50">{ch.topics.length} topics</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                NCERT Certified Blueprint
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/subject/${sub.id}`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-xs shadow-md shadow-slate-900/20 hover:bg-indigo-600 transition-all cursor-pointer"
              >
                <span>View Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
