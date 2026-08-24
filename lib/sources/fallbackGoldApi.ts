import type { SourceFetchResult } from "@/lib/types";

const API_URL = "https://www.goldapi.io/api/XAU/MYR";

interface GoldApiResponse {
  price_gram_24k?: number;
  price_gram_22k?: number;
}

/**
 * Last-resort fallback used only when every scraped source fails. Requires a
 * free GoldAPI.io API key (see https://www.goldapi.io/) set as GOLDAPI_KEY.
 * Gives a purity-adjusted spot price, not a local dealer's quoted price, so
 * it's only used to avoid showing nothing.
 */
export async function fetchFallbackPrice(): Promise<SourceFetchResult> {
  const apiKey = process.env.GOLDAPI_KEY;
  const name = "GoldAPI.io (spot fallback)";

  if (!apiKey) {
    return {
      name,
      url: API_URL,
      ok: false,
      price999: null,
      price916: null,
      error: "GOLDAPI_KEY not configured",
    };
  }

  try {
    const res = await fetch(API_URL, {
      headers: { "x-access-token": apiKey, Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        name,
        url: API_URL,
        ok: false,
        price999: null,
        price916: null,
        error: `HTTP ${res.status}`,
      };
    }

    const data: GoldApiResponse = await res.json();
    const price999 = data.price_gram_24k ?? null;
    const price916 = data.price_gram_22k ?? null;

    if (price999 === null && price916 === null) {
      return {
        name,
        url: API_URL,
        ok: false,
        price999: null,
        price916: null,
        error: "Response missing gram prices",
      };
    }

    return { name, url: API_URL, ok: true, price999, price916 };
  } catch (err) {
    return {
      name,
      url: API_URL,
      ok: false,
      price999: null,
      price916: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
