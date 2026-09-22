import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

type PageParams = { locale: string };

interface Audience {
  title: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Partner.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/partner-werden" },
  };
}

export default async function PartnerWerdenPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Partner");
  const audiences = t.raw("audiences") as Audience[];
  const steps = t.raw("steps") as Step[];

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="rounded-lg border border-primary/10 bg-white p-6"
            >
              <h3 className="font-heading text-lg font-bold text-primary">
                {audience.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/75">
                {audience.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="font-heading text-2xl font-bold text-primary">
            {t("stepsHeading")}
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="relative pl-12">
                <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-background">
                  {index + 1}
                </span>
                <h3 className="font-heading text-base font-bold text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/75">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-10 rounded-lg border border-primary/10 bg-white p-8 lg:grid-cols-[1fr_1.2fr] lg:p-12">
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">
              {t("formHeading")}
            </h2>
            <p className="mt-3 text-sm text-foreground/70">
              {t("formDescription")}
            </p>
          </div>
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
