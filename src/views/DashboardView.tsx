import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, Flame, BookOpen, ArrowRight, Play, CheckCircle, Orbit, Atom, Layers, Crown, Star } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Subject3DArt } from '../components/ui/Subject3DArt';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { selectedClass, curriculumStage, getCurrentCurriculum, userProfile } = useSessionStore();
  const curriculum = getCurrentCurriculum();

  return (
    <div className="space-y-8">
      {/* Grand Hero Showcase with Royal Opal Glass and Ambient Futuristic Sheen */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12 glass-royal-card border border-white/95"
      >
        {/* Subtle decorative background glow orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-amber-500/15 border border-indigo-200/90 mb-5 shadow-sm"
          >
            <Crown className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-xs font-black text-indigo-950 tracking-wider uppercase font-mono">
              {curriculum.stageLabel} • {curriculum.gradeBandName}
            </span>
            <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-4">
            Gramin <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-500 bg-clip-text text-transparent">PocketLab</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-semibold">
            Explore authentic science experiments and mathematics investigations designed specifically for offline rural schools. Aligned to official NCERT standards with zero internet dependency.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs font-black bg-emerald-500/15 text-emerald-950 border border-emerald-300/80 shadow-sm backdrop-blur-md cursor-pointer active-click-pulse"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {curriculum.subjects.length} Flagship NCERT Laboratories
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs font-black bg-teal-500/15 text-teal-950 border border-teal-300/80 shadow-sm backdrop-blur-md cursor-pointer active-click-pulse"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              100% Offline IndexedDB & Audio Engine
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs font-black bg-amber-500/15 text-amber-950 border border-amber-300/80 shadow-sm backdrop-blur-md cursor-pointer active-click-pulse"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              {userProfile.streakDays}-Day Learning Streak Active
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Core Subjects Grid with 3D-styled glass bento cards and motion graphics */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-600" /> Core STEM Field Laboratories
            </h2>
            <p className="text-xs text-slate-500 font-semibold">Interactive dynamic simulators tailored to Class {selectedClass} curriculum:</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-sm">
            Class {selectedClass} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curriculum.subjects.map((sub, idx) => {
            const firstChapter = sub.chapters[0];
            const firstTopic = firstChapter?.topics[0];

            return (
              <motion.article
                key={sub.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -7, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-3xl p-7 border ${sub.colorTheme.border} ${sub.colorTheme.bgTint} glass-panel shadow-glass flex flex-col justify-between group cursor-pointer active-click-pulse`}
                onClick={() => navigate(`/subject/${sub.id}`)}
              >
                {/* Background Ambient Glow */}
                <div className={`absolute -right-10 -bottom-10 w-52 h-52 rounded-full blur-3xl opacity-25 pointer-events-none bg-gradient-to-tr ${sub.colorTheme.gradient}`} />

                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border mb-2.5 ${sub.colorTheme.badgeBg}`}>
                        {sub.category.toUpperCase()} • CLASS {selectedClass}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                        {firstChapter ? `Chapter ${firstChapter.number}: ${firstChapter.title}` : 'Comprehensive STEM Curriculum'}
                      </p>
                    </div>

                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center transform group-hover:scale-115 group-hover:rotate-6 transition-all duration-300">
                      <Subject3DArt category={sub.category as any} size={76} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 border border-white/95 text-xs space-y-1.5 mb-6 shadow-sm backdrop-blur-md">
                    <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Atom className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '8s' }} />
                      <span>Featured Inquiry Topic:</span>
                    </div>
                    <div className="text-slate-600 font-semibold">{firstTopic?.title || 'Interactive laboratory experiments'}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    {sub.chapters.length} Chapters • {sub.chapters.reduce((acc, c) => acc + c.topics.length, 0)} Topics
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/subject/${sub.id}`);
                    }}
                    className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-slate-900 text-white font-black text-xs shadow-md shadow-slate-900/20 group-hover:bg-indigo-600 group-hover:shadow-indigo-600/35 transition-all cursor-pointer"
                  >
                    <span>Enter Subject</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
