import { motion } from 'framer-motion';

export default function Card({ title, children, className = '' }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border border-white/15 bg-zynn-card/80 p-4 shadow-glow ${className}`}>
      {title ? <h3 className="mb-3 text-lg font-bold">{title}</h3> : null}
      {children}
    </motion.section>
  );
}
