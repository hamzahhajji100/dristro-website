import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Reason {
  title: string;
  description: string;
}

export async function WhyDristro() {
  const t = await getTranslations("Home.why");
  const reasons = t.raw("reasons") as Reason[];

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          align="center"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-lg border border-primary/10 bg-background p-6"
            >
              <h3 className="font-heading text-lg font-bold text-primary">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm text-foreground/75">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
