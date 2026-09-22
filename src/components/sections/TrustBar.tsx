import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { TrustBadge } from "@/components/ui/TrustBadge";

const icons = [
  <svg key="0" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2 10h16M10 2c2.5 2.2 2.5 13.8 0 16M10 2c-2.5 2.2-2.5 13.8 0 16"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>,
  <svg key="1" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 18s6-4.5 6-10a6 6 0 10-12 0c0 5.5 6 10 6 10z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M4 17c0-3.3 2.7-5 6-5s6 1.7 6 5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="7" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 11h14M7 7V5h6v2" stroke="currentColor" strokeWidth="1.6" />
  </svg>,
];

export async function TrustBar() {
  const t = await getTranslations("Home.trustBar");
  const items = t.raw("items") as string[];

  return (
    <section className="border-b border-primary/10 bg-white py-10">
      <Container className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {items.map((label, index) => (
          <TrustBadge key={label} icon={icons[index]} label={label} />
        ))}
      </Container>
    </section>
  );
}
