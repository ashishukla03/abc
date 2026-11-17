import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Sparkles, Award } from 'lucide-react';
import { TopicActivity } from '../../data/curriculumData';
import { useSessionStore } from '../../store/useSessionStore';

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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  if (!isOpen) return null;

  const questions = activity.testQuestions;

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const calculateScore = () => {
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
    const xp = Math.round((finalScore / 100) * 50);
    setEarnedXP(xp);
    setIsSubmitted(true);
    completeTopicTest(activity.id, finalScore, subjectCategory);
  };

  const allAnswered = questions.every((q) => selectedAnswers[q.id]);
  const score = isSubmitted ? calculateScore() : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.3)] p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Diagnostic Topic Test • {activity.ncertCode}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">{activity.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Questions Body */}
          <div className="space-y-6">
            {questions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              return (
                <div key={q.id} className="p-5 rounded-2xl bg-white/70 border border-slate-200/70 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                      Q{qIdx + 1}
                    </span>
                    <p className="text-base font-semibold text-slate-800 leading-snug">{q.prompt}</p>
                  </div>

                  <div className="space-y-2.5">
                    {q.options.map((opt) => {
                      const isSelected = selectedOpt === opt.id;
                      const isCorrect = q.correctOptionId === opt.id;
                      let optionClasses = 'border-slate-200/80 bg-white/80 hover:bg-indigo-50/50 text-slate-700';

                      if (isSubmitted) {
                        if (isCorrect) {
                          optionClasses = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-medium ring-2 ring-emerald-500/20';
                        } else if (isSelected && !isCorrect) {
                          optionClasses = 'border-rose-400 bg-rose-50/80 text-rose-900';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium ring-2 ring-indigo-500/20';
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${optionClasses}`}
                        >
                          <span className="text-sm">{opt.text}</span>
                          {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-2" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback explanation if submitted */}
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-3 border-t border-slate-200 text-xs space-y-2"
                    >
                      <p className="text-slate-600 font-medium">
                        <span className="font-bold text-slate-800">Concept Explanation:</span> {q.explanation}
                      </p>
                      {q.misconceptionAlert && (
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Key Misconception:</strong> {q.misconceptionAlert}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission Result / Actions */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            {isSubmitted ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/30">
                  {score}%
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {score >= 80 ? 'Mastery Achieved! 🏆' : 'Diagnostic Complete'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    +{earnedXP} XP added to your Learning Model
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-medium">
                Answer all questions to submit diagnostic check.
              </div>
            )}

            <div className="flex items-center gap-3">
              {isSubmitted ? (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Continue Learning →
                </button>
              ) : (
                <button
                  disabled={!allAnswered}
                  onClick={handleSubmit}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    allAnswered
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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

