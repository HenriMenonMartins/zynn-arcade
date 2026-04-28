export default function ProgressBar({ value }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-black/30">
      <div className="h-full rounded-full bg-gradient-to-r from-zynn-accent to-zynn-accent2 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
