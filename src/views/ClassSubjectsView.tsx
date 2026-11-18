import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles, Beaker, ChevronRight, Compass, Filter } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ncertCurriculum } from '../data/curriculumData';
import { GLASS_CARD_FORMULA } from '../components/ui/AppleGlassCard';
import { Interactive3DCard } from '../components/ui/Interactive3DCard';

export const ClassSubjectsView: React.FC = () => {
  const { currentClass, theme } = useAppStore();
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const subjectsData = ncertCurriculum[currentClass] || [];
  const subjects = Array.isArray(subjectsData) ? subjectsData : subjectsData.subjects || [];

  const filteredSubjects = subjects.filter((s: any) => {
    if (selectedCategory === 'all') return true;
    return (s.category || '').toLowerCase() === selectedCategory.toLowerCase();
  });

  const categories = [
    { id: 'all', label: 'All Subjects' },
    { id: 'physics', label: 'Physics' },
    { id: 'chemistry', label: 'Chemistry' },
    { id: 'mathematics', label: 'Mathematics' },
    { id: 'biology', label: 'Biology' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 text-white"
    >
      {/* Header section with Glass Card Formula */}
      <Interactive3DCard
        className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white`}
        glowColor="rgba(56, 189, 248, 0.35)"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black mb-2 shadow-sm">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>NCERT Class {currentClass} Modules</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Class {currentClass} Subject Hub
            </h1>
            <p className="text-sm font-medium mt-1 text-slate-300">
              Select any core STEM subject to explore chapter timelines, progressive 3D inquiry labs, and mastery milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/15 bg-slate-800/80 text-xs font-bold text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{subjects.length} Subjects Active</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto scrollbar-none">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md border border-white/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Interactive3DCard>

      {/* 2-Column Bento Grid with cascading Framer Motion */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredSubjects.map((subject: any) => {
          const totalChapters = subject.chapters?.length || 0;
          const totalTopics =
            subject.chapters?.reduce(
              (acc: number, ch: any) => acc + (ch.topics?.length || 0),
              0
            ) || 0;

          return (
            <motion.div key={subject.id} variants={itemVariants} className="h-full">
              <Interactive3DCard
                className={`h-full ${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white group cursor-pointer`}
                glowColor="rgba(56, 189, 248, 0.35)"
              >
                <Link to={`/subject/${subject.id}`} className="block h-full">
                  <div className="flex flex-col justify-between h-full space-y-6">
                    {/* Subject Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border bg-slate-800/90 border-white/20 text-cyan-300">
                          {subject.category || 'STEM'}
                        </span>
                        <h2 className="text-xl font-black group-hover:text-cyan-400 transition-colors pt-1">
                          {subject.name}
                        </h2>
                      </div>

                      <div className="w-10 h-10 rounded-2xl border border-white/20 bg-slate-800/80 text-cyan-300 flex items-center justify-center transition-all shadow-md group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-indigo-600 group-hover:to-cyan-500 group-hover:text-white">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Chapters Preview */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Core Chapters ({totalChapters})
                      </div>
                      <div className="space-y-1.5">
                        {subject.chapters?.slice(0, 2).map((ch: any) => (
                          <div
                            key={ch.id}
                            className="px-3 py-2 rounded-xl border border-white/10 bg-slate-800/60 text-xs font-bold flex items-center justify-between"
                          >
                            <span className="truncate pr-2 text-slate-200">
                              Ch {ch.number}: {ch.title}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-extrabold shrink-0">
                              {ch.topics?.length || 0} topics
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Beaker className="w-4 h-4 text-cyan-400" />
                        <span>{totalTopics} Inquiry Lab Topics</span>
                      </div>
                      <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-black">
                        Open Timeline <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Interactive3DCard>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default ClassSubjectsView;
