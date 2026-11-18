import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  Clock,
  Award,
  ArrowRight,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { useAppStore } from '../store/useAppStore';
import { GLASS_CARD_FORMULA } from '../components/ui/AppleGlassCard';
import { Interactive3DCard } from '../components/ui/Interactive3DCard';

interface ExamQuestion {
  id: string;
  q: string;
  subject: string;
  options: string[];
  correct: number;
  expl: string;
  misconception?: string;
}

export const MockExamsView: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentCurriculum } = useSessionStore();
  const { currentClass, addXP, updateCompetency } = useAppStore();
  const curriculum = getCurrentCurriculum();

  const [activeMock, setActiveMock] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Dynamic question bank calibrated for Class 5 to 12
  const examQuestionsByClass: Record<number, ExamQuestion[]> = {
    10: [
      {
        id: 'q10-1',
        q: 'Which characteristic uniquely dictates the angle of refraction when light enters an optically denser medium like glass?',
        subject: 'Physics',
        options: [
          'Ratio of refractive indices (n₁/n₂) per Snell’s Law',
          'Intensity of the incident light beam',
          'Amplitude of the electric field vector',
          'Thickness of the glass medium',
        ],
        correct: 0,
        expl: 'Snell’s Law specifies n₁·sin(θ₁) = n₂·sin(θ₂). The bending depends solely on the ratio of optical densities (wave speeds in the media).',
        misconception: 'Light intensity affects brightness, NOT the angle of refraction!',
      },
      {
        id: 'q10-2',
        q: 'A 12V automotive battery is connected across a circuit with resistance 4 Ω. What is the current flowing and the power dissipated?',
        subject: 'Physics',
        options: [
          'Current = 3 A, Power = 36 W',
          'Current = 48 A, Power = 12 W',
          'Current = 0.33 A, Power = 4 W',
          'Current = 16 A, Power = 192 W',
        ],
        correct: 0,
        expl: 'By Ohm’s Law, I = V / R = 12V / 4Ω = 3 A. Power P = V · I = 12V · 3A = 36 Watts (or I²R = 9 · 4 = 36W).',
      },
      {
        id: 'q10-3',
        q: 'What color change is observed when natural turmeric paper indicator is dipped into an alkaline soap solution?',
        subject: 'Chemistry',
        options: [
          'Transitions from bright yellow to deep reddish-brown',
          'Turns yellow to intense fluorescent blue',
          'Becomes completely transparent/colorless',
          'Remains bright yellow without reaction',
        ],
        correct: 0,
        expl: 'Curcumin in turmeric undergoes deprotonation under alkaline conditions (pH > 8), forming a reddish-brown chromophore.',
        misconception: 'Turmeric turns red with BASES, but stays yellow with ACIDS!',
      },
      {
        id: 'q10-4',
        q: 'Which of the following processes occurs in the nephrons of human kidneys during urine formation?',
        subject: 'Biology',
        options: [
          'Ultrafiltration in glomerulus followed by selective reabsorption in tubules',
          'Direct digestion of proteins into amino acids',
          'Storage of bile juice for fat emulsification',
          'Oxygenation of deoxygenated blood cells',
        ],
        correct: 0,
        expl: 'Nephrons filter blood under hydrostatic pressure in the Bowman’s capsule/glomerulus, followed by selective reabsorption of glucose, amino acids, and water in the renal tubule.',
      },
      {
        id: 'q10-5',
        q: 'For the quadratic polynomial f(x) = 2x² - 8x + 6, what are the roots (zeros) of the function?',
        subject: 'Mathematics',
        options: [
          'x = 1 and x = 3',
          'x = -1 and x = -3',
          'x = 2 and x = 4',
          'x = 0 and x = 6',
        ],
        correct: 0,
        expl: 'Factorizing: 2(x² - 4x + 3) = 2(x - 1)(x - 3) = 0, giving zeros at x = 1 and x = 3.',
      },
    ],
    7: [
      {
        id: 'q7-1',
        q: 'Which property uniquely separates high pitch sound from low pitch sound in acoustic waves?',
        subject: 'Physics',
        options: [
          'Higher wave frequency (Hz)',
          'Higher wave amplitude (dB)',
          'Heavier air particles',
          'Speed of sound increases 10x',
        ],
        correct: 0,
        expl: 'Pitch is the direct auditory perception of oscillation frequency (cycles per second).',
        misconception: 'Striking harder increases amplitude (loudness), NOT frequency (pitch)!',
      },
      {
        id: 'q7-2',
        q: 'In an ecosystem food web, what is the consequence of exterminating primary predators (e.g. frogs)?',
        subject: 'Biology',
        options: [
          'Insects multiply uncontrollably and decimate vegetation',
          'Grass immediately stops growing',
          'All animals turn into carnivores',
          'No noticeable ecological change occurs',
        ],
        correct: 0,
        expl: 'Trophic cascades show that top-down predator control protects vegetation from uncontrolled insect herbivory.',
      },
      {
        id: 'q7-3',
        q: 'What gas is evolved when dilute hydrochloric acid (HCl) reacts with baking soda (sodium hydrogen carbonate)?',
        subject: 'Chemistry',
        options: [
          'Carbon dioxide gas (CO₂)',
          'Hydrogen gas (H₂)',
          'Oxygen gas (O₂)',
          'Nitrogen gas (N₂)',
        ],
        correct: 0,
        expl: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑. The effervescence turns lime water milky.',
      },
    ],
  };

  const activeQuestions: ExamQuestion[] =
    examQuestionsByClass[currentClass] || examQuestionsByClass[10];

  // Timer countdown
  useEffect(() => {
    if (!activeMock || isCompleted || !isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeMock, isCompleted, isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (exam: any) => {
    setActiveMock(exam);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setTimeRemaining((exam.durationMinutes || 15) * 60);
    setIsTimerRunning(true);
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (isCompleted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / activeQuestions.length) * 100);
  };

  const handleFinishExam = () => {
    setIsCompleted(true);
    setIsTimerRunning(false);
    const score = calculateScore();
    addXP(150, 'Standardized Mock Exam');
    updateCompetency('Physics', score);
    updateCompetency('Chemistry', score);
    updateCompetency('Mathematics', score);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-8 text-white">
      {/* Header Banner Glass Card */}
      <Interactive3DCard
        className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white`}
        glowColor="rgba(168, 85, 247, 0.35)"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/25 text-purple-300 border border-purple-400/40">
                Summative Assessment Engine
              </span>
              <span className="text-xs font-bold text-slate-400">Class {currentClass} NCERT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Standardized Mock Examinations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Board-calibrated blueprints with timed conditions, question navigator, and instant diagnostic scoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl border border-white/15 bg-slate-800/80 text-xs font-bold">
              <span className="text-purple-400 font-black">{curriculum.mockExams?.length || 2}</span> Blueprints Available
            </div>
          </div>
        </div>
      </Interactive3DCard>

      {/* Main List or Active Exam Interface */}
      {!activeMock ? (
        /* EXAM CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(curriculum.mockExams || []).map((exam) => (
            <Interactive3DCard
              key={exam.id}
              className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white flex flex-col justify-between space-y-6`}
              glowColor="rgba(129, 140, 248, 0.35)"
            >
              <div>
                <span className="text-[11px] font-black text-cyan-400 font-mono tracking-wider uppercase">
                  {exam.blueprint}
                </span>
                <h3 className="text-xl font-black text-white mt-1">{exam.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Syllabus: {exam.syllabus}
                </p>

                <div className="flex items-center gap-4 mt-5 text-xs text-slate-300 font-mono">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {exam.durationMinutes} Mins
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {exam.totalMarks} Marks
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10">
                    <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                    {exam.questionsCount || activeQuestions.length} Questions
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <span>Launch Timed Exam Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Interactive3DCard>
          ))}
        </div>
      ) : (
        /* ACTIVE MOCK EXAM INTERFACE */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Top Exam HUD */}
          <div className="glass-panel !bg-slate-900/90 border border-white/20 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  {activeMock.blueprint}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white">{activeMock.title}</h2>
              </div>
            </div>

            {/* Countdown Clock & Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-cyan-400/40 text-cyan-300 font-mono text-sm font-black shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>{formatTimer(timeRemaining)}</span>
              </div>

              <button
                onClick={() => setActiveMock(null)}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-white/15 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Exit Simulator
              </button>
            </div>
          </div>

          {!isCompleted ? (
            /* ACTIVE QUESTION VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Question Card */}
              <div className="lg:col-span-8 space-y-6">
                {(() => {
                  const q = activeQuestions[currentQuestionIndex];
                  const chosenOpt = selectedAnswers[currentQuestionIndex];

                  return (
                    <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white space-y-5`}>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/25 text-indigo-300 border border-indigo-400/30">
                          {q.subject} • Question {currentQuestionIndex + 1} of {activeQuestions.length}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {answeredCount} of {activeQuestions.length} answered
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-slate-100 leading-relaxed">
                        {q.q}
                      </h3>

                      {/* Options */}
                      <div className="space-y-3 pt-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = chosenOpt === oIdx;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(currentQuestionIndex, oIdx)}
                              className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-indigo-900/60 to-cyan-900/60 border-cyan-400 text-white shadow-md ring-2 ring-cyan-400/30'
                                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-white/10'
                              }`}
                            >
                              <span>{opt}</span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-cyan-400 border-cyan-300 text-slate-950 font-black'
                                    : 'border-white/30'
                                }`}
                              >
                                {isSelected && '✓'}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <button
                          disabled={currentQuestionIndex === 0}
                          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                          className="px-4 py-2 rounded-xl border border-white/15 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Previous</span>
                        </button>

                        <button
                          disabled={currentQuestionIndex === activeQuestions.length - 1}
                          onClick={() =>
                            setCurrentQuestionIndex((prev) =>
                              Math.min(activeQuestions.length - 1, prev + 1)
                            )
                          }
                          className="px-4 py-2 rounded-xl border border-white/15 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>Next Question</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Question Navigation Palette Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white space-y-4`}>
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 pb-2 border-b border-white/10">
                    Question Palette
                  </h4>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {activeQuestions.map((_, idx) => {
                      const isAnswered = selectedAnswers[idx] !== undefined;
                      const isCurrent = currentQuestionIndex === idx;

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`h-10 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center ${
                            isCurrent
                              ? 'ring-2 ring-cyan-400 border-white bg-indigo-600 text-white scale-105'
                              : isAnswered
                              ? 'bg-emerald-600/80 border-emerald-400 text-white'
                              : 'bg-slate-800 border-white/10 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      <span>Answered ({answeredCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-800 border border-white/20 inline-block" />
                      <span>Unanswered ({activeQuestions.length - answeredCount})</span>
                    </div>
                  </div>

                  <button
                    onClick={handleFinishExam}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    Submit & Evaluate Mock
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* COMPREHENSIVE POST-EXAM EVALUATION REPORT */
            <div className="space-y-6">
              <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/85 border-white/20 text-white p-6 sm:p-8 space-y-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/30">
                      {calculateScore()}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white">Evaluation Complete</h2>
                        <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
                          {calculateScore() >= 75 ? 'Distinction' : 'Standard Pass'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        +150 XP awarded to your Profile Portfolio • Competency Radar updated
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStartExam(activeMock)}
                      className="px-4 py-2.5 rounded-xl border border-white/15 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Exam</span>
                    </button>
                    <button
                      onClick={() => setActiveMock(null)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-black shadow-md cursor-pointer"
                    >
                      Return to Exams Lobby
                    </button>
                  </div>
                </div>

                {/* Question by Question Review */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-cyan-400">
                    Comprehensive Question-by-Question Review:
                  </h3>

                  {activeQuestions.map((q, idx) => {
                    const chosen = selectedAnswers[idx];
                    const isCorrect = chosen === q.correct;

                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-slate-800/60 border border-white/10 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            Question {idx + 1}: {q.q}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                            }`}
                          >
                            {isCorrect ? 'Correct (+1 Mark)' : 'Incorrect'}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-slate-300">
                          <div>
                            <span className="text-slate-400">Your Answer: </span>
                            <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {chosen !== undefined ? q.options[chosen] : 'Unanswered'}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div>
                              <span className="text-slate-400">Correct Answer: </span>
                              <span className="text-emerald-400 font-bold">{q.options[q.correct]}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300 leading-relaxed">
                          <span className="text-cyan-400 font-bold">Explanation: </span>
                          {q.expl}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MockExamsView;
