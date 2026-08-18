import { notFound } from "next/navigation";
import { InquiryPage } from "@/components/marketing/InquiryPage";
import { getEligibleContactActions } from "@/content/site";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Parts inquiry", description: "Submit an eligible parts request.", path: "/parts" });

export default function PartsPage() {
  const route = getEligibleRoutes().find(({ path }) => path === "/parts");
  const claims = getEligibleClaims("surface:parts");
  const contactActions = getEligibleContactActions();
  if (!route?.status.startsWith("eligible") || contactActions.length === 0) notFound();
  return <InquiryPage type="parts" claims={claims} contactActions={contactActions} />;
}
