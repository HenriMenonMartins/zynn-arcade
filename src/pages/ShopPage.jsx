import Card from '../components/Card';
import { AVATAR_ITEMS, MUSIC_ITEMS, SHOP_ITEMS } from '../data/gameData';
import { useArcade } from '../hooks/useArcade';

export default function ShopPage() {
  const { state, buyTheme, buyAvatar, buyMusic } = useArcade();

  return (
    <div className="space-y-4">
      <Card title="Theme Shop">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SHOP_ITEMS.map((item) => {
            const unlocked = state.unlockedThemes.includes(item.id);
            const selected = state.selectedTheme === item.id;
            return (
              <div key={item.id} className="rounded-xl border border-white/15 bg-black/20 p-3">
                <div className={`h-24 rounded-lg bg-gradient-to-br ${item.card}`} />
                <p className="mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-slate-300">{item.price} coins</p>
                <button onClick={() => buyTheme(item.id)} className="mt-3 w-full rounded-lg bg-zynn-accent px-3 py-2 font-semibold text-black disabled:opacity-60" disabled={!unlocked && state.coins < item.price}>
                  {selected ? 'Selected' : unlocked ? 'Use Theme' : 'Unlock'}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Avatar Shop">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AVATAR_ITEMS.map((item) => {
            const unlocked = state.unlockedAvatars.includes(item.id);
            const selected = state.selectedAvatar === item.id;
            return (
              <div key={item.id} className="rounded-xl border border-white/15 bg-black/20 p-3">
                <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-3xl font-black">
                  {item.icon}
                </div>
                <p className="mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-slate-300">{item.price} coins</p>
                <button onClick={() => buyAvatar(item.id)} className="mt-3 w-full rounded-lg bg-zynn-accent px-3 py-2 font-semibold text-black disabled:opacity-60" disabled={!unlocked && state.coins < item.price}>
                  {selected ? 'Selected' : unlocked ? 'Use Avatar' : 'Unlock'}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Music Shop">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MUSIC_ITEMS.map((item) => {
            const unlocked = state.unlockedMusic.includes(item.id);
            const selected = state.selectedMusic === item.id;
            return (
              <div key={item.id} className="rounded-xl border border-white/15 bg-black/20 p-3">
                <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-800/70 to-blue-900/70 text-lg font-black">
                  MUSIC
                </div>
                <p className="mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-slate-300">{item.price} coins</p>
                <button onClick={() => buyMusic(item.id)} className="mt-3 w-full rounded-lg bg-zynn-accent px-3 py-2 font-semibold text-black disabled:opacity-60" disabled={!unlocked && state.coins < item.price}>
                  {selected ? 'Selected' : unlocked ? 'Use Music' : 'Unlock'}
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
