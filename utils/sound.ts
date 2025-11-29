
// Sound Engine using Web Audio API
// Generates Sci-Fi and Mechanical sounds procedurally

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Context is initialized on first user interaction
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3; // Default volume
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
    return this.isMuted;
  }

  // --- ASSEMBLY SOUNDS ---

  playMetalImpact() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    // Use 0.001 instead of 0 or 0.01 to be extra safe against RangeError
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playRatchet() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    for(let i=0; i<5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.1, t + i*0.05);
        gain.gain.linearRampToValueAtTime(0, t + i*0.05 + 0.03); // Linear ramp to 0 is fine
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + i*0.05);
        osc.stop(t + i*0.05 + 0.04);
    }
  }

  playHydraulic() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  // --- UI SOUNDS ---

  playHover() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playClick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    // Mechanical click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    // Use 0.001 to avoid RangeError
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSuccess() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(554.37, this.ctx.currentTime + 0.1); // C#
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playError() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playScan() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // REALISTIC DIESEL ENGINE START
  playBoot() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    // Safety check to prevent errors if context is weird
    const MIN_VAL = 0.001;

    // 1. STARTER MOTOR (Cranking)
    const crankCount = 6;
    const crankDuration = 0.18;
    
    for (let i = 0; i < crankCount; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, t + i * crankDuration);
        osc.frequency.linearRampToValueAtTime(50, t + i * crankDuration + 0.1);

        filter.type = 'lowpass';
        filter.frequency.value = 400;

        gain.gain.setValueAtTime(0, t + i * crankDuration);
        gain.gain.linearRampToValueAtTime(0.4, t + i * crankDuration + 0.05);
        gain.gain.linearRampToValueAtTime(0, t + i * crankDuration + crankDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + i * crankDuration);
        osc.stop(t + i * crankDuration + crankDuration);
    }

    // 2. IGNITION (Explosion)
    const ignitionTime = t + (crankCount * crankDuration);
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    
    boomOsc.type = 'square';
    boomOsc.frequency.setValueAtTime(40, ignitionTime);
    boomOsc.frequency.exponentialRampToValueAtTime(10, ignitionTime + 0.5);
    
    boomGain.gain.setValueAtTime(0.6, ignitionTime);
    // Fixed: Use MIN_VAL instead of 0 to prevent RangeError
    boomGain.gain.exponentialRampToValueAtTime(MIN_VAL, ignitionTime + 1.0);
    
    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);
    boomOsc.start(ignitionTime);
    boomOsc.stop(ignitionTime + 1.0);

    // 3. IDLE RUMBLE (Continuous)
    const idleOsc = this.ctx.createOscillator();
    const idleGain = this.ctx.createGain();
    idleOsc.type = 'sawtooth';
    idleOsc.frequency.setValueAtTime(15, ignitionTime + 0.2);
    idleOsc.frequency.linearRampToValueAtTime(25, ignitionTime + 2.0);
    
    idleGain.gain.setValueAtTime(0, ignitionTime);
    idleGain.gain.linearRampToValueAtTime(0.3, ignitionTime + 0.5);
    
    idleOsc.connect(idleGain);
    idleGain.connect(this.masterGain);
    idleOsc.start(ignitionTime);
    // Let it rumble for a few seconds then fade
    idleGain.gain.linearRampToValueAtTime(0, ignitionTime + 4.0);
    idleOsc.stop(ignitionTime + 4.0);
  }
}

export const soundEngine = new SoundEngine();
