import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TruckCard } from "@/components/trucks/TruckCard";
import { Breadcrumbs, Container, PageHero, SectionHeading } from "@/components/ui/Shared";
import { getEligibleTrucks } from "@/content/trucks";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const route = getEligibleRoutes().find(({ path, status }) => path === "/trucks" && status.startsWith("eligible"));
  if (!route) return {};
  const claims = getEligibleClaims("surface:trucks");
  return createMetadata({
    title: claims.find(({ category }) => category === "identity")?.value ?? "Truck information",
    description: claims.find(({ category }) => category === "purpose")?.value ?? "Review available truck information.",
    path: route.path,
  });
}

export default function TrucksPage() {
  const routes = getEligibleRoutes();
  const route = routes.find(({ path }) => path === "/trucks");
  if (!route || (route.status === "withheld" && !route.serveUnavailablePage)) notFound();
  const claims = getEligibleClaims("surface:trucks");
  const trucks = getEligibleTrucks();
  const eligiblePaths = new Set(routes.filter(({ status }) => status.startsWith("eligible")).map(({ path }) => path));
  const identity = claims.find(({ category }) => category === "identity")?.value;
  const purpose = claims.find(({ category }) => category === "purpose")?.value;
  const request = claims.find(({ category }) => category === "request-semantics")?.value;

  return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: identity ?? "Trucks" }]} /></Container><PageHero eyebrow="Truck information" title={identity ?? "Truck information is currently unavailable"} description={purpose ?? "No verified local truck information is available right now."}>{trucks.length ? <Link className="button" href="/find-your-truck">Find Your Truck</Link> : null}{eligiblePaths.has("/quote") && request ? <Link className="button button-outline" href="/quote">{request}</Link> : null}</PageHero><section className="section"><Container><SectionHeading title={trucks.length ? "Explore model families" : "No verified model information right now"} description={trucks.length ? "Review currently eligible model-family information before requesting a configuration consultation." : "Model information appears only when its local applicability, wording, and source remain approved."} />{trucks.length ? <div className="grid grid-3">{trucks.map((truck) => <TruckCard truck={truck} key={truck.slug} />)}</div> : null}</Container></section></>;
}
