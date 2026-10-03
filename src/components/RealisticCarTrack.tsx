import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import mclarenImg from '../assets/images/mclaren_top_view.png';
import asphaltImg from '../assets/images/asphalt_road_texture_1791029482977.jpg';
import highwayAerialImg from '../assets/images/highway_aerial_night_1791029495681.jpg';
import { TelemetryState } from '../types';

interface RealisticCarTrackProps {
  telemetry: TelemetryState;
  playKey: number;
}

interface StatMetric {
  id: string;
  num: number;
  suffix: string;
  label: string;
  sub: string;
  color: string;
  borderColor: string;
  glowColor: string;
  triggerProgress: number; // point where car reaches this stat
}

const STAT_METRICS: StatMetric[] = [
  {
    id: 'stat1',
    num: 58,
    suffix: '%',
    label: 'Increase in pick up point use',
    sub: 'Optimized routing efficiency across all urban logistics hubs',
    color: '#def54f', // Paras reference lime
    borderColor: 'rgba(222, 245, 79, 0.5)',
    glowColor: 'rgba(222, 245, 79, 0.2)',
    triggerProgress: 0.22,
  },
  {
    id: 'stat2',
    num: 23,
    suffix: '%',
    label: 'Decreased in customer phone calls',
    sub: 'Real-time GPS precision reduces dispatch delivery inquiries',
    color: '#6ac9ff', // Paras reference sky blue
    borderColor: 'rgba(106, 201, 255, 0.5)',
    glowColor: 'rgba(106, 201, 255, 0.2)',
    triggerProgress: 0.45,
  },
  {
    id: 'stat3',
    num: 27,
    suffix: '%',
    label: 'Increase in pick up point use',
    sub: 'Autonomous telemetry unlocks seamless depot parcel handling',
    color: '#f8fafc', // Paras reference clean slate
    borderColor: 'rgba(248, 250, 252, 0.5)',
    glowColor: 'rgba(248, 250, 252, 0.2)',
    triggerProgress: 0.68,
  },
  {
    id: 'stat4',
    num: 40,
    suffix: '%',
    label: 'Decreased in customer phone calls',
    sub: 'Milestone vehicle tracking and automated ETA notification',
    color: '#fa7328', // Paras reference orange
    borderColor: 'rgba(250, 115, 40, 0.5)',
    glowColor: 'rgba(250, 115, 40, 0.2)',
    triggerProgress: 0.88,
  },
];

const HEADLINE_LETTERS = [
  'W', 'E', 'L', 'C', 'O', 'M', 'E', ' ', 'I', 'T', 'Z', 'F', 'I', 'Z', 'Z'
];

