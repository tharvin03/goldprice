# Gold Price Malaysia

A simple, premium single-page site showing today's Malaysia gold price for
999 (24K fine gold) and 916 (22K jewellery gold), per gram in MYR.

- Mobile: 999 stacked on top, 916 below.
- Desktop: 999 and 916 shown side by side.

## How the price is sourced

Malaysia has no official free API for retail 916/999 gold prices — local
dealers each publish their own daily rate. This app:

1. Scrapes 3 public Malaysian gold price pages server-side and cross-checks
   them by taking the median (see `lib/sources/scrape.ts`,
   `lib/sources/extract.ts`).
2. If all scrapes fail, falls back to a purity-adjusted spot price from
   [GoldAPI.io](https://www.goldapi.io/) (requires a free API key set as the
   `GOLDAPI_KEY` environment variable — optional, only used as a last
   resort).
3. If both fail, the UI shows "Unavailable" rather than a fabricated number.

Prices are cached/revalidated hourly (`revalidate = 3600`).

**Note:** the scraper uses resilient text-pattern extraction rather than
brittle CSS selectors, since the source sites don't publish an API or a
stable markup contract. If a source's page layout changes drastically enough
to break the price pattern, that source will simply report no price and drop
out of the median — check `lib/sources/scrape.ts` to add/adjust sources.

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000. The gold price API is at `/api/gold-price`.

## Environment variables

| Variable      | Required | Purpose                                   |
| ------------- | -------- | ------------------------------------------ |
| `GOLDAPI_KEY` | No       | Fallback spot-price API key (goldapi.io). |
