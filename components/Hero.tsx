import { Phone, WhatsApp, Calendar, Shield, HeartPulse, Check } from "./icons";
import { PHONE_DISPLAY, PHONE_TEL, PHONE_WHATSAPP, SERVICE_REGION_LABEL } from "@/lib/contact";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,_#14b8a6_0%,_transparent_40%),radial-gradient(circle_at_80%_80%,_#2dd4bf_0%,_transparent_40%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/15 border border-teal-400/30 px-4 py-2 text-teal-300 font-medium mb-6">
            <Shield className="h-5 w-5" />
            <span>24h erreichbar · Versichert · Pünktlich</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
            Wir kümmern uns.{" "}
            <span className="text-teal-300">Auf jedem Weg.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-navy-50/90 mb-3 leading-relaxed">
            Taxi · Krankenfahrten · Liegend- &amp; Rollstuhltransporte
          </p>
          <p className="text-base sm:text-lg text-navy-50/70 mb-8 leading-relaxed">
            Ihr verlässlicher Transportpartner in {SERVICE_REGION_LABEL}.
            Ob Stadtfahrt, Flughafen-Transfer oder Patientenfahrt – wir bringen
            Sie sicher und pünktlich ans Ziel. Tag und Nacht.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-lg">
            <li className="flex items-center gap-3">
              <Check className="h-6 w-6 text-teal-300 shrink-0" />
              <span>24/7 verfügbar</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-6 w-6 text-teal-300 shrink-0" />
              <span>Faire, transparente Preise</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-6 w-6 text-teal-300 shrink-0" />
              <span>Auch Krankenfahrten &amp; Hublift</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-6 w-6 text-teal-300 shrink-0" />
              <span>Bequem online buchen</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#buchung"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-7 py-4 text-lg sm:text-xl shadow-lg transition"
            >
              <Calendar className="h-6 w-6" />
              Fahrt buchen
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-navy-50 text-navy-900 font-bold px-7 py-4 text-lg sm:text-xl shadow-lg transition"
            >
              <Phone className="h-6 w-6" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${PHONE_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-7 py-4 text-lg sm:text-xl shadow-lg transition"
            >
              <WhatsApp className="h-6 w-6" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute -inset-4 bg-teal-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-teal-500 flex items-center justify-center">
                  <HeartPulse className="h-7 w-7 text-navy-950" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Ihr Partner</div>
                  <div className="text-navy-50/70">
                    Tag und Nacht für Sie unterwegs
                  </div>
                </div>
              </div>
              <div className="space-y-4 text-lg">
                <Row label="Taxi-Service" value="Stadt & Region" />
                <Row label="Krankenfahrten" value="Mit Kassen-Abrechnung" />
                <Row label="Liegendtransporte" value="Fachpersonal" />
                <Row label="Rollstuhltransporte" value="Hublift · Sicher" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-navy-50/90">{label}</span>
      <span className="text-teal-300 font-semibold">{value}</span>
    </div>
  );
}
