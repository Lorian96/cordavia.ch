/**
 * Zentrale Kontakt- und Service-Konstanten.
 * Telefonnummer aktuell PLATZHALTER — ersetzen sobald echte Nummer da ist.
 */

export const PHONE_DISPLAY = "+41 76 606 41 15";
export const PHONE_TEL = "+41766064115";
export const PHONE_WHATSAPP = "41766064115";

export const EMAIL = "info@cordavia.ch";

export const COMPANY_NAME = "Cordavia";

export const SERVICE_CANTONS = [
  { code: "ZH", name: "Zürich", slug: "zuerich" },
  { code: "SZ", name: "Schwyz", slug: "schwyz" },
  { code: "SG", name: "St.Gallen", slug: "st-gallen" },
  { code: "GL", name: "Glarus", slug: "glarus" },
] as const;

export const SERVICE_REGION_LABEL = "Kantone Zürich, Schwyz, St.Gallen und Glarus";
