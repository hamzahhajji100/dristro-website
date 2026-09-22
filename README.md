# dristro Website

B2B-Website für dristro (internationaler Getränke-Import & Vertrieb, NRW).
Next.js 16 (App Router), TypeScript, Tailwind CSS. Kein Onlineshop –
Fokus liegt auf B2B-Vertrauensaufbau und Lead-Generierung über das
Kontaktformular.

## Voraussetzungen

- Node.js 18.18 oder neuer (empfohlen: 20 LTS)
- npm (im Lieferumfang von Node.js enthalten)

## Installation

```bash
npm install
```

Danach `.env.example` nach `.env.local` kopieren und Werte eintragen:

```bash
cp .env.example .env.local
```

| Variable | Beschreibung |
| --- | --- |
| `RESEND_API_KEY` | API-Key von [Resend](https://resend.com) für den Versand der Kontaktformular-E-Mails. Ohne Key wird der Versand übersprungen und nur in die Konsole geloggt (praktisch für lokale Entwicklung). |
| `CONTACT_FROM_EMAIL` | Absenderadresse der Kontaktformular-E-Mails. |
| `CONTACT_TO_EMAIL` | Empfängeradresse, an die Anfragen gesendet werden. |
| `NEXT_PUBLIC_SITE_URL` | Vollständige Domain der Website, wird für Sitemap, robots.txt und Open-Graph-Tags verwendet. |

## Lokale Entwicklung

```bash
npm run dev
```

Die Seite ist danach unter [http://localhost:3000](http://localhost:3000)
erreichbar.

## Weitere Befehle

```bash
npm run build      # Produktions-Build erstellen
npm run start       # Produktions-Build lokal starten
npm run lint         # ESLint ausführen
npm run typecheck    # TypeScript ohne Emit prüfen
```

## Deployment

Die Seite ist für ein Deployment auf [Vercel](https://vercel.com)
vorbereitet (Standard-Next.js-Projekt, kein Sonder-Setup nötig). Beim
Import des Projekts müssen die Umgebungsvariablen aus `.env.example` im
Vercel-Projekt hinterlegt werden.

Alternativ kann die Seite mit `npm run build && npm run start` auf
jedem Node.js-fähigen Server betrieben werden.

## Mehrsprachigkeit

Die Website ist vollständig auf Deutsch, Englisch, Spanisch und
Französisch verfügbar (via [next-intl](https://next-intl.dev)).
Deutsch ist Standardsprache ohne URL-Präfix (`dristro.com/...`),
die anderen Sprachen liegen unter `/en`, `/es`, `/fr`. Der
Sprachumschalter sitzt im Header (Desktop und Mobile).

Übersetzungstexte liegen in `messages/{de,en,es,fr}.json`. Neue Texte
zuerst dort in allen vier Dateien ergänzen, dann per `useTranslations`
(Client-Komponenten) bzw. `getTranslations` (Server-Komponenten)
verwenden. Interne Links müssen `Link`/`usePathname`/`useRouter` aus
[`src/i18n/navigation.ts`](src/i18n/navigation.ts) statt `next/link`
verwenden, damit die Sprachpräfixe automatisch berücksichtigt werden.

**Impressum und Datenschutzerklärung bleiben bewusst auf Deutsch**,
unabhängig von der gewählten Sprache: Sie zitieren deutsche
Rechtsgrundlagen (§ 5 TMG, DSGVO) und sind an deutsches Recht gebunden.
Eine ungeprüfte Übersetzung von Rechtstexten hätte das Risiko von
Abweichungen nur vervielfacht. Auf nicht-deutschen Sprachversionen
zeigt die Seite stattdessen einen Hinweis samt Link zur deutschen
Version.

## Projektstruktur

```
messages/                Übersetzungen: de.json, en.json, es.json, fr.json
src/
  i18n/                  next-intl-Konfiguration (routing, navigation, request)
  proxy.ts               next-intl-Middleware für Sprach-Routing
  app/
    [locale]/            Alle mehrsprachigen Seiten (Home, Über uns, ...)
    api/                 API-Route (sprachunabhängig)
    sitemap.ts, robots.ts
  components/
    ui/                  Basis-Komponenten (Button, Container, Logo, ...)
    layout/              Header, Footer, CookieConsent, LanguageSwitcher
    sections/            Homepage-Sektionen (Hero, TrustBar, ...)
  lib/                   Site-Konfiguration, Produktdaten, E-Mail-Versand
  types/                 Geteilte TypeScript-Typen
public/images/            Platzhalter-Grafiken (SVG)
```

Neue Marken/Produkte können einfach in [`src/lib/products.ts`](src/lib/products.ts)
ergänzt werden – die Sortiment-Seite und `ProductCard` rendern jeden
Eintrag automatisch. Die aktuellen Einträge sind bewusst als
Produktkategorien (Kokoswasser, Energy Drinks, Eistee, ...) statt als
konkrete Fremdmarken angelegt, um keine ungeprüften Handelsbeziehungen
zu behaupten – siehe TODO-Kommentar in der Datei.

## Vor dem Livegang unbedingt erledigen

Der gesamte Code enthält `// TODO:`-Kommentare an den relevanten
Stellen. Die wichtigsten Punkte:

- **[Impressum](src/app/[locale]/impressum/page.tsx):** alle Platzhalter
  in eckigen Klammern (Firmenname, Anschrift, Vertretungsberechtigte,
  Handelsregister, USt-IdNr.) durch echte Daten ersetzen.
- **[Datenschutzerklärung](src/app/[locale]/datenschutz/page.tsx):** ist
  eine allgemeine Vorlage und **nicht rechtssicher** – vor Livegang von
  einem Anwalt prüfen lassen oder über einen Generator (z. B.
  [e-recht24.de](https://www.e-recht24.de)) erstellen/prüfen lassen.
- **Bilder:** alle Platzhalter-SVGs in `public/images/` durch echte
  Produktfotos/Bilder (idealerweise WebP) ersetzen, inkl. eines
  echten Open-Graph-Bilds als PNG/JPG (aktuell sprachunabhängig ein
  deutsches SVG).
- **E-Mail-Versand:** `RESEND_API_KEY` (oder alternativen Anbieter)
  produktiv hinterlegen und Versand testen.
- **Cookie-Consent:** Banner-Text prüfen, sobald feststeht, welche
  optionalen Cookies (z. B. Analyse-Tools) tatsächlich eingesetzt
  werden.
- **Übersetzungsqualität:** Englisch/Spanisch/Französisch wurden
  sorgfältig, aber maschinell/redaktionell durch das Modell erstellt –
  vor Livegang idealerweise von Muttersprachler:innen gegenlesen lassen.

- **Portfolio:** [`src/lib/products.ts`](src/lib/products.ts) enthält
  aktuell generische Produktkategorien statt konkreter Fremdmarken
  (siehe oben). Sobald reale Vertriebsverträge stehen, durch die
  tatsächlichen Marken, Bilder und Beschreibungen ersetzen.

## Status

Projekt wurde mit `npm install`, `npm run typecheck`, `npm run lint`
und `npm run build` erfolgreich verifiziert sowie im Dev-Server
(inkl. Kontaktformular-Flow, mobiler Navigation und Cookie-Banner)
manuell getestet.
