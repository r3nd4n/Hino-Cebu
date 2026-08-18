import { Breadcrumbs, Container, PageHero } from "@/components/ui/Shared";
import { getEligibleBranch, getEligibleContactActions } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Website terms", description: "Review eligible website terms and contact information.", path: "/terms" });

export default function TermsPage() {
  const eligibleBranch = getEligibleBranch();
  const contactActions = getEligibleContactActions();
  const hasBranchDetails = Boolean(eligibleBranch.identity || eligibleBranch.address || eligibleBranch.phone);

  return <><Container><Breadcrumbs items={[{ label: "Terms" }]} /></Container><PageHero eyebrow="Website terms" title="Terms and site information" description="Review the information currently available for this website." />{hasBranchDetails || contactActions.length > 0 ? <section className="section"><Container><h2>Contact</h2>{hasBranchDetails ? <address>{eligibleBranch.identity ? <><strong>{eligibleBranch.identity}</strong><br /></> : null}{eligibleBranch.address ? <>{eligibleBranch.address}<br /></> : null}{eligibleBranch.phone ? <span>{eligibleBranch.phone}</span> : null}</address> : null}{contactActions.length > 0 ? <div className="hero-actions">{contactActions.map((action) => <a className="text-link" href={action.href} key={action.actionId}>{action.label}</a>)}</div> : null}</Container></section> : null}</>;
}
