import { MapPin } from "./icons";
import { Eyebrow } from "./Eyebrow";
import { SERVICE_CANTONS } from "@/lib/contact";

type RegionContent = {
  code: typeof SERVICE_CANTONS[number]["code"];
  intro: string;
  hubs: string;
  facilities: string;
};

const REGION_CONTENT: Record<string, RegionContent> = {
  ZH: {
    code: "ZH",
    intro:
      "Patientenfahrten in der gesamten Region Zürich – von der Stadt bis ins Zürcher Oberland und entlang dem See.",
    hubs: "Zürich Stadt · Winterthur · Uster · Wetzikon · Bülach · Dietikon",
    facilities:
      "Universitätsspital Zürich · Stadtspital Triemli · Spital Limmattal · Reha Wald · Klinik Hirslanden",
  },
  SZ: {
    code: "SZ",
    intro:
      "Im Kanton Schwyz sind wir für Sie da – von Einsiedeln bis Pfäffikon, von der Höfen bis ins Wägital.",
    hubs: "Schwyz · Einsiedeln · Pfäffikon · Lachen · Küssnacht · Brunnen",
    facilities:
      "Spital Schwyz · Spital Lachen · Klinik Einsiedeln · Praxen in March und Höfe",
  },
  SG: {
    code: "SG",
    intro:
      "Im Kanton St.Gallen begleiten wir Patientinnen und Patienten zwischen Linthebene, Toggenburg und Rheintal.",
    hubs: "St.Gallen · Rapperswil-Jona · Uznach · Wil · Buchs · Heerbrugg",
    facilities:
      "Kantonsspital St.Gallen · Spital Linth · Spital Wil · Klinik Stephanshorn · Reha-Zentrum Walenstadtberg",
  },
  GL: {
    code: "GL",
    intro:
      "Im Glarnerland fahren wir Sie verlässlich – von Glarus über Netstal bis hinauf nach Linthal.",
    hubs: "Glarus · Netstal · Näfels · Mollis · Schwanden · Linthal",
    facilities:
      "Kantonsspital Glarus · Praxisgemeinschaft Glarus · Reha-Klinik Braunwald",
  },
};

export function Regions() {
  return (
    <section id="regionen" className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="mb-5">
            <Eyebrow>Service-Region</Eyebrow>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-4">
            Wir fahren in vier Kantonen.
          </h2>
          <p className="text-xl text-navy-800/80 leading-relaxed">
            VitaWay ist in den Kantonen Zürich, Schwyz, St.Gallen und Glarus
            unterwegs. Innerhalb der Schweiz und auch grenzüberschreitend auf
            Anfrage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {SERVICE_CANTONS.map((canton) => {
            const c = REGION_CONTENT[canton.code];
            return (
              <article
                key={canton.code}
                id={`region-${canton.slug}`}
                className="bg-surface-muted rounded-2xl p-7 border border-navy-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-teal-300">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-navy-900">
                      Kanton {canton.name}
                    </h3>
                    <p className="text-sm font-mono text-navy-800/75 uppercase tracking-wider">
                      {canton.code}
                    </p>
                  </div>
                </div>
                <p className="text-navy-800/80 mb-4 leading-relaxed">
                  {c.intro}
                </p>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-navy-900 mb-1">Orte</dt>
                    <dd className="text-navy-800/75">{c.hubs}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-navy-900 mb-1">
                      Häufig angefahren
                    </dt>
                    <dd className="text-navy-800/75">{c.facilities}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>

        <p className="text-center text-navy-800/70 mt-10 max-w-2xl mx-auto">
          Sie wohnen ausserhalb dieser Kantone oder benötigen einen
          interkantonalen Transport? Rufen Sie uns an – wir finden eine Lösung.
        </p>
      </div>
    </section>
  );
}
