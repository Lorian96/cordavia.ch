import { Shield, Clock, HeartPulse } from "./icons";
import type { ReactNode } from "react";

type Pillar = {
  icon: ReactNode;
  title: string;
  text: string;
};

const pillars: Pillar[] = [
  {
    icon: <Clock className="h-7 w-7" />,
    title: "24/7 Verfügbarkeit",
    text: "Tag und Nacht, an 365 Tagen im Jahr. Auch an Wochenenden und Feiertagen.",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Sicherheit zuerst",
    text: "Geschultes Personal, geprüfte Fahrzeuge und zertifizierte Rückhaltesysteme.",
  },
  {
    icon: <HeartPulse className="h-7 w-7" />,
    title: "Mit Herz & Empathie",
    text: "Wir nehmen uns Zeit – besonders für Senioren und Menschen mit Einschränkungen.",
  },
];

export function Trust() {
  return (
    <section
      id="vertrauen"
      className="py-20 sm:py-24 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy-50 text-navy-900 font-semibold text-sm mb-4">
            Warum uns Tausende vertrauen
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-4">
            Verlässlich. Menschlich. Professionell.
          </h2>
          <p className="text-xl text-navy-800/80 leading-relaxed">
            Seit Jahren Ihr Partner für Krankentransporte und Taxi-Service in
            der Region.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="text-center p-6 rounded-2xl bg-surface-muted border border-navy-50"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-navy-950 mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                {pillar.title}
              </h3>
              <p className="text-navy-800/75 leading-relaxed">{pillar.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 text-white text-center max-w-md">
            <div className="text-5xl font-black text-teal-300 mb-2">
              &lt; 60 Sek.
            </div>
            <div className="text-lg text-navy-50/90">Online-Buchung</div>
          </div>
        </div>
      </div>
    </section>
  );
}
