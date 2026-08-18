import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { NOW, loadGovernanceModules } from "./fixtures/governance/records.mjs";

const { report, eligibility } = loadGovernanceModules();

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
    assert.doesNotMatch(key, /secret|token|password|payload|endpoint|content|signature|contact|siteOrigin|profileId|provider/i);
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

test("report source consumes runtime, route, and owner-alert boundaries without spreading raw records", () => {
  const source = readFileSync("src/lib/governance/report.ts", "utf8");
  assert.match(source, /getRuntimeConfig|parseRuntimeConfig/);
  assert.match(source, /getEligibleRoutes/);
  assert.match(source, /createOwnerAlertForGovernanceChange/);
  assert.doesNotMatch(source, /\.\.\.(?:record|config|alert|claim|route)/);
});
