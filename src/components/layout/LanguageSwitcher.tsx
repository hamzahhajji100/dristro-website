"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeLabels } from "@/i18n/routing";

const localeCodes: Record<(typeof routing.locales)[number], string> = {
  de: "DE",
  en: "EN",
  es: "ES",
  fr: "FR",
};

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(nextLocale: (typeof routing.locales)[number]) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded border border-primary/20 px-3 py-2 font-heading text-sm font-semibold text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M1.5 8h13M8 1.5c1.8 1.6 1.8 11.4 0 13M8 1.5c-1.8 1.6-1.8 11.4 0 13"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
        {localeCodes[locale as (typeof routing.locales)[number]]}
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded border border-primary/10 bg-white py-1 shadow-lg"
        >
          {routing.locales.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                onClick={() => switchLocale(code)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-primary/5 ${
                  code === locale
                    ? "font-semibold text-primary"
                    : "text-foreground/80"
                }`}
              >
                {localeLabels[code]}
                <span className="text-xs text-foreground/40">
                  {localeCodes[code]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
