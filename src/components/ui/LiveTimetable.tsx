import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, User, MapPin, Sparkles } from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore';

export const LiveTimetable: React.FC = () => {
  const curriculum = useSessionStore((state) => state.getCurrentCurriculum());
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const curHour = currentDate.getHours();
  const curMin = currentDate.getMinutes();
  const curTimeDec = curHour + curMin / 60;

  const timetable = curriculum.timetable || [];

  return (
    <div className="space-y-3">
      {timetable.map((period) => {
        const startDec = period.startHour + period.startMin / 60;
        const endDec = period.endHour + period.endMin / 60;
        const isActive = curTimeDec >= startDec && curTimeDec <= endDec;
        const isPast = curTimeDec > endDec;

        return (
          <motion.div
            key={period.period}
            whileHover={{ y: -2 }}
            className={`p-4 rounded-2xl transition-all border ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-indigo-500/20 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'bg-slate-800/70 border-white/10 hover:bg-slate-800/95 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/15 text-cyan-300 text-xs font-black font-mono">
                  Period {period.period}
                </span>
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> {period.time}
                </span>
              </div>
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  ACTIVE NOW
                </span>
              ) : isPast ? (
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Upcoming</span>
              )}
            </div>

            <h4 className="text-sm font-black text-white">{period.subject}: {period.topic}</h4>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" /> {period.room}</span>
              <span className="flex items-center gap-1"><User className="w-3 h-3 text-indigo-400" /> {period.teacher}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LiveTimetable;
