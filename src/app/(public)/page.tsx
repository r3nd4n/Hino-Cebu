import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { TruckCard } from "@/components/trucks/TruckCard";
import { Container, SectionHeading } from "@/components/ui/Shared";
import { getEligibleBusinessApplications } from "@/content/businessApplications";
import { getEligibleCampaignRoutes } from "@/content/campaigns";
import { getEligibleDeliveries } from "@/content/deliveries";
import { getEligibleGuides } from "@/content/guides";
import { getEligiblePromotions } from "@/content/promotions";
import { getEligibleSupportServices } from "@/content/services";
import { getEligibleBranch, getEligibleContactActions } from "@/content/site";
import { getEligibleTrucks } from "@/content/trucks";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Hino Cebu | Trucks, Parts & Service in Cebu City",
    description: "Explore eligible Hino Cebu product and support information.",
    path: "/",
  });
}

export default function Home() {
  const eligibleRoutes = getEligibleRoutes()
    .filter(({ status }) => status.startsWith("eligible"));
  const routeIds = new Set(eligibleRoutes.map(({ routeId }) => routeId));
  const routePaths = new Set(eligibleRoutes.map(({ path }) => path));
  const branch = getEligibleBranch();
  const contactActions = getEligibleContactActions();
  const applications = getEligibleBusinessApplications();
  const campaigns = getEligibleCampaignRoutes();
  const deliveries = getEligibleDeliveries();
  const guides = getEligibleGuides();
  const promotions = getEligiblePromotions();
  const services = getEligibleSupportServices();
  const trucks = getEligibleTrucks();
  const primaryClaims = eligibleRoutes.flatMap((route) => (
    getEligibleClaims(`surface:${route.routeId.replace(/^ROUTE-/, "").toLowerCase()}`)
  ));
  const primaryPurpose = primaryClaims.find(({ category }) => category === "purpose")?.value;
  const hasPublicContent = eligibleRoutes.length > 0 || Boolean(branch.identity) || contactActions.length > 0;
  const heroActions = [
    { path: "/trucks", label: "Explore Trucks" },
    { path: "/quote", label: "Get a Quote" },
  ].filter(({ path }) => routePaths.has(path));

  return <>
    <section className="section dark home-hero"><Container className="split"><div><span className="eyebrow">Hino Cebu</span><h1>{hasPublicContent ? primaryPurpose ?? "Built for Cebu business." : "Public information is being verified."}</h1><p className="lead">{hasPublicContent ? "Find the right Hino truck and support pathway for the work ahead." : "Approved product, support, and contact details will appear here when they are ready."}</p>{heroActions.length > 0 ? <div className="hero-actions">{heroActions.map((action) => <Link className="button" href={action.path} key={action.path}>{action.label}</Link>)}</div> : null}</div><div className="home-hero-image"><Image src="/images/official/hino-300.jpg" alt="Hino 300 Series official Hino Motors Philippines product image" fill preload sizes="(max-width: 719px) 100vw, (max-width: 1059px) 58vw, 58vw" /></div></Container></section>
    {!hasPublicContent ? null : <>
    {trucks.length > 0 ? <section className="section alt"><Container><SectionHeading eyebrow="Truck lineup" title="Eligible model families" /><div className="grid grid-3">{trucks.map((truck) => <TruckCard truck={truck} key={truck.slug} />)}</div></Container></section> : null}
    {applications.length > 0 ? <section className="section dark"><Container><SectionHeading eyebrow="Built around the job" title="Business applications" /><div className="grid grid-4">{applications.map((item) => <article className="card card-body" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></Container></section> : null}
    {services.length > 0 ? <section className="section"><Container><SectionHeading eyebrow="Support" title="Available support pathways" /><div className="grid grid-4">{services.map((item) => <article className="card card-body" key={item.title}><h3>{item.title}</h3><p>{item.description}</p><Link className="text-link" href={item.href}>{item.cta} <span aria-hidden>→</span></Link></article>)}</div></Container></section> : null}
    {guides.length > 0 || promotions.length > 0 || deliveries.length > 0 || campaigns.length > 0 ? <section className="section alt"><Container><SectionHeading eyebrow="Updates" title="Eligible guides and updates" /><div className="grid grid-3">{guides.map((guide) => <article className="card card-body" key={guide.slug}><h3>{guide.title}</h3><p>{guide.summary}</p>{routePaths.has("/guides") ? <Link className="text-link" href="/guides">Read more <span aria-hidden>→</span></Link> : null}</article>)}{promotions.map((promotion) => <article className="card card-body" key={promotion.slug}><h3>{promotion.title}</h3><p>{promotion.summary}</p></article>)}{deliveries.map((delivery) => <article className="card card-body" key={delivery.slug}><h3>{delivery.title}</h3><p>{delivery.summary}</p></article>)}{campaigns.map((campaign) => <article className="card card-body" key={campaign.slug}><h3>{campaign.title}</h3><p>{campaign.summary}</p><Link className="text-link" href={`/lp/${campaign.slug}`}>View campaign <span aria-hidden>→</span></Link></article>)}</div></Container></section> : null}
    {branch.identity || branch.address || contactActions.length > 0 ? <section className="section" id="location"><Container><SectionHeading eyebrow="Contact" title={branch.identity ?? "Available contact options"} />{branch.address ? <address>{branch.address}</address> : null}<div className="hero-actions">{contactActions.map((action) => <TrackedLink className="button" href={action.href} event={action.kind === "phone" ? "phone_click" : "directions_click"} eventProperties={{ location: "home_location" }} key={action.actionId}>{action.label}</TrackedLink>)}</div></Container></section> : null}
    {routeIds.has("ROUTE-QUOTE") ? <section className="cta-band"><Container><Link className="button button-light" href="/quote">Request information</Link></Container></section> : null}
    </>}
  </>;
}
