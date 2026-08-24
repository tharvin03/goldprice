import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gold Price Malaysia | 999 & 916 Today",
  description:
    "Today's 999 and 916 gold price per gram in Malaysia (MYR), cross-checked from multiple sources.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
