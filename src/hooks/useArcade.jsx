import { createContext, useContext, useMemo, useState } from 'react';
import {
  ACHIEVEMENT_RULES,
  AD_REWARD,
  AVATAR_ITEMS,
  DAILY_REWARD,
  GAME_FINISH_BONUS,
  LEVELS,
  MUSIC_ITEMS,
  SHOP_ITEMS
} from '../data/gameData';

const STORAGE_KEY = 'zynn-arcade-state-v1';
const todayKey = () => new Date().toISOString().slice(0, 10);

const initialState = {
  username: '',
  coins: 100,
  xp: 0,
  streak: 0,
  lastLoginDate: null,
  lastDailyClaimDate: null,
  selectedTheme: 'default',
  unlockedThemes: ['default'],
  selectedAvatar: 'pilot',
  unlockedAvatars: ['pilot'],
  selectedMusic: 'mute',
  unlockedMusic: ['mute'],
  achievements: [],
  stats: {
    gamesPlayed: 0,
    adsWatched: 0,
    clickerClicks: 0,
    bestReactionMs: null,
    bestDodgeScore: 0
  },
  leaderboard: []
};

const ArcadeContext = createContext(null);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;

    const parsed = JSON.parse(raw);
    return {
      ...initialState,
      ...parsed,
      unlockedThemes: Array.isArray(parsed.unlockedThemes) ? parsed.unlockedThemes : initialState.unlockedThemes,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : initialState.achievements,
      leaderboard: Array.isArray(parsed.leaderboard) ? parsed.leaderboard : initialState.leaderboard,
      unlockedAvatars: Array.isArray(parsed.unlockedAvatars) ? parsed.unlockedAvatars : initialState.unlockedAvatars,
      unlockedMusic: Array.isArray(parsed.unlockedMusic) ? parsed.unlockedMusic : initialState.unlockedMusic,
      stats: {
        ...initialState.stats,
        ...(parsed.stats || {})
      }
    };
  } catch {
    return initialState;
  }
}

function levelFromXp(xp) {
  let level = 1;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (xp >= LEVELS[i]) level = i + 1;
  }
  const nextTarget = LEVELS[Math.min(level, LEVELS.length - 1)] ?? LEVELS[LEVELS.length - 1] + 1200;
  const prevTarget = LEVELS[Math.max(level - 1, 0)] ?? 0;
  const progress = Math.min(100, Math.round(((xp - prevTarget) / Math.max(1, nextTarget - prevTarget)) * 100));
  return { level, progress, nextTarget };
}

export function ArcadeProvider({ children }) {
  const [state, setState] = useState(loadState);

  const patch = (updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const unlockAchievements = (draft) => {
    let next = draft;
    ACHIEVEMENT_RULES.forEach((rule) => {
      if (!next.achievements.includes(rule.id) && rule.test(next)) {
        next = {
          ...next,
          coins: next.coins + rule.reward,
          achievements: [...next.achievements, rule.id]
        };
      }
    });
    return next;
  };

  const login = (username) => {
    const today = todayKey();
    patch((prev) => {
      const previousDate = prev.lastLoginDate;
      let streak = prev.streak || 0;

      if (previousDate) {
        const prevDate = new Date(previousDate);
        const now = new Date(today);
        const diffDays = Math.round((now - prevDate) / 86400000);
        if (diffDays === 1) streak += 1;
        else if (diffDays > 1) streak = 1;
      } else {
        streak = 1;
      }

      let next = { ...prev, username, streak, lastLoginDate: today };
      next = unlockAchievements(next);
      return next;
    });
  };

  const claimDailyReward = () => {
    const today = todayKey();
    if (state.lastDailyClaimDate === today) return false;

    patch((prev) => unlockAchievements({
      ...prev,
      coins: prev.coins + DAILY_REWARD,
      xp: prev.xp + 40,
      lastDailyClaimDate: today
    }));
    return true;
  };

  const watchAd = () => {
    patch((prev) => unlockAchievements({
      ...prev,
      coins: prev.coins + AD_REWARD,
      xp: prev.xp + 20,
      stats: {
        ...prev.stats,
        adsWatched: prev.stats.adsWatched + 1
      }
    }));
  };

  const finishGame = ({ coins = 0, xp = 0, game, score = 0 }) => {
    patch((prev) => {
      const updates = { ...prev.stats, gamesPlayed: prev.stats.gamesPlayed + 1 };

      if (game === 'reaction' && (prev.stats.bestReactionMs === null || score < prev.stats.bestReactionMs)) {
        updates.bestReactionMs = score;
      }
      if (game === 'dodge' && score > prev.stats.bestDodgeScore) {
        updates.bestDodgeScore = score;
      }

      const boardEntry = { game, score, when: Date.now(), user: prev.username };

      let next = {
        ...prev,
        coins: prev.coins + coins + GAME_FINISH_BONUS,
        xp: prev.xp + xp + 25,
        stats: updates,
        leaderboard: [...prev.leaderboard, boardEntry].sort((a, b) => b.score - a.score).slice(0, 20)
      };
      next = unlockAchievements(next);
      return next;
    });
  };

  const recordClicker = (coinsEarned = 1) => {
    patch((prev) => unlockAchievements({
      ...prev,
      coins: prev.coins + coinsEarned,
      xp: prev.xp + 3,
      stats: {
        ...prev.stats,
        clickerClicks: prev.stats.clickerClicks + 1
      }
    }));
  };

  const buyTheme = (id) => {
    const item = SHOP_ITEMS.find((x) => x.id === id);
    if (!item) return false;

    if (state.unlockedThemes.includes(id)) {
      patch((prev) => ({ ...prev, selectedTheme: id }));
      return true;
    }

    if (state.coins < item.price) return false;

    patch((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      unlockedThemes: [...prev.unlockedThemes, id],
      selectedTheme: id
    }));
    return true;
  };

  const buyAvatar = (id) => {
    const item = AVATAR_ITEMS.find((x) => x.id === id);
    if (!item) return false;

    if (state.unlockedAvatars.includes(id)) {
      patch((prev) => ({ ...prev, selectedAvatar: id }));
      return true;
    }

    if (state.coins < item.price) return false;

    patch((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      unlockedAvatars: [...prev.unlockedAvatars, id],
      selectedAvatar: id
    }));
    return true;
  };

  const buyMusic = (id) => {
    const item = MUSIC_ITEMS.find((x) => x.id === id);
    if (!item) return false;

    if (state.unlockedMusic.includes(id)) {
      patch((prev) => ({ ...prev, selectedMusic: id }));
      return true;
    }

    if (state.coins < item.price) return false;

    patch((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      unlockedMusic: [...prev.unlockedMusic, id],
      selectedMusic: id
    }));
    return true;
  };

  const value = useMemo(() => ({
    state,
    level: levelFromXp(state.xp),
    login,
    claimDailyReward,
    watchAd,
    finishGame,
    recordClicker,
    buyTheme,
    buyAvatar,
    buyMusic
  }), [state]);

  return <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>;
}

export function useArcade() {
  const ctx = useContext(ArcadeContext);
  if (!ctx) throw new Error('useArcade must be used inside ArcadeProvider');
  return ctx;
}
