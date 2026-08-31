import { getGoldPrice } from "@/lib/goldPrice";
import PriceCard from "@/components/PriceCard";

export const revalidate = 3600;

const dateFormatter = new Intl.DateTimeFormat("en-MY", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kuala_Lumpur",
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
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        <header className="flex flex-col items-center text-center gap-2 mb-10 sm:mb-12">
          <span
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.35em]"
            style={{ color: "var(--gold-2)" }}
          >
            Malaysia Gold Price
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide gold-text">
            {dateFormatter.format(today)}
          </h1>
        </header>

        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-10 sm:gap-12 md:gap-12">
          <PriceCard purity="999" label="24K Fine Gold" price={data.price999} />
          <PriceCard purity="916" label="22K Gold" price={data.price916} />
        </div>

        <footer className="mt-10 sm:mt-12 flex flex-col items-center gap-1.5 text-center">
          <p
            className="text-[11px] sm:text-xs font-medium"
            style={{ color: "var(--ink-muted)" }}
          >
            Updated {timeFormatter.format(new Date(data.updatedAt))} (MYT)
          </p>
        </footer>
      </main>
    </div>
  );
}
