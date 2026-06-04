/**
 * Zentrale Kontakt- und Service-Konstanten.
 * Telefonnummer aktuell PLATZHALTER — ersetzen sobald echte Nummer da ist.
 */

export const PHONE_DISPLAY = "+41 44 000 00 00"; // TODO: echte Nummer
export const PHONE_TEL = "+41440000000"; // TODO: echte Nummer
export const PHONE_WHATSAPP = "41440000000"; // TODO: echte Nummer (ohne + und Leerzeichen)

export const EMAIL = "info@cordavia.ch";

export const COMPANY_NAME = "Cordavia";

export const SERVICE_CANTONS = [
  { code: "ZH", name: "Zürich", slug: "zuerich" },
  { code: "SZ", name: "Schwyz", slug: "schwyz" },
  { code: "SG", name: "St.Gallen", slug: "st-gallen" },
  { code: "GL", name: "Glarus", slug: "glarus" },
] as const;

export const SERVICE_REGION_LABEL = "Kantone Zürich, Schwyz, St.Gallen und Glarus";
