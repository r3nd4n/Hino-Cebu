import { getGovernedClaims, type GovernedClaim } from "../../content/governance/claims";
import { productionEstateRecord } from "../../content/governance/decisions";
import { leadOperatingContracts } from "../../content/governance/leads";
import { privacyContract } from "../../content/governance/privacy";
import {
  createOwnerAlertForGovernanceChange,
  releaseAuthorityRecord,
} from "../../content/governance/release";
import { getRuntimeConfig, type DeploymentTarget, type RuntimeConfig } from "../runtime-config";
import { getEligibleRoutes } from "./eligibility";
import {
  approvalLanes,
  type Approval,
  type ApprovalLane,
} from "./schemas";

type ApprovalStatus = "invalidated" | "expired" | "pending" | "approved";

type ApprovalSource = {
  approval: Approval;
  label: string;
  affectedSurfaces: string[];
};

const laneLabels: Record<ApprovalLane, string> = {
  sales: "Sales",
  aftersales: "Aftersales",
  "privacy-legal": "Privacy/legal",
  "brand-content": "Brand/content",
  "technical-release": "Technical release",
};

const targetLabels: Record<DeploymentTarget, string> = {
  development: "Development",
  preview: "Preview",
  production: "Production",
};

const routeStatusLabels = {
  eligible: "Eligible",
  "eligible-reduced": "Eligible in reduced form",
  withheld: "Withheld",
} as const;

const approvalSeverity: Record<ApprovalStatus, number> = {
  invalidated: 0,
  expired: 1,
  pending: 2,
  approved: 3,
};

function approvalStatus(approval: Approval, now: Date): ApprovalStatus {
  const department = approval.departmentApproval;
  const release = approval.releaseConfirmation;
  if (department.status !== "approved" || release.status !== "approved") return "pending";
  if (department.invalidatedAt || release.invalidatedAt) return "invalidated";
  if (new Date(department.reviewAt) <= now || new Date(release.reviewAt) <= now) return "expired";
  return "approved";
}

function evidenceProjection(approval: Approval) {
  const department = approval.departmentApproval;
  if (department.status !== "approved") {
    return { evidenceStatus: "Missing" as const, evidenceReference: null };
  }
  return {
    evidenceStatus: "Present" as const,
    evidenceReference: department.evidence.reference,
  };
}

function approvalProjection(source: ApprovalSource, now: Date) {
  const { approval, label, affectedSurfaces } = source;
  const department = approval.departmentApproval;
  const status = approvalStatus(approval, now);
  const evidence = evidenceProjection(approval);
  return {
    recordId: approval.recordId,
    label,
    status,
    approverRole: department.status === "approved" ? department.approverRole : null,
    evidenceStatus: evidence.evidenceStatus,
    evidenceReference: evidence.evidenceReference,
    approvedAt: department.status === "approved" ? department.approvedAt : null,
    reviewAt: department.status === "approved" ? department.reviewAt : null,
    affectedSurfaces: [...affectedSurfaces].sort(),
    nextAction: status === "approved" ? "Complete release-owner review" : "Record current approval evidence",
  };
}

function claimSource(claim: GovernedClaim): ApprovalSource {
  return {
    approval: claim.approval,
    label: `${claim.category} claim`,
    affectedSurfaces: [claim.surfaceId],
  };
}

function approvalSources(): ApprovalSource[] {
  return [
    {
      approval: productionEstateRecord.approval,
      label: "Production estate",
      affectedSurfaces: ["deployment", "public-origin"],
    },
    {
      approval: privacyContract.approval,
      label: "Privacy contract",
      affectedSurfaces: ["privacy", "lead-capture"],
    },
    ...leadOperatingContracts.map((contract) => ({
      approval: contract.approval,
      label: `${contract.leadType} lead operating contract`,
      affectedSurfaces: [`lead:${contract.leadType}`],
    })),
    {
      approval: releaseAuthorityRecord.approval,
      label: "Release authority",
      affectedSurfaces: ["deployment", "rollback"],
    },
    ...getGovernedClaims().map(claimSource),
  ];
}

function configurationError(error: unknown) {
  const message = error instanceof Error ? error.message : "CFG_REPORT_GENERATION_FAILED";
  const match = /^(CFG_[A-Z_]+)(?:: ([A-Z0-9_]+))?$/.exec(message);
  return {
    code: match?.[1] ?? "CFG_REPORT_GENERATION_FAILED",
    key: match?.[2] ?? null,
  };
}

function environmentRows(config: RuntimeConfig) {
  return (["development", "preview", "production"] as const).map((target) => {
    const isCurrent = config.target === target;
    return {
      target,
      label: targetLabels[target],
      originClass: isCurrent
        ? target === "development" ? "local development origin" : target === "preview" ? "unique preview origin" : "approved production origin"
        : "not evaluated",
      leadProfileClass: isCurrent ? `${config.leadProfile} profile` : "not evaluated",
      analyticsProfileClass: isCurrent ? `${config.analyticsProfile} profile` : "not evaluated",
      crawlPolicy: isCurrent ? config.crawlPolicy : "not evaluated",
      reviewReportAvailability: isCurrent ? config.reviewAccess : "not evaluated",
      result: isCurrent ? "pass" : "not evaluated",
    };
  });
}

