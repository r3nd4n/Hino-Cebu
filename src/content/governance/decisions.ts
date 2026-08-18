import {
  isApprovalCurrent,
  productionEstateSchema,
} from "../../lib/governance/schemas";

const pendingDecision = (key: string) => ({ key, value: { status: "pending" as const } });
const pendingApproval = {
  recordId: "GOV-PRODUCTION-ESTATE",
  revision: 1,
  responsibleLane: "technical-release" as const,
  departmentApproval: { status: "pending" as const, lane: "technical-release" as const },
  releaseConfirmation: { status: "pending" as const, lane: "technical-release" as const },
};

export const productionEstateRecord = productionEstateSchema.parse({
  recordId: "GOV-PRODUCTION-ESTATE",
  revision: 1,
  approval: pendingApproval,
  decisions: [
    pendingDecision("production-domain"),
    pendingDecision("commercial-vercel-account"),
    pendingDecision("vercel-project"),
    pendingDecision("dns-owner"),
    pendingDecision("deployment-owner"),
    pendingDecision("rollback-owner"),
  ],
});

export function isProductionEstateApproved(now = new Date()) {
  return isApprovalCurrent(productionEstateRecord.approval, "technical-release", now)
    && productionEstateRecord.decisions.every(({ value }) => value.status === "approved");
}
