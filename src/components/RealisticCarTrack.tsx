import React, { useRef, useEffect, useState } from 'react';
import mclarenImg from '../assets/images/mclaren_top_view.png';
import asphaltImg from '../assets/images/asphalt_road_texture_1791029482977.jpg';
import highwayAerialImg from '../assets/images/highway_aerial_night_1791029495681.jpg';
import { TelemetryState } from '../types';

interface RealisticCarTrackProps {
  telemetry: TelemetryState;
  playKey: number;
  roadTheme: 'night' | 'day' | 'circuit';
}

interface StatBox {
  id: string;
  num: string;
  label: string;
  sub: string;
  color: string;
  borderColor: string;
  glowColor: string;
  position: 'top-1' | 'bottom-1' | 'top-2' | 'bottom-2';
  triggerRange: [number, number]; // [start progress, end progress]
}

const STAT_BOXES: StatBox[] = [
  {
    id: 'box1',
    num: '58%',
    label: 'Increase in pick up point use',
    sub: 'Optimized routing efficiency across all urban logistics hubs',
    color: '#def54f', // Paras's lime accent
    borderColor: 'rgba(222, 245, 79, 0.4)',
    glowColor: 'rgba(222, 245, 79, 0.15)',
    position: 'top-1',
    triggerRange: [0.18, 0.38],
  },
  {
    id: 'box2',
    num: '23%',
    label: 'Decreased in customer phone calls',
    sub: 'Real-time GPS precision reduces dispatch delivery inquiries',
    color: '#6ac9ff', // Paras's sky blue accent
    borderColor: 'rgba(106, 201, 255, 0.4)',
    glowColor: 'rgba(106, 201, 255, 0.15)',
    position: 'bottom-1',
    triggerRange: [0.38, 0.58],
  },
  {
    id: 'box3',
    num: '27%',
    label: 'Increase in pick up point use',
    sub: 'Autonomous telemetry unlocks seamless depot parcel handling',
    color: '#f1f5f9', // Paras's clean slate accent
    borderColor: 'rgba(255, 255, 255, 0.35)',
    glowColor: 'rgba(255, 255, 255, 0.1)',
    position: 'top-2',
    triggerRange: [0.58, 0.78],
  },
  {
    id: 'box4',
    num: '40%',
    label: 'Decreased in customer phone calls',
    sub: 'Milestone vehicle tracking and automated ETA notification',
    color: '#fa7328', // Paras's orange accent
    borderColor: 'rgba(250, 115, 40, 0.4)',
    glowColor: 'rgba(250, 115, 40, 0.15)',
    position: 'bottom-2',
    triggerRange: [0.75, 0.98],
  },
];

const HEADLINE_LETTERS = [
  'W', 'E', 'L', 'C', 'O', 'M', 'E', ' ', 'I', 'T', 'Z', 'F', 'I', 'Z', 'Z'
];

