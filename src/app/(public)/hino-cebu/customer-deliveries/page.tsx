import { notFound } from "next/navigation";
import { Breadcrumbs, Container, PageHero } from "@/components/ui/Shared";
import { getEligibleDeliveries } from "@/content/deliveries";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Customer delivery updates",
  description: "View verified customer delivery updates when they are available.",
  path: "/hino-cebu/customer-deliveries",
});

export default function DeliveriesPage() {
  const now = new Date();
  const route = getEligibleRoutes(now).find(({ path }) => path === "/hino-cebu/customer-deliveries");
  if (!route || (route.status === "withheld" && !route.serveUnavailablePage)) notFound();
  const claims = getEligibleClaims("surface:customer-deliveries", now);
  const deliveries = getEligibleDeliveries(now);
  const identity = claims.find(({ category }) => category === "identity")?.value;
  const purpose = claims.find(({ category }) => category === "purpose")?.value;

  return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Branch", href: "/hino-cebu" }, { label: identity ?? "Delivery updates" }]} /></Container><PageHero eyebrow="Customer updates" title={identity ?? "Delivery information is currently unavailable"} description={purpose ?? "No verified customer delivery story is available right now."} /><section className="section"><Container>{deliveries.length ? <div className="grid grid-3">{deliveries.map((delivery) => <article className="card card-body" key={delivery.slug}><h2>{delivery.title}</h2><p>{delivery.customer}</p><p>{delivery.summary}</p></article>)}</div> : <div className="empty-state"><h2>No verified delivery stories right now</h2><p>Customer details, delivery information, story wording, and media appear only after their approvals and usage rights are current.</p></div>}</Container></section></>;
}
