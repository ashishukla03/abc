import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, ArrowLeft, Play, Sparkles } from 'lucide-react';
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
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Question Worlds
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Class {numClass} Enrolled Subjects
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
              {curriculum.standardBoard}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified board syllabus, interactive virtual simulations, and chapter test banks.
          </p>
        </div>

        {/* Quick Class Selector Dropdown / Pills */}
        <div className="flex items-center gap-2">
          {[5, 7, 10, 12].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedClass(lvl);
                navigate(`/class/${lvl}/subjects`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedClass === lvl
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200'
              }`}
            >
              Class {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curriculum.subjects.map((sub, idx) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-3xl border ${sub.colorTheme.border} ${sub.colorTheme.bgTint} backdrop-blur-xl shadow-glass flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sub.colorTheme.badgeBg}`}>
                    {sub.category.toUpperCase()}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{sub.name}</h3>
                </div>
                <div className="w-16 h-16">
                  <Subject3DArt category={sub.category as any} size={60} />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <span className="text-xs font-bold text-slate-700">Course Units:</span>
                <div className="space-y-1.5">
                  {sub.chapters.map((ch) => (
                    <div key={ch.id} className="p-3 rounded-xl bg-white/70 border border-white/90 text-xs flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Ch {ch.number}: {ch.title}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{ch.topics.length} topics</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                NCERT Certified Blueprint
              </span>
              <button
                onClick={() => navigate(`/subject/${sub.id}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <span>View Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

