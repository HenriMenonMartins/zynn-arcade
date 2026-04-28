import { useState } from 'react';
import Card from '../components/Card';
import { useArcade } from '../hooks/useArcade';

export default function ProfilePage({ onboarding = false }) {
  const { state, login } = useArcade();
  const [value, setValue] = useState(state.username || '');

  return (
    <div className="mx-auto max-w-xl">
      <Card title={onboarding ? 'Create Your Player' : 'Profile'}>
        <label className="text-sm">Username</label>
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Player name" className="mt-1 w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2" />
        <button onClick={() => value.trim() && login(value.trim())} className="mt-3 rounded-lg bg-zynn-accent px-4 py-2 font-bold text-black">Save</button>
        {!onboarding ? (
          <div className="mt-4 space-y-1 text-sm text-slate-300">
            <p>Best reaction: {state.stats.bestReactionMs ? `${state.stats.bestReactionMs} ms` : 'N/A'}</p>
            <p>Best dodge score: {state.stats.bestDodgeScore}</p>
            <p>Clicks: {state.stats.clickerClicks}</p>
          </div>
        ) : null}
      </Card>

      {!onboarding ? (
        <Card title="Leaderboard" className="mt-4">
          <div className="space-y-2 text-sm">
            {state.leaderboard.length === 0 ? <p className="text-slate-300">No records yet. Play games to create rankings.</p> : state.leaderboard.map((e, i) => (
              <div key={`${e.when}-${i}`} className="flex items-center justify-between rounded bg-black/20 px-3 py-2">
                <span>#{i + 1} {e.user} - {e.game}</span>
                <strong>{e.score}</strong>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
