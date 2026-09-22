import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";

type PageParams = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/kontakt" },
  };
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <div className="rounded-lg border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-bold text-primary">
                {t("directHeading")}
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                <li>
                  <span className="block text-xs uppercase tracking-wide text-foreground/50">
                    {t("emailLabel")}
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wide text-foreground/50">
                    {t("phoneLabel")}
                  </span>
                  <a
                    href={`tel:${siteConfig.contact.phoneHref}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wide text-foreground/50">
                    {t("locationLabel")}
                  </span>
                  <span className="font-semibold text-foreground">
                    {siteConfig.location}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-primary/10 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
