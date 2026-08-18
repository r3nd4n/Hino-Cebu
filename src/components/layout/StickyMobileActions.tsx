import { directionsHref, siteConfig } from "@/content/site";
import { TrackedLink } from "@/components/marketing/TrackedLink";

export function StickyMobileActions() {
  return <nav className="mobile-actions" aria-label="Quick actions">
    <TrackedLink href={siteConfig.phoneHref} event="phone_click" eventProperties={{ location: "mobile_bar" }}><span aria-hidden>☎</span> Call</TrackedLink>
    <TrackedLink href="/quote"><span aria-hidden>▣</span> Quote</TrackedLink>
    <TrackedLink href={directionsHref} event="directions_click" eventProperties={{ location: "mobile_bar" }}><span aria-hidden>⌖</span> Directions</TrackedLink>
  </nav>;
}
