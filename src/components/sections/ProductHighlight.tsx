import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { buildProducts } from "@/lib/products";

// Zeigt eine Auswahl aus dem Portfolio, um zu signalisieren, dass dristro
// bereits mit mehreren Produktkategorien arbeitet und nicht nur ein
// einzelnes Produkt vertreibt.
export async function ProductHighlight() {
  const t = await getTranslations("Home.portfolio");
  const tProducts = await getTranslations("Products");
  const preview = buildProducts(tProducts).slice(0, 4);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {preview.map((product) => (
            <div
              key={product.slug}
              className="flex flex-col items-center rounded-lg border border-primary/10 bg-white p-4 text-center"
            >
              <div className="relative aspect-square w-full max-w-[120px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
              <p className="mt-3 font-heading text-sm font-bold text-primary">
                {product.brand}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <LinkButton href="/sortiment">{t("cta")}</LinkButton>
        </div>
      </Container>
    </section>
  );
}
