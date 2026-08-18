import { notFound } from "next/navigation";
import { Breadcrumbs, Container, PageHero } from "@/components/ui/Shared";
import { getEligibleGuides } from "@/content/guides";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Truck guides", description: "Browse verified commercial-truck guidance when it is available.", path: "/guides" });

export default function GuidesPage() {
  const route = getEligibleRoutes().find(({ path }) => path === "/guides");
  if (!route || (route.status === "withheld" && !route.serveUnavailablePage)) notFound();
  const claims = getEligibleClaims("surface:guides");
  const guides = getEligibleGuides();
  const identity = claims.find(({ category }) => category === "identity")?.value;
  const purpose = claims.find(({ category }) => category === "purpose")?.value;

  return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: identity ?? "Guides" }]} /></Container><PageHero eyebrow="Truck information" title={identity ?? "Guide information is currently unavailable"} description={purpose ?? "No verified guide content is available right now."} /><section className="section"><Container>{guides.length ? <div className="grid grid-3">{guides.map((guide) => <article className="card card-body" key={guide.slug}><span className="card-kicker">{guide.category}</span><h2>{guide.title}</h2><p>{guide.summary}</p></article>)}</div> : <div className="empty-state"><h2>No verified guides right now</h2><p>Guide content appears only after its wording and source have been approved and remain current.</p></div>}</Container></section></>;
}
