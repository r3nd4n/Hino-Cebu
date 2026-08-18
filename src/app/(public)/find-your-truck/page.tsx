import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TruckFinder } from "@/components/trucks/TruckFinder";
import { Breadcrumbs, Container, PageHero } from "@/components/ui/Shared";
import { getEligibleTrucks } from "@/content/trucks";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const route = getEligibleRoutes().find(({ path, status }) => path === "/trucks" && status.startsWith("eligible"));
  if (!route || getEligibleTrucks().length === 0) return {};
  const purpose = getEligibleClaims("surface:trucks").find(({ category }) => category === "purpose")?.value;
  return createMetadata({ title: "Find a truck", description: purpose ?? "Review eligible truck model families.", path: "/find-your-truck" });
}

export default function FinderPage() {
  const routes = getEligibleRoutes();
  const trucksRoute = routes.find(({ path }) => path === "/trucks");
  const trucks = getEligibleTrucks();
  if (!trucksRoute || trucksRoute.status === "withheld" || trucks.length === 0) notFound();
  const claims = getEligibleClaims("surface:trucks");
  const identity = claims.find(({ category }) => category === "identity")?.value;
  const purpose = claims.find(({ category }) => category === "purpose")?.value;
  const quoteRoute = routes.find(({ path, status }) => path === "/quote" && status.startsWith("eligible"));

  return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Find a truck" }]} /></Container><PageHero eyebrow={identity ?? "Truck information"} title="Find a practical starting point" description={purpose ?? "Review eligible truck model families."} /><section className="section alt"><Container><TruckFinder models={trucks.map(({ slug, name }) => ({ slug, name }))} consultationHref={quoteRoute ? "/quote?source=truck-finder" : undefined} /></Container></section></>;
}
