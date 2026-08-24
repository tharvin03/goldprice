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
    <div
      className="relative flex-1 rounded-3xl border px-8 py-10 sm:px-10 sm:py-12 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur"
      style={{
        borderColor: "var(--card-border)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%), var(--card)",
      }}
    >
      <div className="flex items-baseline justify-center gap-2">
        <span className="font-display text-2xl sm:text-3xl font-semibold gold-text">
          {purity}
        </span>
        <span
          className="text-[11px] sm:text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--ink-muted)" }}
        >
          {label}
        </span>
      </div>

      <div className="mt-6 sm:mt-8">
        {price !== null ? (
          <>
            <span className="font-display text-lg sm:text-xl align-top mr-1 text-[color:var(--ink-muted)]">
              RM
            </span>
            <span className="font-display text-5xl sm:text-6xl font-medium tabular-nums text-[color:var(--ink)]">
              {priceFormatter.format(price)}
            </span>
          </>
        ) : (
          <span
            className="font-display text-2xl sm:text-3xl"
            style={{ color: "var(--ink-muted)" }}
          >
            Unavailable
          </span>
        )}
      </div>

      <div
        className="mt-3 text-[11px] sm:text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--ink-muted)" }}
      >
        per gram
      </div>
    </div>
  );
}