function emptyGenerationError(now: Date, error: unknown) {
  return {
    header: {
      eyebrow: "Protected preview",
      title: "Production approval review",
      generatedAt: now.toISOString(),
      deploymentTarget: "Unavailable",
      configurationReference: null,
    },
    summary: {
      overall: "Production blocked",
      blockerCount: 1,
      missingApprovalCount: 0,
      dueExpiredCount: 0,
      ineligibleRouteCount: 0,
      environmentIsolation: "Blocked",
    },
    blockers: [],
    approvalGroups: [],
    routes: [],
    environments: [],
    ownerAlerts: [],
    limitations: "Automated checks verify repository and configuration contracts; evidence authority, document access, and final stakeholder approval require human review.",
    generationError: configurationError(error),
  };
}

export function getReviewReport(now = new Date()) {
  let config: RuntimeConfig;
  try {
    config = getRuntimeConfig();
  } catch (error) {
    return emptyGenerationError(now, error);
  }

  const sources = approvalSources();
  const projectedApprovals = sources.map((source) => ({
    lane: source.approval.responsibleLane,
    row: approvalProjection(source, now),
  }));
  const approvalGroups = approvalLanes.map((lane) => ({
    lane,
    label: laneLabels[lane],
    records: projectedApprovals
      .filter((item) => item.lane === lane)
      .map((item) => item.row)
      .sort((first, second) => (
        approvalSeverity[first.status] - approvalSeverity[second.status]
        || (first.reviewAt ?? "9999").localeCompare(second.reviewAt ?? "9999")
        || first.recordId.localeCompare(second.recordId)
      )),
  }));
  const routes = getEligibleRoutes(now)
    .map(({ routeId, path, status, checks, retainedCategories, withheldCategories, serveUnavailablePage }) => ({
      routeId,
      path,
      status,
      statusLabel: routeStatusLabels[status],
      checks: {
        identity: checks.identity,
        purpose: checks.purpose,
        requestSemantics: checks.requestSemantics,
        contactAction: checks.contactAction,
      },
      retainedCategories: [...retainedCategories],
      withheldCategories: [...withheldCategories],
      serveUnavailablePage,
    }))
    .sort((first, second) => first.routeId.localeCompare(second.routeId));
  const approvalBlockers = projectedApprovals
    .filter(({ row }) => row.status !== "approved")
    .map(({ lane, row }) => ({
      blockerCode: `GOV_APPROVAL_${row.status.toUpperCase()}`,
      recordId: row.recordId,
      label: row.label,
      affectedSurface: row.affectedSurfaces[0] ?? "governance",
      responsibleLane: lane,
      nextAction: row.nextAction,
      evidenceStatus: row.evidenceStatus,
    }));
  const routeBlockers = routes
    .filter(({ status }) => status === "withheld")
    .map((route) => ({
      blockerCode: "GOV_ROUTE_WITHHELD",
      recordId: route.routeId,
      label: "Governed route",
      affectedSurface: route.path,
      responsibleLane: "technical-release" as const,
      nextAction: "Resolve minimum viable truth approvals",
      evidenceStatus: "Review required" as const,
    }));
  const blockers = [...approvalBlockers, ...routeBlockers]
    .sort((first, second) => first.blockerCode.localeCompare(second.blockerCode) || first.recordId.localeCompare(second.recordId));
  const ownerAlerts = sources.flatMap(({ approval }) => {
    const alert = createOwnerAlertForGovernanceChange(approval, now);
    if (!alert) return [];
    return [{
      alertId: alert.alertId,
      governedRecordId: alert.governedRecordId,
      responsibleLane: alert.responsibleLane,
      responsibleOwnerRef: alert.responsibleOwnerRef,
      triggerCode: alert.triggerCode,
      status: alert.status,
      acknowledgementStatus: alert.acknowledgedAt ? "recorded" : "not-recorded",
      acknowledgementEvidenceStatus: alert.acknowledgementEvidenceReference ? "Present" : "Missing",
      acknowledgementEvidenceReference: alert.acknowledgementEvidenceReference?.reference ?? null,
      attemptState: alert.attemptState,
      retryEscalationDisposition: alert.retryEscalationDisposition,
    }];
  }).sort((first, second) => first.alertId.localeCompare(second.alertId));
  const missingApprovalCount = projectedApprovals.filter(({ row }) => row.status === "pending").length;
  const dueExpiredCount = projectedApprovals.filter(({ row }) => ["expired", "invalidated"].includes(row.status)).length;
  const ineligibleRouteCount = routes.filter(({ status }) => status === "withheld").length;

  return {
    header: {
      eyebrow: "Protected preview",
      title: "Production approval review",
      generatedAt: now.toISOString(),
      deploymentTarget: targetLabels[config.target],
      configurationReference: config.fingerprint,
    },
    summary: {
      overall: blockers.length > 0 ? "Production blocked" : "Ready for release-owner review",
      blockerCount: blockers.length,
      missingApprovalCount,
      dueExpiredCount,
      ineligibleRouteCount,
      environmentIsolation: "Pass",
    },
    blockers,
    approvalGroups,
    routes,
    environments: environmentRows(config),
    ownerAlerts,
    limitations: "Automated checks verify repository and configuration contracts; evidence authority, document access, and final stakeholder approval require human review.",
    generationError: null,
  };
}
