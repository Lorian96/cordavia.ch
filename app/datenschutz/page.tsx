import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Datenschutz · Cordavia",
  description: "Datenschutzerklärung von Cordavia – wie wir Ihre Daten verarbeiten und schützen.",
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-muted">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-black text-navy-900 mb-8">Datenschutzerklärung</h1>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-900">
            <strong>Hinweis:</strong> Diese Datenschutzerklärung ist ein Grundgerüst. Sie wird vor dem
            offiziellen Launch von einer Fachperson rechtlich geprüft und an Ihre konkreten
            Verarbeitungstätigkeiten angepasst.
          </div>

          <div className="prose prose-lg max-w-none text-navy-800 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">1. Verantwortliche Stelle</h2>
              <p>
                Verantwortlich für die Datenbearbeitung im Sinne des Schweizer Datenschutzgesetzes (DSG)
                sowie der EU-DSGVO ist:
              </p>
              <p>
                <strong>[Firma / Rechtsform]</strong>
                <br />
                [Adresse]
                <br />
                E-Mail: <a href={`mailto:${EMAIL}`} className="text-teal-600 hover:underline">{EMAIL}</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">2. Welche Daten wir erheben</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Buchungsdaten: Vor- und Nachname, Telefonnummer, Abhol- und Zielort, Datum und Uhrzeit</li>
                <li>Optional: E-Mail-Adresse, Hinweise zur Fahrt (z.B. Rollstuhl, Begleitperson)</li>
                <li>Technische Daten: IP-Adresse, Browser-Typ, Geräteinformationen (anonymisiert)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">3. Zweck der Datenbearbeitung</h2>
              <p>Wir bearbeiten Ihre Daten zur:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Durchführung Ihrer gebuchten Fahrt</li>
                <li>Kommunikation mit Ihnen (Bestätigung, Rückfragen)</li>
                <li>Abrechnung mit Krankenkassen (sofern zutreffend)</li>
                <li>Erfüllung gesetzlicher Aufbewahrungspflichten</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">4. Speicherdauer</h2>
              <p>
                Buchungsdaten werden gemäss gesetzlichen Aufbewahrungspflichten (in der Regel 10 Jahre nach
                Schweizer Obligationenrecht) gespeichert. Daten, die nicht mehr benötigt werden, werden
                gelöscht oder anonymisiert.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">5. Weitergabe an Dritte</h2>
              <p>
                Eine Weitergabe an Dritte erfolgt nur, wenn dies zur Vertragserfüllung notwendig ist (z.B.
                Abrechnung mit der Krankenkasse) oder gesetzlich vorgeschrieben.
              </p>
              <p>
                Technische Dienstleister wir nutzen:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Vercel Inc.</strong> (Hosting) – USA, EU-Standard­vertragsklauseln</li>
                <li><strong>Supabase Inc.</strong> (Datenbank, Frankfurt EU) – DSGVO-konform</li>
                <li><strong>Resend Inc.</strong> (Email-Versand) – USA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">6. Ihre Rechte</h2>
              <p>
                Sie haben das Recht auf:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Auskunft über Ihre gespeicherten Daten</li>
                <li>Berichtigung unrichtiger Daten</li>
                <li>Löschung Ihrer Daten (soweit keine gesetzlichen Aufbewahrungspflichten bestehen)</li>
                <li>Widerspruch gegen die Datenbearbeitung</li>
                <li>Datenübertragbarkeit</li>
              </ul>
              <p className="mt-3">
                Schreiben Sie uns dazu eine E-Mail an{" "}
                <a href={`mailto:${EMAIL}`} className="text-teal-600 hover:underline">{EMAIL}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">7. Cookies und Tracking</h2>
              <p>
                Cordavia setzt nur technisch notwendige Cookies ein. Es findet kein Tracking durch Dritte
                statt. Es werden keine Marketing-Cookies, Werbe-Cookies oder Cookies sozialer Netzwerke
                verwendet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">8. Kontakt zum Datenschutz</h2>
              <p>
                Bei Fragen zur Datenbearbeitung wenden Sie sich an:{" "}
                <a href={`mailto:${EMAIL}`} className="text-teal-600 hover:underline">{EMAIL}</a>
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
