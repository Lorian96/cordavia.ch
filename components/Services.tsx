import { HeartPulse, Stretcher, Wheelchair, TaxiCar, ArrowRight } from "./icons";
import type { ReactNode } from "react";

type Service = {
  icon: ReactNode;
  title: string;
  description: string;
  items: string[];
};

const services: Service[] = [
  {
    icon: <HeartPulse className="h-8 w-8" />,
    title: "Krankenfahrten",
    description:
      "Sichere Beförderung zu Arzt, Krankenhaus, Dialyse, Reha und Therapie – mit Krankenkassen-Abrechnung.",
    items: ["Arzttermine", "Krankenhausfahrten", "Dialysefahrten", "Reha-Fahrten", "Therapiefahrten"],
  },
  {
    icon: <Stretcher className="h-8 w-8" />,
    title: "Liegendtransporte",
    description:
      "Komfortable und sichere Beförderung im Liegen für Patienten mit eingeschränkter Mobilität.",
    items: [
      "Speziell ausgestattete Fahrzeuge",
      "Medizinisch geschultes Personal",
      "Begleitung möglich",
      "Schonende Umlagerung",
    ],
  },
  {
    icon: <Wheelchair className="h-8 w-8" />,
    title: "Rollstuhltransporte",
    description:
      "Barrierefreie Fahrzeuge mit sicheren Befestigungssystemen – damit Sie mobil bleiben.",
    items: [
      "Rampen & Hublift",
      "Zertifizierte Sicherungssysteme",
      "Auch elektrische Rollstühle",
      "Begleitperson willkommen",
    ],
  },
  {
    icon: <TaxiCar className="h-8 w-8" />,
    title: "Taxi-Service",
    description:
      "Klassisches Taxi für Stadtfahrten, Privatfahrten und Kurierdienste – schnell und zuverlässig.",
    items: ["Stadtfahrten", "Privatfahrten", "Kurierfahrten", "Flughafen-Transfer"],
  },
];

export function Services() {
  return (
    <section id="leistungen" className="py-20 sm:py-24 bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-500 font-semibold text-sm mb-4">
            Unsere Leistungen
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-4">
            Vier Leistungen. Ein verlässlicher Partner.
          </h2>
          <p className="text-xl text-navy-800/80 leading-relaxed">
            Ob medizinischer Transport oder normale Taxifahrt – wir bringen Sie
            sicher und pünktlich ans Ziel.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
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
                Jetzt buchen
                <ArrowRight className="h-5 w-5" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
