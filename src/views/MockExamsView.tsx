import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileCheck, Clock, Award, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';

export const MockExamsView: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentCurriculum, addXP } = useSessionStore();
  const curriculum = getCurrentCurriculum();
  const [activeMock, setActiveMock] = useState<any | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const mockQuestions = [
    {
      q: 'Which characteristic uniquely separates high pitch sound from low pitch sound in acoustic waves?',
      options: ['Higher wave frequency (Hz)', 'Higher amplitude (dB)', 'Heavier air particles', 'Speed of sound increases 10x'],
      correct: 0,
      expl: 'Pitch is the direct auditory perception of frequency (cycles per second).'
    },
    {
      q: 'What is the color transition of natural turmeric paper when placed into an alkaline soap solution?',
      options: ['Turns yellow to bright blue', 'Turns yellow to deep reddish-brown', 'Becomes colorless', 'Turns fluorescent green'],
      correct: 1,
      expl: 'Curcumin in turmeric changes molecular configuration into a reddish chromophore under alkaline conditions.'
    },
    {
      q: 'In an ecosystem food web, what is the consequence of exterminating primary predators (e.g. frogs)?',
      options: ['Insects multiply and decimate agricultural vegetation', 'Grass immediately stops growing', 'All animals turn into carnivores', 'No noticeable change occurs'],
      correct: 0,
      expl: 'Trophic cascades demonstrate that top-down predator control protects vegetation from uncontrolled insect herbivory.'
    }
  ];

  const handleStartExam = (exam: any) => {
    setActiveMock(exam);
    setSelectedOpt(null);
    setIsCompleted(false);
  };

  const handleFinishExam = () => {
    setIsCompleted(true);
    addXP(100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
              Summative Assessment Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Standardized Mock Examinations
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Board-calibrated blueprints with timed conditions, instant diagnostic breakdown, and XP scoring.
          </p>
        </div>
      </div>

      {/* Main List or Active Exam */}
      {!activeMock ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curriculum.mockExams.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-6"
            >
              <div>
                <span className="text-[11px] font-bold text-indigo-600 font-mono tracking-wider uppercase">
                  {exam.blueprint}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{exam.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Covers: {exam.syllabus}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs text-slate-600 font-mono">
                  <span>⏱ {exam.durationMinutes} Mins</span>
                  <span>🏆 {exam.totalMarks} Marks</span>
                  <span>📝 {exam.questionsCount} Questions</span>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                <span>Start Timed Mock Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Active Mock Interface */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase font-mono">{activeMock.blueprint}</span>
              <h2 className="text-2xl font-extrabold text-slate-900">{activeMock.title}</h2>
            </div>
            <button
              onClick={() => setActiveMock(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              ✕ Exit Simulator
            </button>
          </div>

          {/* Exam Questions */}
          <div className="space-y-6">
            {mockQuestions.map((q, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/80 border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Question {idx + 1}: {q.q}</h4>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setSelectedOpt(oIdx)}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 text-xs hover:bg-indigo-50/50 flex items-center justify-between"
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            {isCompleted ? (
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Mock Exam Submitted! +100 XP awarded to your Profile.
              </div>
            ) : (
              <span className="text-xs text-slate-500">Official Exam Conditions</span>
            )}

            <button
              onClick={handleFinishExam}
              disabled={isCompleted}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs ${
                isCompleted ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white shadow-md'
              }`}
            >
              {isCompleted ? 'Evaluation Complete' : 'Submit Mock Exam'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

