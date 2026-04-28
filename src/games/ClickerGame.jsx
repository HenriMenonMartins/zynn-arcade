import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { useArcade } from '../hooks/useArcade';

export default function ClickerGame() {
  const { recordClicker } = useArcade();
  const [pops, setPops] = useState([]);

  const click = () => {
    recordClicker(1);
    const id = Date.now();
    setPops((prev) => [...prev, id]);
    setTimeout(() => setPops((prev) => prev.filter((x) => x !== id)), 500);
  };

  return (
    <Card title="Clicker Game">
      <div className="relative flex flex-col items-center gap-4">
        <button onClick={click} className="h-36 w-36 rounded-full bg-gradient-to-br from-zynn-accent to-zynn-accent2 text-xl font-black text-black shadow-glow active:scale-95">TAP</button>
        {pops.map((id) => (
          <motion.span key={id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -40 }} className="absolute top-8 text-zynn-accent2">+1</motion.span>
        ))}
        <p className="text-slate-300">Tap fast to farm coins and XP.</p>
      </div>
    </Card>
  );
}
