import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, FileQuestion, CheckCircle2, Clock, Sparkles, Beaker, HelpCircle, Trophy } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { TopicQuizModal } from '../components/modals/TopicQuizModal';
import { TopicActivity } from '../data/curriculumData';

export const SubjectTimelineView: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const { getCurrentCurriculum, topicProgress } = useSessionStore();
  const curriculum = getCurrentCurriculum();

  // Find target subject in current or all classes
  const subject = curriculum.subjects.find((s) => s.id === subjectId) || curriculum.subjects[0];

  const [activeQuizActivity, setActiveQuizActivity] = useState<TopicActivity | null>(null);

  if (!subject) {
    return (
      <div className="p-8 text-center glass-panel rounded-3xl">
        <h2 className="text-xl font-bold text-slate-800">Subject Not Found</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="mt-4 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl active-click-pulse cursor-pointer"
        >
          Return to Dashboard
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subject Header with Royal Opalescent Glass & Motion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`p-8 rounded-3xl border ${subject.colorTheme.border} ${subject.colorTheme.bgTint} glass-header shadow-glass flex flex-wrap items-center justify-between gap-4`}
      >
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-indigo-600 mb-2 transition-colors cursor-pointer active-click-pulse"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${subject.colorTheme.badgeBg}`}>
              {subject.category.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{subject.name}</h1>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Official NCERT Curriculum Chapters • Interactive Labs & Formative Quizzes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert(`🤖 RoboBuddy AI Tutor for ${subject.name} is ready! Ask your conceptual doubts.`)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm transition-all cursor-pointer active-click-pulse"
          >
            Ask AI Tutor
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mock-exams')}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all cursor-pointer active-click-pulse"
          >
            Take Mock Exam
          </motion.button>
        </div>
      </motion.div>

      {/* Chapters & Topics Timeline */}
      <div className="space-y-8">
        {subject.chapters.map((chapter, cIdx) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: cIdx * 0.1, duration: 0.45 }}
            className="glass-royal-card rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
              <div>
                <span className="text-[11px] font-black text-indigo-600 font-mono tracking-wider uppercase">
                  {chapter.theme}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  Chapter {chapter.number}: {chapter.title}
                </h2>
              </div>
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-sm font-mono">
                {chapter.topics.length} Activities
              </span>
            </div>

            {/* Vertical timeline items */}
            <div className="space-y-4 pl-2 relative">
              {chapter.topics.map((topic, tIdx) => {
                const prog = topicProgress[topic.id];
                const isMastered = prog?.status === 'mastered';

                return (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.015, y: -3 }}
                    whileTap={{ scale: 0.99 }}
                    className="p-5 rounded-2xl bg-white/90 border border-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 active-click-pulse"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-black text-slate-500">{topic.ncertCode}</span>
                        {isMastered && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mastered ({prog.score}%)
                          </span>
                        )}
                        {topic.hasInquiryLab && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                            <Beaker className="w-3 h-3 text-cyan-600" /> Interactive STEM Lab
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-black text-slate-900">{topic.title}</h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{topic.shortDesc}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {topic.durationMinutes} mins
                        </span>
                        <span>•</span>
                        <span>{topic.testQuestions.length} Formative Questions</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                      {topic.hasInquiryLab && (
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => navigate(`/lab/${topic.id}`)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/25 transition cursor-pointer active-click-pulse"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" /> Explore Lab
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setActiveQuizActivity(topic)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition cursor-pointer active-click-pulse"
                      >
                        <FileQuestion className="w-3.5 h-3.5" /> Take Topic Test
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Diagnostic Quiz Modal */}
      {activeQuizActivity && (
        <TopicQuizModal
          activity={activeQuizActivity}
          subjectCategory={subject.category}
          onClose={() => setActiveQuizActivity(null)}
        />
      )}
    </div>
  );
};
