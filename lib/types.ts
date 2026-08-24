export type Purity = "999" | "916";

export interface SourceFetchResult {
  name: string;
  url: string;
  ok: boolean;
  price999: number | null;
  price916: number | null;
  error?: string;
}

export type PriceMethod = "scrape" | "fallback-api" | "unavailable";

export interface GoldPriceData {
  price999: number | null;
  price916: number | null;
  method: PriceMethod;
  updatedAt: string;
  sources: { name: string; url: string; ok: boolean }[];
}
