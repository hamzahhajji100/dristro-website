import { defineRouting } from "next-intl/routing";

export const locales = ["de", "en", "es", "fr"] as const;
export const defaultLocale = "de" as const;

export const localeLabels: Record<(typeof locales)[number], string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Standardsprache ohne Präfix ausliefern (dristro.com/... statt
  // dristro.com/de/...), andere Sprachen unter /en, /es, /fr.
  localePrefix: "as-needed",
});
