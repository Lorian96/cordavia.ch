import { Shield, Clock, HeartPulse, Check } from "./icons";
import type { ReactNode } from "react";

type Pillar = {
  icon: ReactNode;
  title: string;
  text: string;
};

const pillars: Pillar[] = [
  {
    icon: <HeartPulse className="h-7 w-7" />,
    title: "Medizinische Kompetenz",
    text: "Geschultes Fachpersonal mit Erfahrung in Patientenbegleitung. Zertifizierte Rückhaltesysteme und sanitärtechnisch ausgerüstete Fahrzeuge.",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Sicherheit zuerst",
    text: "Geprüfte Fahrzeuge, Hublift für Rollstühle, sichere Fixierung. Wir arbeiten nach den Standards des medizinischen Krankentransports.",
  },
  {
    icon: <Clock className="h-7 w-7" />,
    title: "Rund um die Uhr für Sie",
    text: "24 Stunden am Tag, 365 Tage im Jahr. Auch an Wochenenden und Feiertagen. Termine planen oder kurzfristig anrufen – wir sind da.",
  },
];

const credentials = [
  "Krankenkassen-Abrechnung",
  "Medizinisch geschultes Personal",
  "Zertifizierte Rückhaltesysteme",
  "Hublift & barrierefreie Fahrzeuge",
  "Schweizer Qualitätsstandards",
  "Versichert nach SVG",
];

export function Trust() {
  return (
    <section id="vertrauen" className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy-50 text-navy-900 font-semibold text-sm mb-4">
            Über uns
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-4">
            Verlässlich. Menschlich. Professionell.
          </h2>
          <p className="text-xl text-navy-800/80 leading-relaxed">
            Cordavia steht für medizinischen Transport mit Ruhe und Erfahrung.
            Wir begleiten Patientinnen und Patienten – nicht nur fahren wir sie.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="text-center p-7 rounded-2xl bg-surface-muted border border-navy-50"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-navy-950 mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                {pillar.title}
              </h3>
              <p className="text-navy-800/75 leading-relaxed">{pillar.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-navy-900 text-white p-8 sm:p-10">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-teal-300 uppercase tracking-wider mb-2">
              Unsere Standards
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Was Sie bei uns erwarten dürfen
            </h3>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {credentials.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-navy-50/90 text-base"
              >
                <Check className="h-5 w-5 text-teal-300 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
