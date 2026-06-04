import { Phone, WhatsApp } from "./icons";

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
            Wir kümmern uns — auf jedem Weg.
            <br />Krankenfahrten, Liegendtransporte, Rollstuhltransporte und Taxi-Service.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Kontakt</h3>
          <ul className="space-y-3 text-navy-50/90">
            <li>
              <a
                href="tel:+4900000000000"
                className="flex items-center gap-3 hover:text-teal-300 transition"
              >
                <Phone className="h-5 w-5" />
                <span>+49 000 000 000 00</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/4900000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-teal-300 transition"
              >
                <WhatsApp className="h-5 w-5" />
                <span>WhatsApp Chat</span>
              </a>
            </li>
            <li className="text-navy-50/80">info@cordavia.ch</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Leistungen</h3>
          <ul className="space-y-2 text-navy-50/80">
            <li>Krankenfahrten</li>
            <li>Liegendtransporte</li>
            <li>Rollstuhltransporte</li>
            <li>Taxi-Service</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Rechtliches</h3>
          <ul className="space-y-2 text-navy-50/80">
            <li>
              <a href="#" className="hover:text-teal-300 transition">
                Impressum
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-300 transition">
                Datenschutz
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-300 transition">
                AGB
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-navy-50/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Cordavia. Alle Rechte vorbehalten.</span>
          <span>DSGVO-konform · SSL verschlüsselt</span>
        </div>
      </div>
    </footer>
  );
}
