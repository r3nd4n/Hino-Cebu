export type TruckSeriesSlug = "200-series" | "300-series" | "500-series" | "bus-puv";

export interface TruckRange {
  slug: TruckSeriesSlug;
  name: string;
  category: string;
  description: string;
  href: string;
  availability: "requires-verification";
  sourceUrl?: string;
}

export const truckRanges: readonly TruckRange[] = [
  {
    slug: "200-series",
    name: "Hino 200 Series",
    category: "Light-Duty Truck",
    description: "Compact and practical for urban delivery and everyday commercial use.",
    href: "/trucks/200-series",
    availability: "requires-verification",
  },
  {
    slug: "300-series",
    name: "Hino 300 Series",
    category: "Light / Medium-Duty Truck",
    description: "A versatile Hino platform for growing businesses, fleets, and commercial applications.",
    href: "/trucks/300-series",
    availability: "requires-verification",
    sourceUrl: "https://hino.com.ph/300-series",
  },
  {
    slug: "500-series",
    name: "Hino 500 Series",
    category: "Medium / Heavy-Duty Truck",
    description: "Built for demanding cargo, construction, hauling, and fleet requirements.",
    href: "/trucks/500-series",
    availability: "requires-verification",
    sourceUrl: "https://www.hino.com.ph/500-series",
  },
  {
    slug: "bus-puv",
    name: "Hino Bus & PUV",
    category: "Passenger Transport",
    description: "Commercial passenger solutions supported by Hino engineering and local service.",
    href: "/trucks/bus-puv",
    availability: "requires-verification",
  },
] as const;

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
