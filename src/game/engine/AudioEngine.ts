import { GameSettings } from '../types/game';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private musicPlaying: boolean = false;
  private musicInterval: number | null = null;
  private musicStep: number = 0;

  constructor() {
    // Lazy initialize on first user interaction
  }

  public init(settings: GameSettings) {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.applySettings(settings);
    } catch {
      // Audio context might fail or be blocked until user gesture
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public applySettings(settings: GameSettings) {
    this.isMuted = settings.muted;
    if (!this.ctx || !this.masterGain || !this.sfxGain || !this.musicGain) return;

    const masterVol = this.isMuted ? 0 : settings.masterVolume;
    this.masterGain.gain.setValueAtTime(masterVol, this.ctx.currentTime);
    this.sfxGain.gain.setValueAtTime(settings.sfxVolume * 0.4, this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(settings.musicVolume * 0.25, this.ctx.currentTime);
  }

  // SFX: Player Laser Shoot
  public playPlayerShoot(isMultiShot: boolean = false) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isMultiShot ? 'sawtooth' : 'triangle';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(isMultiShot ? 980 : 880, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // SFX: Enemy Laser Shoot
  public playEnemyShoot() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // SFX: Laser / Impact Hit
  public playHit() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // SFX: Explosions
  public playExplosion(isLarge: boolean = false) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.resume();

    const now = this.ctx.currentTime;
    const duration = isLarge ? 0.8 : 0.35;

    // Synthesize noise buffer for explosion
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to give deep rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLarge ? 450 : 320, now);
    filter.frequency.exponentialRampToValueAtTime(30, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isLarge ? 0.6 : 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // SFX: Power-Up Pickup
  public playPowerUp() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.resume();

    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  // SFX: Boss Siren / Warning
  public playBossAlarm() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.resume();

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.35;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(360, startTime);
      osc.frequency.linearRampToValueAtTime(180, startTime + 0.28);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.linearRampToValueAtTime(0.01, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    }
  }

  // SFX: Shield Deflect
  public playShieldHit() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Procedural Background Cyberpunk Synth Music
  public startMusic() {
    if (this.musicPlaying || !this.ctx) return;
    this.musicPlaying = true;
    this.musicStep = 0;

    // Cyberpunk bassline notes (Hz)
    const bassline = [
      110.00, 110.00, 130.81, 110.00, // A2, A2, C3, A2
      98.00,  98.00,  123.47, 98.00,  // G2, G2, B2, G2
      87.31,  87.31,  110.00, 87.31,  // F2, F2, A2, F2
      98.00,  110.00, 123.47, 130.81  // G2, A2, B2, C3
    ];

    const leadNotes = [
      440, 0, 523.25, 0, 659.25, 587.33, 523.25, 0,
      392, 0, 493.88, 0, 587.33, 523.25, 493.88, 0
    ];

    const stepDuration = 180; // ms per 16th beat (~166 BPM)

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || !this.musicPlaying || this.isMuted) return;
      this.resume();

      const now = this.ctx.currentTime;
      const bassFreq = bassline[this.musicStep % bassline.length];
      const leadFreq = leadNotes[this.musicStep % leadNotes.length];

      // Bass synth note
      if (bassFreq > 0) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassFreq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + 0.14);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + 0.14);
      }

      // Lead melodic note (accented)
      if (leadFreq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(leadFreq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + 0.12);
      }

      this.musicStep++;
    }, stepDuration);
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public destroy() {
    this.stopMusic();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const audioEngine = new AudioEngine();
