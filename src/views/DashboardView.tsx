import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, Flame, BookOpen, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Subject3DArt } from '../components/ui/Subject3DArt';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { selectedClass, curriculumStage, getCurrentCurriculum, userProfile } = useSessionStore();
  const curriculum = getCurrentCurriculum();

  return (
    <div className="space-y-8">
      {/* Grand Hero Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-white/90 via-white/70 to-indigo-50/50 backdrop-blur-2xl border border-white/90 shadow-glass"
      >
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-800 tracking-wide uppercase">
              {curriculum.stageLabel} • {curriculum.gradeBandName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-4">
            Gramin PocketLab
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Explore authentic science and mathematics investigations designed for offline rural schools. Aligned to official NCERT standards.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              {curriculum.subjects.length} Core Subjects Enrolled
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Local Storage Mode (100% Offline)
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              {userProfile.streakDays}-Day Learning Streak
            </span>
          </div>
        </div>
      </motion.div>

      {/* Core Subjects Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Core STEM Field Investigations</h2>
            <p className="text-xs text-slate-500">Choose any inquiry mission below to begin your hands-on investigation:</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {curriculum.subjects.length} Flagship Laboratories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curriculum.subjects.map((sub, idx) => {
            const firstChapter = sub.chapters[0];
            const firstTopic = firstChapter?.topics[0];

            return (
              <motion.article
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`relative overflow-hidden rounded-3xl p-6 border ${sub.colorTheme.border} ${sub.colorTheme.bgTint} backdrop-blur-2xl shadow-glass flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${sub.colorTheme.badgeBg}`}>
                        {sub.category.toUpperCase()} • CLASS {selectedClass}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {firstChapter ? firstChapter.title : 'Comprehensive STEM Curriculum'}
                      </p>
                    </div>

                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                      <Subject3DArt category={sub.category as any} size={70} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 text-xs space-y-1 mb-5">
                    <div className="font-bold text-slate-800">Latest NCERT Topic:</div>
                    <div className="text-slate-600">{firstTopic?.title || 'Interactive laboratory experiments'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/60">
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {sub.chapters.length} Chapters • {sub.chapters.reduce((acc, c) => acc + c.topics.length, 0)} Labs
                  </span>

                  <button
                    onClick={() => navigate(`/subject/${sub.id}`)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-indigo-600 shadow-md transition-all cursor-pointer group-hover:shadow-indigo-500/25"
                  >
                    <span>Start Investigation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
