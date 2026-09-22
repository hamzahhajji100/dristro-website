"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SupplyChainCanvas = dynamic(
  () => import("@/components/three/SupplyChainScene"),
  { ssr: false }
);

interface Stop {
  label: string;
  description: string;
}

// Lädt die (vergleichsweise schwere) 3D-Szene erst, wenn die Sektion in
// den sichtbaren Bereich scrollt, statt sie beim initialen Seitenaufbau
// mitzuladen.
export function SupplyChain() {
  const t = useTranslations("SupplyChain");
  const stops = t.raw("stops") as Stop[];
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const markerColors = ["#E8A377", "#5DCAA5", "#C1653F"];

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
          align="center"
        />

        <div
          ref={containerRef}
          className="relative mt-12 aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary-deep via-primary to-primary-dark shadow-card sm:aspect-[16/9]"
        >
          {visible ? (
            <SupplyChainCanvas />
          ) : (
            <span className="sr-only">{t("canvasFallback")}</span>
          )}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {stops.map((stop, index) => (
            <div key={stop.label} className="text-center sm:text-left">
              <h3 className="flex items-center justify-center gap-2 font-heading text-base font-bold text-primary sm:justify-start">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 flex-none rounded-full"
                  style={{ backgroundColor: markerColors[index] }}
                />
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
