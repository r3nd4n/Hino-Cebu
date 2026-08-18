import { notFound } from "next/navigation";
import { InquiryPage } from "@/components/marketing/InquiryPage";
import { getEligibleContactActions } from "@/content/site";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Fleet inquiry", description: "Submit an eligible fleet request.", path: "/fleet" });

export default function FleetPage() {
  const route = getEligibleRoutes().find(({ path }) => path === "/fleet");
  const claims = getEligibleClaims("surface:fleet");
  const contactActions = getEligibleContactActions();
  if (!route?.status.startsWith("eligible") || contactActions.length === 0) notFound();
  return <InquiryPage type="fleet" claims={claims} contactActions={contactActions} />;
}
