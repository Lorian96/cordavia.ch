import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { PHONE_DISPLAY, EMAIL } from "@/lib/contact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://vitaway.ch";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VitaWay – Taxi & Krankenfahrten in der Schweiz",
    template: "%s · VitaWay",
  },
  description:
    "VitaWay – Ihr Taxi und Krankentransport in den Kantonen Zürich, Schwyz, St.Gallen und Glarus. Stadtfahrten, Krankenfahrten, Liegend- und Rollstuhltransporte. 24h erreichbar, pünktlich, mit Krankenkassen-Abrechnung.",
  keywords: [
    "Taxi Schweiz",
    "Taxi Zürich",
    "Taxi St.Gallen",
    "Krankenfahrt Schweiz",
    "Krankentransport",
    "Liegendtransport",
    "Rollstuhltransport",
    "Dialysefahrt",
    "Reha-Fahrt",
    "Flughafentransfer",
    "VitaWay",
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
    siteName: "VitaWay",
    title: "VitaWay – Taxi & Krankenfahrten in der Schweiz",
    description:
      "Ihr Transportpartner in Zürich, Schwyz, St.Gallen und Glarus. Taxi, Krankenfahrten, Rollstuhl- und Liegendtransporte. 24h erreichbar.",
  },
  robots: { index: true, follow: true },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["TaxiService", "MedicalBusiness", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: "VitaWay",
  alternateName: "VitaWay Taxi & Krankenfahrten",
  description:
    "Taxi- und Krankentransport in der Schweiz – Stadtfahrten, Krankenfahrten, Liegend- und Rollstuhltransporte mit Krankenkassen-Abrechnung.",
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
