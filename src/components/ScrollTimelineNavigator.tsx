import React from 'react';
import { Sliders, FastForward, Play, Pause } from 'lucide-react';

interface ScrollTimelineNavigatorProps {
  progress: number;
  onJumpToProgress: (progress: number) => void;
  scrubDamping: number;
  onChangeScrubDamping: (damping: number) => void;
  fps: number;
}

const STAGES = [
  { id: 'intro', label: '01 Intro', targetProgress: 0 },
  { id: 'launch', label: '02 Launch', targetProgress: 0.25 },
  { id: 'aero', label: '03 Aero Tunnel', targetProgress: 0.52 },
  { id: 'chassis', label: '04 Vectoring', targetProgress: 0.76 },
  { id: 'specs', label: '05 Specs', targetProgress: 0.96 },
];

export const ScrollTimelineNavigator: React.FC<ScrollTimelineNavigatorProps> = ({
  progress,
  onJumpToProgress,
  scrubDamping,
  onChangeScrubDamping,
  fps,
}) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl bg-neutral-950/85 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-3 shadow-2xl transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Stage quick jump buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-0.5">
          {STAGES.map((st) => {
            const isActive =
              progress >= st.targetProgress - 0.12 &&
              progress < st.targetProgress + 0.18;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onJumpToProgress(st.targetProgress)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Manual Interactive Scrubber Bar */}
        <div className="flex items-center gap-3 w-full sm:w-72">
          <span className="text-[11px] font-mono text-neutral-400 tabular-nums shrink-0">
            {Math.round(progress * 100)}%
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.002"
              value={progress}
              onChange={(e) => onJumpToProgress(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Damping & FPS metrics */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-neutral-400 shrink-0">
          {/* Damping preset */}
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-neutral-500" />
            <button
              onClick={() => {
                const next = scrubDamping === 0.3 ? 1.0 : scrubDamping === 1.0 ? 1.8 : 0.3;
                onChangeScrubDamping(next);
              }}
              className="hover:text-amber-400 transition-colors text-[11px]"
              title="Click to toggle GSAP scrub damping (fluidity)"
            >
              Scrub: <span className="text-white font-semibold">{scrubDamping}s</span>
            </button>
          </div>

          {/* Real-time FPS */}
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-neutral-300 tabular-nums">{fps} FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