export const RealisticCarTrack: React.FC<RealisticCarTrackProps> = ({
  telemetry,
  playKey,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { progress, velocityKmh, isScrolling } = telemetry;

  const [roadWidth, setRoadWidth] = useState<number>(1200);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  // Measure road width dynamically
  useEffect(() => {
    const updateSize = () => {
      if (roadRef.current) {
        setRoadWidth(roadRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initial load animation for Headline and Statistics
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Headline character reveal
      const letters = containerRef.current?.querySelectorAll('.hero-headline-char');
      if (letters) {
        gsap.fromTo(
          letters,
          { opacity: 0, y: 24, scale: 0.94, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.04,
            ease: 'power3.out',
          }
        );
      }

      // 2. Statistics cards entrance with subtle delay
      const statCards = containerRef.current?.querySelectorAll('.stat-card-item');
      if (statCards) {
        gsap.fromTo(
          statCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            delay: 0.55,
            ease: 'power3.out',
          }
        );
      }

      // 3. Count up animation for stats
      const tracker = { v0: 0, v1: 0, v2: 0, v3: 0 };
      gsap.to(tracker, {
        v0: STAT_METRICS[0].num,
        v1: STAT_METRICS[1].num,
        v2: STAT_METRICS[2].num,
        v3: STAT_METRICS[3].num,
        duration: 1.6,
        delay: 0.65,
        ease: 'power2.out',
        onUpdate: () => {
          setCounts([
            Math.round(tracker.v0),
            Math.round(tracker.v1),
            Math.round(tracker.v2),
            Math.round(tracker.v3),
          ]);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [playKey]);

  // Car geometry calculation
  const carWidth = Math.min(240, Math.max(150, roadWidth * 0.18));
  const carHeight = carWidth * 0.48; // McLaren 720S aspect ratio ~2.1:1
  const startX = 20;
  const maxTravel = Math.max(100, roadWidth - carWidth - 40);
  const carCurrentX = startX + progress * maxTravel;
  const carNoseX = carCurrentX + carWidth;

  // Realistic dynamic suspension & micro steering sway
  const speedRatio = Math.min(1, velocityKmh / 300);
  const suspensionSquat = Math.sin(progress * Math.PI * 6) * 1.5 * (isScrolling ? 1 : 0.2);
  const steeringYaw = Math.sin(progress * Math.PI * 4) * 1.2;

  // Calculate active letters based on car nose position crossing letter bounding rect
  const [litLetters, setLitLetters] = useState<boolean[]>(new Array(HEADLINE_LETTERS.length).fill(false));

  useEffect(() => {
    if (!roadRef.current) return;
    const roadRect = roadRef.current.getBoundingClientRect();

    const newLit = HEADLINE_LETTERS.map((_, idx) => {
      const span = letterRefs.current[idx];
      if (!span) return false;
      const spanRect = span.getBoundingClientRect();
      const relativeSpanLeft = spanRect.left - roadRect.left;
      // Headlights project ahead of the car nose
      return (carNoseX + 50) >= relativeSpanLeft;
    });

    setLitLetters(newLit);
  }, [carNoseX, roadWidth, progress]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col justify-between py-6 px-4 md:px-12 select-none overflow-hidden"
    >
      {/* 1. Atmospheric Ambient Horizon Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={highwayAerialImg}
          alt="Aerial Raceway Backdrop"
          className="w-full h-full object-cover opacity-20 filter blur-[1px] brightness-70 scale-105"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/80 to-neutral-950" />
      </div>

      {/* 2. Top Header & Letter-Spaced Headline (First Screen Above Fold) */}
      <div className="relative z-20 w-full max-w-6xl mx-auto text-center pt-24 md:pt-28">
        <div className="flex items-center justify-center gap-2 text-[11px] md:text-xs font-mono text-emerald-400 mb-1.5 font-semibold tracking-[0.3em] uppercase">
          <span>REAL-TIME SCROLL SIMULATION</span>
          <span aria-hidden="true">·</span>
          <span>MCLAREN 720S AERO</span>
          <span aria-hidden="true">·</span>
          <span>GSAP ENGINE</span>
        </div>

        {/* W E L C O M E   I T Z   F I Z Z */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.25em] md:tracking-[0.45em] text-white uppercase flex flex-wrap items-center justify-center leading-tight">
          {HEADLINE_LETTERS.map((char, idx) => (
            char === ' ' ? (
              <span key={`space-${idx}`} className="w-4 md:w-8 inline-block" />
            ) : (
              <span
                key={`hchar-${idx}`}
                className="hero-headline-char inline-block transition-transform duration-200 hover:scale-110 hover:text-emerald-400"
                style={{ margin: '0 0.05em' }}
              >
                {char}
              </span>
            )
          ))}
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-sans font-light tracking-wide max-w-2xl mx-auto">
          Scroll down to pilot the McLaren across the high-speed telemetry raceway.
        </p>
      </div>

      {/* 3. The 4 Impact Metrics / Statistics from Reference */}
      <div className="relative z-20 w-full max-w-6xl mx-auto my-3 md:my-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {STAT_METRICS.map((stat, idx) => {
            const isCarReached = progress >= stat.triggerProgress;
            return (
              <div
                key={stat.id}
                className={`stat-card-item rounded-xl p-3.5 md:p-4 bg-neutral-950/80 backdrop-blur-md border transition-all duration-300 ${
                  isCarReached
                    ? 'border-emerald-400/60 shadow-[0_0_20px_rgba(69,219,125,0.25)] scale-[1.02]'
                    : 'border-white/10 hover:border-white/20'
                }`}
                style={{
                  borderTopColor: isCarReached ? stat.color : undefined,
                  borderTopWidth: isCarReached ? '2px' : undefined,
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-display font-extrabold text-3xl md:text-4xl tabular-nums tracking-tight"
                    style={{ color: isCarReached ? stat.color : '#ffffff' }}
                  >
                    {counts[idx]}
                    <span className="text-xl md:text-2xl font-normal ml-0.5">
                      {stat.suffix}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    METRIC 0{idx + 1}
                  </span>
                </div>

                <div className="font-semibold text-neutral-200 text-xs mt-1 leading-snug">
                  {stat.label}
                </div>

                <div className="text-[11px] text-neutral-400 mt-1 font-light leading-relaxed truncate">
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. The Photorealistic Asphalt Raceway & McLaren Supercar */}
      <div
        ref={roadRef}
        className="relative z-20 w-full max-w-6xl mx-auto h-[180px] sm:h-[220px] md:h-[260px] shadow-2xl rounded-2xl overflow-hidden border border-neutral-700/80 my-2"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0,0,0,0.8) inset',
        }}
      >
        {/* Realistic Asphalt Texture Surface */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.55] contrast-[1.25]"
          style={{
            backgroundImage: `url(${asphaltImg})`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: `${-progress * 400}px center`,
          }}
        />

        {/* Ambient Dark Sheen & Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

        {/* Top & Bottom FIA Racetrack Rumble Strip Curbs (Red & White alternating) */}
        <div
          className="absolute top-0 inset-x-0 h-3 border-b border-black/40 shadow-sm"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #dc2626, #dc2626 24px, #f8fafc 24px, #f8fafc 48px)',
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-3 border-t border-black/40 shadow-sm"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #dc2626, #dc2626 24px, #f8fafc 24px, #f8fafc 48px)',
          }}
        />

        {/* Yellow Outer Boundary Lines */}
        <div className="absolute top-5 inset-x-0 h-0.5 bg-yellow-400/40" />
        <div className="absolute bottom-5 inset-x-0 h-0.5 bg-yellow-400/40" />

        {/* Dashed Center Dividing Lines with Dynamic Scroll Parallax */}
        <div
          className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-1 opacity-60"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 35px, transparent 35px, transparent 70px)',
            backgroundPosition: `${-progress * 500}px 0`,
          }}
        />

        {/* Rubber Skid Marks from High Acceleration */}
        <div className="absolute top-[32%] inset-x-0 h-2 bg-black/40 blur-[1px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-[32%] inset-x-0 h-2 bg-black/40 blur-[1px] opacity-40 pointer-events-none" />

        {/* 5. Dynamic Energy Trail Behind the Car (The Reference Feature) */}
        <div
          className="absolute top-0 left-0 bottom-0 pointer-events-none z-10 transition-all duration-75 overflow-hidden"
          style={{ width: `${Math.max(0, carCurrentX + 30)}px` }}
        >
          {/* Luminous Emerald Telemetry Energy Ribbon with Soft Glow */}
          <div
            className="w-full h-full opacity-65"
            style={{
              background: 'linear-gradient(90deg, rgba(69, 219, 125, 0.05) 0%, rgba(69, 219, 125, 0.25) 70%, rgba(69, 219, 125, 0.6) 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 15%, black 40%, black 60%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 15%, black 40%, black 60%, transparent 85%)',
            }}
          />

          {/* Rubber Tire Skid Marks left behind wheels */}
          <div className="absolute top-[32%] inset-x-0 h-1.5 bg-black/80 blur-[0.5px]" />
          <div className="absolute bottom-[32%] inset-x-0 h-1.5 bg-black/80 blur-[0.5px]" />
        </div>

        {/* 6. Embedded Asphalt Typography: "W E L C O M E   I T Z F I Z Z" */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-15 flex items-center justify-between pointer-events-none px-6 md:px-14">
          {HEADLINE_LETTERS.map((char, i) => {
            const isSpace = char === ' ';
            const isLit = litLetters[i];

            if (isSpace) {
              return (
                <span
                  key={`space-${i}`}
                  ref={(el) => {
                    letterRefs.current[i] = el;
                  }}
                  className="w-4 md:w-8 inline-block"
                />
              );
            }

            return (
              <span
                key={`rchar-${i}`}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className={`font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight transition-all duration-300 transform select-none ${
                  isLit
                    ? 'text-white scale-100 opacity-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]'
                    : 'text-neutral-500/50 scale-95 opacity-40'
                }`}
                style={{
                  textShadow: isLit
                    ? '0 0 25px rgba(255,255,255,0.95), 0 0 45px rgba(69,219,125,0.6)'
                    : 'none',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* 7. The Authentic McLaren 720S Top-View Supercar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-20 will-change-transform pointer-events-none"
          style={{
            left: `${carCurrentX}px`,
            width: `${carWidth}px`,
            height: `${carHeight}px`,
            transform: `translate3d(0, ${suspensionSquat}px, 0) rotate(${steeringYaw}deg)`,
            transition: 'transform 0.05s ease-out',
          }}
        >
          {/* Volumetric Headlight Beams projecting forward onto the asphalt */}
          <div
            className="absolute -right-44 md:-right-64 top-[-25%] w-52 md:w-72 h-[150%] pointer-events-none z-10 mix-blend-screen transition-opacity duration-200"
            style={{
              background: 'radial-gradient(ellipse at 0% 50%, rgba(255,255,240,0.85) 0%, rgba(255,245,210,0.4) 40%, rgba(69,219,125,0.2) 70%, transparent 95%)',
              clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
              opacity: 0.85 + Math.min(0.15, speedRatio * 0.4),
            }}
          />

          {/* Under-Chassis Contact Ground Shadow */}
          <div
            className="absolute inset-1 bg-black/95 rounded-[30%] blur-md transform scale-105 pointer-events-none"
            style={{
              boxShadow: '0 0 25px 15px rgba(0,0,0,0.9)',
            }}
          />

          {/* Ambient Red Taillight Laser Glow at the rear */}
          <div
            className="absolute -left-5 top-[25%] w-8 h-[50%] bg-red-600/80 rounded-full blur-md pointer-events-none"
            style={{
              opacity: 0.6 + (isScrolling ? 0.35 : 0.1),
            }}
          />

          {/* High-Resolution Transparent McLaren 720S Asset */}
          <img
            src={mclarenImg}
            alt="McLaren 720S Top View"
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] brightness-105 contrast-110"
          />

          {/* Dynamic Cockpit Gloss Sweep */}
          <div
            className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-150"
            style={{
              background: `linear-gradient(90deg, transparent ${(progress * 140 - 20)}%, rgba(255,255,255,0.5) ${(progress * 140)}%, transparent ${(progress * 140 + 20)}%)`,
              opacity: isScrolling ? 0.8 : 0.2,
            }}
          />
        </div>
      </div>

      {/* 8. Live Telemetry Bar */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-2 flex items-center justify-between text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white font-semibold">VELOCITY:</span>
          <span className="text-emerald-400 font-bold tabular-nums text-sm">
            {Math.round(velocityKmh)} km/h
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span>PROGRESS: <strong className="text-white">{Math.round(progress * 100)}%</strong></span>
          <span aria-hidden="true">·</span>
          <span>DOWNFORCE: <strong className="text-cyan-400">{Math.round(telemetry.downforceKg)} kg</strong></span>
          <span aria-hidden="true">·</span>
          <span>FRICTION: <strong className="text-amber-400">0.89 μ</strong></span>
        </div>

        <div className="text-[11px] text-neutral-400">
          DRIVE STATUS: <strong className="text-white">{progress >= 0.95 ? 'FINISH LINE' : 'TRACK ACTIVE'}</strong>
        </div>
      </div>
    </div>
  );
};
