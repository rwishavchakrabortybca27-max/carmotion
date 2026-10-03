export interface ImpactMetric {
  id: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  description: string;
}

export interface ScrollStage {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  scrollRange: [number, number]; // [start %, end %]
  speedKmh: number;
  downforceKg: number;
  gear: string;
}

export interface TelemetryState {
  progress: number; // 0 to 1
  velocityKmh: number;
  downforceKg: number;
  gForce: number;
  yawDeg: number;
  activeStage: number;
  isScrolling: boolean;
}
