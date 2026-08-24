/**
 * Sites we scrape don't offer an API, so we don't have verified CSS selectors
 * to depend on (that would break silently on any redesign anyway). Instead we
 * scan the page's visible text for a purity marker ("999"/"24K" or "916"/"22K")
 * followed shortly by a "RM"-prefixed number, and sanity-check the result
 * against a plausible price band. This is more resilient to markup changes
 * than a brittle class-name selector.
 */

const RM_NUMBER = /RM\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/gi;

function toNumber(raw: string): number {
  return parseFloat(raw.replace(/,/g, ""));
}

function withinBand(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

/**
 * Look for the first RM-prefixed number within `window` characters after any
 * occurrence of one of `keywords`, whose value falls within [min, max].
 */
export function findPriceNear(
  text: string,
  keywords: string[],
  min: number,
  max: number,
  window = 100
): number | null {
  for (const keyword of keywords) {
    let searchFrom = 0;
    while (searchFrom < text.length) {
      const idx = text.indexOf(keyword, searchFrom);
      if (idx === -1) break;

      const slice = text.slice(idx, idx + keyword.length + window);
      RM_NUMBER.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = RM_NUMBER.exec(slice)) !== null) {
        const value = toNumber(match[1]);
        if (withinBand(value, min, max)) {
          return value;
        }
      }
      searchFrom = idx + keyword.length;
    }
  }
  return null;
}

// Loose plausible per-gram bands (MYR) for each purity, wide enough to
// tolerate normal market movement without accepting obviously-wrong numbers
// (phone numbers, years, unrelated prices on the page).
export const PRICE_BAND_999 = { min: 250, max: 900 };
export const PRICE_BAND_916 = { min: 220, max: 850 };

export function extractPrices(text: string): {
  price999: number | null;
  price916: number | null;
} {
  const price999 = findPriceNear(
    text,
    ["999", "24K", "24 K", "24k"],
    PRICE_BAND_999.min,
    PRICE_BAND_999.max
  );
  const price916 = findPriceNear(
    text,
    ["916", "22K", "22 K", "22k"],
    PRICE_BAND_916.min,
    PRICE_BAND_916.max
  );
  return { price999, price916 };
}
