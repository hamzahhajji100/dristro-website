import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export async function ContactTeaser() {
  const t = await getTranslations("Home.contactTeaser");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-deep py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-warm/20 blur-3xl"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
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
