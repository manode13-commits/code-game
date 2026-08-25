// Web Audio API sound synthesizer for responsive, latency-free game feedback

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playMove() {
    this.playStep(true);
  }

  public playError() {
    this.playStep(false);
  }

  public playBump() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      // Low punchy collision thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
    } catch {}
  }

  public playStep(isCorrect: boolean = true) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (isCorrect) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + (isCorrect ? 0.09 : 0.16));
    } catch {
      // AudioContext might be blocked before first user gesture
    }
  }

  public playLevelSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.22);
      });
    } catch {}
  }

  public playCombo(comboCount: number) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const baseFreq = 440;
      const freq = Math.min(baseFreq * Math.pow(1.08, comboCount), 1200);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {}
  }

  public playTick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  // GRAND CHAMPION VICTORY FANFARE (เล่นครบ 20 ด่าน - เสียงแตรชัยชนะดังกระหึ่มสุดอลังการ)
  public playGrandVictoryFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Stage 1: Fast ascending royal trumpet arpeggio
      const introNotes = [
        { freq: 523.25, time: 0.00, dur: 0.12 }, // C5
        { freq: 659.25, time: 0.12, dur: 0.12 }, // E5
        { freq: 783.99, time: 0.24, dur: 0.12 }, // G5
        { freq: 1046.5, time: 0.36, dur: 0.22 }, // C6
        { freq: 783.99, time: 0.58, dur: 0.12 }, // G5
        { freq: 1046.5, time: 0.70, dur: 0.45 }, // C6 (accent)
      ];

      introNotes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.28, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur + 0.02);
      });

      // Stage 2: Grand Sustained Royal Chord + Bass Boom at 1.15s
      const grandChord = [
        { freq: 130.81, type: 'triangle' as OscillatorType, vol: 0.35 }, // C3 Deep Bass
        { freq: 261.63, type: 'triangle' as OscillatorType, vol: 0.30 }, // C4
        { freq: 523.25, type: 'sawtooth' as OscillatorType, vol: 0.25 }, // C5 Trumpet
        { freq: 659.25, type: 'sawtooth' as OscillatorType, vol: 0.25 }, // E5
        { freq: 783.99, type: 'sawtooth' as OscillatorType, vol: 0.28 }, // G5
        { freq: 1046.5, type: 'sine' as OscillatorType, vol: 0.35 },     // C6
        { freq: 1318.5, type: 'sine' as OscillatorType, vol: 0.25 },     // E6 High Shine
      ];

      grandChord.forEach(({ freq, type, vol }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + 1.15);

        gain.gain.setValueAtTime(0.01, now + 1.15);
        gain.gain.exponentialRampToValueAtTime(vol, now + 1.20);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.80);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + 1.15);
        osc.stop(now + 2.85);
      });

      // Stage 3: Celebration Sparkle Cascade (Chimes from 1.3s to 2.4s)
      const sparkleFreqs = [1567.98, 1760.00, 2093.00, 2349.32, 2637.02, 3135.96];
      sparkleFreqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const chimeTime = now + 1.3 + i * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chimeTime);

        gain.gain.setValueAtTime(0.18, chimeTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chimeTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(chimeTime);
        osc.stop(chimeTime + 0.38);
      });
    } catch {}
  }

  public playFanfare() {
    this.playGrandVictoryFanfare();
  }
}

export const sound = new SoundEffects();
