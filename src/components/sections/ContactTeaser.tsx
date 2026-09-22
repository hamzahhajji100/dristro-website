import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export async function ContactTeaser() {
  const t = await getTranslations("Home.contactTeaser");

  return (
    <section className="bg-primary py-16 sm:py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-heading text-3xl font-bold text-background sm:text-4xl">
          {t("title")}
        </h2>
        <p className="max-w-xl text-background/80">{t("description")}</p>
        <LinkButton href="/kontakt" variant="secondary">
          {t("cta")}
        </LinkButton>
      </Container>
    </section>
  );
}
