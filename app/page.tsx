import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Regions } from "@/components/Regions";
import { Trust } from "@/components/Trust";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { Eyebrow } from "@/components/Eyebrow";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Regions />

        <section
          id="buchung"
          className="py-20 sm:py-24 bg-gradient-to-b from-surface-muted to-white"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="mb-5 flex justify-center">
                <Eyebrow>Online-Buchung</Eyebrow>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 mb-4">
                Fahrt buchen — in fünf Schritten
              </h2>
              <p className="text-xl text-navy-800/80 leading-relaxed">
                Einfach und übersichtlich. Wir rufen Sie zur Bestätigung an –
                E-Mail-Bestätigung auf Wunsch.
              </p>
            </div>
            <BookingForm />
          </div>
        </section>

        <Trust />
      </main>
      <Footer />
    </>
  );
}
