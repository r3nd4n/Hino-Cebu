import { notFound } from "next/navigation";
import { InquiryPage } from "@/components/marketing/InquiryPage";
import { getEligibleContactActions } from "@/content/site";
import { getEligibleClaims, getEligibleRoutes } from "@/lib/governance/eligibility";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Truck sales inquiry", description: "Submit an eligible truck sales request.", path: "/quote" });

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ model?: string }> }) {
  const route = getEligibleRoutes().find(({ path }) => path === "/quote");
  const claims = getEligibleClaims("surface:quote");
  const contactActions = getEligibleContactActions();
  if (!route?.status.startsWith("eligible") || contactActions.length === 0) notFound();
  const { model } = await searchParams;
  const defaults = model ? { modelInterest: `Hino ${model.replace("hino-", "")}` } : undefined;
  return <InquiryPage type="sales" claims={claims} contactActions={contactActions} defaults={defaults} />;
}