export const RealisticCarTrack: React.FC<RealisticCarTrackProps> = ({
  telemetry,
  playKey,
  roadTheme,
}) => {
  const roadRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { progress, velocityKmh, isScrolling } = telemetry;

  const [roadWidth, setRoadWidth] = useState<number>(1200);

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

  // Car geometry
  const carWidth = Math.min(260, Math.max(160, roadWidth * 0.18));
  const carHeight = carWidth * 0.48; // McLaren 720S aspect ratio ~2.1 : 1
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
      // Headlights project ~80px ahead of the car nose
      return (carNoseX + 60) >= relativeSpanLeft;
    });

    setLitLetters(newLit);
  }, [carNoseX, roadWidth, progress]);

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center select-none overflow-hidden">
      {/* 1. Atmospheric Ambient Ground / Asphalt Horizon */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={highwayAerialImg}
          alt="Aerial Raceway"
          className="w-full h-full object-cover opacity-25 filter blur-[1px] brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/70 to-neutral-950" />
      </div>

      {/* 2. Stat Boxes Pinned Around the Track (Reference Layout) */}
      <div className="absolute inset-x-0 inset-y-4 max-w-7xl mx-auto pointer-events-none z-20 flex flex-col justify-between py-6 px-4 md:px-12">
        {/* Top Tier Stat Boxes */}
        <div className="flex justify-between items-start gap-4">
          {/* Box 1 (Top Left/Center) */}
          <div
            className={`transition-all duration-500 transform ${
              progress >= STAT_BOXES[0].triggerRange[0]
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95'
            }`}
            style={{ width: '280px' }}
          >
            <div
              className="p-5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border shadow-2xl transition-all"
              style={{
                borderColor: STAT_BOXES[0].borderColor,
                boxShadow: `0 10px 30px -5px ${STAT_BOXES[0].glowColor}`,
              }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display font-extrabold text-4xl sm:text-5xl tabular-nums tracking-tight"
                  style={{ color: STAT_BOXES[0].color }}
                >
                  {STAT_BOXES[0].num}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">METRIC 01</span>
              </div>
              <div className="font-semibold text-white text-sm mt-1.5 leading-snug">
                {STAT_BOXES[0].label}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-light leading-relaxed">
                {STAT_BOXES[0].sub}
              </div>
            </div>
          </div>

          {/* Box 3 (Top Right/Center) */}
          <div
            className={`transition-all duration-500 transform ${
              progress >= STAT_BOXES[2].triggerRange[0]
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95'
            }`}
            style={{ width: '280px' }}
          >
            <div
              className="p-5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border shadow-2xl transition-all"
              style={{
                borderColor: STAT_BOXES[2].borderColor,
                boxShadow: `0 10px 30px -5px ${STAT_BOXES[2].glowColor}`,
              }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display font-extrabold text-4xl sm:text-5xl tabular-nums tracking-tight"
                  style={{ color: STAT_BOXES[2].color }}
                >
                  {STAT_BOXES[2].num}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">METRIC 03</span>
              </div>
              <div className="font-semibold text-white text-sm mt-1.5 leading-snug">
                {STAT_BOXES[2].label}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-light leading-relaxed">
                {STAT_BOXES[2].sub}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier Stat Boxes */}
        <div className="flex justify-between items-end gap-4 mb-20 md:mb-16">
          {/* Box 2 (Bottom Left/Center) */}
          <div
            className={`transition-all duration-500 transform ${
              progress >= STAT_BOXES[1].triggerRange[0]
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95'
            }`}
            style={{ width: '280px', marginLeft: '6%' }}
          >
            <div
              className="p-5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border shadow-2xl transition-all"
              style={{
                borderColor: STAT_BOXES[1].borderColor,
                boxShadow: `0 10px 30px -5px ${STAT_BOXES[1].glowColor}`,
              }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display font-extrabold text-4xl sm:text-5xl tabular-nums tracking-tight"
                  style={{ color: STAT_BOXES[1].color }}
                >
                  {STAT_BOXES[1].num}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">METRIC 02</span>
              </div>
              <div className="font-semibold text-white text-sm mt-1.5 leading-snug">
                {STAT_BOXES[1].label}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-light leading-relaxed">
                {STAT_BOXES[1].sub}
              </div>
            </div>
          </div>

          {/* Box 4 (Bottom Right/Center) */}
          <div
            className={`transition-all duration-500 transform ${
              progress >= STAT_BOXES[3].triggerRange[0]
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95'
            }`}
            style={{ width: '280px', marginRight: '6%' }}
          >
            <div
              className="p-5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border shadow-2xl transition-all"
              style={{
                borderColor: STAT_BOXES[3].borderColor,
                boxShadow: `0 10px 30px -5px ${STAT_BOXES[3].glowColor}`,
              }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display font-extrabold text-4xl sm:text-5xl tabular-nums tracking-tight"
                  style={{ color: STAT_BOXES[3].color }}
                >
                  {STAT_BOXES[3].num}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">METRIC 04</span>
              </div>
              <div className="font-semibold text-white text-sm mt-1.5 leading-snug">
                {STAT_BOXES[3].label}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-light leading-relaxed">
                {STAT_BOXES[3].sub}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Central Photorealistic Asphalt Highway Roadway */}
      <div
        ref={roadRef}
        className="relative w-full h-[240px] sm:h-[280px] md:h-[320px] shadow-2xl overflow-hidden border-y border-neutral-800"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0,0,0,0.8) inset',
        }}
      >
        {/* Realistic Asphalt Texture Canvas */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.55] contrast-[1.25]"
          style={{
            backgroundImage: `url(${asphaltImg})`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: `${-progress * 300}px center`,
          }}
        />

        {/* Ambient Dark Overlay with Specular sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

        {/* Top & Bottom FIA Racetrack Rumble Strip Curbs (Red & White alternating) */}
        <div
          className="absolute top-0 inset-x-0 h-3 md:h-4 border-b border-black/40 shadow-sm"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #dc2626, #dc2626 24px, #f8fafc 24px, #f8fafc 48px)',
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-3 md:h-4 border-t border-black/40 shadow-sm"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #dc2626, #dc2626 24px, #f8fafc 24px, #f8fafc 48px)',
          }}
        />

        {/* Yellow & White Road Lane Stripes */}
        <div className="absolute top-6 inset-x-0 h-0.5 bg-yellow-500/40" />
        <div className="absolute bottom-6 inset-x-0 h-0.5 bg-yellow-500/40" />

        {/* Dashed Center Dividing Lines with Perspective Motion */}
        <div
          className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-1.5 opacity-60"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 40px, transparent 40px, transparent 80px)',
            backgroundPosition: `${-progress * 400}px 0`,
          }}
        />

        {/* Pre-existing Rubber Skid Marks on Pavement for high realism */}
        <div
          className="absolute top-[38%] inset-x-0 h-2 bg-black/40 blur-[1px] transform -rotate-1 pointer-events-none opacity-50"
          style={{ width: '120%' }}
        />
        <div
          className="absolute top-[62%] inset-x-0 h-2 bg-black/40 blur-[1px] transform rotate-1 pointer-events-none opacity-50"
          style={{ width: '120%' }}
        />

        {/* 4. Realistic Dynamic Trail Behind the Car */}
        <div
          className="absolute top-0 left-0 bottom-0 pointer-events-none z-10 transition-all duration-75 overflow-hidden"
          style={{ width: `${Math.max(0, carCurrentX + 30)}px` }}
        >
          {/* Neon Telemetry Energy Ribbon (from the reference) with high realism gradient */}
          <div
            className="w-full h-full opacity-60"
            style={{
              background: 'linear-gradient(90deg, rgba(69, 219, 125, 0.05) 0%, rgba(69, 219, 125, 0.25) 70%, rgba(69, 219, 125, 0.6) 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 15%, black 40%, black 60%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 15%, black 40%, black 60%, transparent 85%)',
            }}
          />

          {/* Dual Hot Rubber Skid Trails left by tires */}
          <div className="absolute top-[30%] inset-x-0 h-2 bg-black/80 blur-[0.5px]" />
          <div className="absolute bottom-[30%] inset-x-0 h-2 bg-black/80 blur-[0.5px]" />

          {/* High-speed Particle Streamlines */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #45db7d 0px, #45db7d 15px, transparent 15px, transparent 45px)',
              backgroundPosition: `${-progress * 800}px 0`,
            }}
          />
        </div>

        {/* 5. Embedded Asphalt Typography: "W E L C O M E   I T Z F I Z Z" */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-15 flex items-center justify-center pointer-events-none px-6 md:px-16"
        >
          <div className="w-full flex items-center justify-between max-w-5xl">
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
                    className="w-6 md:w-12 inline-block"
                  />
                );
              }

              return (
                <span
                  key={`char-${i}`}
                  ref={(el) => {
                    letterRefs.current[i] = el;
                  }}
                  className={`font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight transition-all duration-300 transform select-none ${
                    isLit
                      ? 'text-white scale-100 opacity-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.85)]'
                      : 'text-neutral-700/40 scale-95 opacity-20'
                  }`}
                  style={{
                    textShadow: isLit
                      ? '0 0 25px rgba(255,255,255,0.9), 0 0 50px rgba(69,219,125,0.5)'
                      : 'none',
                    transform: isLit ? 'translateY(0px)' : 'translateY(2px)',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* 6. The High-Performance Supercar Entity (McLaren 720S Top-View) */}
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
          {/* Dual Volumetric Headlight Beams projecting forward onto the asphalt */}
          <div
            className="absolute -right-48 md:-right-72 top-[-30%] w-56 md:w-80 h-[160%] pointer-events-none z-10 mix-blend-screen transition-opacity duration-200"
            style={{
              background: 'radial-gradient(ellipse at 0% 50%, rgba(255,255,240,0.85) 0%, rgba(255,245,210,0.4) 40%, rgba(69,219,125,0.15) 70%, transparent 95%)',
              clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
              opacity: 0.8 + Math.min(0.2, speedRatio * 0.4),
            }}
          />

          {/* Under-Chassis Contact Ground Shadow */}
          <div
            className="absolute inset-1 bg-black/95 rounded-[30%] blur-md transform scale-105 pointer-events-none"
            style={{
              boxShadow: '0 0 25px 15px rgba(0,0,0,0.9)',
            }}
          />

          {/* Ambient Taillight Laser Red Glow at the rear */}
          <div
            className="absolute -left-6 top-[25%] w-10 h-[50%] bg-red-600/80 rounded-full blur-md pointer-events-none"
            style={{
              opacity: 0.6 + (isScrolling ? 0.35 : 0.1),
            }}
          />

          {/* The Authentic Transparent McLaren 720S Asset */}
          <img
            src={mclarenImg}
            alt="McLaren 720S Top View"
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] brightness-105 contrast-110"
          />

          {/* Dynamic Cockpit & Aero Gloss Sweep while scrolling */}
          <div
            className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-150"
            style={{
              background: `linear-gradient(90deg, transparent ${(progress * 140 - 20)}%, rgba(255,255,255,0.6) ${(progress * 140)}%, transparent ${(progress * 140 + 20)}%)`,
              opacity: isScrolling ? 0.8 : 0.2,
            }}
          />
        </div>
      </div>

      {/* 7. Live Road Telemetry Bar Beneath the Track */}
      <div className="w-full max-w-5xl mx-auto px-6 mt-6 flex items-center justify-between text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white font-semibold">TRACK VELOCITY:</span>
          <span className="text-emerald-400 font-bold tabular-nums text-sm">
            {Math.round(velocityKmh)} km/h
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span>POSITION: <strong className="text-white">{Math.round(progress * 100)}%</strong></span>
          <span aria-hidden="true">·</span>
          <span>FRICTION COEFFICIENT: <strong className="text-amber-400">0.89 μ</strong></span>
          <span aria-hidden="true">·</span>
          <span>AERO DOWNFORCE: <strong className="text-cyan-400">{Math.round(telemetry.downforceKg)} kg</strong></span>
        </div>

        <div className="text-[11px] text-neutral-500">
          MCLAREN 720S TWIN-TURBO V8
        </div>
      </div>
    </div>
  );
};
