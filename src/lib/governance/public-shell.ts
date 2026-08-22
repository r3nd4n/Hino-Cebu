import { getEligibleBranch, getEligibleContactActions } from "@/content/site";
import { getEligibleTrucks } from "@/content/trucks";
import { getEligibleRoutes } from "./eligibility";

export type PublicShellNavigationId =
  | "trucks"
  | "find-your-truck"
  | "parts"
  | "service"
  | "hino-cebu"
  | "quote";

export type PublicShellNavigationItem = {
  navigationId: PublicShellNavigationId;
  label: string;
  href: string;
  kind: "link" | "primary";
};

const governedDestinations = {
  "ROUTE-TRUCKS": { navigationId: "trucks", label: "Trucks", href: "/trucks", kind: "link" },
  "ROUTE-PARTS": { navigationId: "parts", label: "Parts", href: "/parts", kind: "link" },
  "ROUTE-SERVICE": { navigationId: "service", label: "Service", href: "/service", kind: "link" },
  "ROUTE-QUOTE": { navigationId: "quote", label: "Get a Quote", href: "/quote", kind: "primary" },
} as const satisfies Readonly<Record<string, PublicShellNavigationItem>>;

const derivedDestinations = {
  findYourTruck: {
    navigationId: "find-your-truck",
    label: "Find Your Truck",
    href: "/find-your-truck",
    kind: "link",
  },
  hinoCebu: {
    navigationId: "hino-cebu",
    label: "Hino Cebu",
    href: "/hino-cebu",
    kind: "link",
  },
} as const satisfies Readonly<Record<string, PublicShellNavigationItem>>;

export function getPublicShellNavigation(now = new Date()): PublicShellNavigationItem[] {
  const eligibleRoutes = new Map(
    getEligibleRoutes(now)
      .filter(({ status }) => status !== "withheld")
      .map((route) => [route.routeId, route]),
  );
  const eligibleBranch = getEligibleBranch(now);
  const hasEligibleBranchAction = getEligibleContactActions(now).length > 0;
  const hasRecommendableTruck = eligibleRoutes.has("ROUTE-TRUCKS") && getEligibleTrucks(now).length > 0;

  const navigation: Array<PublicShellNavigationItem | null> = [
    eligibleRoutes.has("ROUTE-TRUCKS") ? governedDestinations["ROUTE-TRUCKS"] : null,
    hasRecommendableTruck ? derivedDestinations.findYourTruck : null,
    eligibleRoutes.has("ROUTE-PARTS") ? governedDestinations["ROUTE-PARTS"] : null,
    eligibleRoutes.has("ROUTE-SERVICE") ? governedDestinations["ROUTE-SERVICE"] : null,
    eligibleBranch.identity && hasEligibleBranchAction ? derivedDestinations.hinoCebu : null,
    eligibleRoutes.has("ROUTE-QUOTE") ? governedDestinations["ROUTE-QUOTE"] : null,
  ];
  return navigation.filter((item): item is PublicShellNavigationItem => item !== null);
}
