import React from 'react';
import { ArrowRight, CheckCircle2, Sliders, Shield, Zap, Wind, Cpu } from 'lucide-react';
import aeroChassisImg from '../assets/images/aerodynamic_chassis_1791029108996.jpg';

interface FeatureDeepDivesProps {
  onSelectSpec: (specName: string) => void;
}

export const FeatureDeepDives: React.FC<FeatureDeepDivesProps> = ({ onSelectSpec }) => {
  return (
    <div className="relative z-20 bg-neutral-950 text-neutral-100 border-t border-white/10">
      {/* 01. Dynamic Launch Velocity Section */}
      <section id="stage-velocity" className="py-24 md:py-32 border-b border-white/10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              {/* Clean unboxed metadata separator */}
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>01. VELOCITY</span>
                <span aria-hidden="true">·</span>
                <span>LAUNCH DYNAMICS</span>
                <span aria-hidden="true">·</span>
                <span>TORQUE PRE-LOAD</span>
              </div>

              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Sub-2 Second Acceleration with Zero Wheelspin.
              </h2>

              <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-light">
                Each wheel is driven by a bespoke silicon-carbide inverter operating at 24,000 RPM. Millisecond-level traction feedback samples surface friction 2,000 times per second to maximize launch grip without pre-heating rubber.
              </p>

              {/* Quantified proof metrics */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-white tabular-nums">
                    1.85<span className="text-amber-400 text-lg">s</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">0–100 km/h Launch Time</div>
                </div>
                <div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-white tabular-nums">
                    2.14<span className="text-amber-400 text-lg">G</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Peak Longitudinal G-Force</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectSpec('launch-dynamics')}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/15 rounded-lg text-xs font-semibold text-white tracking-wider uppercase transition-colors inline-flex items-center gap-2"
                >
                  <span>Inspect Launch Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Visual Proof / Telemetry matrix */}
            <div className="lg:col-span-7 bg-neutral-900/60 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Torque Distribution Matrix
                </span>
                <span className="text-xs font-mono text-emerald-400">OPTIMAL ADHESION</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950/80 p-4 rounded-xl border border-white/5 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">Front Left Motor</div>
                  <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">320 kW</div>
                  <div className="text-[11px] text-neutral-500">99.8% slip regulation</div>
                </div>
                <div className="bg-neutral-950/80 p-4 rounded-xl border border-white/5 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">Front Right Motor</div>
                  <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">320 kW</div>
                  <div className="text-[11px] text-neutral-500">99.8% slip regulation</div>
                </div>
                <div className="bg-neutral-950/80 p-4 rounded-xl border border-white/5 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">Rear Left Motor</div>
                  <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">320 kW</div>
                  <div className="text-[11px] text-neutral-500">Dual stator bias</div>
                </div>
                <div className="bg-neutral-950/80 p-4 rounded-xl border border-white/5 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">Rear Right Motor</div>
                  <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">320 kW</div>
                  <div className="text-[11px] text-neutral-500">Dual stator bias</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. Aerodynamics & Venturi Ground Effect */}
      <section id="stage-aerodynamics" className="py-24 md:py-32 border-b border-white/10 px-6 md:px-12 bg-neutral-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Aerodynamic visual asset */}
            <div className="lg:col-span-6 order-2 lg:order-1 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
              <img
                src={aeroChassisImg}
                alt="Active Aerodynamic Diffuser and Wing Assembly"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <div className="text-xs font-mono text-cyan-400">FIG. 02A · VENTURI TUNNEL CROSS-SECTION</div>
                  <div className="text-sm font-semibold text-white mt-1">Autonomous Active Diffuser with -32° Flap Actuation</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span>02. AERODYNAMICS</span>
                <span aria-hidden="true">·</span>
                <span>GROUND EFFECT</span>
                <span aria-hidden="true">·</span>
                <span>ACTIVE AERO</span>
              </div>

              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Harnessing Atmospheric Pressure into 860 kg Downforce.
              </h2>

              <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-light">
                Rather than using oversized drag-inducing wings, ItzFizz utilizes sculpted underbody venturi tunnels that channel airflow through twin variable-throat diffusers, pulling the chassis closer to the asphalt as velocity increases.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-white tabular-nums">
                    0.19<span className="text-cyan-400 text-lg">Cd</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Drag Coefficient (Straightaway)</div>
                </div>
                <div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-white tabular-nums">
                    860<span className="text-cyan-400 text-lg">kg</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Active Downforce at 280 km/h</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectSpec('aero-profile')}
                  className="px-5 py-2.5 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg text-xs font-semibold text-cyan-200 tracking-wider uppercase transition-colors inline-flex items-center gap-2"
                >
                  <span>View Wind Tunnel Mapping</span>
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. Quad-Vectoring Powertrain & Solid-State Architecture */}
      <section id="stage-powertrain" className="py-24 md:py-32 border-b border-white/10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3">
              <span>03. POWERTRAIN</span>
              <span aria-hidden="true">·</span>
              <span>SOLID-STATE CELL</span>
              <span aria-hidden="true">·</span>
              <span>900V PLATFORM</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Sustained High-Discharge Architecture.
            </h2>
            <p className="text-sm md:text-base text-neutral-400 mt-4 leading-relaxed font-light">
              Engineered with immersion-cooled solid-state battery modules capable of delivering 1,280 kW continuously across repeated 20-minute track hot laps without thermal throttling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <div className="text-lg font-semibold text-white">900V Ultra-Fast Architecture</div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Replenishes 10% to 80% state of charge in 9.5 minutes using liquid-cooled 450 kW CCS megawatt charging dispensers.
              </p>
              <div className="pt-2 text-xs font-mono text-neutral-300">
                CHARGE RATE: <span className="text-amber-400">38 km/min</span>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <div className="text-lg font-semibold text-white">Active Yaw Vectoring</div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Generates yaw rotation independently of steering wheel angle by applying opposing torque vectors to inner and outer wheel pairs.
              </p>
              <div className="pt-2 text-xs font-mono text-neutral-300">
                LATERAL RESPONSE: <span className="text-cyan-400">&lt; 3 ms</span>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div className="text-lg font-semibold text-white">Monocoque Carbon Safety Cell</div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                FIA Grade 1 certified autoclave prepreg carbon fiber chassis with integrated titanium rollover protection structure.
              </p>
              <div className="pt-2 text-xs font-mono text-neutral-300">
                TORSIONAL RIGIDITY: <span className="text-emerald-400">62,000 Nm/deg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. Technical Specifications Matrix */}
      <section id="stage-specs" className="py-24 md:py-32 px-6 md:px-12 bg-neutral-950/70">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                <span>04. SPECIFICATIONS</span>
                <span aria-hidden="true">·</span>
                <span>ENGINEERING BENCHMARK</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
                Technical Dossier & Capabilities
              </h2>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              CERTIFIED HOMOLOGATION 2026
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/40">
              <div className="text-[11px] font-mono text-neutral-400 uppercase">Total System Output</div>
              <div className="font-display text-3xl font-bold text-white mt-1 tabular-nums">1,720</div>
              <div className="text-xs text-amber-400 font-mono">BRAKE HORSEPOWER (BHP)</div>
              <div className="text-[11px] text-neutral-400 mt-2">Combined quad permanent-magnet motors</div>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/40">
              <div className="text-[11px] font-mono text-neutral-400 uppercase">Curb Weight</div>
              <div className="font-display text-3xl font-bold text-white mt-1 tabular-nums">1,640</div>
              <div className="text-xs text-amber-400 font-mono">KILOGRAMS (DRY)</div>
              <div className="text-[11px] text-neutral-400 mt-2">Dry carbon chassis & magnesium wheels</div>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/40">
              <div className="text-[11px] font-mono text-neutral-400 uppercase">Track Range</div>
              <div className="font-display text-3xl font-bold text-white mt-1 tabular-nums">640</div>
              <div className="text-xs text-amber-400 font-mono">KILOMETERS (WLTP)</div>
              <div className="text-[11px] text-neutral-400 mt-2">115 kWh solid-state immersion pack</div>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/40">
              <div className="text-[11px] font-mono text-neutral-400 uppercase">Braking Distance</div>
              <div className="font-display text-3xl font-bold text-white mt-1 tabular-nums">28.4</div>
              <div className="text-xs text-amber-400 font-mono">METERS (100–0 KM/H)</div>
              <div className="text-[11px] text-neutral-400 mt-2">420mm carbon-ceramic 10-piston calipers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
