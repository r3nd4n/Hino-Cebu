import { TrackedLink } from "@/components/marketing/TrackedLink";
import { Breadcrumbs, Container, JsonLd, PageHero, PlaceholderVisual } from "@/components/ui/Shared";
import { getEligibleBranch, getEligibleContactActions } from "@/content/site";
import { createMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";

export const metadata = createMetadata({
  title: "Contact | Branch Location and Phone",
  description: "View available branch contact and location details.",
  path: "/contact",
});

export default function ContactPage() {
  const eligibleBranch = getEligibleBranch();
  const contactActions = getEligibleContactActions();
  const hasBranchDetails = Boolean(
    eligibleBranch.identity
    || eligibleBranch.address
    || eligibleBranch.phone
    || eligibleBranch.hours,
  );
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    url: absoluteUrl("/contact"),
    ...(eligibleBranch.identity ? { name: eligibleBranch.identity } : {}),
    ...(eligibleBranch.phone ? { telephone: eligibleBranch.phone } : {}),
    ...(eligibleBranch.address ? {
      address: { "@type": "PostalAddress", streetAddress: eligibleBranch.address },
    } : {}),
    ...(eligibleBranch.hours ? { openingHours: eligibleBranch.hours } : {}),
  };

  return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} /></Container><PageHero eyebrow="Contact and location" title="Branch contact details" description="Use an available contact option or review the branch details below." />{hasBranchDetails || contactActions.length > 0 ? <section className="section" id="location"><Container className="split"><div className="location-card"><h2>Branch details</h2>{hasBranchDetails ? <address>{eligibleBranch.identity ? <><strong>{eligibleBranch.identity}</strong><br /></> : null}{eligibleBranch.address ? <>{eligibleBranch.address}<br /></> : null}{eligibleBranch.phone ? <span>{eligibleBranch.phone}</span> : null}{eligibleBranch.hours ? <><br /><span>{eligibleBranch.hours}</span></> : null}</address> : null}{contactActions.length > 0 ? <div className="hero-actions">{contactActions.map((action) => <TrackedLink className={action.kind === "phone" ? "button" : "button button-outline"} href={action.href} event={action.kind === "phone" ? "phone_click" : "directions_click"} eventProperties={{ location: "contact" }} key={action.actionId}>{action.label}</TrackedLink>)}</div> : null}</div><PlaceholderVisual label="Branch exterior and map" /></Container></section> : null}{eligibleBranch.identity ? <JsonLd data={schema} /> : null}</>;
}
