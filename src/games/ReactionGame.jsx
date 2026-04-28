import { useEffect, useRef, useState } from 'react';
import Card from '../components/Card';
import { useArcade } from '../hooks/useArcade';

export default function ReactionGame() {
  const { finishGame } = useArcade();
  const [phase, setPhase] = useState('idle');
  const [message, setMessage] = useState('Press Start and wait for green...');
  const [result, setResult] = useState(null);
  const startTime = useRef(0);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = () => {
    setResult(null);
    setPhase('waiting');
    setMessage('Wait for green...');
    timer.current = setTimeout(() => {
      setPhase('go');
      setMessage('CLICK NOW!');
      startTime.current = performance.now();
    }, 1200 + Math.random() * 1800);
  };

  const clickArea = () => {
    if (phase === 'waiting') {
      clearTimeout(timer.current);
      setPhase('idle');
      setMessage('Too early. Try again.');
      return;
    }
    if (phase !== 'go') return;
    const ms = Math.round(performance.now() - startTime.current);
    setResult(ms);
    setPhase('idle');
    setMessage(`Result: ${ms} ms`);
    finishGame({ game: 'reaction', score: ms, coins: ms < 250 ? 80 : 45, xp: 60 });
  };

  return (
    <Card title="Reaction Speed">
      <button onClick={start} className="mb-3 rounded-lg bg-zynn-accent px-4 py-2 font-semibold text-black">Start</button>
      <button onClick={clickArea} className={`h-40 w-full rounded-xl border text-lg font-bold ${phase === 'go' ? 'border-emerald-300 bg-emerald-400/25' : 'border-white/20 bg-black/30'}`}>
        {message}
      </button>
      {result ? <p className="mt-2 text-sm text-slate-300">Bonus improves with faster reactions.</p> : null}
    </Card>
  );
}
