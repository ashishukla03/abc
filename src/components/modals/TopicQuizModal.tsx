import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Sparkles, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { TopicActivity } from '../../data/curriculumData';
import { useSessionStore } from '../../store/useSessionStore';
import { useAppStore } from '../../store/useAppStore';

interface TopicQuizModalProps {
  activity: TopicActivity;
  subjectCategory: any;
  isOpen: boolean;
  onClose: () => void;
}

export const TopicQuizModal: React.FC<TopicQuizModalProps> = ({
  activity,
  subjectCategory,
  isOpen,
  onClose,
}) => {
  const completeTopicTest = useSessionStore((state) => state.completeTopicTest);
  const { markTopicStatus, updateCompetency, addXP } = useAppStore();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  if (!isOpen) return null;

  const questions = activity.testQuestions || [];

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const calculateScore = () => {
    if (questions.length === 0) return 100;
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    const xp = Math.round((finalScore / 100) * 80);
    setEarnedXP(xp);
    setIsSubmitted(true);

    // Update session store and app store
    completeTopicTest(activity.id, finalScore, subjectCategory);
    markTopicStatus(activity.id, 'mastered');
    updateCompetency(String(subjectCategory || 'STEM'), finalScore);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setEarnedXP(0);
  };

  const allAnswered = questions.length > 0 && questions.every((q) => selectedAnswers[q.id]);
  const score = isSubmitted ? calculateScore() : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900/95 backdrop-blur-3xl border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.85),inset_0_1.5px_1px_rgba(255,255,255,0.2)] p-6 md:p-8 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-cyan-300 border border-indigo-400/40">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                NCERT Diagnostic Check • {activity.ncertCode || 'Core Unit'}
              </span>
              <h3 className="text-xl font-black text-white mt-2">{activity.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Questions Body */}
          <div className="space-y-6">
            {questions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-800/70 border border-white/10 shadow-sm space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white text-xs font-black flex items-center justify-center shadow-md">
                      Q{qIdx + 1}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                      {q.prompt}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const isSelected = selectedOpt === opt.id;
                      const isCorrect = q.correctOptionId === opt.id;
                      let optionClasses = 'border-white/15 bg-slate-900/60 hover:bg-slate-700/60 text-slate-200';

                      if (isSubmitted) {
                        if (isCorrect) {
                          optionClasses = 'border-emerald-400/80 bg-emerald-950/60 text-emerald-300 font-bold ring-1 ring-emerald-400';
                        } else if (isSelected && !isCorrect) {
                          optionClasses = 'border-rose-400/80 bg-rose-950/60 text-rose-300';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-cyan-400 bg-cyan-950/50 text-cyan-200 font-bold ring-2 ring-cyan-400/40';
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${optionClasses}`}
                        >
                          <span>{opt.text}</span>
                          {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-2 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback explanation if submitted */}
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-white/10 text-xs space-y-2 leading-relaxed"
                    >
                      <p className="text-slate-300 font-medium">
                        <span className="font-black text-cyan-300">Explanation:</span> {q.explanation}
                      </p>
                      {q.misconceptionAlert && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-400/30">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong>Key Misconception Alert:</strong> {q.misconceptionAlert}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission Result / Actions */}
          <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            {isSubmitted ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-cyan-500/30">
                  {score}%
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">
                    {score >= 80 ? 'Mastery Achieved! 🏆' : 'Diagnostic Complete'}
                  </h4>
                  <p className="text-xs text-cyan-300 font-medium">
                    +{earnedXP} XP & Competency updated
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-medium">
                Answer all questions to submit diagnostic test.
              </div>
            )}

            <div className="flex items-center gap-3">
              {isSubmitted ? (
                <>
                  <button
                    onClick={handleRetake}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs border border-white/20 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  disabled={!allAnswered}
                  onClick={handleSubmit}
                  className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all ${
                    allAnswered
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/10'
                  }`}
                >
                  Submit & Score Test
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
