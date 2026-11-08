import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "DeskMuse — Show Your Setup. Inspire Others.",
  description:
    "A decentralized workspace inspiration magazine on Botchain Testnet where creators showcase desk setups, ergonomics, and battle stations on-chain.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-text-primary antialiased bg-mesh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

