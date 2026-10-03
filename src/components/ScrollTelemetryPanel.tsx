import React from 'react';
import { Gauge, Zap, Wind, Compass } from 'lucide-react';
import { TelemetryState } from '../types';

interface ScrollTelemetryPanelProps {
  telemetry: TelemetryState;
}

export const ScrollTelemetryPanel: React.FC<ScrollTelemetryPanelProps> = ({ telemetry }) => {
  const { progress, velocityKmh, downforceKg, gForce, yawDeg, activeStage } = telemetry;

  const modeLabels = ['RESTING IDLE', 'LAUNCH DYNAMICS', 'VENTURI GROUND EFFECT', 'QUAD-VECTORING', 'TERMINAL SPEC'];
  const currentMode = modeLabels[activeStage] || modeLabels[0];

  return (
    <div className="hidden md:flex flex-col gap-2 pointer-events-none select-none">
      {/* Telemetry HUD card adhering to single-elevation depth & tabular numbers */}
      <div className="bg-neutral-950/70 backdrop-blur-md border border-white/10 rounded-xl p-4 text-xs font-mono text-neutral-300 shadow-2xl w-64">
        {/* Drive Mode Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <span className="text-[10px] text-amber-400 tracking-widest uppercase font-bold">
            DRIVE MODE
          </span>
          <span className="text-[11px] text-white font-semibold tracking-wide">
            {currentMode}
          </span>
        </div>

        {/* Real-time stats */}
        <div className="space-y-2.5">
          {/* Velocity */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>Velocity</span>
            </span>
            <span className="text-white font-bold tabular-nums text-sm">
              {Math.round(velocityKmh)} <span className="text-[10px] text-neutral-400 font-normal">km/h</span>
            </span>
          </div>

          {/* Downforce */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Downforce</span>
            </span>
            <span className="text-white font-bold tabular-nums text-sm">
              {Math.round(downforceKg)} <span className="text-[10px] text-neutral-400 font-normal">kg</span>
            </span>
          </div>

          {/* Acceleration G-Force */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Longitudinal G</span>
            </span>
            <span className="text-white font-bold tabular-nums text-sm">
              {gForce.toFixed(2)} <span className="text-[10px] text-neutral-400 font-normal">G</span>
            </span>
          </div>

          {/* Yaw Angle */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chassis Yaw</span>
            </span>
            <span className="text-white font-bold tabular-nums text-sm">
              {yawDeg.toFixed(1)}°
            </span>
          </div>
        </div>

        {/* Mini progress track */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
            <span>Scroll Sync Progress</span>
            <span className="font-bold text-amber-400">{(progress * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-75"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
