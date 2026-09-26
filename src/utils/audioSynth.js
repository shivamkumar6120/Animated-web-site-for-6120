/**
 * CELESTIAL ROMANTIC AUDIO ENGINE (Web Audio API)
 * Optimized for Mobile (iOS Safari & Android Chrome) + Desktop
 */

class CelestialAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.masterGain = null;
    this.ambientInterval = null;
    this.customAudio = null;
    this.customAudioMode = false;
    this.analyser = null;
    this.dataArray = null;

    // F# Major / Eb minor romantic celestial chords (Hz)
    this.chords = [
      [185.00, 277.18, 329.63, 370.00, 440.00], // F#maj9
      [155.56, 233.08, 277.18, 311.13, 415.30], // D#m9
      [123.47, 185.00, 246.94, 277.18, 370.00], // Bmaj7
      [138.59, 207.65, 277.18, 311.13, 415.30]  // C#sus4
    ];
    this.currentChordIndex = 0;
  }

  init(customUrl = '') {
    if (this.ctx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Audio analyser for real-time visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.masterGain.connect(this.analyser);

    // iOS Safari silent buffer unlock
    const buffer = this.ctx.createBuffer(1, 1, 22050);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.ctx.destination);
    source.start(0);

    if (customUrl) {
      this.customAudioMode = true;
      this.customAudio = new Audio(customUrl);
      this.customAudio.loop = true;
      this.customAudio.volume = 0.65;
      const mediaSource = this.ctx.createMediaElementSource(this.customAudio);
      mediaSource.connect(this.masterGain);
    }
  }

  start() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.customAudioMode && this.customAudio) {
      this.customAudio.play().catch(() => {});
    } else {
      this.playAmbientPads();
      if (!this.ambientInterval) {
        this.ambientInterval = setInterval(() => {
          if (this.isPlaying && !this.isMuted) {
            this.playAmbientPads();
          }
        }, 5500);
      }
    }

    this.isPlaying = true;
    this.fadeMaster(0.5, 2.0);
  }

  stop() {
    this.isPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.customAudioMode && this.customAudio) {
      this.customAudio.pause();
    }
    this.fadeMaster(0.001, 0.8);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  fadeMaster(targetVolume, duration = 1.0) {
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetVolume), now + duration);
  }

  // Romantic ambient chord layer
  playAmbientPads() {
    if (!this.ctx || this.isMuted) return;

    const chord = this.chords[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    const now = this.ctx.currentTime;
    const chordDuration = 6.5;

    chord.forEach((freq, i) => {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.003, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + (i * 120), now);
      filter.Q.setValueAtTime(1.2, now);

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.04 / (i + 1.2), now + 2.0);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + chordDuration);
      osc2.stop(now + chordDuration);

      // Subtle celestial chime
      if (i === 3 || i === 4) {
        setTimeout(() => {
          if (this.isPlaying && !this.isMuted) {
            this.playStarlightChime(freq * 2);
          }
        }, 800 + i * 400);
      }
    });
  }

  // Crystalline starlight chime
  playStarlightChime(freq = 880) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    chimeGain.gain.setValueAtTime(0.0001, now);
    chimeGain.gain.linearRampToValueAtTime(0.015, now + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(chimeGain);
    chimeGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  // Interactive Heartbeat pulse with mobile haptic trigger
  playHeartbeat() {
    // Mobile haptic vibration if supported (iOS/Android)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch (e) {}
    }

    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const playThump = (timeOffset, freq, vol) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + timeOffset);
      osc.frequency.exponentialRampToValueAtTime(32, now + timeOffset + 0.15);

      gain.gain.setValueAtTime(vol, now + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + 0.22);
    };

    // Human heartbeat: lub-dub
    playThump(0, 58, 0.22);
    playThump(0.14, 52, 0.18);
  }

  // Sparkle burst sound effect
  playBurstChime() {
    // Light haptic tap on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch (e) {}
    }

    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const baseFreqs = [523.25, 659.25, 783.99, 1046.50];

    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.035, now + idx * 0.04 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 1.3);
    });
  }
}

export const celestialAudio = new CelestialAudioEngine();
