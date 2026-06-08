/**
 * Zentrales Preis-Schema für VitaWay.
 * Alle Tarife an EINER Stelle — ändern hier, gilt auf Preisseite + Kalkulator.
 * Stand: Juni 2026
 */

export type PriceCategory = "krankenfahrt" | "rollstuhl" | "liegend" | "taxi";

export type PriceItem = {
  id: PriceCategory;
  label: string;
  description: string;
  baseFee: number;        // Grundtaxe CHF
  perKm: number;          // CHF/km
  waitingPerHour: number; // Wartezeit CHF/h
  companionPerHour?: number; // Begleitperson CHF/h, falls anwendbar
  inclusive: string[];    // Was inkludiert ist
  highlight?: boolean;    // Hauptangebot hervorheben
};

export const SURCHARGE_NIGHT_FROM = 22; // Stunde
export const SURCHARGE_NIGHT_TO = 6;
export const SURCHARGE_PERCENT = 20;
export const MINIMUM_FARE = 25; // CHF Mindestumsatz

export const PRICES: PriceItem[] = [
  {
    id: "krankenfahrt",
    label: "Krankenfahrt",
    description:
      "Begleitete Fahrten zu Arzt, Klinik, Dialyse, Therapie oder Reha — mit Krankenkassen-Abrechnung.",
    baseFee: 8,
    perKm: 4.4,
    waitingPerHour: 60,
    inclusive: [
      "Hilfe beim Ein- und Aussteigen",
      "Begleitung bis zur Praxis-/Klinik-Tür",
      "Krankenkassen-Abrechnung wenn ärztlich verordnet",
    ],
    highlight: true,
  },
  {
    id: "rollstuhl",
    label: "Rollstuhltransport",
    description:
      "Barrierefreie Fahrzeuge mit Rampe oder Hublift, zertifizierte Rückhaltesysteme.",
    baseFee: 12,
    perKm: 5.2,
    waitingPerHour: 60,
    inclusive: [
      "Hublift oder Rampe",
      "Sichere Fixierung im Fahrzeug",
      "Auch Elektrorollstühle",
      "1 Begleitperson kostenlos",
    ],
    highlight: true,
  },
  {
    id: "liegend",
    label: "Liegendtransport",
    description:
      "Schonende Beförderung im Liegen mit zertifizierter Trage und geschultem Personal.",
    baseFee: 35,
    perKm: 8.5,
    waitingPerHour: 60,
    companionPerHour: 60,
    inclusive: [
      "Zertifizierte Trage und Sicherung",
      "Geschultes Personal",
      "Sanfte Umlagerung",
      "Sauerstoff auf Anfrage",
    ],
  },
  {
    id: "taxi",
    label: "Taxi (Stadt & Privat)",
    description:
      "Klassischer Taxi-Service für Stadtfahrten, Flughafen-Transfer oder Privatfahrten.",
    baseFee: 6.5,
    perKm: 3.9,
    waitingPerHour: 60,
    inclusive: [
      "Bis 4 Personen",
      "Gepäck im Preis enthalten",
      "Kartenzahlung möglich",
    ],
  },
];

export type CalculationInput = {
  category: PriceCategory;
  km: number;
  waitingMinutes?: number;
  nightOrHoliday?: boolean;
};

export type CalculationResult = {
  baseFee: number;
  kmCost: number;
  waitingCost: number;
  subtotal: number;
  surchargeAmount: number;
  total: number;
  appliedMinimum: boolean;
};

export function getPrice(category: PriceCategory): PriceItem {
  const p = PRICES.find((x) => x.id === category);
  if (!p) throw new Error(`Unknown price category: ${category}`);
  return p;
}

export function calculatePrice(input: CalculationInput): CalculationResult {
  const price = getPrice(input.category);
  const baseFee = price.baseFee;
  const kmCost = Math.max(0, input.km) * price.perKm;
  const waitingHours = (input.waitingMinutes ?? 0) / 60;
  const waitingCost = waitingHours * price.waitingPerHour;

  const subtotal = baseFee + kmCost + waitingCost;
  const surchargeAmount = input.nightOrHoliday ? subtotal * (SURCHARGE_PERCENT / 100) : 0;
  let total = subtotal + surchargeAmount;

  const appliedMinimum = total < MINIMUM_FARE;
  if (appliedMinimum) total = MINIMUM_FARE;

  return {
    baseFee,
    kmCost,
    waitingCost,
    subtotal,
    surchargeAmount,
    total,
    appliedMinimum,
  };
}

export function formatChf(n: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
