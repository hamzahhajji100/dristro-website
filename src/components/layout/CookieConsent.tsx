"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "dristro-cookie-consent";

interface ConsentState {
  necessary: true;
  optional: boolean;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

// true = es liegt bereits eine gespeicherte Cookie-Entscheidung vor.
function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    // localStorage evtl. nicht verfügbar (z.B. privater Modus) – Banner sicherheitshalber zeigen
    return false;
  }
}

// Während SSR/vor der Hydration gibt es keinen Zugriff auf localStorage;
// "true" verhindert, dass der Banner serverseitig kurz aufblitzt.
function getServerSnapshot() {
  return true;
}

export function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const hasStoredConsent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [dismissed, setDismissed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [optional, setOptional] = useState(false);

  function save(state: ConsentState) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore – Entscheidung gilt dann nur für die aktuelle Sitzung
    }
    setDismissed(true);
  }

  if (hasStoredConsent || dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/10 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-container px-5 py-6 sm:px-8">
        <p className="text-sm text-foreground/80">
          {t.rich("text", {
            link: (chunks) => (
              <Link
                href="/datenschutz"
                className="underline hover:text-primary"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>

        {showSettings && (
          <div className="mt-4 space-y-2 rounded border border-primary/10 bg-background p-4">
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input type="checkbox" checked disabled className="h-4 w-4" />
              {t("necessaryLabel")}
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input
                type="checkbox"
                checked={optional}
                onChange={(e) => setOptional(e.target.checked)}
                className="h-4 w-4"
              />
              {t("optionalLabel")}
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => save({ necessary: true, optional: true })}
            className="rounded bg-primary px-5 py-2.5 font-heading text-sm font-semibold text-background hover:bg-primary-dark"
          >
            {t("acceptAll")}
          </button>
          <button
            type="button"
            onClick={() => save({ necessary: true, optional: false })}
            className="rounded border border-primary/30 px-5 py-2.5 font-heading text-sm font-semibold text-primary hover:bg-primary/5"
          >
            {t("onlyNecessary")}
          </button>
          {!showSettings ? (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="px-5 py-2.5 font-heading text-sm font-semibold text-foreground/60 underline hover:text-primary"
            >
              {t("settings")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => save({ necessary: true, optional })}
              className="rounded border border-primary/30 px-5 py-2.5 font-heading text-sm font-semibold text-primary hover:bg-primary/5"
            >
              {t("saveSelection")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
