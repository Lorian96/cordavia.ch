import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AGB · Cordavia",
  description: "Allgemeine Geschäftsbedingungen für die Beförderungsleistungen von Cordavia.",
  robots: { index: true, follow: true },
};

export default function AgbPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-muted">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-black text-navy-900 mb-8">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-900">
            <strong>Hinweis:</strong> Dieser AGB-Entwurf ist ein Grundgerüst. Vor offizieller Verwendung
            sollte er von einer Fachperson (Anwalt für Verkehrs- und Transportrecht) rechtlich geprüft werden.
          </div>

          <div className="prose prose-lg max-w-none text-navy-800 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">1. Geltungsbereich</h2>
              <p>
                Diese AGB gelten für alle Beförderungsleistungen von <strong>[Firma]</strong> („Cordavia").
                Mit der Buchung einer Fahrt erkennt der Auftraggeber diese AGB an.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">2. Leistungsumfang</h2>
              <p>Cordavia bietet:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Krankenfahrten zu Arzt, Klinik, Dialyse, Reha und Therapie</li>
                <li>Liegendtransporte</li>
                <li>Rollstuhltransporte mit Hublift</li>
                <li>Taxi-Service als Zusatzleistung</li>
              </ul>
              <p>
                Der genaue Leistungsumfang ergibt sich aus der einzelnen Buchung. Bestätigte Abholzeiten
                können sich aufgrund von Verkehrslage oder unvorhergesehenen Ereignissen geringfügig
                verschieben.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">3. Buchung und Vertragsschluss</h2>
              <p>
                Buchungen sind telefonisch, per WhatsApp oder über das Online-Formular auf cordavia.ch
                möglich. Eine Buchung wird verbindlich, sobald Cordavia die Bestätigung mündlich oder
                schriftlich erteilt hat.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">4. Preise und Zahlung</h2>
              <p>
                Bei Krankenfahrten erfolgt die Abrechnung – sofern medizinisch indiziert und genehmigt –
                direkt mit der Krankenkasse. Eigenanteile, Selbstbehalte oder nicht von der Kasse
                übernommene Strecken werden dem Auftraggeber in Rechnung gestellt.
              </p>
              <p>
                Privatfahrten (Taxi-Service) werden nach festgelegtem Tarif berechnet. Zahlung erfolgt
                bar, mit Karte oder per Rechnung.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">5. Stornierung</h2>
              <p>
                Stornierungen sind bis 2 Stunden vor der gebuchten Abholzeit kostenlos. Bei kurzfristigerer
                Stornierung oder Nichterscheinen kann eine Pauschale bis zur Höhe des Fahrpreises in
                Rechnung gestellt werden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">6. Pflichten des Fahrgastes</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Anweisungen des Personals zur Sicherheit sind zu befolgen</li>
                <li>Bei Rollstuhl- oder Liegendtransport ist eine Begleitperson empfohlen, sofern medizinisch nötig</li>
                <li>Verschmutzungen oder Beschädigungen am Fahrzeug können in Rechnung gestellt werden</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">7. Haftung</h2>
              <p>
                Cordavia haftet im Rahmen der gesetzlichen Bestimmungen und der abgeschlossenen
                Personentransport-Versicherung. Bei Verspätungen oder Ausfällen aufgrund höherer Gewalt
                (z.B. Unwetter, Strassensperrung) ist eine Haftung ausgeschlossen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">8. Datenschutz</h2>
              <p>
                Die Bearbeitung personenbezogener Daten erfolgt gemäss unserer
                {" "}<a href="/datenschutz" className="text-teal-600 hover:underline">Datenschutzerklärung</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">9. Anwendbares Recht und Gerichtsstand</h2>
              <p>
                Es gilt Schweizer Recht. Gerichtsstand ist der Sitz von Cordavia, sofern gesetzlich
                zulässig.
              </p>
            </section>

            <p className="text-sm text-navy-800/60 mt-8">
              Stand: {new Date().toLocaleDateString("de-CH", { year: "numeric", month: "long" })}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
