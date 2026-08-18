import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  NOW,
  approvedDecision,
  loadGovernanceModules,
} from "./fixtures/governance/records.mjs";

const { report, eligibility, decisions } = loadGovernanceModules();

function inspect(value, visit, path = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspect(item, visit, [...path, String(index)]));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      visit(key, item, [...path, key]);
      inspect(item, visit, [...path, key]);
    }
  }
}

test("review DTO follows the fixed UI section order with deterministic rows", () => {
  const result = report.getReviewReport(NOW);

  assert.deepEqual(Object.keys(result), [
    "header",
    "summary",
    "blockers",
    "approvalGroups",
    "routes",
    "environments",
    "ownerAlerts",
    "limitations",
    "generationError",
  ]);
  assert.deepEqual(result.approvalGroups.map(({ lane }) => lane), [
    "sales",
    "aftersales",
    "privacy-legal",
    "brand-content",
    "technical-release",
  ]);
  assert.deepEqual(
    result.routes.map(({ routeId }) => routeId),
    eligibility.getEligibleRoutes(NOW).map(({ routeId }) => routeId).sort(),
  );
  assert.deepEqual(result.environments.map(({ target }) => result.generationError ? [] : target),
    result.generationError ? [] : ["development", "preview", "production"]);
  assert.deepEqual([...result.blockers].sort((a, b) => (
    a.blockerCode.localeCompare(b.blockerCode) || a.recordId.localeCompare(b.recordId)
  )), result.blockers);
});

test("route rows are the final eligibility projection without claim wording", () => {
  const result = report.getReviewReport(NOW);
  const expected = eligibility.getEligibleRoutes(NOW)
    .map(({ routeId, path, status, checks, retainedCategories, withheldCategories, serveUnavailablePage }) => ({
      routeId,
      path,
      status,
      statusLabel: {
        eligible: "Eligible",
        "eligible-reduced": "Eligible in reduced form",
        withheld: "Withheld",
      }[status],
      checks,
      retainedCategories,
      withheldCategories,
      serveUnavailablePage,
    }))
    .sort((a, b) => a.routeId.localeCompare(b.routeId));

  assert.deepEqual(result.routes, expected);
});

test("recursive report inspection rejects raw configuration, governed wording, endpoints, and sensitive keys", () => {
  const result = report.getReviewReport(NOW);
  const serialized = JSON.stringify(result);
  const forbiddenValues = [
    "http://localhost:3000",
    "Hino truck model families",
    "Compare model families for business use",
    "Contact Hino Cebu sales",
  ];
  for (const value of forbiddenValues) assert.doesNotMatch(serialized, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));

  inspect(result, (key, value) => {
    assert.doesNotMatch(key, /secret|token|password|payload|endpoint|contentBody|signature|contactData|contactDetails|email|phone|siteOrigin|profileId|provider/i);
    if (typeof value === "string") {
      assert.doesNotMatch(value, /https?:\/\/|[?&](?:token|signature)=|BEGIN [A-Z ]+ KEY|@[a-z0-9.-]+\.[a-z]{2,}/i);
    }
  });
});

test("approval and alert rows are explicit allow-listed projections", () => {
  const result = report.getReviewReport(NOW);
  const approvals = result.approvalGroups.flatMap(({ records }) => records);
  assert.ok(approvals.length > 0);
  for (const row of approvals) {
    assert.deepEqual(Object.keys(row), [
      "recordId", "label", "status", "approverRole", "evidenceStatus", "evidenceReference",
      "approvedAt", "reviewAt", "affectedSurfaces", "nextAction",
    ]);
  }
  for (const row of result.ownerAlerts) {
    assert.deepEqual(Object.keys(row), [
      "alertId", "governedRecordId", "responsibleLane", "responsibleOwnerRef", "triggerCode",
      "status", "acknowledgementStatus", "acknowledgementEvidenceStatus",
      "acknowledgementEvidenceReference", "attemptState", "retryEscalationDisposition",
    ]);
  }
});

test("expired governance creates a redacted owner-alert report row", () => {
  const approval = decisions.productionEstateRecord.approval;
  const originalDepartment = approval.departmentApproval;
  const originalRelease = approval.releaseConfirmation;
  approval.departmentApproval = approvedDecision("technical-release", {
    reviewAt: "2026-08-18T12:00:00.000Z",
  });
  approval.releaseConfirmation = approvedDecision("technical-release", {
    approverRole: "technical-release-owner",
    reviewAt: "2026-09-01T00:00:00.000Z",
  });

  try {
    const alert = report.getReviewReport(NOW).ownerAlerts.find(({ governedRecordId }) => (
      governedRecordId === "GOV-PRODUCTION-ESTATE"
    ));
    assert.deepEqual(alert, {
      alertId: "ALERT-PRODUCTION-ESTATE-R1-EXPIRED",
      governedRecordId: "GOV-PRODUCTION-ESTATE",
      responsibleLane: "technical-release",
      responsibleOwnerRef: "OWNER-TECHNICAL-RELEASE-PENDING",
      triggerCode: "expired",
      status: "open",
      acknowledgementStatus: "not-recorded",
      acknowledgementEvidenceStatus: "Missing",
      acknowledgementEvidenceReference: null,
      attemptState: "not-attempted",
      retryEscalationDisposition: "escalate",
    });
  } finally {
    approval.departmentApproval = originalDepartment;
    approval.releaseConfirmation = originalRelease;
  }
});

test("runtime generation failures expose only a stable code and safe key", () => {
  const keys = [
    "DEPLOYMENT_ENV", "VERCEL_ENV", "NEXT_PUBLIC_SITE_URL", "LEAD_PROFILE",
    "ANALYTICS_PROFILE", "CRAWL_POLICY", "REVIEW_ACCESS",
  ];
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  process.env.DEPLOYMENT_ENV = "production";
  process.env.NEXT_PUBLIC_SITE_URL = "https://secret.invalid/private?token=leak";

  try {
    const result = report.getReviewReport(NOW);
    assert.deepEqual(result.generationError, {
      code: "CFG_ORIGIN_INVALID",
      key: "NEXT_PUBLIC_SITE_URL",
    });
    assert.deepEqual(result.routes, []);
    assert.doesNotMatch(JSON.stringify(result), /secret\.invalid|token=leak/);
  } finally {
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
});

test("report source consumes runtime, route, and owner-alert boundaries without spreading raw records", () => {
  const source = readFileSync("src/lib/governance/report.ts", "utf8");
  assert.match(source, /getRuntimeConfig|parseRuntimeConfig/);
  assert.match(source, /getEligibleRoutes/);
  assert.match(source, /createOwnerAlertForGovernanceChange/);
  assert.doesNotMatch(source, /\{\s*\.\.\.(?:record|config|alert|claim|route)\b/);
});
