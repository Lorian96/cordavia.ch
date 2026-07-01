import { Phone, WhatsApp, Calendar, Shield, HeartPulse, Check } from "./icons";
import { PHONE_DISPLAY, PHONE_TEL, PHONE_WHATSAPP, SERVICE_REGION_LABEL } from "@/lib/contact";
import { CallbackButton } from "./CallbackButton";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white">
      {/* Signatur: die „Route" – eine ruhige, statische Wegstrecke von Abhol- zu Zielpunkt */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_15%_100%,_#14b8a6_0%,_transparent_45%),radial-gradient(circle_at_85%_0%,_#13315c_0%,_transparent_50%)]"
      />
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full text-teal-300"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          d="M -40 520 C 180 520 220 300 420 300 S 700 140 860 120"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="1 16"
          strokeLinecap="round"
          opacity="0.35"
        />
        {/* Abholpunkt */}
        <circle cx="60" cy="470" r="7" fill="currentColor" opacity="0.6" />
        <circle cx="60" cy="470" r="16" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        {/* Zielpunkt */}
        <circle cx="760" cy="150" r="7" fill="currentColor" opacity="0.6" />
        <circle cx="760" cy="150" r="16" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      </svg>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/15 border border-teal-400/30 px-4 py-2 text-teal-300 font-medium mb-6">
              <Shield className="h-5 w-5" />
              <span>24h erreichbar · Versichert · Pünktlich</span>
            </div>
          </Reveal>

          <Reveal>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
              Wir kümmern uns.{" "}
              <span className="text-teal-300">Auf jedem Weg.</span>
            </h1>
          </Reveal>

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

          <p className="text-base text-teal-300 font-semibold mb-3">
            So erreichen Sie uns — wählen Sie was Ihnen am liebsten ist:
          </p>
          <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-navy-50 text-navy-900 font-bold px-6 py-5 text-lg sm:text-xl shadow-xl ring-2 ring-teal-300 transition"
            >
              <Phone className="h-7 w-7" />
              <span>Anrufen</span>
            </a>
            <a
              href="#buchung"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-6 py-5 text-lg sm:text-xl shadow-xl transition"
            >
              <Calendar className="h-7 w-7" />
              <span>Online buchen</span>
            </a>
            <a
              href={`https://wa.me/${PHONE_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-5 text-lg sm:text-xl shadow-xl transition"
            >
              <WhatsApp className="h-7 w-7" />
              <span>WhatsApp</span>
            </a>
          </Reveal>
          <a
            href={`tel:${PHONE_TEL}`}
            className="group mt-4 inline-flex items-center gap-3 text-navy-50/90 hover:text-white transition"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/15 ring-1 ring-teal-400/30 group-hover:bg-teal-500/25 transition">
              <Phone className="h-5 w-5 text-teal-300" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-teal-300 font-semibold">
                Direkt anrufen · Tag &amp; Nacht
              </span>
              <span className="block text-2xl font-bold tracking-tight tabular-nums">
                {PHONE_DISPLAY}
              </span>
            </span>
          </a>
          <div className="mt-4">
            <CallbackButton />
          </div>
        </div>

        <Reveal className="hidden lg:block">
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
                <Row label="Krankenfahrten" value="Mit Begleitung" />
                <Row label="Liegendtransporte" value="Fachpersonal" />
                <Row label="Rollstuhltransporte" value="Hublift · Sicher" />
              </div>
            </div>
          </div>
        </Reveal>
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
