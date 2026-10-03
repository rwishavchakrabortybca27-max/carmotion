import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ImpactMetric } from '../types';

interface HeroMetricsProps {
  playKey: number;
  scrollProgress: number;
}

const METRICS_DATA: ImpactMetric[] = [
  {
    id: 'aero-efficiency',
    value: 99.4,
    suffix: '%',
    decimals: 1,
    label: 'Aero Downforce Efficiency',
    description: 'Active venturi tunnel & dual wing ground suction',
  },
  {
    id: 'launch-acceleration',
    value: 1.85,
    suffix: 's',
    decimals: 2,
    label: '0 to 100 km/h Launch',
    description: 'Instant torque vectoring across four inverters',
  },
  {
    id: 'top-velocity',
    value: 412,
    suffix: ' km/h',
    decimals: 0,
    label: 'Terminal Track Speed',
    description: 'Autonomous drag reduction system enabled',
  },
  {
    id: 'battery-efficiency',
    value: 98.2,
    suffix: '%',
    decimals: 1,
    label: 'Regenerative Recovery',
    description: 'Carbon-ceramic dynamic energy harvesting',
  },
];

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ playKey, scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.metric-col');

      // Reset
      setCounts([0, 0, 0, 0]);
      gsap.set(cards || [], { opacity: 0, y: 35 });

      // Staggered card entrance with subtle delay after headline
      gsap.to(cards || [], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.65, // Starts just as headline completes
        ease: 'power3.out',
      });

      // Animate numerical counters
      const tracker = { v0: 0, v1: 0, v2: 0, v3: 0 };
      gsap.to(tracker, {
        v0: METRICS_DATA[0].value,
        v1: METRICS_DATA[1].value,
        v2: METRICS_DATA[2].value,
        v3: METRICS_DATA[3].value,
        duration: 1.8,
        delay: 0.75,
        ease: 'power2.out',
        onUpdate: () => {
          setCounts([tracker.v0, tracker.v1, tracker.v2, tracker.v3]);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [playKey]);

  // Fade out as scroll reaches deeper stages so car visual takes full stage
  const metricsOpacity = Math.max(0, 1 - scrollProgress * 5);
  const metricsTranslateY = -scrollProgress * 80;

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate3d(0, ${metricsTranslateY}px, 0)`,
        opacity: metricsOpacity,
        pointerEvents: metricsOpacity < 0.1 ? 'none' : 'auto',
      }}
      className="w-full max-w-5xl mx-auto px-4 mt-6 md:mt-10 will-change-transform"
    >
      {/* Clean hairline border grid, zero pills, unboxed typography */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-6 border-t border-white/10">
        {METRICS_DATA.map((metric, idx) => (
          <div
            key={metric.id}
            className="metric-col flex flex-col items-center md:items-start text-center md:text-left group"
          >
            {/* Value with Tabular Numerals */}
            <div className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight tabular-nums flex items-baseline">
              <span>
                {counts[idx].toFixed(metric.decimals ?? 0)}
              </span>
              <span className="text-amber-400 text-lg sm:text-xl font-normal ml-0.5">
                {metric.suffix}
              </span>
            </div>

            {/* Label */}
            <div className="text-xs sm:text-sm font-semibold text-neutral-200 mt-1 uppercase tracking-wider">
              {metric.label}
            </div>

            {/* Quiet context description without pills */}
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 font-light leading-relaxed max-w-[200px]">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
