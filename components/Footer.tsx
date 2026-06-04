import Link from "next/link";
import { Phone, WhatsApp } from "./icons";
import { PHONE_DISPLAY, PHONE_TEL, PHONE_WHATSAPP, EMAIL, SERVICE_CANTONS } from "@/lib/contact";

export function Footer() {
  return (
    <footer id="kontakt" className="bg-navy-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span
              aria-hidden
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-navy-950 font-black"
            >
              C
            </span>
            <span className="text-xl font-bold">Cordavia</span>
          </div>
          <p className="text-navy-50/80 leading-relaxed">
            Ihr Taxi und Krankentransport.
            <br />
            Wir kümmern uns – auf jedem Weg.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Kontakt</h3>
          <ul className="space-y-3 text-navy-50/90">
            <li>
              <a
                href={`tel:${PHONE_TEL}`}
                className="flex items-center gap-3 hover:text-teal-300 transition"
              >
                <Phone className="h-5 w-5" />
                <span>{PHONE_DISPLAY}</span>
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${PHONE_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-teal-300 transition"
              >
                <WhatsApp className="h-5 w-5" />
                <span>WhatsApp Chat</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="text-navy-50/80 hover:text-teal-300 transition"
              >
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Service-Region</h3>
          <ul className="space-y-2 text-navy-50/80">
            {SERVICE_CANTONS.map((c) => (
              <li key={c.code}>
                <a href={`#region-${c.slug}`} className="hover:text-teal-300 transition">
                  Kanton {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Rechtliches</h3>
          <ul className="space-y-2 text-navy-50/80">
            <li>
              <Link href="/impressum" className="hover:text-teal-300 transition">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-teal-300 transition">
                Datenschutz
              </Link>
            </li>
            <li>
              <Link href="/agb" className="hover:text-teal-300 transition">
                AGB
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-navy-50/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Cordavia. Alle Rechte vorbehalten.</span>
          <span>Schweizer Datenschutz · SSL verschlüsselt</span>
        </div>
      </div>
    </footer>
  );
}
