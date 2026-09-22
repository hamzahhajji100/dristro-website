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
  const t = await getTranslations({
    locale,
    namespace: "Legal.datenschutzMeta",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/datenschutz" },
    robots: { index: true, follow: true },
  };
}

// WICHTIG: Dieser Text ist eine allgemeine DSGVO-Vorlage und KEINE
// rechtssichere Datenschutzerklärung. Vor Livegang unbedingt von einem
// Anwalt prüfen lassen oder über einen Generator (z. B. e-recht24.de,
// Datenschutz-Generator.de) individuell erstellen/prüfen lassen.
// Alle Platzhalter in eckigen Klammern MÜSSEN ersetzt werden.
// TODO: durch echte, rechtlich geprüfte Datenschutzerklärung ersetzen
//
// Der Text bleibt bewusst auf Deutsch, unabhängig von der gewählten
// Sprache – siehe Begründung in impressum/page.tsx. Auf nicht-deutschen
// Sprachversionen wird stattdessen ein Hinweis samt Link zur deutschen
// Version angezeigt.
export default async function DatenschutzPage({
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
          Datenschutzerklärung
        </h1>

        {!isGerman && (
          <p className="mt-4 rounded border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground/80">
            {t("germanOnlyNotice")}
          </p>
        )}

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              1. Verantwortlicher
            </h2>
            <p className="mt-2">
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung
              (DSGVO) ist:
              <br />
              dristro GbR
              <br />
              Mainstraße 85, 41469 Neuss
              <br />
              E-Mail: info@dristro.com
              <br />
              Telefon: +49 1622 733296
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              2. Erhebung und Speicherung personenbezogener Daten beim
              Besuch der Website
            </h2>
            <p className="mt-2">
              Beim Aufrufen dieser Website erfasst unser Hosting-Anbieter
              automatisiert Informationen in sogenannten Server-Logfiles, die
              Ihr Browser übermittelt (z. B. IP-Adresse, Datum und Uhrzeit
              der Anfrage, Browsertyp, verwendetes Betriebssystem,
              Referrer-URL). Diese Daten sind nicht bestimmten Personen
              zuordenbar und werden ausschließlich zur Gewährleistung eines
              störungsfreien Betriebs sowie zur Verbesserung unseres
              Angebots ausgewertet (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              3. Kontaktformular
            </h2>
            <p className="mt-2">
              Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen,
              werden Ihre Angaben aus dem Formular inklusive der von Ihnen
              dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage
              und für den Fall von Anschlussfragen bei uns gespeichert. Diese
              Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p className="mt-2">
              Die Verarbeitung der in das Kontaktformular eingegebenen Daten
              erfolgt auf Grundlage eines berechtigten Interesses (Art. 6
              Abs. 1 lit. f DSGVO) bzw., sofern die Anfrage auf den
              Abschluss eines Vertrags abzielt, auf Grundlage von Art. 6
              Abs. 1 lit. b DSGVO. Der Versand der Anfrage erfolgt über den
              E-Mail-Dienstleister [Name des Dienstleisters, z. B. Resend,
              inkl. Link zur Datenschutzerklärung des Anbieters]. Die von uns
              erhobenen personenbezogenen Daten werden gelöscht, sobald sie
              für die Erreichung des Zwecks ihrer Erhebung nicht mehr
              erforderlich sind.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              4. Cookies
            </h2>
            <p className="mt-2">
              Diese Website verwendet technisch notwendige Cookies, um
              grundlegende Funktionen sicherzustellen. Optionale Cookies
              (z. B. für Statistik-/Reichweitenmessung) werden nur mit Ihrer
              Einwilligung über unser Cookie-Banner gesetzt. Sie können Ihre
              Einwilligung jederzeit über die Cookie-Einstellungen widerrufen
              oder anpassen. [Bei Einsatz von Analyse-Tools wie z. B. Google
              Analytics, Matomo etc. hier detailliert ergänzen: Anbieter,
              Zweck, Rechtsgrundlage, Speicherdauer, Widerspruchsmöglichkeit.]
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              5. Hosting
            </h2>
            <p className="mt-2">
              Diese Website wird bei [Name des Hosting-Anbieters, z. B.
              Vercel Inc.] gehostet. Der Anbieter verarbeitet in unserem
              Auftrag personenbezogene Daten, die beim Aufruf der Website
              anfallen. [Ggf. Hinweis auf Serverstandort außerhalb der
              EU/des EWR und Rechtsgrundlage der Übermittlung ergänzen, z. B.
              Standardvertragsklauseln.]
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              6. Ihre Rechte
            </h2>
            <p className="mt-2">
              Sie haben jederzeit das Recht auf Auskunft über Ihre bei uns
              gespeicherten personenbezogenen Daten, deren Herkunft und
              Empfänger sowie den Zweck der Datenverarbeitung (Art. 15
              DSGVO). Ihnen steht außerdem ein Recht auf Berichtigung (Art.
              16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der
              Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20
              DSGVO) sowie ein Widerspruchsrecht gegen die Verarbeitung (Art.
              21 DSGVO) zu. Zudem haben Sie das Recht, sich bei einer
              Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
              personenbezogenen Daten durch uns zu beschweren.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              7. Stand dieser Datenschutzerklärung
            </h2>
            <p className="mt-2">[Datum der letzten Aktualisierung]</p>
          </section>
        </div>
      </Container>
    </div>
  );
}
