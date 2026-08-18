import { TruckFinder } from "@/components/trucks/TruckFinder";
import { Breadcrumbs, Container, PageHero } from "@/components/ui/Shared";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Find Your Hino Truck | Hino Cebu", description: "Answer practical business, cargo, payload, body, route, fleet, and timeline questions for a preliminary Hino model-family suggestion.", path: "/find-your-truck" });
export default function FinderPage() { return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Find Your Truck" }]} /></Container><PageHero eyebrow="Truck finder v1" title="Find a practical starting point" description="Answer seven quick questions. The result is a preliminary recommendation designed to support—not replace—a technical consultation." /><section className="section alt"><Container><TruckFinder /></Container></section></>; }
