import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useArcade } from '../hooks/useArcade';

export default function TargetRushGame() {
  const { finishGame } = useArcade();
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(15);
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 20, y: 20 });

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setRunning(false);
          finishGame({ game: 'target', score, coins: score * 3, xp: score * 2 });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, score, finishGame]);

  const start = () => {
    setScore(0);
    setTime(15);
    setRunning(true);
    setPos({ x: Math.random() * 84, y: Math.random() * 70 });
  };

  const hit = () => {
    if (!running) return;
    setScore((s) => s + 1);
    setPos({ x: Math.random() * 84, y: Math.random() * 70 });
  };

  return (
    <Card title="Target Rush">
      <div className="mb-3 flex items-center gap-3">
        <button onClick={start} className="rounded-lg bg-zynn-accent px-3 py-1.5 text-black">{running ? 'Restart' : 'Start'}</button>
        <p>Time: {time}s</p>
        <p>Score: {score}</p>
      </div>
      <div className="relative h-56 rounded-xl border border-white/20 bg-black/25">
        {running ? (
          <button
            onClick={hit}
            className="absolute h-12 w-12 rounded-full bg-zynn-danger shadow-glow"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">Hit Start and click the moving target fast.</div>
        )}
      </div>
    </Card>
  );
}
