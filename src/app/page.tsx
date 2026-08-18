import Link from "next/link";
import { businessApplications } from "@/content/businessApplications";
import { deliveries } from "@/content/deliveries";
import { guides } from "@/content/guides";
import { activePromotions } from "@/content/promotions";
import { supportServices } from "@/content/services";
import { directionsHref, siteConfig } from "@/content/site";
import { trucks } from "@/content/trucks";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { TruckCard } from "@/components/trucks/TruckCard";
import { Container, CtaBand, PlaceholderVisual, SectionHeading } from "@/components/ui/Shared";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Hino Cebu | Trucks, Parts & Service in Cebu City", description: "Explore Hino trucks, request a quote, find genuine parts, and connect with Hino Cebu for service, financing, and fleet support.", path: "/" });

const tasks = [
  { title: "Buy a Hino", description: "Explore model families and start a practical sales conversation.", href: "/trucks" },
  { title: "Service Your Hino", description: "Request a service schedule for branch-team confirmation.", href: "/service" },
  { title: "Find Genuine Parts", description: "Send vehicle and part details for an availability inquiry.", href: "/parts" },
  { title: "Fleet Support", description: "Discuss acquisition, replacement, parts, or service requirements.", href: "/fleet" },
];

export default function Home() {
  const promotions = activePromotions();
  return <>
    <section className="section dark"><Container className="split"><div><span className="eyebrow">Hino Cebu · Cebu City</span><h1>Built for Cebu business.</h1><p className="lead">From choosing the right truck to keeping it on the road, Hino Cebu connects local businesses with trucks, parts, service, and practical support.</p><div className="hero-actions"><Link className="button" href="/trucks">Explore Trucks</Link><Link className="button button-light" href="/quote">Get a Quote</Link></div></div><PlaceholderVisual label="Hino Cebu branch and truck" tone="dark" /></Container></section>
    <section className="section"><Container><SectionHeading eyebrow="Start here" title="What can we help you with?" description="Choose the path that matches what your business needs today." /><div className="grid grid-4">{tasks.map((task, i) => <Link className="card task-card" href={task.href} key={task.title}><span className="task-number">0{i + 1}</span><h3>{task.title}</h3><p>{task.description}</p><span className="text-link">Get started →</span></Link>)}</div></Container></section>
    <section className="section alt"><Container><SectionHeading eyebrow="Truck lineup" title="A model family for the work ahead" description="Start with practical use, payload, body, and route requirements. Final configuration should always be confirmed with the team." /><div className="grid grid-3">{trucks.map((truck) => <TruckCard truck={truck} key={truck.slug} />)}</div></Container></section>
    <section className="section"><Container className="split"><div><span className="eyebrow">Decision support</span><h2>Not sure which Hino fits your business?</h2><p>Answer a short set of operational questions to get a preliminary model-family starting point. The tool keeps final technical suitability where it belongs—with a verified consultation.</p><Link className="button" href="/find-your-truck">Find Your Truck</Link></div><div className="list-panel"><strong>Bring the important details</strong><ul className="feature-list"><li>Business and cargo type</li><li>Estimated payload range</li><li>Preferred body application</li><li>Routes and operating environment</li></ul></div></Container></section>
    <section className="section dark"><Container><SectionHeading eyebrow="Built around the job" title="Business applications" description="A truck decision starts with the operation—not just a model name." /><div className="grid grid-4">{businessApplications.map((item) => <article className="card card-body" key={item.title}><span className="card-kicker">Application</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></Container></section>
    <section className="section"><Container><SectionHeading eyebrow="Beyond the vehicle" title="The support ecosystem" description="Sales, service, parts, financing, and fleet conversations connect around your operation." /><div className="grid grid-4">{supportServices.map((item) => <article className="card card-body" key={item.title}><h3>{item.title}</h3><p>{item.description}</p><Link className="text-link" href={item.href}>{item.cta} →</Link></article>)}</div></Container></section>
    <section className="section alt"><Container><div className="grid grid-2"><div><SectionHeading eyebrow="Customer deliveries" title="Real Cebu business stories belong here" />{deliveries.length ? null : <div className="empty-state"><h3>Delivery stories are being prepared</h3><p>Customer names, photos, and vehicle details will only appear after approval. No placeholder customers are published.</p><Link className="text-link" href="/hino-cebu/customer-deliveries">View delivery updates →</Link></div>}</div><div><SectionHeading eyebrow="Current offers" title="Verified promotions only" />{promotions.length ? promotions.map((promotion) => <article key={promotion.slug}><h3>{promotion.title}</h3><p>{promotion.summary}</p></article>) : <div className="empty-state"><h3>No published promotion right now</h3><p>Contact the team for current, verified information. The website does not invent offers, prices, or financing rates.</p><Link className="text-link" href="/promotions">Promotion updates →</Link></div>}</div></div></Container></section>
    <section className="section"><Container><SectionHeading eyebrow="Cebu Truck Guide" title="Useful questions before the next decision" description="Plain-language starting points designed to help business owners prepare for an informed consultation." /><div className="grid grid-3">{guides.map((guide) => <article className="card card-body" key={guide.slug}><span className="card-kicker">{guide.category}</span><h3>{guide.title}</h3><p>{guide.summary}</p><Link className="text-link" href="/guides">Read the guide preview →</Link></article>)}</div></Container></section>
    <section className="section alt" id="location"><Container className="split"><div className="location-card"><span className="eyebrow">Visit or call</span><h2>Hino Cebu</h2><address>{siteConfig.address}<br /><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></address><div className="hero-actions"><TrackedLink className="button" href={siteConfig.phoneHref} event="phone_click" eventProperties={{ location: "home_location" }}>Call Hino Cebu</TrackedLink><TrackedLink className="button button-outline" href={directionsHref} event="directions_click" eventProperties={{ location: "home_location" }}>Get Directions</TrackedLink></div><p><small>Operating hours and an official map target will be added after verification.</small></p></div><PlaceholderVisual label="Hino Cebu branch location" /></Container></section>
    <CtaBand />
  </>;
}
