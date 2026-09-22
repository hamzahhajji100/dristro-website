import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex min-h-[60vh] items-center py-16">
      <Container className="text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-primary">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-foreground/70">
          {t("description")}
        </p>
        <div className="mt-8 flex justify-center">
          <LinkButton href="/">{t("cta")}</LinkButton>
        </div>
      </Container>
    </div>
  );
}
