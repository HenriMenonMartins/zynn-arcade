import { useMemo, useState } from 'react';
import Card from '../components/Card';
import ClickerGame from '../games/ClickerGame';
import ReactionGame from '../games/ReactionGame';
import DodgeGame from '../games/DodgeGame';

const GAMES = [
  { id: 'clicker', name: 'Coin Clicker', component: ClickerGame },
  { id: 'reaction', name: 'Reaction Speed', component: ReactionGame },
  { id: 'dodge', name: 'Dodge Arena', component: DodgeGame }
];

export default function GamesPage() {
  const [active, setActive] = useState('clicker');
  const ActiveGame = useMemo(() => GAMES.find((g) => g.id === active)?.component || ClickerGame, [active]);

  return (
    <div className="space-y-4">
      <Card title="Mini Games">
        <div className="flex flex-wrap gap-2">
          {GAMES.map((game) => (
            <button key={game.id} onClick={() => setActive(game.id)} className={`rounded-xl px-4 py-2 ${active === game.id ? 'bg-zynn-accent text-black' : 'bg-black/25'}`}>
              {game.name}
            </button>
          ))}
        </div>
      </Card>
      <ActiveGame />
    </div>
  );
}
