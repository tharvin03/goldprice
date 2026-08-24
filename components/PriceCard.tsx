const priceFormatter = new Intl.NumberFormat("en-MY", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface PriceCardProps {
  purity: "999" | "916";
  label: string;
  price: number | null;
}

export default function PriceCard({ purity, label, price }: PriceCardProps) {
  return (
    <div className="flex-1 text-center">
      <div className="font-display text-5xl sm:text-6xl font-black tracking-tight gold-text">
        {purity}
      </div>
      <div
        className="mt-1 text-sm sm:text-base font-bold uppercase tracking-[0.15em]"
        style={{ color: "var(--gold-2)" }}
      >
        {label}
      </div>

      <div className="mt-5 sm:mt-6">
        {price !== null ? (
          <div className="flex items-start justify-center gap-1.5">
            <span className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-[color:var(--ink)]">
              RM
            </span>
            <span className="text-6xl sm:text-7xl font-black tabular-nums tracking-tight text-[color:var(--ink)]">
              {priceFormatter.format(price)}
            </span>
          </div>
        ) : (
          <span
            className="font-display text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--ink-muted)" }}
          >
            Unavailable
          </span>
        )}
      </div>

      <div
        className="mt-4 text-sm sm:text-base font-bold uppercase tracking-[0.2em]"
        style={{ color: "var(--ink-muted)" }}
      >
        per gram
      </div>
    </div>
  );
}
