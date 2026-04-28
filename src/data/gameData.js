export const SHOP_ITEMS = [
  { id: 'default', name: 'Nebula Base', price: 0, card: 'from-cyan-500 to-blue-600', unlockedByDefault: true },
  { id: 'lava', name: 'Lava Rush', price: 300, card: 'from-orange-500 to-rose-600' },
  { id: 'forest', name: 'Neon Forest', price: 450, card: 'from-emerald-500 to-lime-600' },
  { id: 'royal', name: 'Royal Core', price: 700, card: 'from-indigo-500 to-fuchsia-600' }
];

export const ACHIEVEMENT_RULES = [
  { id: 'play1', title: 'First Steps', description: 'Play 1 game', test: (s) => s.stats.gamesPlayed >= 1, reward: 50 },
  { id: 'play10', title: 'Arcade Fan', description: 'Play 10 games', test: (s) => s.stats.gamesPlayed >= 10, reward: 150 },
  { id: 'coins500', title: 'Stacked', description: 'Reach 500 coins', test: (s) => s.coins >= 500, reward: 100 },
  { id: 'streak3', title: 'Consistent', description: '3-day login streak', test: (s) => s.streak >= 3, reward: 200 }
];

export const LEVELS = [0, 150, 400, 800, 1400, 2200, 3300, 4700];

export const DAILY_REWARD = 120;
export const AD_REWARD = 80;
export const GAME_FINISH_BONUS = 35;
