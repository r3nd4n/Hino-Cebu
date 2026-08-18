import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, PageHero } from "@/components/ui/Shared";
import { getEligiblePromotions } from "@/content/promotions";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Promotions", description: "View verified offers when they are available.", path: "/promotions" });

export default function PromotionsPage() {
  const route = getEligibleRoutes().find(({ path }) => path === "/promotions");
  if (!route || (route.status === "withheld" && !route.serveUnavailablePage)) notFound();
  const claims = getEligibleClaims("surface:promotions");
  const promotions = getEligiblePromotions();
  const identity = claims.find(({ category }) => category === "identity")?.value;
  const purpose = claims.find(({ category }) => category === "purpose")?.value;

  return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: identity ?? "Promotions" }]} /></Container><PageHero eyebrow="Current information" title={identity ?? "Promotion information is currently unavailable"} description={purpose ?? "No verified offer is available right now."} /><section className="section"><Container>{promotions.length ? <div className="grid grid-3">{promotions.map((promotion) => <article className="card card-body" key={promotion.slug}><h2>{promotion.title}</h2><p>{promotion.summary}</p><Link className="button" href={promotion.ctaHref}>{promotion.ctaLabel}</Link></article>)}</div> : <div className="empty-state"><h2>No verified promotion right now</h2><p>Offers appear only after their details, applicability, dates, and terms have been approved and remain current.</p></div>}</Container></section></>;
}
