import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useArcade } from '../hooks/useArcade';
import { SHOP_ITEMS } from '../data/gameData';

export default function Layout({ children }) {
  const { state } = useArcade();
  const theme = SHOP_ITEMS.find((x) => x.id === state.selectedTheme) || SHOP_ITEMS[0];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.card} text-slate-100`}>
      <header className="border-b border-white/15 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 p-4">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-extrabold tracking-wide">ZYNN Arcade</motion.h1>
          <nav className="flex gap-2">
            {[
              ['/', 'Home'],
              ['/games', 'Games'],
              ['/shop', 'Shop'],
              ['/profile', 'Profile']
            ].map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-3 py-1.5 text-sm ${isActive ? 'bg-black/40' : 'bg-black/20 hover:bg-black/35'}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
