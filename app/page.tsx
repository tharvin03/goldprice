import { getGoldPrice } from "@/lib/goldPrice";
import PriceCard from "@/components/PriceCard";

export const revalidate = 3600;

const dateFormatter = new Intl.DateTimeFormat("en-MY", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-MY", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kuala_Lumpur",
});

export default async function Home() {
  const data = await getGoldPrice();
  const today = new Date();

  return (
    <div className="flex-1 flex flex-col bg-radial-glow">
      <main className="flex-1 flex flex-col items-center px-6 py-16 sm:py-20">
        <header className="flex flex-col items-center text-center gap-3 mb-12 sm:mb-16">
          <span
            className="text-[11px] sm:text-xs uppercase tracking-[0.35em]"
            style={{ color: "var(--ink-muted)" }}
          >
            Malaysia Gold Price
          </span>
          <h1 className="font-display text-xl sm:text-2xl font-medium text-[color:var(--ink)]">
            {dateFormatter.format(today)}
          </h1>
        </header>

        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-5 sm:gap-6">
          <PriceCard purity="999" label="24K Fine Gold" price={data.price999} />
          <PriceCard purity="916" label="22K Gold" price={data.price916} />
        </div>

        <footer className="mt-14 sm:mt-16 flex flex-col items-center gap-1.5 text-center">
          <p
            className="text-[11px] sm:text-xs"
            style={{ color: "var(--ink-muted)" }}
          >
            Updated {timeFormatter.format(new Date(data.updatedAt))} (MYT) &middot;
            reference price only, not an official quotation
          </p>
        </footer>
      </main>
    </div>
  );
}
