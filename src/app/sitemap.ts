import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { routing } from "@/i18n/routing";

const routes = [
  "",
  "/ueber-uns",
  "/sortiment",
  "/partner-werden",
  "/kontakt",
  "/impressum",
  "/datenschutz",
];

function localizedPath(route: string, locale: string) {
  if (locale === routing.defaultLocale) return route || "/";
  return `/${locale}${route}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = `${siteConfig.url}${localizedPath(route, locale)}`;
    }

    return {
      url: `${siteConfig.url}${localizedPath(route, routing.defaultLocale)}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "" ? 1 : 0.7,
      alternates: { languages },
    };
  });
}
