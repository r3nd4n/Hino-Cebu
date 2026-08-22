import { TrackedLink } from "@/components/marketing/TrackedLink";
import { Breadcrumbs, Container, PageHero, SectionHeading } from "@/components/ui/Shared";
import { getEligibleBranch, getEligibleContactActions } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Branch Information | Cebu",
  description: "Review available branch information and contact options.",
  path: "/hino-cebu",
});

export default function AboutPage() {
  const eligibleBranch = getEligibleBranch();
  const contactActions = getEligibleContactActions();
  const hasBranchDetails = Boolean(
    eligibleBranch.identity
    || eligibleBranch.address
    || eligibleBranch.phone
    || eligibleBranch.hours,
  );

  return <><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Branch" }]} /></Container><PageHero eyebrow="The local branch" title="Branch information" description="Review available branch details and choose an available contact option." /><section className="section"><Container className="split"><div><SectionHeading eyebrow="Local focus" title="Start with the right next step" /><p>Use the site to compare truck families, prepare an inquiry, or find an available branch contact option.</p><ul className="feature-list"><li>Compare primary truck families</li><li>Prepare sales, parts, or service questions</li><li>Share application details through the appropriate inquiry</li><li>Review available branch information</li></ul></div><div className="list-panel"><strong>Plan your visit or inquiry</strong><p>Review the available branch details and use an eligible contact option for the next step.</p></div></Container></section>{hasBranchDetails || contactActions.length > 0 ? <section className="section alt"><Container><SectionHeading title="Branch details" />{hasBranchDetails ? <div className="detail-list">{eligibleBranch.identity ? <div className="detail-row"><strong>Business name</strong><span>{eligibleBranch.identity}</span></div> : null}{eligibleBranch.address ? <div className="detail-row"><strong>Address</strong><span>{eligibleBranch.address}</span></div> : null}{eligibleBranch.phone ? <div className="detail-row"><strong>Phone</strong><span>{eligibleBranch.phone}</span></div> : null}{eligibleBranch.hours ? <div className="detail-row"><strong>Hours</strong><span>{eligibleBranch.hours}</span></div> : null}</div> : null}{contactActions.length > 0 ? <div className="hero-actions">{contactActions.map((action) => <TrackedLink className={action.kind === "phone" ? "button" : "button button-outline"} href={action.href} event={action.kind === "phone" ? "phone_click" : "directions_click"} eventProperties={{ location: "hino-cebu" }} key={action.actionId}>{action.label}</TrackedLink>)}</div> : null}</Container></section> : null}</>;
}
