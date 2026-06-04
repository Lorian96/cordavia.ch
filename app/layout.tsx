import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cordavia – Krankenfahrten, Liegendtransporte, Rollstuhl & Taxi",
  description:
    "Cordavia – Wir kümmern uns, auf jedem Weg. Krankenfahrten, Liegendtransporte, Rollstuhltransporte und Taxi-Service. 24h erreichbar. Pünktlich. Komfortabel.",
  keywords: [
    "Cordavia",
    "Krankenfahrt",
    "Liegendtransport",
    "Rollstuhltransport",
    "Taxi",
    "Dialysefahrt",
    "Krankentransport",
    "Reha-Fahrt",
    "Schweiz",
  ],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[var(--color-navy-900)]">
        {children}
      </body>
    </html>
  );
}
