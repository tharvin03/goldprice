import * as cheerio from "cheerio";
import type { SourceFetchResult } from "@/lib/types";
import { extractPrices } from "./extract";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 GoldPriceMY-Site/1.0";

export interface ScrapeSource {
  name: string;
  url: string;
}

export const SCRAPE_SOURCES: ScrapeSource[] = [
  { name: "goldprice.com.my", url: "https://goldprice.com.my/" },
  { name: "malaysiagoldprice.com", url: "https://malaysiagoldprice.com/" },
  {
    name: "calculatormalaysia.com",
    url: "https://calculatormalaysia.com/gold-price-malaysia/",
  },
];

export async function scrapeSource(
  source: ScrapeSource
): Promise<SourceFetchResult> {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      // Sources update at most a few times a day; an hour is plenty fresh
      // while keeping us from hammering their servers.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        name: source.name,
        url: source.url,
        ok: false,
        price999: null,
        price916: null,
        error: `HTTP ${res.status}`,
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    $("script, style, noscript").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();

    const { price999, price916 } = extractPrices(text);

    if (price999 === null && price916 === null) {
      return {
        name: source.name,
        url: source.url,
        ok: false,
        price999: null,
        price916: null,
        error: "No price pattern matched",
      };
    }

    return {
      name: source.name,
      url: source.url,
      ok: true,
      price999,
      price916,
    };
  } catch (err) {
    return {
      name: source.name,
      url: source.url,
      ok: false,
      price999: null,
      price916: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function scrapeAllSources(): Promise<SourceFetchResult[]> {
  return Promise.all(SCRAPE_SOURCES.map(scrapeSource));
}
