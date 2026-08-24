import { NextResponse } from "next/server";
import { getGoldPrice } from "@/lib/goldPrice";

export const revalidate = 3600;

export async function GET() {
  const data = await getGoldPrice();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}
