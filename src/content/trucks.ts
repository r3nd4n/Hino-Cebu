import {
  getGovernedClaims,
  getGovernedRoutes,
  type GovernedClaim,
  type GovernedRoute,
} from "./governance/claims";
import { evaluateApproval, getEligibleRoutes } from "../lib/governance/eligibility";

export type Truck = {
  routeId: string;
  claimIds: string[];
  slug: string;
  name: string;
  category: string;
  positioning: string;
  summary: string;
  uses: string[];
  applications: string[];
  details: { label: string; value: string }[];
  variants: string[];
  heroImage: string;
  sourceUrl: string;
  sourceLabel: string;
  lastReviewed: string;
  brochureUrl?: string;
  seoTitle: string;
  seoDescription: string;
  faqs: { question: string; answer: string }[];
};

const commonFaqs = (name: string) => [
  {
    question: `Is the ${name} suitable for my business?`,
    answer: "Suitability depends on payload, body configuration, route conditions, and operating requirements. Hino Cebu can help review these before you choose a configuration.",
  },
  {
    question: "Can I ask about financing?",
    answer: "Yes. Submit a financing inquiry so the team can discuss currently available, verified options without implying approval or fixed terms.",
  },
  {
    question: "Where can I request parts and service support?",
    answer: "Use the Hino Cebu parts and service request forms. A request is subject to team confirmation and is not an availability or appointment guarantee.",
  },
];

