import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export async function Hero() {
  const t = await getTranslations("Home.hero");

  return (
    <section className="overflow-hidden bg-primary">
      <Container className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-background sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-background/80">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LinkButton href="/partner-werden" variant="secondary">
              {t("ctaPartner")}
            </LinkButton>
            <LinkButton href="/sortiment" variant="outlineInverse">
              {t("ctaProducts")}
            </LinkButton>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <Image
            src="/images/hero-products.svg"
            alt={t("imageAlt")}
            fill
            priority
            className="object-contain"
            sizes="(min-width: 1024px) 480px, 320px"
          />
        </div>
      </Container>
    </section>
  );
}
