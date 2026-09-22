"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { navItems } from "@/lib/site";

export function Header() {
  const t = useTranslations("Nav");
  const tHeader = useTranslations("Header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-heading text-sm font-semibold transition-colors ${
                  active
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <LinkButton href="/partner-werden" className="text-sm">
            {tHeader("becomePartner")}
          </LinkButton>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="flex h-10 w-10 flex-none items-center justify-center rounded border border-primary/20"
            aria-label={open ? tHeader("closeMenu") : tHeader("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open ? (
                <path
                  d="M4 4L16 16M16 4L4 16"
                  stroke="#0F6E56"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 5H18M2 10H18M2 15H18"
                  stroke="#0F6E56"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-primary/10 bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded px-2 py-3 font-heading text-base font-semibold text-foreground/80 hover:bg-primary/5 hover:text-primary"
              >
                {t(item.key)}
              </Link>
            ))}
            <LinkButton
              href="/partner-werden"
              className="mt-2 justify-center"
              onClick={() => setOpen(false)}
            >
              {tHeader("becomePartner")}
            </LinkButton>
          </Container>
        </div>
      )}
    </header>
  );
}
