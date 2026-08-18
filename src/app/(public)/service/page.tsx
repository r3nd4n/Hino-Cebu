import { notFound } from "next/navigation";
import { InquiryPage } from "@/components/marketing/InquiryPage";
import { getEligibleContactActions } from "@/content/site";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Service inquiry", description: "Submit an eligible service request.", path: "/service" });

export default function ServicePage() {
  const route = getEligibleRoutes().find(({ path }) => path === "/service");
  const claims = getEligibleClaims("surface:service");
  const contactActions = getEligibleContactActions();
  if (!route?.status.startsWith("eligible") || contactActions.length === 0) notFound();
  return <InquiryPage type="service" claims={claims} contactActions={contactActions} />;
}
