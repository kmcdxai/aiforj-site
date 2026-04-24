import { TECHNIQUES } from "./techniques/data";
import { INTERVENTIONS } from "../data/interventions";
import { FEELING_PAGES, MOMENT_PAGES } from "../data/seoPages";

const BASE_URL = "https://aiforj.com";
const NOW = new Date("2026-04-23T12:00:00Z");

const staticRoutes = [
  "/",
  "/help",
  "/start",
  "/tools",
  "/weather",
  "/techniques",
  "/blueprint",
  "/companion",
  "/today",
  "/clinician-pack",
  "/family",
  "/organizations",
  "/organizations/reporting",
  "/sponsor",
  "/send",
  "/garden",
  "/find-help",
  "/why-aiforj",
  "/3am-spiral",
  "/overwhelmed",
  "/burned-out",
  "/about/founder",
  "/for",
  "/how-aiforj-stays-safe",
  "/editorial-policy",
  "/what-we-collect",
  "/admin/growth",
  "/receipt",
  "/redeem-family",
  "/redeem-gift",
  "/help/after-argument",
  "/help/anxiety-at-work",
  "/help/before-presentation",
  "/help/burnout-recovery",
  "/help/cant-sleep",
  "/help/comparison-trap",
  "/help/grief",
  "/help/imposter-syndrome",
  "/help/lonely",
  "/help/morning-dread",
  "/help/overthinking",
  "/help/panic-attack",
  "/help/perfectionism",
  "/help/self-worth",
  "/archetypes/architect",
  "/archetypes/empath",
  "/archetypes/ghost",
  "/archetypes/phoenix",
  "/archetypes/sentinel",
  "/archetypes/storm",
];

export default function sitemap() {
  const interventionList = Object.values(INTERVENTIONS).flatMap((emotion) =>
    ["quick", "medium", "deep"].flatMap((tier) => emotion[tier] || [])
  );

  const techniqueRoutes = TECHNIQUES.map((technique) => ({
    url: `${BASE_URL}/techniques/${technique.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const interventionRoutes = interventionList.map((intervention) => ({
    url: `${BASE_URL}/intervention/${intervention.id}`,
    lastModified: NOW,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const growthContentRoutes = [...FEELING_PAGES.map((page) => `/feelings/${page.slug}`), ...MOMENT_PAGES.map((page) => `/moments/${page.slug}`)]
    .map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.82,
    }));

  const coreRoutes = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: NOW,
    changeFrequency: route.startsWith("/help/") ? "monthly" : "weekly",
    priority:
      route === "/" ? 1 :
      route === "/start" || route === "/techniques" || route === "/companion" || route === "/help" ? 0.9 :
      route.startsWith("/help/") || route.startsWith("/archetypes/") ? 0.8 :
      0.7,
  }));

  return [...coreRoutes, ...techniqueRoutes, ...interventionRoutes, ...growthContentRoutes];
}
