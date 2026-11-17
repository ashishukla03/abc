import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, FileQuestion, CheckCircle2, Clock, Sparkles } from 'lucide-react';
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
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className={`p-8 rounded-3xl border ${subject.colorTheme.border} ${subject.colorTheme.bgTint} backdrop-blur-2xl shadow-glass flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${subject.colorTheme.badgeBg}`}>
              {subject.category.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{subject.name}</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Official NCERT Curriculum Chapters • Interactive Labs & Formative Quizzes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`Launching AI Tutor for ${subject.name}... Ask any question!`)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
          >
            Ask AI Tutor About This Course
          </button>
          <button
            onClick={() => navigate('/mock-exams')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 transition-all"
          >
            Take Summative Mock Exam
          </button>
        </div>
      </div>

      {/* Chapters & Topics Timeline */}
      <div className="space-y-8">
        {subject.chapters.map((chapter) => (
          <div key={chapter.id} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 font-mono tracking-wider uppercase">
                  {chapter.theme}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Chapter {chapter.number}: {chapter.title}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
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
                    whileHover={{ scale: 1.005 }}
                    className="p-5 rounded-2xl bg-white/80 border border-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded">
                          {topic.ncertCode}
                        </span>
                        {isMastered ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mastered ({prog.score || 100}%)
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            Ready to Learn
                          </span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {topic.durationMinutes} mins
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{topic.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{topic.shortDesc}</p>
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                      {topic.hasInquiryLab && (
                        <button
                          onClick={() => navigate(`/lab/${topic.id}`)}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-sm transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Explore Lab</span>
                        </button>
                      )}

                      <button
                        onClick={() => setActiveQuizActivity(topic)}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                      >
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span>Take Topic Test</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {activeQuizActivity && (
        <TopicQuizModal
          activity={activeQuizActivity}
          subjectCategory={subject.category}
          isOpen={Boolean(activeQuizActivity)}
          onClose={() => setActiveQuizActivity(null)}
        />
      )}
    </div>
  );
};

