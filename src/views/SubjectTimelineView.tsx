import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Play,
  Lock,
  ChevronLeft,
  Beaker,
  Clock,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import { useAppStore, TopicStatus } from '../store/useAppStore';
import { ncertCurriculum, TopicActivity } from '../data/curriculumData';
import { GLASS_CARD_FORMULA } from '../components/ui/AppleGlassCard';
import { Interactive3DCard } from '../components/ui/Interactive3DCard';
import { TopicQuizModal } from '../components/modals/TopicQuizModal';

export const SubjectTimelineView: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { currentClass, getTopicStatus, markTopicStatus, theme } = useAppStore();
  const isDark = theme === 'dark';

  const [selectedQuizActivity, setSelectedQuizActivity] = useState<TopicActivity | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'mastered'>('all');

  const currentClassData = ncertCurriculum[currentClass] || [];
  const subjects = Array.isArray(currentClassData) ? currentClassData : currentClassData.subjects || [];
  let subject = subjects.find((s: any) => s.id === subjectId);

  if (!subject) {
    for (const c of Object.values(ncertCurriculum)) {
      const list = Array.isArray(c) ? c : (c as any).subjects || [];
      const found = list.find((s: any) => s.id === subjectId);
      if (found) {
        subject = found;
        break;
      }
    }
  }

  if (!subject) {
    return (
      <div
        className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white text-center py-16`}
      >
        <h2 className="text-2xl font-black">Subject Not Found</h2>
        <p className="text-sm mt-2 text-slate-400">
          The requested subject ID ({subjectId}) is not active for Class {currentClass}.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-sm shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Subjects</span>
        </Link>
      </div>
    );
  }

  const units = subject.units || [
    {
      id: `unit-${subject.id}-default`,
      title: `${subject.name} Core Syllabus`,
      chapters: subject.chapters || [],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="space-y-8 text-white"
    >
      {/* Top Banner Glass Card */}
      <Interactive3DCard
        className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white`}
        glowColor="rgba(56, 189, 248, 0.35)"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border border-white/15 bg-slate-800/80 text-cyan-300 hover:bg-slate-700 shadow-sm transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Class {currentClass} Subjects</span>
            </Link>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                {subject.category || 'STEM Curriculum'}
              </span>
              <span className="text-xs text-slate-400 font-bold">Class {currentClass} NCERT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{subject.name}</h1>
            <p className="text-sm font-medium text-slate-300">
              Interactive Chapter Timeline & Progressive 3D Inquiry Milestones
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-800/90 border border-white/15">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Topics
              </button>
              <button
                onClick={() => setFilterStatus('ready')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'ready'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ready
              </button>
              <button
                onClick={() => setFilterStatus('mastered')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'mastered'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mastered
              </button>
            </div>

            <div className="px-4 py-2 rounded-2xl border border-white/15 bg-slate-800/80 text-xs font-bold shadow-sm">
              <span className="text-cyan-400 font-black">{subject.chapters?.length || 0}</span> Chapters
            </div>
          </div>
        </div>
      </Interactive3DCard>

      {/* Vertical Timeline Mapping Units and Chapters */}
      <div className="space-y-10">
        {units.map((unit: any, unitIdx: number) => (
          <div key={unit.id} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-black shadow-md">
                UNIT {unitIdx + 1}
              </div>
              <h2 className="text-lg font-black text-white">{unit.title}</h2>
            </div>

            {/* Chapters inside Unit */}
            <div className="space-y-8">
              {unit.chapters?.map((chapter: any) => (
                <div
                  key={chapter.id}
                  className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white`}
                >
                  {/* Chapter Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
                    <div>
                      <div className="text-[11px] font-black text-cyan-400 uppercase tracking-wider">
                        Chapter {chapter.number} • {chapter.theme || 'NCERT Core'}
                      </div>
                      <h3 className="text-xl font-black mt-0.5">{chapter.title}</h3>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full border bg-slate-800/80 border-white/15 text-slate-300">
                      {chapter.topics?.length || 0} Topics
                    </span>
                  </div>

                  {/* Vertical Timeline of Topics */}
                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-500/40">
                    {chapter.topics
                      ?.filter((topic: any) => {
                        const status = getTopicStatus(topic.id, topic.status || 'ready');
                        if (filterStatus === 'ready') return status === 'ready';
                        if (filterStatus === 'mastered') return status === 'mastered';
                        return true;
                      })
                      .map((topic: any) => {
                        const status: TopicStatus = getTopicStatus(topic.id, topic.status || 'ready');

                        return (
                          <div key={topic.id} className="relative group">
                            {/* Timeline Node Icon based on topic.status */}
                            <div className="absolute -left-6 sm:-left-8 top-2 -translate-x-1/2 flex items-center justify-center z-10">
                              {status === 'mastered' && (
                                <button
                                  onClick={() => markTopicStatus(topic.id, 'ready')}
                                  title="Mastered! Click to toggle status"
                                  className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-[0_0_16px_rgba(251,191,36,0.9)] border-2 border-slate-900 cursor-pointer hover:scale-110 transition-transform"
                                >
                                  <Star className="w-4 h-4 fill-amber-950" />
                                </button>
                              )}
                              {status === 'ready' && (
                                <button
                                  onClick={() => markTopicStatus(topic.id, 'mastered')}
                                  title="Ready to Learn! Click to mark mastered"
                                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)] border-2 border-slate-900 animate-pulse cursor-pointer hover:scale-110 transition-transform"
                                >
                                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                                </button>
                              )}
                              {status === 'locked' && (
                                <button
                                  onClick={() => markTopicStatus(topic.id, 'ready')}
                                  title="Locked. Click to unlock"
                                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-slate-800 text-slate-500 border-slate-700 cursor-pointer hover:scale-110 transition-transform"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Topic Sub-card */}
                            <div className="p-4 sm:p-5 rounded-2xl border bg-slate-800/60 hover:bg-slate-800/95 border-white/10 shadow-sm transition-all hover:translate-x-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-black text-white">{topic.title}</h4>
                                    <span
                                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                        status === 'mastered'
                                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                                          : status === 'ready'
                                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                                          : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                                      }`}
                                    >
                                      {status}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-slate-300">
                                    {topic.shortDesc}
                                  </p>
                                  <div className="flex items-center gap-4 text-[11px] font-bold pt-1 text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-cyan-400" />
                                      {topic.durationMinutes} mins
                                    </span>
                                    <span>•</span>
                                    <span className="text-cyan-400">{topic.ncertCode}</span>
                                    {topic.testQuestions?.length > 0 && (
                                      <>
                                        <span>•</span>
                                        <span className="text-indigo-300 flex items-center gap-1">
                                          <Sparkles className="w-3 h-3 text-indigo-400" />
                                          {topic.testQuestions.length} Diagnostic Questions
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                                  {/* Diagnostic Topic Quiz Button */}
                                  <button
                                    onClick={() => setSelectedQuizActivity(topic)}
                                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-indigo-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                    title="Take diagnostic test"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Take Quiz</span>
                                  </button>

                                  {/* Enter Lab Button */}
                                  {status !== 'locked' ? (
                                    <Link
                                      to={`/lab/${topic.id}`}
                                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all"
                                    >
                                      <Beaker className="w-3.5 h-3.5" />
                                      <span>Enter 3D Lab</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                  ) : (
                                    <button
                                      onClick={() => markTopicStatus(topic.id, 'ready')}
                                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                                    >
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Unlock</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostic Topic Quiz Modal */}
      {selectedQuizActivity && (
        <TopicQuizModal
          activity={selectedQuizActivity}
          subjectCategory={subject.category || 'physics'}
          isOpen={!!selectedQuizActivity}
          onClose={() => setSelectedQuizActivity(null)}
        />
      )}
    </motion.div>
  );
};

export default SubjectTimelineView;
