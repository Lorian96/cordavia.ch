import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PHONE_DISPLAY, EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Impressum · VitaWay",
  description: "Impressum und rechtliche Angaben zu VitaWay – Medizinischer Transportdienst in der Schweiz.",
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-muted">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-black text-navy-900 mb-8">Impressum</h1>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-900">
            <strong>Hinweis:</strong> Diese Seite enthält noch Platzhalter. Die
            rechtlich verbindlichen Angaben werden ergänzt, sobald die
            Geschäftsdaten finalisiert sind.
          </div>

          <div className="prose prose-lg max-w-none text-navy-800 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">Angaben gemäss Art. 3 UWG</h2>
              <p>
                <strong>[Firma / Rechtsform]</strong>
                <br />
                [Strasse, Hausnummer]
                <br />
                [PLZ, Ort]
                <br />
                Schweiz
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">Kontakt</h2>
              <p>
                Telefon: <a href={`tel:${PHONE_DISPLAY}`} className="text-teal-600 hover:underline">{PHONE_DISPLAY}</a>
                <br />
                E-Mail: <a href={`mailto:${EMAIL}`} className="text-teal-600 hover:underline">{EMAIL}</a>
                <br />
                Web: vitaway.ch
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">Vertretungsberechtigte Person</h2>
              <p>[Vor- und Nachname Geschäftsführer/Inhaber]</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">Handelsregister</h2>
              <p>
                Eintrag im Handelsregister des Kantons [Kanton]
                <br />
                UID-Nummer: <span className="font-mono">CHE-XXX.XXX.XXX</span>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">Haftungsausschluss</h2>
              <p>
                Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit,
                Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den
                Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung
                bzw. Nichtnutzung der veröffentlichten Informationen entstehen, sind ausgeschlossen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">Urheberrechte</h2>
              <p>
                Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf
                dieser Website gehören ausschliesslich VitaWay oder den speziell genannten Rechteinhabern.
                Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung erforderlich.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
