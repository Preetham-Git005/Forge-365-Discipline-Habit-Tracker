/**
 * Web Audio API synthesizer for cinematic tactile sounds and ambient focus audio
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSources: (AudioNode | null)[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Crisp tactile toggle click
   */
  public playClick(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context might fail before user interaction
    }
  }

  /**
   * Resonant metallic blade-chime on completing a habit
   */
  public playComplete(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Fundamental harmonic bell tones
      const frequencies = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 chord
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const initialGain = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(initialGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + idx * 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
      });
    } catch {
      // Ignore audio failure
    }
  }

  /**
   * Milestone / Level up fanfare
   */
  public playLevelUp(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major arpeggio
      notes.forEach((freq, i) => {
        const now = ctx.currentTime + i * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.0);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Stop all ambient and focus soundscapes immediately
   */
  public stopAmbient() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
      this.ambientSources.forEach(src => {
        try {
          if (src && 'stop' in src && typeof (src as AudioScheduledSourceNode).stop === 'function') {
            (src as AudioScheduledSourceNode).stop();
          }
          if (src) src.disconnect();
        } catch {
          // Ignore
        }
      });
      this.ambientSources = [];
    } catch {
      // Ignore
    }
  }

  /**
   * Stop everything and mute
   */
  public stopAll() {
    this.stopAmbient();
  }

  /**
   * Play continuous ambient soundscape (rain, fire, deep focus 432Hz binaural)
   */
  public playAmbient(type: 'rain' | 'fire' | 'focus' | 'off') {
    this.stopAmbient();
    if (type === 'off') return;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.5);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'rain') {
        // Pink / Brown noise synthesis for rainfall
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        this.ambientSources = [whiteNoise, filter];
      } else if (type === 'focus') {
        // 432 Hz Deep Alpha Tone + Binaural 8Hz beat
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc2.frequency.setValueAtTime(224, ctx.currentTime);

        const toneGain = ctx.createGain();
        toneGain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc1.connect(toneGain);
        osc2.connect(toneGain);
        toneGain.connect(masterGain);

        osc1.start();
        osc2.start();

        this.ambientSources = [osc1, osc2, toneGain];
      } else if (type === 'fire') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const white = (Math.random() * 2 - 1);
          output[i] = Math.random() > 0.993 ? (Math.random() * 0.8) : white * 0.02;
        }

        const fireSource = ctx.createBufferSource();
        fireSource.buffer = noiseBuffer;
        fireSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        fireSource.connect(filter);
        filter.connect(masterGain);
        fireSource.start();

        this.ambientSources = [fireSource, filter];
      }
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();
