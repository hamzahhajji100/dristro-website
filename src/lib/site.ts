// Strukturelle Site-Konfiguration. Übersetzbare Texte (Navigation, Footer,
// Metadaten etc.) liegen in den messages/*.json-Dateien.
export const siteConfig = {
  name: "dristro",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dristro.com",
  contact: {
    email: "info@dristro.com",
    phone: "+49 1622 733296",
    phoneHref: "+491622733296",
  },
  // Grobe Standortangabe für Footer/Kontaktseite; vollständige
  // ladungsfähige Anschrift steht im Impressum.
  location: "Neuss, Nordrhein-Westfalen, Deutschland",
  social: {
    // TODO: echte Social-Media-Profile ergänzen, sobald vorhanden
    linkedin: "https://www.linkedin.com/company/dristro",
    instagram: "https://www.instagram.com/dristro",
  },
};

// Kanonische Pfade (locale-unabhängig) + zugehöriger Übersetzungsschlüssel
// im "Nav"-Namespace der messages/*.json-Dateien.
export const navItems = [
  { href: "/", key: "home" },
  { href: "/ueber-uns", key: "about" },
  { href: "/sortiment", key: "products" },
  { href: "/partner-werden", key: "partner" },
  { href: "/kontakt", key: "contact" },
] as const;

export const footerLegalItems = [
  { href: "/impressum", key: "impressum" },
  { href: "/datenschutz", key: "datenschutz" },
] as const;
