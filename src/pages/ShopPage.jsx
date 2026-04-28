import Card from '../components/Card';
import { SHOP_ITEMS } from '../data/gameData';
import { useArcade } from '../hooks/useArcade';

export default function ShopPage() {
  const { state, buyTheme } = useArcade();

  return (
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
  );
}
