import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Info, ArrowUpRight } from 'lucide-react';
import { hypercarAudio } from '../utils/audioEngine';

interface NavbarProps {
  onReplayIntro: () => void;
  onOpenSubmissionInfo: () => void;
  scrollProgress: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReplayIntro,
  onOpenSubmissionInfo,
  scrollProgress,
}) => {
  const [audioActive, setAudioActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsScrolled(scrollProgress > 0.05);
  }, [scrollProgress]);

  const handleToggleAudio = () => {
    const active = hypercarAudio.toggle();
    setAudioActive(active);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/80 backdrop-blur-md border-b border-white/10 py-3.5'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-lg md:text-xl font-bold tracking-widest text-white hover:text-amber-400 transition-colors uppercase whitespace-nowrap"
        >
          ITZFIZZ·AERO
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-wider uppercase font-medium text-neutral-400">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="hover:text-white transition-colors py-1"
          >
            Overview
          </a>
          <a
            href="#stage-velocity"
            onClick={(e) => handleNavClick(e, 'stage-velocity')}
            className="hover:text-white transition-colors py-1"
          >
            Velocity
          </a>
          <a
            href="#stage-aerodynamics"
            onClick={(e) => handleNavClick(e, 'stage-aerodynamics')}
            className="hover:text-white transition-colors py-1"
          >
            Aerodynamics
          </a>
          <a
            href="#stage-powertrain"
            onClick={(e) => handleNavClick(e, 'stage-powertrain')}
            className="hover:text-white transition-colors py-1"
          >
            Chassis
          </a>
          <a
            href="#stage-specs"
            onClick={(e) => handleNavClick(e, 'stage-specs')}
            className="hover:text-white transition-colors py-1"
          >
            Specifications
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAudio}
            type="button"
            title={audioActive ? 'Mute motor hum' : 'Enable hypercar acoustic synth'}
            className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 bg-white/5 transition-all text-xs flex items-center gap-1.5"
          >
            {audioActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px] font-mono">{audioActive ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          <button
            onClick={onReplayIntro}
            type="button"
            title="Replay Page Load Entrance Animation"
            className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 bg-white/5 transition-all text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-mono">REPLAY</span>
          </button>

          <button
            onClick={onOpenSubmissionInfo}
            type="button"
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <span>Assignment Info</span>
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
