import Link from "next/link";
import { Phone } from "./icons";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-navy-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 text-navy-900 font-bold text-xl">
          <span
            aria-hidden
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white font-black text-lg"
          >
            C
          </span>
          <span className="hidden sm:inline">Cordavia</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-lg font-medium text-navy-800">
          <a href="#leistungen" className="hover:text-teal-500 transition">
            Leistungen
          </a>
          <a href="#regionen" className="hover:text-teal-500 transition">
            Regionen
          </a>
          <a href="#buchung" className="hover:text-teal-500 transition">
            Buchung
          </a>
          <a href="#vertrauen" className="hover:text-teal-500 transition">
            Über uns
          </a>
          <a href="#kontakt" className="hover:text-teal-500 transition">
            Kontakt
          </a>
        </nav>

        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center gap-2 rounded-full bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-5 py-3 text-base sm:text-lg transition shadow-md"
          aria-label={`Jetzt anrufen ${PHONE_DISPLAY}`}
        >
          <Phone className="h-5 w-5" />
          <span className="hidden lg:inline">{PHONE_DISPLAY}</span>
          <span className="hidden sm:inline lg:hidden">24h Hotline</span>
          <span className="sm:hidden">Anrufen</span>
        </a>
      </div>
    </header>
  );
}