const truckCatalog: readonly Truck[] = [
  {
    routeId: "ROUTE-TRUCK-HINO-200",
    claimIds: ["CLAIM-TRUCKS-IDENTITY", "CLAIM-TRUCKS-PURPOSE", "CLAIM-TRUCKS-REQUEST", "CLAIM-TRUCKS-CONTACT", "CLAIM-HINO-200-DETAIL"],
    slug: "hino-200",
    name: "Hino 200",
    category: "Compact light-duty",
    positioning: "Hino's lightest Philippine commercial-truck line, designed for inner-city use with emphasis on maneuverability, GVW, and payload.",
    summary: "The Hino 200 uses a 2.755-liter Toyota 1GD-FTV Euro 4 diesel engine rated at 144 PS and 300 Nm. Final Cebu model and body availability must be confirmed.",
    uses: ["Urban delivery", "Retail distribution", "Light cargo", "Service bodies"],
    applications: ["Dry van", "Dropside", "Utility body", "Application subject to consultation"],
    details: [{ label: "Engine", value: "2.755 L Toyota 1GD-FTV Euro 4 diesel" }, { label: "Maximum output", value: "144 PS at 3,400 rpm" }, { label: "Maximum torque", value: "300 Nm at 1,200–3,200 rpm" }, { label: "Published GVW range", value: "3,490–3,800 kg, depending on model" }, { label: "Transmission", value: "R451 5-speed manual with overdrive" }],
    variants: ["315 NAC", "315", "415"],
    heroImage: "/images/official/hino-200.jpg",
    sourceUrl: "https://www.hino.com.ph/200-series",
    sourceLabel: "Hino Motors Philippines — Hino 200 Series",
    lastReviewed: "2026-08-18",
    brochureUrl: "https://www.hino.com.ph/File/200%20Series/200Series315Brochure.pdf",
    seoTitle: "Hino 200 Cebu | Compact Light-Duty Trucks | Hino Cebu",
    seoDescription: "Explore Hino 200 trucks for Cebu business applications and request a configuration consultation from Hino Cebu.",
    faqs: commonFaqs("Hino 200"),
  },
  {
    routeId: "ROUTE-TRUCK-HINO-300",
    claimIds: ["CLAIM-TRUCKS-IDENTITY", "CLAIM-TRUCKS-PURPOSE", "CLAIM-TRUCKS-REQUEST", "CLAIM-TRUCKS-CONTACT", "CLAIM-HINO-300-DETAIL"],
    slug: "hino-300",
    name: "Hino 300",
    category: "Light-duty",
    positioning: "A light-duty range combining compact dimensions with multiple GVW, wheelbase, cab, and transmission choices for business applications.",
    summary: "The official Philippine range uses the 4.009-liter Hino N04C Euro 4 engine family, with published outputs from 136–150 PS and torque from 390–420 Nm.",
    uses: ["Local distribution", "Food and beverage", "Logistics", "Construction supply"],
    applications: ["Aluminum van", "Refrigerated body", "Dropside", "Application subject to consultation"],
    details: [{ label: "Engine family", value: "4.009 L Hino N04C Euro 4 diesel" }, { label: "Published output range", value: "136–150 PS (ISO net), depending on model" }, { label: "Published torque range", value: "390–420 Nm (ISO net), depending on model" }, { label: "Published GVW range", value: "4,490–8,500 kg, depending on model" }, { label: "Transmissions", value: "5- or 6-speed manual; 6-speed automatic on 514 Auto" }],
    variants: ["414i", "414i Long", "414i 6W", "814i", "814i Extra Long", "514 Auto", "514", "616", "716", "716 Double", "916"],
    heroImage: "/images/official/hino-300.jpg",
    sourceUrl: "https://www.hino.com.ph/300-series",
    sourceLabel: "Hino Motors Philippines — Hino 300 Series",
    lastReviewed: "2026-08-18",
    brochureUrl: "https://www.hino.com.ph/File/300%20Series/01%20Hino%20300%20414i%20%28XZU309LN%29%20Brochure.pdf",
    seoTitle: "Hino 300 Series Cebu | Light-Duty Trucks | Hino Cebu",
    seoDescription: "Explore Hino 300 light-duty trucks for Cebu delivery and business use. Ask Hino Cebu about the right configuration.",
    faqs: commonFaqs("Hino 300"),
  },
  {
    routeId: "ROUTE-TRUCK-HINO-500",
    claimIds: ["CLAIM-TRUCKS-IDENTITY", "CLAIM-TRUCKS-PURPOSE", "CLAIM-TRUCKS-REQUEST", "CLAIM-TRUCKS-CONTACT", "CLAIM-HINO-500-DETAIL"],
    slug: "hino-500",
    name: "Hino 500",
    category: "Medium-duty",
    positioning: "A medium-duty and heavy commercial range designed for demanding operations, with multiple axle, GVW, wheelbase, and transmission configurations.",
    summary: "The Philippine lineup spans six-wheel, ten-wheel, dump, automatic, and tractor-head configurations. Power, torque, dimensions, and braking systems vary materially by model.",
    uses: ["Regional logistics", "Construction", "High-volume distribution", "Fleet operations"],
    applications: ["Cargo body", "Wing van", "Specialized body", "Application subject to consultation"],
    details: [{ label: "Published output range", value: "210–360 PS (ISO net), depending on model" }, { label: "Published torque range", value: "637–1,463 Nm (ISO net), depending on model" }, { label: "Published GVW range", value: "10,400–28,000 kg for rigid-truck models listed nationally" }, { label: "Published tractor GCM", value: "Up to 50,500 kg on the listed 2836 Tractor" }, { label: "Transmissions", value: "6- or 9-speed manual; 6-speed automatic on 1927 Auto" }],
    variants: ["1021", "1625", "1625 Long", "1927 Auto", "2629 6x2", "2629 6x4", "2836", "2836 Long", "2836 Dump", "2836 Tractor", "1735 Tractor"],
    heroImage: "/images/official/hino-500.jpg",
    sourceUrl: "https://www.hino.com.ph/Products%28500Series%29.aspx",
    sourceLabel: "Hino Motors Philippines — Hino 500 Series",
    lastReviewed: "2026-08-18",
    brochureUrl: "https://www.hino.com.ph/File/500%20Series/01%20Hino%20500%201021%20%28FC9JL7A%29%20Brochure.pdf",
    seoTitle: "Hino 500 Series Cebu | Medium-Duty Trucks | Hino Cebu",
    seoDescription: "Explore Hino 500 medium-duty trucks for Cebu fleet, logistics, and business needs with support from Hino Cebu.",
    faqs: commonFaqs("Hino 500"),
  },
];

export function getEligibleTrucks(
  now = new Date(),
  records: readonly Truck[] = truckCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  const trucksRoute = getEligibleRoutes(now, routes, claims)
    .find(({ path, status }) => path === "/trucks" && status.startsWith("eligible"));
  if (!trucksRoute) return [];

  const eligibleClaimIds = new Set(
    claims.filter((claim) => evaluateApproval(claim, now)).map(({ claimId }) => claimId),
  );

  return records.filter(({ claimIds }) => (
    claimIds.length > 0
    && claimIds.every((claimId) => eligibleClaimIds.has(claimId))
  ));
}

export function getEligibleTruck(
  slug: string,
  now = new Date(),
  records: readonly Truck[] = truckCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  return getEligibleTrucks(now, records, routes, claims).find((truck) => truck.slug === slug);
}

export const trucks = getEligibleTrucks();
