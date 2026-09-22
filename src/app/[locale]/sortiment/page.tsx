import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { LinkButton } from "@/components/ui/Button";
import { buildProducts } from "@/lib/products";

type PageParams = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/sortiment" },
  };
}

export default async function SortimentPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Products");
  const products = buildProducts(t);

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-dashed border-warm/40 bg-warm/5 p-10 text-center">
          <h2 className="font-heading text-xl font-bold text-primary">
            {t("comingSoonTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/70">
            {t("comingSoonText")}
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton href="/kontakt">{t("comingSoonCta")}</LinkButton>
          </div>
        </div>
      </Container>
    </div>
  );
}
