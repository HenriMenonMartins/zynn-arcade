import { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../components/Card';
import { useArcade } from '../hooks/useArcade';

const W = 300;
const H = 200;

export default function DodgeGame() {
  const { finishGame } = useArcade();
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(W / 2 - 12);
  const [obstacles, setObstacles] = useState([]);
  const rafRef = useRef(null);

  const player = useMemo(() => ({ x: playerX, y: H - 24, w: 24, h: 16 }), [playerX]);

  useEffect(() => {
    const handler = (e) => {
      if (!running) return;
      if (e.key === 'ArrowLeft') setPlayerX((x) => Math.max(0, x - 18));
      if (e.key === 'ArrowRight') setPlayerX((x) => Math.min(W - 24, x + 18));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const loop = () => {
      setScore((s) => s + 1);
      setObstacles((prev) => {
        const moved = prev.map((o) => ({ ...o, y: o.y + 5 })).filter((o) => o.y < H + 20);
        if (Math.random() < 0.2) moved.push({ x: Math.random() * (W - 18), y: -12, w: 18, h: 18 });
        const hit = moved.some((o) => o.x < player.x + player.w && o.x + o.w > player.x && o.y < player.y + player.h && o.y + o.h > player.y);
        if (hit) {
          setRunning(false);
          finishGame({ game: 'dodge', score, coins: Math.floor(score / 4), xp: Math.floor(score / 6) });
          return [];
        }
        return moved;
      });
      rafRef.current = setTimeout(loop, 70);
    };
    rafRef.current = setTimeout(loop, 70);
    return () => clearTimeout(rafRef.current);
  }, [running, player.x, player.h, player.w, player.y, finishGame, score]);

  const start = () => {
    setScore(0);
    setPlayerX(W / 2 - 12);
    setObstacles([]);
    setRunning(true);
  };

  return (
    <Card title="Dodge Arena">
      <button onClick={start} className="mb-3 rounded-lg bg-zynn-accent px-4 py-2 font-semibold text-black">{running ? 'Restart' : 'Start'}</button>
      <div className="relative overflow-hidden rounded-xl border border-white/20 bg-black/40" style={{ width: W, height: H }}>
        <div className="absolute rounded bg-zynn-accent2" style={{ left: player.x, top: player.y, width: player.w, height: player.h }} />
        {obstacles.map((o, i) => (
          <div key={i} className="absolute rounded bg-zynn-danger" style={{ left: o.x, top: o.y, width: o.w, height: o.h }} />
        ))}
      </div>
      <p className="mt-2">Score: {score}</p>
      <p className="text-sm text-slate-300">Use Left/Right arrow keys to dodge.</p>
    </Card>
  );
}
