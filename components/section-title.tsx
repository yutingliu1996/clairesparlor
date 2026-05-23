export default function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-3 max-w-2xl text-display-md font-semibold tracking-tight">{title}</h2>
      {sub && <p className="mt-3 max-w-prose text-base text-ink-2 md:text-lg">{sub}</p>}
    </div>
  );
}
