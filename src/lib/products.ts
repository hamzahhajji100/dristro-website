import { Product } from "@/types";

// Strukturelle Produktdaten (Bild, Formate-Schlüssel). Übersetzbare Inhalte
// (Markenname, Produktname, Herkunft, Beschreibung) liegen in den
// messages/*.json-Dateien unter "Products.items.<slug>" und werden über
// buildProducts() mit diesen strukturellen Daten zusammengeführt.
//
// WICHTIG: Die Einträge sind bewusst als Produktkategorien statt als
// konkrete, real existierende Fremdmarken angelegt (kein "Prime", keine
// "Jana"/"Sola" o.Ä.), um keine ungeprüften/fiktiven Handelsbeziehungen mit
// echten Marken auf der Website zu behaupten. Sobald reale Vertriebsverträge
// stehen, hier die tatsächlichen Bilder eintragen und in messages/*.json die
// echten Markennamen/Beschreibungen ergänzen.
// TODO: durch echte Marken/Produkte ersetzen, sobald Vertriebsverträge stehen
export const productSlugs = [
  "kokoswasser",
  "energy-drinks",
  "eistee",
  "erfrischungsgetraenke",
  "snacks",
] as const;

export type ProductSlug = (typeof productSlugs)[number];

const productImages: Record<ProductSlug, string> = {
  kokoswasser: "/images/products/kokoswasser.svg",
  "energy-drinks": "/images/products/energy-drink.svg",
  eistee: "/images/products/eistee.svg",
  erfrischungsgetraenke: "/images/products/erfrischungsgetraenk.svg",
  snacks: "/images/products/snacks.svg",
};

interface ProductsTranslator {
  (key: string): string;
  raw: (key: string) => unknown;
}

export function buildProducts(t: ProductsTranslator): Product[] {
  return productSlugs.map((slug) => ({
    slug,
    brand: t(`items.${slug}.brand`),
    name: t(`items.${slug}.name`),
    origin: t(`items.${slug}.origin`),
    description: t(`items.${slug}.description`),
    formats: t.raw(`items.${slug}.formats`) as string[],
    image: productImages[slug],
  }));
}
