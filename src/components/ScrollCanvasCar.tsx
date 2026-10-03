import React, { useRef } from 'react';
import heroCarImg from '../assets/images/hero_hypercar_profile_1791029082806.jpg';
import trackBgImg from '../assets/images/track_highway_dark_1791029096239.jpg';
import { TelemetryState } from '../types';

interface ScrollCanvasCarProps {
  telemetry: TelemetryState;
  perspectiveMode: 'cinematic' | 'low-angle' | 'top-track';
}

export const ScrollCanvasCar: React.FC<ScrollCanvasCarProps> = ({
  telemetry,
  perspectiveMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, velocityKmh, downforceKg, isScrolling } = telemetry;

  // Transform calculation based on scroll progress:
  // Progress 0.0 -> 0.20: Stage 0 - Hero idle with subtle breathing
  // Progress 0.20 -> 0.45: Stage 1 - Launch acceleration (moves forward, tilts backward under torque, scale increases)
  // Progress 0.45 -> 0.70: Stage 2 - Aerodynamic cornering (lateral shift, banking angle, wind vortex active)
  // Progress 0.70 -> 0.90: Stage 3 - Straightaway high speed (streamlines intense, ground perspective rushing)
  // Progress 0.90 -> 1.00: Stage 4 - Terminal deceleration into docked inspection position

  // Interpolated coordinates:
  let carX = 0; // px
  let carY = 0; // px
  let carScale = 1.0;
  let carRotateZ = 0; // deg (roll)
  let carRotateY = 0; // deg (yaw)
  let carPitch = 0; // deg (squat / dive)
  let backgroundOffset = 0; // %

  if (progress <= 0.25) {
    // Stage 0 -> 1
    const p = progress / 0.25;
    carX = p * -60; // slight center-left drift
    carY = p * 15;
    carScale = 1.0 + p * 0.12;
    carPitch = p * -2.5; // nose lifts on acceleration
    carRotateZ = p * -1.2;
    backgroundOffset = p * 15;
  } else if (progress <= 0.55) {
    // Stage 1 -> 2: Cornering & Aerodynamics
    const p = (progress - 0.25) / 0.3;
    carX = -60 + p * 140; // moves to right lane
    carY = 15 - p * 30; // raises into aerodynamic plane
    carScale = 1.12 - p * 0.08;
    carPitch = -2.5 + p * 3.5; // nose dips under downforce
    carRotateZ = -1.2 + p * 3.8; // banking roll into corner
    carRotateY = p * -6; // slight perspective angle
    backgroundOffset = 15 + p * 35;
  } else if (progress <= 0.82) {
    // Stage 2 -> 3: Full throttle high-speed straight
    const p = (progress - 0.55) / 0.27;
    carX = 80 - p * 80; // centers dynamically
    carY = -15 + p * 20;
    carScale = 1.04 + p * 0.14;
    carPitch = 1.0 - p * 1.5;
    carRotateZ = 2.6 - p * 2.8;
    carRotateY = -6 + p * 6;
    backgroundOffset = 50 + p * 35;
  } else {
    // Stage 3 -> 4: Precision docking & specs reveal
    const p = (progress - 0.82) / 0.18;
    carX = p * 10;
    carY = 5 + p * 15;
    carScale = 1.18 - p * 0.18;
    carPitch = -0.5 + p * 0.5;
    carRotateZ = -0.2 + p * 0.2;
    backgroundOffset = 85 + p * 15;
  }

  // Perspective mode modifier
  if (perspectiveMode === 'low-angle') {
    carY += 40;
    carScale *= 1.08;
  } else if (perspectiveMode === 'top-track') {
    carPitch += 8;
    carScale *= 0.92;
  }

  // Wind speed streaks intensity based on velocity
  const windVortexOpacity = Math.min(1, Math.max(0, (velocityKmh - 60) / 220));
  const headlightBeamOpacity = 0.4 + Math.min(0.6, progress * 0.8);
  const roadLinesSpeed = progress * 600;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden pointer-events-none select-none"
    >
      {/* 1. Cinematic Background Runway & Horizon */}
      <div className="absolute inset-0 z-0">
        <img
          src={trackBgImg}
          alt="Night Track Horizon"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.15] scale-105"
          style={{
            transform: `translate3d(0, ${progress * -40}px, 0) scale(${1.05 + progress * 0.08})`,
            transition: 'transform 0.1s linear',
          }}
        />

        {/* Dynamic perspective speed grid */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 opacity-30 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(245, 158, 11, 0.18) 0%, transparent 60%), repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,255,255,0.06) 120px, rgba(255,255,255,0.06) 122px)`,
            transform: `perspective(600px) rotateX(65deg) translateY(${roadLinesSpeed % 100}px)`,
          }}
        />

        {/* Ambient Radial Vignette for dramatic contrast scrim */}
        <div className="absolute inset-0 radial-vignette pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/80 pointer-events-none" />
      </div>

      {/* 2. Interactive Hotspot Callout along the Car at key stages */}
      {progress > 0.22 && progress < 0.52 && (
        <div className="absolute top-[28%] left-[18%] md:left-[28%] z-30 pointer-events-auto transition-opacity duration-300">
          <div className="flex items-center gap-3 bg-neutral-950/80 backdrop-blur-md border border-amber-500/30 px-3.5 py-2 rounded-lg shadow-xl">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                ACTIVE TORQUE VECTORING
              </div>
              <div className="text-xs text-neutral-200 font-sans">
                Quad-Inverter 1,280 kW Direct Drive
              </div>
            </div>
          </div>
        </div>
      )}

      {progress >= 0.52 && progress < 0.85 && (
        <div className="absolute top-[24%] right-[14%] md:right-[24%] z-30 pointer-events-auto transition-opacity duration-300">
          <div className="flex items-center gap-3 bg-neutral-950/80 backdrop-blur-md border border-cyan-500/30 px-3.5 py-2 rounded-lg shadow-xl">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                VENTURI GROUND SUCTION
              </div>
              <div className="text-xs text-neutral-200 font-sans">
                {Math.round(downforceKg)} kg Downforce at Apex
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. The Central Car Entity Container */}
      <div
        className="relative z-10 w-full max-w-5xl px-4 flex items-center justify-center will-change-transform"
        style={{
          transform: `perspective(1200px) translate3d(${carX}px, ${carY}px, 0px) scale(${carScale}) rotateX(${carPitch}deg) rotateY(${carRotateY}deg) rotateZ(${carRotateZ}deg)`,
          transition: 'transform 0.05s ease-out',
        }}
      >
        {/* Soft Dynamic Under-Chassis Ground Shadow */}
        <div
          className="absolute -bottom-6 md:-bottom-10 w-[85%] h-14 md:h-20 bg-black/90 rounded-[100%] blur-xl transform scale-x-110 pointer-events-none"
          style={{
            opacity: 0.85 - progress * 0.15,
            transform: `scaleX(${1.05 + progress * 0.1}) scaleY(${0.9 - Math.abs(carPitch) * 0.04})`,
          }}
        />

        {/* Ambient Ground Underglow */}
        <div
          className="absolute -bottom-4 md:-bottom-8 w-[75%] h-12 rounded-[100%] blur-2xl pointer-events-none transition-all duration-300"
          style={{
            background: progress > 0.5 ? 'rgba(6, 182, 212, 0.25)' : 'rgba(245, 158, 11, 0.22)',
            opacity: 0.3 + (velocityKmh / 400) * 0.5,
          }}
        />

        {/* Dynamic Headlight Projection Cones */}
        <div
          className="absolute -left-16 md:-left-32 top-[45%] w-72 md:w-96 h-28 pointer-events-none mix-blend-screen transition-opacity duration-300"
          style={{
            background: 'linear-gradient(260deg, rgba(255,255,255,0.7) 0%, rgba(245, 158, 11, 0.35) 40%, transparent 80%)',
            clipPath: 'polygon(100% 40%, 100% 60%, 0% 100%, 0% 0%)',
            opacity: headlightBeamOpacity,
            transform: `rotate(${carPitch * 0.8}deg)`,
          }}
        />

        {/* Aerodynamic Wind Tunnel Streamlines SVG Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          style={{ opacity: windVortexOpacity }}
        >
          <defs>
            <linearGradient id="streamlineGrad" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Roof Streamline */}
          <path
            d="M 950 180 C 720 160, 480 150, 80 170"
            fill="none"
            stroke="url(#streamlineGrad)"
            strokeWidth="2.5"
            strokeDasharray="40 18"
            strokeDashoffset={-progress * 1200}
            className="transition-all"
          />
          {/* Hood Streamline */}
          <path
            d="M 900 240 C 650 230, 420 220, 60 250"
            fill="none"
            stroke="url(#streamlineGrad)"
            strokeWidth="2"
            strokeDasharray="30 15"
            strokeDashoffset={-progress * 1600}
          />
          {/* Undercarriage Ground-Effect Streamline */}
          <path
            d="M 880 340 C 600 350, 350 350, 40 330"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeDasharray="20 10"
            strokeDashoffset={-progress * 2200}
            strokeOpacity="0.75"
          />
        </svg>

        {/* The Main High-Resolution Car Image Entity */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-neutral-950/40 backdrop-blur-[2px]">
          <img
            src={heroCarImg}
            alt="ItzFizz Aero Hypercar"
            className="w-full h-auto object-contain max-h-[62vh] select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
          />

          {/* Dynamic gloss flare running across the car on scroll velocity */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-150"
            style={{
              background: `linear-gradient(105deg, transparent ${(progress * 130 - 30)}%, rgba(255,255,255,0.45) ${(progress * 130)}%, transparent ${(progress * 130 + 30)}%)`,
              opacity: isScrolling ? 0.9 : 0.2,
            }}
          />
        </div>
      </div>
    </div>
  );
};
