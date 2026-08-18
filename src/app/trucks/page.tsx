import Link from "next/link";
import { trucks } from "@/content/trucks";
import { TruckCard } from "@/components/trucks/TruckCard";
import { Breadcrumbs, Container, CtaBand, PageHero, SectionHeading } from "@/components/ui/Shared";
import { breadcrumbSchema, createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/ui/Shared";

export const metadata = createMetadata({ title: "Hino Trucks Cebu | Hino 200, 300 & 500 | Hino Cebu", description: "Explore Hino truck model families for Cebu business applications and request help choosing a practical starting point.", path: "/trucks" });

export default function TrucksPage() { return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Trucks" }]} /></Container><PageHero eyebrow="Hino truck lineup" title="Start with the work your truck needs to do" description="Compare model-family positioning, then bring payload, body, cargo, and route details into a Hino Cebu consultation."><Link className="button" href="/find-your-truck">Find Your Truck</Link><Link className="button button-outline" href="/quote">Request a Quote</Link></PageHero><section className="section"><Container><SectionHeading title="Explore model families" description="Specifications and variants are intentionally withheld until approved product information is provided." /><div className="grid grid-3">{trucks.map((truck) => <TruckCard truck={truck} key={truck.slug} />)}</div></Container></section><CtaBand /><JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Trucks", path: "/trucks" }])} /></>; }
