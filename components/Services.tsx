import { HeartPulse, Stretcher, Wheelchair, TaxiCar, ArrowRight } from "./icons";
import type { ReactNode } from "react";

type Service = {
  icon: ReactNode;
  title: string;
  description: string;
  items: string[];
};

const medicalServices: Service[] = [
  {
    icon: <HeartPulse className="h-8 w-8" />,
    title: "Krankenfahrten",
    description:
      "Begleitete Fahrten zu Arzt, Klinik, Dialyse, Reha und Therapie – mit Krankenkassen-Abrechnung.",
    items: [
      "Arzt- und Klinikfahrten",
      "Dialyse- und Reha-Fahrten",
      "Therapie- und Tagesklinik",
      "Krankenkassen-Abrechnung",
    ],
  },
  {
    icon: <Stretcher className="h-8 w-8" />,
    title: "Liegendtransporte",
    description:
      "Schonende Beförderung im Liegen – mit zertifizierten Tragen und medizinisch geschultem Personal.",
    items: [
      "Speziell ausgestattete Fahrzeuge",
      "Sanitäter und Fachpersonal",
      "Sanfte Umlagerung",
      "Begleitperson erlaubt",
    ],
  },
  {
    icon: <Wheelchair className="h-8 w-8" />,
    title: "Rollstuhltransporte",
    description:
      "Barrierefreie Fahrzeuge mit Hublift und geprüften Rückhaltesystemen – damit Sie selbstständig mobil bleiben.",
    items: [
      "Rampe und Hublift",
      "Zertifizierte Sicherungssysteme",
      "Auch für Elektro-Rollstühle",
      "Begleitperson willkommen",
    ],
  },
];

const taxiService: Service = {
  icon: <TaxiCar className="h-8 w-8" />,
  title: "Taxi-Service",
  description:
    "Als Zusatzleistung – komfortable Fahrten für Stadt, Flughafen oder private Wege.",
  items: [
    "Stadtfahrten",
    "Flughafen-Transfer",
    "Private Termine",
    "Kurierfahrten",
  ],
};

export function Services() {
  return (
    <section id="leistungen" className="py-20 sm:py-24 bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-500 font-semibold text-sm mb-4">
            Medizinische Transporte
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-4">
            Spezialisiert auf Patientenfahrten.
          </h2>
          <p className="text-xl text-navy-800/80 leading-relaxed">
            Wir sind in erster Linie medizinischer Transportdienst – mit
            geschultem Personal, zertifizierten Rückhaltesystemen und
            Krankenkassen-Abrechnung. Den klassischen Taxi-Service bieten wir
            ergänzend an.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {medicalServices.map((service) => (
            <article
              key={service.title}
              className="group relative bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition border border-navy-50 flex flex-col"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900 text-teal-300 mb-5">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">
                {service.title}
              </h3>
              <p className="text-navy-800/75 mb-5 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2 mb-6 text-base">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-navy-900"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#buchung"
                className="mt-auto inline-flex items-center gap-2 text-navy-900 font-semibold hover:text-teal-500 transition"
              >
                Jetzt anfragen
                <ArrowRight className="h-5 w-5" />
              </a>
            </article>
          ))}
        </div>

        {/* Taxi: dezent als Zusatzleistung */}
        <div className="mt-4 max-w-4xl">
          <p className="text-sm font-semibold text-navy-800/60 uppercase tracking-wider mb-4">
            Zusatzleistung
          </p>
          <article className="bg-white/60 border border-navy-50 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row gap-6 items-start">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-900 shrink-0">
              {taxiService.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                {taxiService.title}
              </h3>
              <p className="text-navy-800/75 mb-3 leading-relaxed">
                {taxiService.description}
              </p>
              <p className="text-sm text-navy-800/60">
                {taxiService.items.join(" · ")}
              </p>
            </div>
            <a
              href="#buchung"
              className="text-navy-900 font-semibold hover:text-teal-500 transition inline-flex items-center gap-2 shrink-0"
            >
              Anfragen <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
