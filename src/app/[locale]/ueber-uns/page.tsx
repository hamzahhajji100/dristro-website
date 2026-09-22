import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type PageParams = { locale: string };

interface Value {
  title: string;
  description: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/ueber-uns" },
  };
}

export default async function UeberUnsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const intro = t.raw("intro") as string[];
  const values = t.raw("values") as Value[];

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        {/* TODO: durch echte Firmengeschichte/Mission ersetzen */}
        <div className="mt-8 max-w-3xl space-y-4 text-base text-foreground/80 sm:text-lg">
          {intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="rounded-lg border border-primary/10 bg-white p-6">
            {/* TODO: durch echtes Foto ersetzen */}
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
              HH
            </div>
            <p className="mt-4 text-center font-heading text-lg font-bold text-primary">
              {t("founderName")}
            </p>
            <p className="text-center text-sm text-foreground/60">
              {t("founderRole")}
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">
              {t("founderHeading")}
            </h2>
            {/* TODO: durch echten Gründer-Text ersetzen */}
            <p className="mt-4 text-base text-foreground/80">
              {t("founderText")}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-primary">
            {t("valuesHeading")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-lg border border-primary/10 bg-white p-6"
              >
                <h3 className="font-heading text-base font-bold text-primary">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/75">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
