import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { PHONE_DISPLAY, EMAIL } from "@/lib/contact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://cordavia.ch";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cordavia – Krankenfahrten & medizinischer Transport in der Schweiz",
    template: "%s · Cordavia",
  },
  description:
    "Cordavia – medizinischer Transportdienst in den Kantonen Zürich, Schwyz, St.Gallen und Glarus. Krankenfahrten, Liegend- und Rollstuhltransporte mit Krankenkassen-Abrechnung. 24h erreichbar.",
  keywords: [
    "Krankenfahrt Schweiz",
    "Krankentransport Zürich",
    "Krankentransport St.Gallen",
    "Liegendtransport",
    "Rollstuhltransport",
    "Dialysefahrt",
    "Reha-Fahrt",
    "Patientenfahrt",
    "Cordavia",
    "Krankenkassen-Abrechnung",
    "Kanton Schwyz",
    "Kanton Glarus",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: SITE_URL,
    siteName: "Cordavia",
    title: "Cordavia – Krankenfahrten & medizinischer Transport",
    description:
      "Medizinischer Transportdienst in Zürich, Schwyz, St.Gallen und Glarus. Mit Herz, Erfahrung und Krankenkassen-Abrechnung.",
  },
  robots: { index: true, follow: true },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: "Cordavia",
  alternateName: "Cordavia Krankentransport",
  description:
    "Medizinischer Transportdienst in der Schweiz – Krankenfahrten, Liegend- und Rollstuhltransporte mit Krankenkassen-Abrechnung.",
  url: SITE_URL,
  telephone: PHONE_DISPLAY,
  email: EMAIL,
  image: `${SITE_URL}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "[Strasse und Hausnummer]",
    postalCode: "[PLZ]",
    addressLocality: "[Ort]",
    addressRegion: "ZH",
    addressCountry: "CH",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Kanton Zürich", identifier: "CH-ZH" },
    { "@type": "AdministrativeArea", name: "Kanton Schwyz", identifier: "CH-SZ" },
    { "@type": "AdministrativeArea", name: "Kanton St.Gallen", identifier: "CH-SG" },
    { "@type": "AdministrativeArea", name: "Kanton Glarus", identifier: "CH-GL" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  priceRange: "$$",
  knowsLanguage: ["de", "fr", "en", "it"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Transportleistungen",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Krankenfahrten" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Liegendtransporte" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rollstuhltransporte" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Taxi-Service" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[var(--color-navy-900)]">
        {children}
      </body>
    </html>
  );
}
