import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { ProductHighlight } from "@/components/sections/ProductHighlight";
import { SupplyChain } from "@/components/sections/SupplyChain";
import { WhyDristro } from "@/components/sections/WhyDristro";
import { ContactTeaser } from "@/components/sections/ContactTeaser";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustBar />
      <ProductHighlight />
      <SupplyChain />
      <WhyDristro />
      <ContactTeaser />
    </>
  );
}
