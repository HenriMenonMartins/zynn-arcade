import { useEffect, useRef } from 'react';
import { MUSIC_ITEMS } from '../data/gameData';
import { useArcade } from './useArcade';

export default function useBackgroundMusic() {
  const { state } = useArcade();
  const audioRef = useRef({ ctx: null, osc: null, gain: null, timer: null, index: 0 });

  useEffect(() => {
    const selected = MUSIC_ITEMS.find((m) => m.id === state.selectedMusic) || MUSIC_ITEMS[0];

    const stop = () => {
      const a = audioRef.current;
      if (a.timer) {
        clearInterval(a.timer);
        a.timer = null;
      }
      if (a.osc) {
        a.osc.stop();
        a.osc.disconnect();
        a.osc = null;
      }
      if (a.gain) {
        a.gain.disconnect();
        a.gain = null;
      }
    };

    stop();

    if (!selected.tones.length) return undefined;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return undefined;

      if (!audioRef.current.ctx) {
        audioRef.current.ctx = new AudioCtx();
      }

      const ctx = audioRef.current.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = selected.tones[0];
      gain.gain.value = 0.018;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioRef.current.osc = osc;
      audioRef.current.gain = gain;
      audioRef.current.index = 0;

      audioRef.current.timer = setInterval(() => {
        audioRef.current.index = (audioRef.current.index + 1) % selected.tones.length;
        const nextTone = selected.tones[audioRef.current.index];
        if (audioRef.current.osc) {
          audioRef.current.osc.frequency.setValueAtTime(nextTone, ctx.currentTime);
        }
      }, 360);

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      return undefined;
    }

    return () => stop();
  }, [state.selectedMusic]);
}
