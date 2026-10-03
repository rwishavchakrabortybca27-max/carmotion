import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { HeroIntroHeadline } from './components/HeroIntroHeadline';
import { HeroMetrics } from './components/HeroMetrics';
import { ScrollCanvasCar } from './components/ScrollCanvasCar';
import { RealisticCarTrack } from './components/RealisticCarTrack';
import { ScrollTelemetryPanel } from './components/ScrollTelemetryPanel';
import { ScrollTimelineNavigator } from './components/ScrollTimelineNavigator';
import { FeatureDeepDives } from './components/FeatureDeepDives';
import { SubmissionHelperModal } from './components/SubmissionHelperModal';
import { Footer } from './components/Footer';
import { TelemetryState } from './types';
import { hypercarAudio } from './utils/audioEngine';
import { Camera, ChevronDown, CheckCircle2, Car, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [playKey, setPlayKey] = useState<number>(1);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState<boolean>(false);
  const [scrubDamping, setScrubDamping] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<'realistic-reference' | 'cinematic-3d'>('realistic-reference');
  const [perspectiveMode, setPerspectiveMode] = useState<'cinematic' | 'low-angle' | 'top-track'>('cinematic');
  const [activeSpecDetail, setActiveSpecDetail] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(60);

  // Raw & interpolated scroll progress (0 to 1)
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    progress: 0,
    velocityKmh: 0,
    downforceKg: 45,
    gForce: 0,
    yawDeg: 0,
    activeStage: 0,
    isScrolling: false,
  });

  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(performance.now());
  const scrollTimeout = useRef<number | null>(null);

  // FPS Monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // GSAP ScrollTrigger Integration for smooth scroll binding
  useEffect(() => {
    const heroTrack = heroTrackRef.current;
    if (!heroTrack) return;

    const trigger = ScrollTrigger.create({
      trigger: heroTrack,
      start: 'top top',
      end: 'bottom bottom',
      scrub: scrubDamping,
      onUpdate: (self) => {
        const p = self.progress;

        // Calculate instantaneous scroll speed for telemetry & sound
        const now = performance.now();
        const dt = Math.max(1, now - lastScrollTime.current);
        const dy = Math.abs(window.scrollY - lastScrollY.current);
        const scrollSpeed = (dy / dt) * 100;

        lastScrollY.current = window.scrollY;
        lastScrollTime.current = now;

        // Derive physical telemetry dynamically from progress and scroll motion
        const baseSpeed = p * 340;
        const dynamicSpeed = Math.min(360, baseSpeed + scrollSpeed * 0.4);
        const downforce = 45 + Math.pow(p, 1.4) * 815;
        const gForce = p < 0.25 ? p * 7.5 : Math.max(0.2, (1 - p) * 1.8 + Math.min(scrollSpeed * 0.015, 1.2));

        let stage = 0;
        if (p < 0.25) stage = 0;
        else if (p < 0.5) stage = 1;
        else if (p < 0.75) stage = 2;
        else stage = 3;

        setTelemetry({
          progress: p,
          velocityKmh: dynamicSpeed,
          downforceKg: downforce,
          gForce: gForce,
          yawDeg: Math.sin(p * Math.PI * 4) * 1.8,
          activeStage: stage,
          isScrolling: true,
        });

        // Update procedural audio synth
        hypercarAudio.updateScrollDynamics(scrollSpeed, p);

        // Clear scrolling timeout
        if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
        scrollTimeout.current = window.setTimeout(() => {
          setTelemetry((prev) => ({
            ...prev,
            isScrolling: false,
            velocityKmh: p * 340,
          }));
        }, 150);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [scrubDamping]);

  // Jump to specific progress along hero track
  const handleJumpToProgress = useCallback((targetProgress: number) => {
    const heroTrack = heroTrackRef.current;
    if (!heroTrack) return;

    const trackTop = heroTrack.offsetTop;
    const trackHeight = heroTrack.offsetHeight - window.innerHeight;
    const targetY = trackTop + trackHeight * targetProgress;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, []);

  // Replay initial load animations
  const handleReplayIntro = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setPlayKey((k) => k + 1);
    }, 350);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-neutral-100 selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. Global Strict Top Navigation Bar */}
      <Navbar
        onReplayIntro={handleReplayIntro}
        onOpenSubmissionInfo={() => setIsSubmissionOpen(true)}
        scrollProgress={telemetry.progress}
      />

      {/* 2. Primary Hero Scroll Track (Pinned Scroll-Driven Container) */}
      <section
        id="hero"
        ref={heroTrackRef}
        className="relative h-[360vh] w-full"
      >
        {/* Sticky 100vh Viewport: Remains fixed on screen as user scrolls */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
          
          {/* Top Header Mode Toggle (Realistic McLaren Reference vs Cinematic 3D) */}
          <div className="relative z-30 w-full pt-16 md:pt-20 px-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
            {/* View Mode Selector */}
            <div className="pointer-events-auto flex items-center gap-1 p-1 bg-neutral-950/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg">
              <button
                onClick={() => setViewMode('realistic-reference')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 ${
                  viewMode === 'realistic-reference'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                <span>REALISTIC TRACK (REFERENCE DEMO)</span>
              </button>

              <button
                onClick={() => setViewMode('cinematic-3d')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 ${
                  viewMode === 'cinematic-3d'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>CINEMATIC 3D HORIZON</span>
              </button>
            </div>

            {/* Quick Helper pill */}
            <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SCROLL-DRIVEN GSAP INTERPOLATION</span>
            </div>
          </div>

          {/* Central Layer: Selected View Mode */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {viewMode === 'realistic-reference' ? (
              <RealisticCarTrack
                telemetry={telemetry}
                playKey={playKey}
              />
            ) : (
              <div className="relative w-full h-full flex flex-col justify-between">
                <div className="relative z-30 w-full pt-12">
                  <HeroIntroHeadline
                    playKey={playKey}
                    scrollProgress={telemetry.progress}
                  />
                  <HeroMetrics
                    playKey={playKey}
                    scrollProgress={telemetry.progress}
                  />
                </div>
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <ScrollCanvasCar
                    telemetry={telemetry}
                    perspectiveMode={perspectiveMode}
                  />
                </div>
                <div className="absolute left-6 md:left-12 bottom-24 z-30">
                  <ScrollTelemetryPanel telemetry={telemetry} />
                </div>
              </div>
            )}
          </div>

          {/* Scroll Prompt Indicator at 0% scroll */}
          {telemetry.progress < 0.08 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none animate-bounce">
              <span className="text-[10px] tracking-[0.25em] font-mono text-neutral-300 uppercase bg-neutral-950/80 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                SCROLL TO DRIVE CAR
              </span>
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            </div>
          )}

          {/* Bottom Floating Interactive Scrubber Navigator */}
          <ScrollTimelineNavigator
            progress={telemetry.progress}
            onJumpToProgress={handleJumpToProgress}
            scrubDamping={scrubDamping}
            onChangeScrubDamping={setScrubDamping}
            fps={fps}
          />
        </div>
      </section>

      {/* 3. Seamlessly Connected Feature Deep Dives & Engineering Dossier */}
      <FeatureDeepDives
        onSelectSpec={(specName) => setActiveSpecDetail(specName)}
      />

      {/* 4. Quiet Corporate Footer */}
      <Footer />

      {/* 5. Assignment Submission & Verification Dossier Modal */}
      <SubmissionHelperModal
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
        fps={fps}
        onReplayIntro={handleReplayIntro}
      />

      {/* Optional Spec Detail Modal when clicking feature deep dive CTA */}
      {activeSpecDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-white/15 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-amber-400 uppercase">
                SYSTEM TELEMETRY EXPANSION
              </span>
              <button
                onClick={() => setActiveSpecDetail(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono"
              >
                CLOSE [ESC]
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-neutral-300 font-sans">
              <p>
                Telemetry verified via CAN-FD 5.0 Mbps onboard optical bus. Real-time inverter telemetry streams with sub-microsecond synchronization across all four corners.
              </p>
              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5 font-mono text-[11px] text-amber-300">
                STATUS: NOMINAL · THERMAL GRADIENT &lt; 2.4°C · VECTOR RESPONSE: ACTIVE
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveSpecDetail(null)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono transition-colors"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
