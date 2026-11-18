import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Film, Sparkles, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export interface CinematicFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const scenes = [
  { time: 0, title: '1. Identity & Purpose' },
  { time: 4, title: '2. 7-Step Cycle' },
  { time: 8, title: '3. Math Canal' },
  { time: 12, title: '4. Food Web' },
  { time: 16, title: '5. pH Lab' },
  { time: 20, title: '6. Wave Oscilloscope' },
  { time: 24, title: '7. Scope Statement' },
  { time: 28, title: '8. Grand Finale' },
];

export const CinematicFilmModal: React.FC<CinematicFilmModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(32);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoaded = () => setDuration(video.duration || 32);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('ended', onEnded);
    };
  }, [isOpen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop blur with cosmic dark glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden bg-slate-900/90 border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1.5px_1px_rgba(255,255,255,0.2)] p-6 flex flex-col gap-5 text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                    <span>Gramin PocketLab Overview Film</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono">
                      1080p • OpenMotion
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Authored technical motion engine demonstrating the offline STEM learner journey
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Frame with Specular Rim Highlight */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <video
                ref={videoRef}
                src="/openmotion/exports/gramin_pocketlab_overview.mp4"
                poster="/openmotion/exports/gramin_pocketlab_overview_poster.png"
                playsInline
                muted={isMuted}
                className="w-full h-full object-contain"
              />

              {/* Big Center Play Overlay when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer group"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] border-2 border-white/40"
                  >
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Scrubber Controls */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5"
                />
                <span className="text-xs font-mono font-bold text-cyan-300 shrink-0">
                  {currentTime.toFixed(1)}s / {duration.toFixed(0)}s
                </span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => seek(0)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs cursor-pointer"
                    title="Restart"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Scene jump pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {scenes.map((sc) => (
                    <button
                      key={sc.time}
                      onClick={() => seek(sc.time)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        Math.abs(currentTime - sc.time) < 4
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-800/80 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {sc.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

