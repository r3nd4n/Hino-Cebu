import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  NOW,
  approvedClaim,
  approvedDecision,
  approvedEnvelope,
  loadGovernanceModules,
} from "./fixtures/governance/records.mjs";

const modules = loadGovernanceModules();
const { schemas, decisions, privacy, leads, release, eligibility, claims, site, trucks, campaigns, services } = modules;
const DIRECTIVE_NOW = new Date("2026-08-22T00:00:00.000Z");

function readSource(path) {
  return readFileSync(path, "utf8");
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

test("public layout structurally owns the public shell and root layout stays minimal", () => {
  const rootLayout = readSource("src/app/layout.tsx");
  const publicLayout = readSource("src/app/(public)/layout.tsx");

  assert.doesNotMatch(rootLayout, /Header|Footer|StickyMobileActions|AttributionCapture|MarketingTags|JsonLd/);
  assert.match(publicLayout, /Header/);
  assert.match(publicLayout, /Footer/);
  assert.match(publicLayout, /StickyMobileActions/);
  assert.match(publicLayout, /AttributionCapture/);
  assert.match(publicLayout, /MarketingTags/);
  assert.doesNotMatch(publicLayout, /usePathname|"use client"|redirect\(|review|provisional|diagnostic/i);
});

test("organization schema is constructed only from the eligible branch DTO", () => {
  const publicLayout = readSource("src/app/(public)/layout.tsx");

  assert.match(publicLayout, /getEligibleBranch/);
  assert.match(publicLayout, /const eligibleBranch = getEligibleBranch\(\)/);
  assert.match(publicLayout, /eligibleBranch\.identity \? <JsonLd/);
  assert.doesNotMatch(publicLayout, /siteConfig\.(?:name|address|phoneDisplay|directionsUrl)/);
  assert.doesNotMatch(publicLayout, /expired branch|withheld branch/i);
});

test("public 404 uses final selectors while root 404 remains shell-free", () => {
  const rootNotFound = readSource("src/app/not-found.tsx");
  const publicNotFound = readSource("src/app/(public)/not-found.tsx");

  assert.doesNotMatch(rootNotFound, /Header|Footer|StickyMobileActions|MarketingTags|getEligible/);
  assert.match(publicNotFound, /getEligibleRoutes/);
  assert.match(publicNotFound, /getEligibleContactActions/);
  assert.doesNotMatch(publicNotFound, /siteConfig|\/withheld|expired branch|provisional|diagnostic/i);
});

test("navigation and contact DTOs are projected by the public server layout", () => {
  const publicLayout = readSource("src/app/(public)/layout.tsx");
  const shellSources = [
    "src/components/layout/Header.tsx",
    "src/components/layout/Footer.tsx",
    "src/components/layout/StickyMobileActions.tsx",
  ].map(readSource).join("\n");

  assert.match(publicLayout, /getEligibleRoutes/);
  assert.match(publicLayout, /getEligibleContactActions/);
  assert.match(publicLayout, /const navigation(?::[^=]+)? =/);
  assert.match(publicLayout, /<Header[^>]*navigation=\{navigation\}[^>]*contactActions=\{contactActions\}/s);
  assert.match(publicLayout, /<Footer[^>]*navigation=\{navigation\}[^>]*contactActions=\{contactActions\}/s);
  assert.match(publicLayout, /<StickyMobileActions[^>]*navigation=\{navigation\}[^>]*contactActions=\{contactActions\}/s);
  assert.doesNotMatch(shellSources, /siteConfig|directionsHref|\/trucks|\/quote|\/contact/);
  assert.doesNotMatch(shellSources, /<Link[^>]+href="\/"/);
  assert.doesNotMatch(shellSources, /review|provisional|diagnostic|withheld/i);
});

test("client surfaces cannot import governance records or eligibility selectors", () => {
  const forbidden = /@\/content\/governance|@\/lib\/governance\/eligibility|getEligibleBranch|getEligibleRoutes|getEligibleClaims|getEligibleContactActions|@\/content\/site/;

  for (const path of sourceFiles("src")) {
    const source = readSource(path);
    if (!/^\s*["']use client["']/m.test(source)) continue;
    assert.doesNotMatch(source, forbidden, path);
  }
});

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

test("production estate records retain temporary and unresolved values as explicit blockers", () => {
  assert.equal(decisions.productionEstateRecord.decisions.length, 6);
  assert.deepEqual(decisions.productionEstateRecord.decisions.map(({ key }) => key), [
    "production-domain",
    "commercial-vercel-account",
    "vercel-project",
    "dns-owner",
    "deployment-owner",
    "rollback-owner",
  ]);
  assert.equal(decisions.isProductionEstateApproved(DIRECTIVE_NOW), false);
  assert.deepEqual(decisions.productionEstateRecord.decisions.map(({ value }) => value.status), [
    "proposal", "proposal", "approved", "pending", "approved", "approved",
  ]);
});

test("privacy contract enumerates every required topic and keeps draft policy values blocked", () => {
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
  assert.equal(privacy.isPrivacyContractApproved(DIRECTIVE_NOW), false);
  assert.ok(privacy.privacyContract.topics.every(({ value }) => value.status === "proposal"));
});

test("lead contract registry records the approved proposal while preventing production eligibility", () => {
  assert.deepEqual(leads.leadOperatingContracts.map(({ leadType }) => leadType).sort(), [
    "financing", "fleet", "parts", "sales", "service",
  ]);
  assert.equal(new Set(leads.leadOperatingContracts.map(({ leadType }) => leadType)).size, 5);

  for (const contract of leads.leadOperatingContracts) {
    const expectedLane = ["service", "parts"].includes(contract.leadType) ? "aftersales" : "sales";
    assert.equal(contract.departmentOwnerLane, expectedLane);
    assert.equal(contract.centralOperationsOwnerRef, "OWNER-JCS-001");
    assert.deepEqual(contract.escalationStages.map(({ stage }) => stage), ["routing-failure", "unacknowledged"]);
    assert.equal(contract.secondaryIntake.mustBeContractEquivalent, true);
    assert.equal(contract.policyStatus, "proposal");
    assert.equal(leads.isLeadContractApproved(contract, DIRECTIVE_NOW), false);
  }
  assert.equal(leads.leadProviderProposal.durableStore.providerCode, "neon-postgres");
  assert.equal(leads.leadProviderProposal.notificationTransport.providerCode, "resend");
  assert.equal(leads.leadProviderProposal.notificationTransport.recipientStatus, "pending");
  assert.equal(leads.leadProviderProposal.notificationTransport.sendingDomainStatus, "pending");
  assert.equal(leads.leadProviderProposal.secondaryIntake.mode, "phone-to-neon");
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
  assert.equal(release.createOwnerAlertForGovernanceChange(governed, NOW), null);
  assert.equal(
    release.createOwnerAlertForGovernanceChange(approvedEnvelope("brand-content", {
      departmentApproval: approvedDecision("brand-content", { reviewAt: NOW.toISOString() }),
    }), NOW)?.triggerCode,
    "expired",
  );
  assert.equal(
    release.createOwnerAlertForGovernanceChange(approvedEnvelope("brand-content", {
      departmentApproval: approvedDecision("brand-content", {
        invalidatedAt: "2026-08-17T00:00:00.000Z",
        invalidationCode: "source-changed",
      }),
    }), NOW)?.triggerCode,
    "invalidated",
  );
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

test("eligibility rejects due, pending, invalidated, wrong-lane, wrong-locality, malformed-evidence, and superseded claims", () => {
  const eligible = approvedClaim();
  const blocked = [
    approvedClaim({ claimId: "CLAIM-PENDING", approval: { ...approvedEnvelope("sales"), departmentApproval: { status: "pending", lane: "sales" } } }),
    approvedClaim({ claimId: "CLAIM-DUE", approval: approvedEnvelope("sales", { departmentApproval: approvedDecision("sales", { reviewAt: NOW.toISOString() }) }) }),
    approvedClaim({ claimId: "CLAIM-INVALID", approval: approvedEnvelope("sales", { departmentApproval: approvedDecision("sales", { invalidatedAt: "2026-08-17T00:00:00.000Z", invalidationCode: "source-changed" }) }) }),
    approvedClaim({ claimId: "CLAIM-LANE", ownerLane: "aftersales" }),
    approvedClaim({ claimId: "CLAIM-LOCALITY", locality: "national" }),
    approvedClaim({ claimId: "CLAIM-EVIDENCE", approval: approvedEnvelope("sales", { departmentApproval: approvedDecision("sales", { evidence: { reference: "https://example.invalid/evidence" } }) }) }),
    approvedClaim({ claimId: "CLAIM-SUPERSEDED", activeRevision: 2 }),
  ];

  assert.deepEqual(eligibility.getEligibleClaims("surface:synthetic", NOW, [eligible, ...blocked]), [{
    claimId: eligible.claimId,
    category: "purpose",
    value: eligible.value,
  }]);
});

test("branch field groups and contact actions are independently eligible", () => {
  const branch = {
    recordId: "BRANCH-HINO-CEBU",
    revision: 1,
    fields: {
      identity: approvedClaim({ claimId: "CLAIM-BRANCH-IDENTITY", category: "identity", value: "Hino Cebu", ownerLane: "brand-content", approval: approvedEnvelope("brand-content") }),
      address: approvedClaim({ claimId: "CLAIM-BRANCH-ADDRESS", category: "identity", value: "377 P. Almendras Extension, Cebu City, Central Visayas", ownerLane: "brand-content", approval: approvedEnvelope("brand-content") }),
      phone: approvedClaim({ claimId: "CLAIM-BRANCH-PHONE", category: "contact-action", value: "+63 32 346 3322", ownerLane: "sales", approval: approvedEnvelope("sales") }),
      hours: approvedClaim({ claimId: "CLAIM-BRANCH-HOURS", category: "purpose", value: "Weekdays", approval: { ...approvedEnvelope("sales"), departmentApproval: { status: "pending", lane: "sales" } } }),
      directions: approvedClaim({ claimId: "CLAIM-BRANCH-DIRECTIONS", category: "contact-action", value: "https://www.google.com/maps/search/?api=1&query=Hino%20Cebu", ownerLane: "brand-content", approval: approvedEnvelope("brand-content") }),
    },
  };

  assert.deepEqual(site.getEligibleBranch(NOW, branch), {
    identity: "Hino Cebu",
    address: "377 P. Almendras Extension, Cebu City, Central Visayas",
    phone: "+63 32 346 3322",
    directions: "https://www.google.com/maps/search/?api=1&query=Hino%20Cebu",
  });
  assert.deepEqual(site.getEligibleContactActions(NOW, branch), [
    { actionId: "branch-phone", kind: "phone", label: "Call Hino Cebu", href: "tel:+63323463322" },
    { actionId: "branch-directions", kind: "directions", label: "Directions", href: "https://www.google.com/maps/search/?api=1&query=Hino%20Cebu" },
  ]);
});

test("route eligibility emits one final state and category IDs without withheld wording", () => {
  const four = [
    approvedClaim({ claimId: "CLAIM-ROUTE-IDENTITY", surfaceId: "surface:route", category: "identity", value: "Sales" }),
    approvedClaim({ claimId: "CLAIM-ROUTE-PURPOSE", surfaceId: "surface:route", category: "purpose", value: "Compare model families" }),
    approvedClaim({ claimId: "CLAIM-ROUTE-REQUEST", surfaceId: "surface:route", category: "request-semantics", value: "Request a consultation" }),
    approvedClaim({ claimId: "CLAIM-ROUTE-CONTACT", surfaceId: "surface:route", category: "contact-action", value: "Contact sales" }),
  ];
  const optional = approvedClaim({ claimId: "CLAIM-ROUTE-OFFER", surfaceId: "surface:route", category: "offer", value: "Secret withheld offer", approval: { ...approvedEnvelope("sales"), departmentApproval: { status: "pending", lane: "sales" } } });
  const routes = [
    { routeId: "ROUTE-FULL", path: "/full", surfaceId: "surface:route", minimumTruth: { identity: four[0].claimId, purpose: four[1].claimId, requestSemantics: four[2].claimId, contactAction: four[3].claimId }, optionalClaimIds: [], unavailablePage: false },
    { routeId: "ROUTE-REDUCED", path: "/reduced", surfaceId: "surface:route", minimumTruth: { identity: four[0].claimId, purpose: four[1].claimId, requestSemantics: four[2].claimId, contactAction: four[3].claimId }, optionalClaimIds: [optional.claimId], unavailablePage: false },
    { routeId: "ROUTE-WITHHELD", path: "/withheld", surfaceId: "surface:route", minimumTruth: { identity: four[0].claimId, purpose: four[1].claimId, requestSemantics: four[2].claimId, contactAction: "CLAIM-MISSING-CONTACT" }, optionalClaimIds: [optional.claimId], unavailablePage: true },
  ];

  const result = eligibility.getEligibleRoutes(NOW, routes, [...four, optional]);
  assert.deepEqual(result.map(({ routeId, status }) => [routeId, status]), [
    ["ROUTE-FULL", "eligible"],
    ["ROUTE-REDUCED", "eligible-reduced"],
    ["ROUTE-WITHHELD", "withheld"],
  ]);
  assert.deepEqual(result[1].retainedCategories, ["identity", "purpose", "request-semantics", "contact-action"]);
  assert.deepEqual(result[1].withheldCategories, ["offer"]);
  assert.equal(result[2].serveUnavailablePage, true);
  assert.equal(JSON.stringify(result).includes("Secret withheld offer"), false);
});

test("canonical content entries carry stable claim and route IDs while unapproved repository facts fail closed", () => {
  assert.ok(trucks.trucks.every(({ claimIds, routeId }) => claimIds.length > 0 && routeId.startsWith("ROUTE-")));
  assert.ok(campaigns.campaigns.every(({ claimIds, routeId }) => claimIds.length > 0 && routeId.startsWith("ROUTE-")));
  assert.ok(services.supportServices.every(({ claimIds, routeId }) => claimIds.length > 0 && routeId.startsWith("ROUTE-")));
  assert.deepEqual(site.getEligibleBranch(DIRECTIVE_NOW), {
    identity: "Hino Cebu",
    address: "377 P. Almendras Extension, Cebu City, Central Visayas",
    phone: "+63 32 346 3322",
    hours: "Monday–Saturday, 8:00 AM–5:00 PM; Sunday, closed",
    directions: "https://www.google.com/maps/search/?api=1&query=377%20P.%20Almendras%20Extension%2C%20Cebu%20City%2C%20Central%20Visayas",
  });
  assert.deepEqual(site.getEligibleContactActions(DIRECTIVE_NOW), [
    { actionId: "branch-phone", kind: "phone", label: "Call Hino Cebu", href: "tel:+63323463322" },
    { actionId: "branch-directions", kind: "directions", label: "Directions", href: "https://www.google.com/maps/search/?api=1&query=377%20P.%20Almendras%20Extension%2C%20Cebu%20City%2C%20Central%20Visayas" },
  ]);
  assert.equal(claims.getClaimCatalogSize() > 0, true);
});
