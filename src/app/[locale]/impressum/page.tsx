import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { routing } from "@/i18n/routing";

type PageParams = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.impressumMeta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/impressum" },
    robots: { index: true, follow: true },
  };
}

// Angelegt für eine GbR mit zwei Gesellschaftern (Hamzah Hajji, Yunus Emre
// Deniz; Kleinunternehmerregelung § 19 UStG). Eine GbR wird – anders als
// OHG/KG – nicht ins Handelsregister eingetragen, daher entfällt dieser
// Abschnitt. Falls sich die Rechtsform ändert (z. B. Umwandlung in eine
// GmbH) oder weitere Gesellschafter dazukommen, Angaben entsprechend
// anpassen.
// TODO: bei Bedarf einen GbR-Vertrag/Gesellschaftsvertrag hinterlegen und
// prüfen, ob die Eintragung ins (seit 2024 freiwillige) Gesellschaftsregister
// sinnvoll ist.
//
// Folgende, bei einer reinen B2B-Firmenseite ohne redaktionelle Inhalte
// nicht einschlägige Abschnitte wurden bewusst weggelassen statt als
// Lückentext stehen zu lassen:
// - "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV" (nur bei
//   journalistisch-redaktionellen Inhalten wie einem Blog nötig)
// - EU-Streitschlichtung/OS-Plattform (die EU-ODR-Plattform wurde 2025
//   von der EU-Kommission abgeschaltet) und Verbraucherstreitbeilegung
//   (nur bei Verträgen mit Verbrauchern (B2C) einschlägig – dristro ist
//   ausschließlich B2B)
// Falls sich Rechtsform, Handelsregistereintrag oder USt-Status ändern
// (z. B. Umwandlung in eine GmbH), diese Abschnitte entsprechend ergänzen.
//
// Der Impressumstext bleibt bewusst auf Deutsch, unabhängig von der
// gewählten Sprache: Er zitiert deutsche Rechtsgrundlagen (§ 5 TMG) und
// ist rechtlich an das deutsche Recht gebunden. Eine (noch dazu ungeprüfte)
// Übersetzung von Rechtstexten würde das Risiko von Abweichungen/
// Fehlübersetzungen unnötig vervielfachen. Auf nicht-deutschen
// Sprachversionen wird stattdessen ein Hinweis samt Link zur deutschen
// Version angezeigt.
export default async function ImpressumPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");
  const isGerman = locale === routing.defaultLocale;

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
          Impressum
        </h1>

        {!isGerman && (
          <p className="mt-4 rounded border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground/80">
            {t("germanOnlyNotice")}
          </p>
        )}

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="mt-2">
              dristro GbR
              <br />
              Mainstraße 85
              <br />
              41469 Neuss, Nordrhein-Westfalen, Deutschland
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              Vertreten durch
            </h2>
            <p className="mt-2">
              Hamzah Hajji, Yunus Emre Deniz
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              Kontakt
            </h2>
            <p className="mt-2">
              Telefon: +49 1622 733296
              <br />
              E-Mail: info@dristro.com
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              Umsatzsteuer-ID
            </h2>
            <p className="mt-2">
              Gemäß § 19 UStG wird als Kleinunternehmer keine
              Umsatzsteuer erhoben und ausgewiesen.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
