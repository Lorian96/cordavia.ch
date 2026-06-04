import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceCalculator } from "@/components/PriceCalculator";
import { PRICES, formatChf, SURCHARGE_PERCENT } from "@/lib/pricing";
import { Check, Phone } from "@/components/icons";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Preise · Cordavia",
  description:
    "Transparente Preise für Krankenfahrten, Rollstuhltransporte, Liegendtransporte und Taxi in der Schweiz. Mit Krankenkassen-Abrechnung. Direkt online berechnen.",
  alternates: { canonical: "https://cordavia.ch/preise" },
};

export default function PreisePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-sm mb-4">
              Transparente Preise
            </span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              Klare Preise. Ohne Überraschungen.
            </h1>
            <p className="text-xl text-navy-50/85 max-w-3xl mx-auto leading-relaxed">
              Wir glauben an Transparenz. Hier finden Sie alle Tarife auf einen
              Blick — und können Ihre Fahrt direkt selbst berechnen.
            </p>
          </div>
        </section>

        {/* Preise + Kalkulator */}
        <section className="py-16 bg-surface-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_400px] gap-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-navy-900">Tarif-Übersicht</h2>
              <p className="text-lg text-navy-800/80 leading-relaxed">
                Alle Tarife in Schweizer Franken (CHF), inkl. MwSt. Preise gelten
                für die Kantone Zürich, Schwyz, St.Gallen und Glarus.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                {PRICES.map((p) => (
                  <article
                    key={p.id}
                    className={`bg-white rounded-2xl border-2 p-6 ${
                      p.highlight ? "border-teal-300 shadow-md" : "border-navy-50"
                    }`}
                  >
                    <h3 className="text-xl font-bold text-navy-900 mb-1">
                      {p.label}
                    </h3>
                    <p className="text-sm text-navy-800/70 mb-4 leading-relaxed">
                      {p.description}
                    </p>
                    <dl className="space-y-2 text-sm border-t border-navy-50 pt-4">
                      <PriceRow label="Grundtaxe" value={formatChf(p.baseFee)} />
                      <PriceRow label="Pro Kilometer" value={`${formatChf(p.perKm)}/km`} />
                      <PriceRow label="Wartezeit" value={`${formatChf(p.waitingPerHour)}/h`} />
                      {p.companionPerHour && (
                        <PriceRow label="Begleitperson" value={`${formatChf(p.companionPerHour)}/h`} />
                      )}
                    </dl>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      {p.inclusive.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-navy-900">
                          <Check className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              {/* Zuschläge */}
              <div className="bg-white rounded-2xl border border-navy-50 p-6">
                <h3 className="text-lg font-bold text-navy-900 mb-3">Zuschläge & Konditionen</h3>
                <dl className="space-y-2 text-sm">
                  <PriceRow
                    label="Nacht-Zuschlag (22-06 Uhr)"
                    value={`+${SURCHARGE_PERCENT}%`}
                  />
                  <PriceRow label="Sonn- und Feiertage" value={`+${SURCHARGE_PERCENT}%`} />
                  <PriceRow label="Stornierung bis 2h vor Abholung" value="kostenlos" />
                </dl>
              </div>
            </div>

            {/* Kalkulator (sticky auf Desktop) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <PriceCalculator />
            </div>
          </div>
        </section>

        {/* Krankenkassen-Info */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-navy-900 mb-6">
              Krankenkassen-Abrechnung
            </h2>
            <div className="space-y-4 text-lg text-navy-800/85 leading-relaxed">
              <p>
                Bei medizinisch indizierten Fahrten kann ein Teil der Kosten über
                die Krankenkasse abgerechnet werden — wir kümmern uns für Sie um
                die gesamte Abrechnung.
              </p>
              <p>
                <strong>Voraussetzung:</strong> Eine ärztliche Verordnung. Sie müssen sich
                um nichts weiter kümmern.
              </p>
              <ul className="space-y-2 my-6">
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
                  <span>Fahrten zu Arzt, Klinik, Dialyse oder Therapie</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
                  <span>Reha- und Therapiefahrten</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
                  <span>Wir reichen die Abrechnung direkt bei Ihrer Kasse ein</span>
                </li>
              </ul>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-base">
                <p className="font-semibold text-navy-900 mb-1">Fragen zur Abrechnung?</p>
                <p className="text-navy-800/85">
                  Rufen Sie uns an unter{" "}
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="text-teal-700 font-bold underline whitespace-nowrap"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  {" "}— wir beraten Sie kostenlos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy-900 text-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Bereit für Ihre Fahrt?
            </h2>
            <p className="text-xl text-navy-50/85 mb-8">
              Jetzt direkt online buchen oder anrufen — wir sind 24 Stunden für Sie da.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#buchung"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-7 py-4 text-lg transition shadow-lg"
              >
                Fahrt jetzt buchen
              </Link>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-navy-50 text-navy-900 font-bold px-7 py-4 text-lg transition shadow-lg"
              >
                <Phone className="h-6 w-6" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-navy-800/75">{label}</dt>
      <dd className="text-navy-900 font-semibold font-mono">{value}</dd>
    </div>
  );
}
