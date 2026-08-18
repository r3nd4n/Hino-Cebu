import { Breadcrumbs, Container, PageHero } from "@/components/ui/Shared";
import { getEligiblePrivacyTopics } from "@/content/governance/privacy";
import { getEligibleBranch, getEligibleContactActions } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Privacy policy", description: "Review eligible privacy information.", path: "/privacy" });

const topicLabels: Record<string, string> = {
  "controller-identity": "Controller identity",
  "privacy-contact": "Privacy contact",
  "processing-purposes": "Processing purposes",
  "recipients-processors": "Recipients and processors",
  "retention-deletion": "Retention and deletion",
  "rights-process": "Rights process",
  "incident-process": "Incident process",
  "marketing-consent": "Marketing consent",
};

export default function PrivacyPage() {
  const topics = getEligiblePrivacyTopics();
  const eligibleBranch = getEligibleBranch();
  const contactActions = getEligibleContactActions();
  const hasBranchDetails = Boolean(eligibleBranch.identity || eligibleBranch.address || eligibleBranch.phone);

  return <><Container><Breadcrumbs items={[{ label: "Privacy" }]} /></Container><PageHero eyebrow="Privacy" title="Privacy information" description="Review the information currently available for this website." />{topics.length > 0 ? <section className="section"><Container>{topics.map((topic) => <section key={topic.key}><h2>{topicLabels[topic.key]}</h2><p>{topic.value}</p></section>)}</Container></section> : null}{hasBranchDetails || contactActions.length > 0 ? <section className="section"><Container><h2>Contact</h2>{hasBranchDetails ? <address>{eligibleBranch.identity ? <><strong>{eligibleBranch.identity}</strong><br /></> : null}{eligibleBranch.address ? <>{eligibleBranch.address}<br /></> : null}{eligibleBranch.phone ? <span>{eligibleBranch.phone}</span> : null}</address> : null}{contactActions.length > 0 ? <div className="hero-actions">{contactActions.map((action) => <a className="text-link" href={action.href} key={action.actionId}>{action.label}</a>)}</div> : null}</Container></section> : null}</>;
}
