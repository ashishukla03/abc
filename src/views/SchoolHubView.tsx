import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  School,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  BookOpen,
  Beaker,
  Trash2,
  Bell,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { useAppStore } from '../store/useAppStore';
import { LiveTimetable } from '../components/ui/LiveTimetable';
import { GLASS_CARD_FORMULA } from '../components/ui/AppleGlassCard';
import { Interactive3DCard } from '../components/ui/Interactive3DCard';

export const SchoolHubView: React.FC = () => {
  const { userProfile, getCurrentCurriculum } = useSessionStore();
  const { currentClass, studyTasks, toggleStudyTask, addStudyTask } = useAppStore();
  const curriculum = getCurrentCurriculum();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Physics');
  const [showAddTask, setShowAddTask] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addStudyTask({
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      due: 'Tomorrow, 5:00 PM',
    });
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const completedCount = studyTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-8 text-white">
      {/* School Hub Hero Glass Card */}
      <Interactive3DCard
        className={`${GLASS_CARD_FORMULA} !bg-slate-900/80 border-white/15 text-white`}
        glowColor="rgba(56, 189, 248, 0.35)"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-md">
                🏫
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{userProfile.school}</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Affiliated to {userProfile.board} • Class {currentClass}-B • Academic Session 2026-2027
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Term 1 Summative Active</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold text-xs flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>2 School Notices</span>
            </div>
          </div>
        </div>
      </Interactive3DCard>

      {/* Grid: Timetable & Study Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Period Timetable */}
        <div className="lg:col-span-6 space-y-6">
          <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-black text-white">Today's Class Timetable</h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-300/80 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-white/10">
                Live Clock Sync
              </span>
            </div>

            <LiveTimetable />
          </div>
        </div>

        {/* Right Column: Interactive Daily Study Planner & Exam Countdowns */}
        <div className="lg:col-span-6 space-y-6">
          {/* Daily Study Planner & Homework Checklist */}
          <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Study Planner & Prep Tasks
                </h2>
                <p className="text-[11px] text-slate-400">
                  {completedCount} of {studyTasks.length} tasks completed • +25 XP per task
                </p>
              </div>

              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Add Task Form */}
            <AnimatePresence>
              {showAddTask && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreateTask}
                  className="p-4 rounded-2xl bg-slate-800/90 border border-white/15 space-y-3"
                >
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter study goal or revision topic..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <select
                      value={newTaskSubject}
                      onChange={(e) => setNewTaskSubject(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-white/20 text-white text-xs font-bold"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="General Science">General Science</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs cursor-pointer shadow-md"
                    >
                      Save to Planner
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Tasks List */}
            <div className="space-y-2.5">
              {studyTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleStudyTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'bg-slate-900/50 border-white/10 opacity-70'
                      : 'bg-slate-800/70 border-white/15 hover:bg-slate-800 hover:border-cyan-400/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                          : 'border-white/30 bg-slate-900'
                      }`}
                    >
                      {task.completed && '✓'}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-cyan-400 font-bold">{task.subject}</span>
                        <span>•</span>
                        <span>{task.due}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-amber-400">+25 XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Countdowns Card */}
          <div className={`${GLASS_CARD_FORMULA} !bg-slate-900/75 border-white/15 text-white space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black text-white">Official Exam Countdowns</h2>
              </div>
              <Link to="/exams" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                All Exams →
              </Link>
            </div>

            <div className="space-y-3">
              {(curriculum.mockExams || []).map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-2xl bg-slate-800/70 border border-white/10 flex items-center justify-between hover:bg-slate-800 transition-all"
                >
                  <div>
                    <h4 className="text-xs font-black text-white">{exam.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Syllabus: {exam.syllabus}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-xl font-black text-rose-400 font-mono">
                        {exam.urgencyDays || 30}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">Days Left</span>
                    </div>
                    <Link
                      to="/exams"
                      className="p-2 rounded-xl bg-slate-700/80 hover:bg-cyan-600 text-white transition-colors"
                      title="Prepare for exam"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolHubView;
