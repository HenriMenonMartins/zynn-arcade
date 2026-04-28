import { useMemo, useState } from 'react';
import Card from '../components/Card';
import { useArcade } from '../hooks/useArcade';

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

export default function MemoryFlipGame() {
  const { finishGame } = useArcade();
  const base = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'F'], []);
  const [cards, setCards] = useState(() => shuffle([...base, ...base]).map((v, i) => ({ id: i, v })));
  const [opened, setOpened] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const reset = () => {
    setCards(shuffle([...base, ...base]).map((v, i) => ({ id: i, v })));
    setOpened([]);
    setMatched([]);
    setMoves(0);
  };

  const click = (id) => {
    if (opened.includes(id) || matched.includes(id) || opened.length === 2) return;
    const nextOpened = [...opened, id];
    setOpened(nextOpened);

    if (nextOpened.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextOpened.map((x) => cards.find((c) => c.id === x));
      if (a.v === b.v) {
        const newMatched = [...matched, a.id, b.id];
        setMatched(newMatched);
        setOpened([]);
        if (newMatched.length === cards.length) {
          const score = Math.max(100, 320 - (moves + 1) * 15);
          finishGame({ game: 'memory', score, coins: Math.floor(score / 3), xp: Math.floor(score / 4) });
        }
      } else {
        setTimeout(() => setOpened([]), 550);
      }
    }
  };

  return (
    <Card title="Memory Flip">
      <div className="mb-3 flex items-center gap-3">
        <p>Moves: {moves}</p>
        <button onClick={reset} className="rounded-lg bg-zynn-accent px-3 py-1.5 text-black">Reset</button>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {cards.map((card) => {
          const open = opened.includes(card.id) || matched.includes(card.id);
          return (
            <button key={card.id} onClick={() => click(card.id)} className={`h-12 rounded-lg border ${open ? 'border-cyan-300 bg-cyan-400/20' : 'border-white/20 bg-black/25'}`}>
              {open ? card.v : '?'}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
