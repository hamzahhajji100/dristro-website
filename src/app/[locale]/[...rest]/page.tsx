import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type PageParams = { locale: string };

// Catch-all für unbekannte Pfade innerhalb einer Sprachversion (z.B.
// /en/irgendwas). Ohne diese Route würde Next.js für nicht existierende
// Unterpfade nicht zuverlässig in den [locale]-Layoutbaum einsteigen und
// stattdessen die generische, nicht übersetzte Standard-404-Seite zeigen
// statt src/app/[locale]/not-found.tsx.
export default async function CatchAll({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
