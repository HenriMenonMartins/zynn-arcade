import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { ACHIEVEMENT_RULES, AD_REWARD, DAILY_REWARD } from '../data/gameData';
import { useArcade } from '../hooks/useArcade';

export default function HomePage() {
  const { state, level, claimDailyReward, watchAd } = useArcade();
  const claimedToday = state.lastDailyClaimDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Welcome Back">
        <p className="text-slate-300">Player: <span className="font-semibold text-white">{state.username}</span></p>
        <p className="text-2xl font-bold text-zynn-accent">{state.coins} Coins</p>
        <div className="mt-3 space-y-2">
          <p className="text-sm">Level {level.level}</p>
          <ProgressBar value={level.progress} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={claimDailyReward} disabled={claimedToday} className="rounded-xl bg-zynn-accent px-4 py-2 font-semibold text-black disabled:opacity-50">
            {claimedToday ? 'Daily Reward Claimed' : `Claim Daily +${DAILY_REWARD}`}
          </button>
          <button onClick={watchAd} className="rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-black">{`Watch Ad (+${AD_REWARD})`}</button>
        </div>
      </Card>

      <Card title="Retention Stats">
        <p>Daily streak: <span className="font-semibold">{state.streak} days</span></p>
        <p>Games played: <span className="font-semibold">{state.stats.gamesPlayed}</span></p>
        <p>Ads watched: <span className="font-semibold">{state.stats.adsWatched}</span></p>
      </Card>

      <Card title="Achievements" className="md:col-span-2">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENT_RULES.map((a) => {
            const unlocked = state.achievements.includes(a.id);
            return (
              <div key={a.id} className={`rounded-xl border p-3 ${unlocked ? 'border-emerald-300/50 bg-emerald-400/10' : 'border-white/15 bg-black/20'}`}>
                <p className="font-semibold">{a.title}</p>
                <p className="text-sm text-slate-300">{a.description}</p>
                <p className="mt-1 text-xs">Reward: {a.reward} coins</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
