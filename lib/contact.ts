/**
 * Zentrale Kontakt- und Service-Konstanten.
 */

export const PHONE_DISPLAY = "+41 76 606 41 15";
export const PHONE_TEL = "+41766064115";
export const PHONE_WHATSAPP = "41766064115";

export const EMAIL = "info@vitaway.ch";

export const COMPANY_NAME = "VitaWay";

export const SERVICE_CANTONS = [
  { code: "ZH", name: "Zürich", slug: "zuerich" },
  { code: "SZ", name: "Schwyz", slug: "schwyz" },
  { code: "SG", name: "St.Gallen", slug: "st-gallen" },
  { code: "GL", name: "Glarus", slug: "glarus" },
] as const;

export const SERVICE_REGION_LABEL = "Kantone Zürich, Schwyz, St.Gallen und Glarus";
