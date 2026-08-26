export type TruckSeriesSlug = "200-series" | "300-series" | "500-series" | "bus-puv";

export type TruckImageKey = "truck200" | "truck300" | "truck500" | "truckBusPuv";

export interface TruckApplication {
  title: string;
  description: string;
}

export interface TruckHighlight {
  title: string;
  description: string;
}

interface TruckSeriesBase {
  slug: TruckSeriesSlug;
  name: string;
  category: string;
  description: string;
  href: string;
  imageKey: TruckImageKey;
  heroCopy: string;
  applications: readonly TruckApplication[];
  availabilityNotice: string;
  availability: "requires-verification";
}

export type TruckRange =
  | (TruckSeriesBase & { mode: "rich"; highlights: readonly TruckHighlight[] })
  | (TruckSeriesBase & { mode: "lightweight" });

interface ContentSource {
  publisher: "Hino Motors Philippines";
  url: string;
  reviewedOn: string;
  supports: readonly string[];
}

type SourcedTruckSeries = TruckRange & {
  source?: ContentSource;
};

const detailAvailabilityNotice =
  "Current Cebu availability and detailed requirements need local confirmation. Ask Hino Cebu about your operation before making a selection.";

const sourcedTruckSeries: readonly SourcedTruckSeries[] = [
  {
    slug: "200-series",
    name: "Hino 200 Series",
    category: "Light-Duty Truck",
    description: "Compact and practical for urban delivery and everyday commercial use.",
    href: "/trucks/200-series",
    imageKey: "truck200",
    mode: "lightweight",
    heroCopy: "Explore a compact commercial range with your route, body, and operating needs in view.",
    applications: [
      { title: "Urban deliveries", description: "Explore local delivery and distribution conversations." },
      { title: "Everyday business movement", description: "Tell us about your cargo, route, and operating pattern." },
    ],
    availabilityNotice: detailAvailabilityNotice,
    availability: "requires-verification",
  },
  {
    slug: "300-series",
    name: "Hino 300 Series",
    category: "Light / Medium-Duty Truck",
    description: "A versatile Hino platform for growing businesses, fleets, and commercial applications.",
    href: "/trucks/300-series",
    imageKey: "truck300",
    mode: "rich",
    heroCopy: "Start with the work: routes, cargo, body requirements, and the day-to-day driver experience.",
    applications: [
      { title: "Distribution routes", description: "Explore delivery and distribution needs across urban and regional routes." },
      { title: "Growing operations", description: "Tell us about changing cargo, route, and fleet requirements." },
      { title: "Commercial body needs", description: "Ask how body and operating requirements shape the conversation." },
    ],
    highlights: [
      { title: "Practical operation", description: "Explore maneuverability and operating themes that vary by model and configuration." },
      { title: "Driver-focused cab", description: "Ask about comfort and cab features available on select models." },
      { title: "Service access", description: "Discuss inspection and service-access features, which vary by model." },
    ],
    availabilityNotice: detailAvailabilityNotice,
    availability: "requires-verification",
    source: {
      publisher: "Hino Motors Philippines",
      url: "https://hino.com.ph/300-series",
      reviewedOn: "2026-08-26",
      supports: ["series positioning", "operation themes", "cab themes", "service-access themes"],
    },
  },
  {
    slug: "500-series",
    name: "Hino 500 Series",
    category: "Medium / Heavy-Duty Truck",
    description: "Built for demanding cargo, construction, hauling, and fleet requirements.",
    href: "/trucks/500-series",
    imageKey: "truck500",
    mode: "rich",
    heroCopy: "Begin a focused conversation about demanding commercial work, operating conditions, and driver needs.",
    applications: [
      { title: "Cargo and hauling", description: "Explore cargo movement with route, load, and body requirements in view." },
      { title: "Construction operations", description: "Tell us about jobsite access, operating conditions, and body needs." },
      { title: "Fleet conversations", description: "Ask about the operating and support priorities of your fleet." },
    ],
    highlights: [
      { title: "Durability-focused design", description: "Explore durability themes that vary by model and intended operation." },
      { title: "Driver operation", description: "Ask about cab and control features available on select models." },
      { title: "Safety themes", description: "Discuss safety-related features and systems, which vary by model." },
    ],
    availabilityNotice: detailAvailabilityNotice,
    availability: "requires-verification",
    source: {
      publisher: "Hino Motors Philippines",
      url: "https://www.hino.com.ph/500-series",
      reviewedOn: "2026-08-26",
      supports: ["series positioning", "durability themes", "driver-operation themes", "safety themes"],
    },
  },
  {
    slug: "bus-puv",
    name: "Hino Bus & PUV",
    category: "Passenger Transport",
    description: "Commercial passenger solutions supported by Hino engineering and local service.",
    href: "/trucks/bus-puv",
    imageKey: "truckBusPuv",
    mode: "lightweight",
    heroCopy: "Explore passenger-transport needs with route, capacity, body, and operating requirements in view.",
    applications: [
      { title: "Passenger routes", description: "Tell us about route patterns and operating requirements." },
      { title: "Institutional transport", description: "Ask about passenger-transport conversations for organizations." },
    ],
    availabilityNotice: detailAvailabilityNotice,
    availability: "requires-verification",
  },
] as const;

export type PublicTruckSeries = TruckRange;

function toPublicTruckSeries(series: SourcedTruckSeries): PublicTruckSeries {
  const publicFields = {
    slug: series.slug,
    name: series.name,
    category: series.category,
    description: series.description,
    href: series.href,
    imageKey: series.imageKey,
    heroCopy: series.heroCopy,
    applications: series.applications,
    availabilityNotice: series.availabilityNotice,
    availability: series.availability,
  };

  return series.mode === "rich"
    ? { ...publicFields, mode: "rich", highlights: series.highlights }
    : { ...publicFields, mode: "lightweight" };
}

export const publicTruckSeries: readonly PublicTruckSeries[] = sourcedTruckSeries.map(toPublicTruckSeries);

export const truckRanges: readonly TruckRange[] = publicTruckSeries;

export function getPublicTruckSeries(slug: TruckSeriesSlug): PublicTruckSeries | undefined {
  const series = sourcedTruckSeries.find((entry) => entry.slug === slug);
  return series ? toPublicTruckSeries(series) : undefined;
}

export const businessUses = [
  "Delivery / Distribution",
  "Logistics / Fleet",
  "Construction",
  "Hauling / Cargo",
  "Food / Cold Chain",
  "Passenger Transport",
  "Government / Institutional",
  "Other",
] as const;
