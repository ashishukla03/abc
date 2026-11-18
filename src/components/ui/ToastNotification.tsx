import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Zap, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ToastNotification: React.FC = () => {
  const { toast, setToast } = useAppStore();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  return (
    <div className="fixed top-24 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 text-white backdrop-blur-2xl border border-cyan-400/50 shadow-[0_10px_35px_rgba(6,182,212,0.35)]"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              {toast.type === 'badge' ? (
                <Award className="w-4 h-4 text-slate-950" />
              ) : toast.type === 'mastery' ? (
                <Zap className="w-4 h-4 text-slate-950" />
              ) : (
                <Sparkles className="w-4 h-4 text-slate-950" />
              )}
            </div>

            <p className="text-xs font-extrabold text-slate-100 pr-2">{toast.message}</p>

            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
