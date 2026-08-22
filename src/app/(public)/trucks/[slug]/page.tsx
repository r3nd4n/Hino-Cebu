import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, JsonLd, PageHero, SectionHeading } from "@/components/ui/Shared";
import { getEligibleTruck, getEligibleTrucks } from "@/content/trucks";
import { getEligibleRoutes } from "@/lib/governance/eligibility";
import { breadcrumbSchema, createMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  const route = getEligibleRoutes().find(({ path, status }) => path === "/trucks" && status.startsWith("eligible"));
  return route ? getEligibleTrucks().map(({ slug }) => ({ slug })) : [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = getEligibleRoutes().find(({ path, status }) => path === "/trucks" && status.startsWith("eligible"));
  const truck = route ? getEligibleTruck(slug) : undefined;
  if (!truck) return {};
  return createMetadata({ title: truck.seoTitle, description: truck.seoDescription, path: `/trucks/${truck.slug}` });
}

export default async function TruckPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const routes = getEligibleRoutes();
  const route = routes.find(({ path, status }) => path === "/trucks" && status.startsWith("eligible"));
  const truck = route ? getEligibleTruck(slug) : undefined;
  if (!truck) notFound();
  const eligiblePaths = new Set(routes.filter(({ status }) => status.startsWith("eligible")).map(({ path }) => path));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Trucks", path: "/trucks" },
    { name: truck.name, path: `/trucks/${truck.slug}` },
  ];
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: truck.name,
    description: truck.summary,
    category: truck.category,
    url: absoluteUrl(`/trucks/${truck.slug}`),
    brand: { "@type": "Brand", name: "Hino" },
  };
  const supportLinks = [
    { title: "Service support", path: "/service", copy: "Request service information." },
    { title: "Genuine parts", path: "/parts", copy: "Request parts information." },
    { title: "Financing inquiry", path: "/financing", copy: "Request financing information." },
  ].filter(({ path }) => eligiblePaths.has(path));

  return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Trucks", href: "/trucks" }, { label: truck.name }]} /></Container><PageHero eyebrow={truck.category} title={`${truck.name} in Cebu`} description={truck.positioning}>{eligiblePaths.has("/quote") ? <Link className="button" href={`/quote?model=${truck.slug}`}>Request a {truck.name} consultation</Link> : null}{eligiblePaths.has("/financing") ? <Link className="button button-outline" href="/financing">Ask about financing</Link> : null}</PageHero>
    <section className="section"><Container className="split"><div><SectionHeading eyebrow="Practical positioning" title="Choose around the operation" description={truck.summary} /><ul className="feature-list">{truck.uses.map((use) => <li key={use}>{use}</li>)}</ul><a className="text-link" href={truck.sourceUrl} target="_blank" rel="noreferrer">{truck.sourceLabel} <span aria-hidden>↗</span></a><p><small>Specifications reviewed {truck.lastReviewed}. Confirm current model and Cebu availability before purchase.</small></p></div><div className="official-image official-image-large"><Image src={truck.heroImage} alt={`${truck.name} Series official Hino Motors Philippines product image`} fill sizes="(max-width: 719px) calc(100vw - 32px), (max-width: 1059px) calc(50vw - 60px), 50vw" /></div></Container></section>
    <section className="section alt"><Container><SectionHeading eyebrow="Common applications" title="Plan the body and platform together" description="These are conversation starters, not a confirmation that every body or configuration is available or suitable." /><div className="grid grid-4">{truck.applications.map((application) => <article className="card card-body" key={application}><h3>{application}</h3><p>Review cargo, payload, dimensions, routes, and operational requirements with the team.</p></article>)}</div></Container></section>
    <section className="section"><Container className="split"><div><SectionHeading eyebrow="Key details" title="Official Philippine specifications" /><div className="detail-list">{truck.details.map((detail) => <div className="detail-row" key={detail.label}><strong>{detail.label}</strong><span>{detail.value}</span></div>)}</div><p><small>Figures are national published specifications and vary by model. They do not confirm local stock, body compatibility, payload suitability, or current availability.</small></p></div><div className="list-panel"><h3>Published model lineup</h3><ul className="feature-list">{truck.variants.map((variant) => <li key={variant}>{variant}</li>)}</ul>{truck.brochureUrl ? <a className="text-link" href={truck.brochureUrl} target="_blank" rel="noreferrer">View an official brochure <span aria-hidden>↗</span></a> : null}</div></Container></section>
    {supportLinks.length ? <section className="section dark"><Container><SectionHeading eyebrow="Ownership support" title="Connect sales with ownership support" /><div className="grid grid-3">{supportLinks.map((item) => <article className="card card-body" key={item.title}><h3>{item.title}</h3><p>{item.copy}</p><Link className="text-link" href={item.path}>Get started <span aria-hidden>→</span></Link></article>)}</div></Container></section> : null}
    <section className="section"><Container>{eligiblePaths.has("/guides") ? <p><Link className="text-link" href="/guides">Browse truck guides <span aria-hidden>→</span></Link></p> : null}<div className="faq-list"><SectionHeading eyebrow="Questions" title={`${truck.name} FAQ`} />{truck.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></Container></section><JsonLd data={breadcrumbSchema(crumbs)} /><JsonLd data={productSchema} /></>;
}
