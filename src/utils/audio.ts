// Synthesized audio helper using Web Audio API for arcade feedback
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playAudioEffect = (type: 'coin' | 'key' | 'chest' | 'trap' | 'win' | 'click' | 'powerup') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'key') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'chest') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'trap') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(783.99, now + 0.24);
      osc.frequency.setValueAtTime(1046.50, now + 0.36);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.25);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'timerBeep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (err) {
    // Ignore audio policies
  }
};

// Simple synthesized study ambient generator (Lofi chord / rain noise)
let ambientNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;

export const toggleFocusAmbientSound = (enable: boolean) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (!enable) {
      if (ambientNodes) {
        ambientNodes.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => {
          try {
            ambientNodes?.osc1.stop();
            ambientNodes?.osc2.stop();
          } catch {}
          ambientNodes = null;
        }, 500);
      }
      return;
    }

    if (ambientNodes) return; // Already running

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Warm soft synth chord
    osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    ambientNodes = { osc1, osc2, gain };
  } catch (e) {
    // Audio context fallback
  }
};

