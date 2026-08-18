import { notFound } from "next/navigation";
import { InquiryPage } from "@/components/marketing/InquiryPage";
import { getEligibleContactActions } from "@/content/site";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Financing inquiry", description: "Submit an eligible financing request.", path: "/financing" });

export default function FinancingPage() {
  const route = getEligibleRoutes().find(({ path }) => path === "/financing");
  const claims = getEligibleClaims("surface:financing");
  const contactActions = getEligibleContactActions();
  if (!route?.status.startsWith("eligible") || contactActions.length === 0) notFound();
  return <InquiryPage type="financing" claims={claims} contactActions={contactActions} />;
}
