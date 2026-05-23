/**
 * Big-number stats strip. Apple-style display type, sparing accent.
 */
const STATS = [
  { num: '5', unit: 'yr', label: 'PM 出身' },
  { num: '5', unit: '条线', label: '内容平台并行' },
  { num: '41', unit: '本', label: '在读 / 已读' },
  { num: '∞', unit: '', label: '想做的事' },
];

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="border-l border-hairline pl-5">
          <div className="flex items-baseline gap-2">
            <span className="stat-num">{s.num}</span>
            {s.unit && <span className="text-base text-ink-3 md:text-lg">{s.unit}</span>}
          </div>
          <div className="mt-2 text-xs uppercase tracking-eyebrow text-ink-3 md:text-sm md:tracking-normal md:normal-case">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
