import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { siteConfig, navItems, footerLegalItems } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");
  const tLegal = await getTranslations("Legal");

  return (
    <footer className="border-t border-primary/10 bg-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-foreground/70">
            {tFooter("tagline")} {siteConfig.location}.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
            {tFooter("navigationHeading")}
          </h3>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground/70 hover:text-primary"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
            {tFooter("contactHeading")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-foreground/70">
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="hover:text-primary"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.contact.phoneHref}`}
                className="hover:text-primary"
              >
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>{siteConfig.location}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
            {tFooter("legalHeading")}
          </h3>
          <ul className="mt-4 space-y-2">
            {footerLegalItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground/70 hover:text-primary"
                >
                  {tLegal(`${item.key}Meta.title`)}
                </Link>
              </li>
            ))}
          </ul>
          {/* TODO: echte Social-Media-Links ergänzen, sobald Profile bestehen */}
          <div className="mt-4 flex gap-3">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/50 hover:text-primary"
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/50 hover:text-primary"
            >
              Instagram
            </a>
          </div>
        </div>
      </Container>

      <div className="border-t border-primary/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-foreground/50 sm:flex-row">
          <p>{tFooter("copyright", { year: new Date().getFullYear() })}</p>
          <p>{tFooter("brandLine")}</p>
        </Container>
      </div>
    </footer>
  );
}
