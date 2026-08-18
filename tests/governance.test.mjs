import assert from "node:assert/strict";
import test from "node:test";
import {
  NOW,
  approvedDecision,
  approvedEnvelope,
  loadGovernanceModules,
} from "./fixtures/governance/records.mjs";

const modules = loadGovernanceModules();
const { schemas, decisions, privacy, leads, release } = modules;

test("approval requires two tiers, the correct fixed lane, evidence, and a current review", () => {
  const current = approvedEnvelope();
  assert.equal(schemas.isApprovalCurrent(current, "sales", NOW), true);

  const blocked = [
    approvedEnvelope("sales", { departmentApproval: { status: "pending", lane: "sales" } }),
    approvedEnvelope("sales", { departmentApproval: approvedDecision("aftersales") }),
    approvedEnvelope("sales", { departmentApproval: approvedDecision("sales", { evidence: undefined }) }),
    approvedEnvelope("sales", { departmentApproval: approvedDecision("sales", { reviewAt: NOW.toISOString() }) }),
    approvedEnvelope("sales", { departmentApproval: approvedDecision("sales", { reviewAt: "2026-08-17T00:00:00.000Z" }) }),
    approvedEnvelope("sales", { departmentApproval: approvedDecision("sales", { invalidatedAt: "2026-08-10T00:00:00.000Z", invalidationCode: "source-changed" }) }),
    approvedEnvelope("sales", { departmentApproval: approvedDecision("sales", { supersededByRevision: 2 }) }),
    approvedEnvelope("sales", { releaseConfirmation: { status: "pending", lane: "technical-release" } }),
  ];

  for (const record of blocked) {
    assert.equal(schemas.isApprovalCurrent(record, "sales", NOW), false);
  }
  assert.equal(schemas.approvalSchema.safeParse(approvedEnvelope("sales", {
    departmentApproval: approvedDecision("sales", { evidence: { reference: "https://example.invalid/evidence" } }),
  })).success, false);
});

test("production estate records keep unknown authorities as explicit blockers", () => {
  assert.equal(decisions.productionEstateRecord.decisions.length, 6);
  assert.deepEqual(decisions.productionEstateRecord.decisions.map(({ key }) => key), [
    "production-domain",
    "commercial-vercel-account",
    "vercel-project",
    "dns-owner",
    "deployment-owner",
    "rollback-owner",
  ]);
  assert.equal(decisions.isProductionEstateApproved(NOW), false);
  assert.ok(decisions.productionEstateRecord.decisions.every(({ value }) => value.status === "pending"));
});

test("privacy contract enumerates every required topic and remains blocked pending approval", () => {
  assert.deepEqual(privacy.privacyContract.topics.map(({ key }) => key), [
    "controller-identity",
    "privacy-contact",
    "processing-purposes",
    "recipients-processors",
    "retention-deletion",
    "rights-process",
    "incident-process",
    "marketing-consent",
  ]);
  assert.equal(privacy.isPrivacyContractApproved(NOW), false);
  assert.ok(privacy.privacyContract.topics.every(({ value }) => value.status === "pending"));
});

test("lead contract registry contains one provider-neutral pending contract per lead type", () => {
  assert.deepEqual(leads.leadOperatingContracts.map(({ leadType }) => leadType).sort(), [
    "financing", "fleet", "parts", "sales", "service",
  ]);
  assert.equal(new Set(leads.leadOperatingContracts.map(({ leadType }) => leadType)).size, 5);

  for (const contract of leads.leadOperatingContracts) {
    const expectedLane = ["service", "parts"].includes(contract.leadType) ? "aftersales" : "sales";
    assert.equal(contract.departmentOwnerLane, expectedLane);
    assert.equal(contract.centralOperationsOwnerRef, "OWNER-CENTRAL-OPERATIONS-PENDING");
    assert.deepEqual(contract.escalationStages.map(({ stage }) => stage), ["routing-failure", "unacknowledged"]);
    assert.equal(contract.secondaryIntake.mustBeContractEquivalent, true);
    assert.equal(contract.policyStatus, "pending");
    assert.equal(leads.isLeadContractApproved(contract, NOW), false);
  }
});

test("proposal values cannot satisfy an approved policy predicate", () => {
  const proposedPolicy = {
    status: "proposal",
    value: 30,
    unit: "minutes",
    approval: approvedEnvelope("sales"),
  };
  assert.equal(schemas.isApprovedPolicyValue(proposedPolicy, "sales", NOW), false);
  assert.equal(schemas.isApprovedPolicyValue({ ...proposedPolicy, status: "approved" }, "sales", NOW), true);
});

test("owner alert creation is stable, bounded, redacted, and triggered only by expiry or invalidation", () => {
  const governed = approvedEnvelope("brand-content");
  const first = release.createOwnerAlert(governed, "expired", NOW);
  const second = release.createOwnerAlert(governed, "expired", NOW);
  assert.deepEqual(first, second);
  assert.deepEqual(Object.keys(first).sort(), [
    "acknowledgementEvidenceReference",
    "acknowledgedAt",
    "alertId",
    "attemptState",
    "governedRecordId",
    "governedRecordRevision",
    "responsibleLane",
    "responsibleOwnerRef",
    "retryEscalationDisposition",
    "status",
    "triggerCode",
    "triggeredAt",
  ].sort());
  assert.equal(schemas.ownerAlertSchema.safeParse({ ...first, rawContent: "withheld wording" }).success, false);
  assert.equal(schemas.ownerAlertSchema.safeParse({ ...first, providerPayload: {} }).success, false);
  assert.throws(() => release.createOwnerAlert(governed, "pending", NOW));
});

test("release policy records encode ordinary, emergency, rollback, and closeout authority as blockers", () => {
  assert.equal(release.releaseAuthorityRecord.ordinaryRelease.manualPromotionRequired, true);
  assert.equal(release.releaseAuthorityRecord.ordinaryRelease.protectedPreviewRequired, true);
  assert.deepEqual(release.releaseAuthorityRecord.emergencyAuthority.allowedRoles, ["technical-release-owner", "technical-release-backup"]);
  assert.deepEqual(release.releaseAuthorityRecord.rollbackAuthority.allowedRoles, ["technical-release-owner", "technical-release-backup"]);
  assert.ok(release.releaseAuthorityRecord.closeout.requiredFields.includes("configuration-drift-reconciled"));
  assert.equal(release.isReleaseAuthorityApproved(NOW), false);
});

test("governance registry schema parses authoritative repository records", () => {
  const result = schemas.governanceRegistrySchema.safeParse({
    productionEstate: decisions.productionEstateRecord,
    privacy: privacy.privacyContract,
    leadContracts: leads.leadOperatingContracts,
    releaseAuthority: release.releaseAuthorityRecord,
  });
  assert.equal(result.success, true, result.error?.message);
});
