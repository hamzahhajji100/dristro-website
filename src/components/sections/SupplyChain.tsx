import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Stop {
  label: string;
  description: string;
}

// Flache 2D-Illustration statt einer 3D-Szene: zuverlässiger, leichter
// (kein WebGL/Three.js nötig) und passend zum bestehenden flachen
// Icon-Stil der Seite (siehe Produktkarten). Eine einzelne durchgehende
// Route verbindet vier Stationen, ein Paket-Icon wandert per SVG
// animateMotion entlang des Pfads – daher "fließen" die Szenen ineinander
// statt harter Schnitte.
export async function SupplyChain() {
  const t = await getTranslations("SupplyChain");
  const stops = t.raw("stops") as Stop[];

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
          align="center"
        />

        <div className="relative mt-12 w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary-deep via-primary to-primary-dark shadow-card">
          <svg
            viewBox="0 0 1200 340"
            className="h-auto w-full"
            role="img"
            aria-label={t("canvasFallback")}
          >
            <defs>
              <linearGradient id="sc-building" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#128C90" />
                <stop offset="100%" stopColor="#085458" />
              </linearGradient>
              <linearGradient id="sc-truck" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F3C876" />
                <stop offset="100%" stopColor="#E3A73E" />
              </linearGradient>
            </defs>

            {/* Route */}
            <path
              id="sc-route"
              d="M130,255 C230,165 320,165 420,225 C520,285 610,285 710,215 C810,145 900,145 1000,235"
              fill="none"
              stroke="#E3A73E"
              strokeOpacity="0.5"
              strokeWidth="3"
              strokeDasharray="2 12"
              strokeLinecap="round"
            />

            {/* Station 1: Produktion + Flugzeug */}
            <g transform="translate(130,255)">
              <g className="supply-plane-bob" transform="translate(6,-142) rotate(-8)">
                <path
                  d="M-38,0 L30,0 L46,-6 L30,-3 L14,-16 L6,-16 L14,-3 L-14,-3 L-22,-12 L-29,-12 L-24,-3 L-38,-3 Z"
                  fill="#FAFAF8"
                  stroke="#05393C"
                  strokeWidth="1.2"
                />
              </g>
              <rect x="-58" y="-78" width="116" height="78" rx="5" fill="url(#sc-building)" />
              <rect x="-58" y="-96" width="26" height="20" rx="2" fill="#085458" />
              <rect x="-14" y="-46" width="26" height="46" rx="2" fill="#FAFAF8" />
              <rect x="20" y="-60" width="20" height="20" rx="2" fill="#E3A73E" />
            </g>

            {/* Station 2: Container auf Lkw */}
            <g transform="translate(420,225)">
              <rect x="-70" y="-64" width="100" height="52" rx="4" fill="#C1653F" />
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1={-64 + i * 20}
                  y1="-64"
                  x2={-64 + i * 20}
                  y2="-12"
                  stroke="#9C4F31"
                  strokeWidth="2"
                />
              ))}
              <rect x="30" y="-40" width="42" height="28" rx="3" fill="url(#sc-truck)" />
              <rect x="-72" y="-16" width="144" height="16" rx="3" fill="#05393C" />
              <circle className="supply-wheel" cx="-40" cy="4" r="12" fill="#2C2C2A" />
              <circle cx="-40" cy="4" r="4" fill="#FAFAF8" />
              <circle className="supply-wheel" cx="46" cy="4" r="12" fill="#2C2C2A" />
              <circle cx="46" cy="4" r="4" fill="#FAFAF8" />
            </g>

            {/* Station 3: Lagerregal */}
            <g transform="translate(710,215)">
              <rect x="-60" y="-100" width="120" height="8" rx="2" fill="#085458" />
              <rect x="-60" y="-56" width="120" height="8" rx="2" fill="#085458" />
              <rect x="-60" y="-12" width="120" height="8" rx="2" fill="#085458" />
              <rect x="-56" y="-104" width="6" height="100" fill="#05393C" />
              <rect x="50" y="-104" width="6" height="100" fill="#05393C" />
              <rect className="supply-pulse" x="-44" y="-96" width="26" height="26" rx="3" fill="#E8A377" />
              <rect x="-10" y="-94" width="22" height="24" rx="3" fill="#E3A73E" />
              <rect className="supply-pulse" x="20" y="-52" width="26" height="26" rx="3" fill="#C1653F" />
              <rect x="-40" y="-50" width="22" height="24" rx="3" fill="#E3A73E" opacity="0.9" />
            </g>

            {/* Station 4: Supermarkt */}
            <g transform="translate(1000,235)">
              <rect x="-55" y="-62" width="110" height="62" rx="4" fill="#FAFAF8" />
              <rect x="-60" y="-78" width="120" height="18" rx="3" fill="#C1653F" />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect
                  key={i}
                  x={-58 + i * 20}
                  y="-62"
                  width="10"
                  height="16"
                  fill={i % 2 === 0 ? "#C1653F" : "#FAFAF8"}
                  stroke="#9C4F31"
                  strokeWidth="0.6"
                />
              ))}
              <rect x="-18" y="-34" width="36" height="34" rx="2" fill="#0B6E76" />
              <circle cx="-30" cy="-20" r="8" fill="#E3A73E" opacity="0.9" />
            </g>

            {/* Wanderndes Paket entlang der Route */}
            <g>
              <rect x="-9" y="-9" width="18" height="16" rx="2" fill="#A9754C" stroke="#7C5334" strokeWidth="1" />
              <line x1="0" y1="-9" x2="0" y2="7" stroke="#7C5334" strokeWidth="1.4" />
              <animateMotion dur="13s" repeatCount="indefinite" rotate="auto">
                <mpath href="#sc-route" />
              </animateMotion>
            </g>
          </svg>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {stops.map((stop) => (
            <div key={stop.label} className="text-center sm:text-left">
              <h3 className="font-heading text-base font-bold text-primary">
                {stop.label}
              </h3>
              <p className="mt-1.5 text-sm text-foreground/70">
                {stop.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
