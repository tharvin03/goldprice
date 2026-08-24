import type { GoldPriceData, SourceFetchResult } from "@/lib/types";
import { scrapeAllSources } from "@/lib/sources/scrape";
import { fetchFallbackPrice } from "@/lib/sources/fallbackGoldApi";

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function summarize(results: SourceFetchResult[]) {
  const price999 = median(
    results.filter((r) => r.ok && r.price999 !== null).map((r) => r.price999 as number)
  );
  const price916 = median(
    results.filter((r) => r.ok && r.price916 !== null).map((r) => r.price916 as number)
  );
  return { price999, price916 };
}

export async function getGoldPrice(): Promise<GoldPriceData> {
  const scraped = await scrapeAllSources();
  let { price999, price916 } = summarize(scraped);
  let method: GoldPriceData["method"] = "scrape";
  let sourcesUsed: SourceFetchResult[] = scraped;

  if (price999 === null && price916 === null) {
    const fallback = await fetchFallbackPrice();
    if (fallback.ok) {
      price999 = fallback.price999;
      price916 = fallback.price916;
      method = "fallback-api";
      sourcesUsed = [...scraped, fallback];
    } else {
      method = "unavailable";
      sourcesUsed = [...scraped, fallback];
    }
  }

  return {
    price999,
    price916,
    method,
    updatedAt: new Date().toISOString(),
    sources: sourcesUsed.map((s) => ({ name: s.name, url: s.url, ok: s.ok })),
  };
}
