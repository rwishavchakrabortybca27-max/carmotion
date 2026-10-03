/**
 * Procedural Web Audio synthesizer for electric hypercar motor hum & acceleration.
 * Pure Web Audio API: 100% self-contained, no external mp3 assets needed.
 */
class HypercarAudioEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isEnabled: boolean = false;
  private isInitialized: boolean = false;

  private init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

      // Low pass filter
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(4, this.ctx.currentTime);

      // Dual oscillator for rich electric hypercar turbine texture
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(45, this.ctx.currentTime);

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(90, this.ctx.currentTime);

      this.osc1.connect(this.filterNode);
      this.osc2.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
      this.isInitialized = true;
    } catch {
      // AudioContext not allowed or not supported
    }
  }

  public toggle(): boolean {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isEnabled = !this.isEnabled;
    if (this.gainNode) {
      const targetGain = this.isEnabled ? 0.08 : 0;
      this.gainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }
    return this.isEnabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public updateScrollDynamics(speed: number, progress: number) {
    if (!this.ctx || !this.gainNode || !this.isEnabled) return;

    const baseFreq = 42 + progress * 80;
    const scrollBoost = Math.min(speed * 12, 180);
    const targetFreq = baseFreq + scrollBoost;

    if (this.osc1 && this.osc2 && this.filterNode) {
      this.osc1.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
      this.osc2.frequency.setTargetAtTime(targetFreq * 2.01, this.ctx.currentTime, 0.08);
      this.filterNode.frequency.setTargetAtTime(250 + targetFreq * 4.5, this.ctx.currentTime, 0.08);
    }

    // Dynamic volume bump during active scrolling
    const activeVol = 0.06 + Math.min(speed * 0.005, 0.09);
    this.gainNode.gain.setTargetAtTime(activeVol, this.ctx.currentTime, 0.1);
  }
}

export const hypercarAudio = new HypercarAudioEngine();
