import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  NOW,
  approvedClaim,
  loadGovernanceModules,
} from "./fixtures/governance/records.mjs";

const { campaigns } = loadGovernanceModules();
const publicRoutePath = "src/app/(public)/lp/[slug]/page.tsx";
const oldRoutePath = "src/app/lp/[slug]/page.tsx";
const readSource = (path) => readFileSync(path, "utf8");

function approvedCampaignRecords() {
  const routeClaims = [
    approvedClaim({ claimId: "CLAIM-CAMPAIGN-IDENTITY", surfaceId: "surface:campaign", category: "identity" }),
    approvedClaim({ claimId: "CLAIM-CAMPAIGN-PURPOSE", surfaceId: "surface:campaign", category: "purpose" }),
    approvedClaim({ claimId: "CLAIM-CAMPAIGN-REQUEST", surfaceId: "surface:campaign", category: "request-semantics" }),
    approvedClaim({ claimId: "CLAIM-CAMPAIGN-CONTACT", surfaceId: "surface:campaign", category: "contact-action" }),
  ];
  const offerClaim = approvedClaim({
    claimId: "CLAIM-CAMPAIGN-OFFER",
    surfaceId: "surface:campaign",
    category: "offer",
  });
  const route = {
    routeId: "ROUTE-CAMPAIGN",
    path: "/lp/approved-campaign",
    surfaceId: "surface:campaign",
    minimumTruth: {
      identity: "CLAIM-CAMPAIGN-IDENTITY",
      purpose: "CLAIM-CAMPAIGN-PURPOSE",
      requestSemantics: "CLAIM-CAMPAIGN-REQUEST",
      contactAction: "CLAIM-CAMPAIGN-CONTACT",
    },
    optionalClaimIds: [offerClaim.claimId],
    unavailablePage: false,
  };
  const campaign = {
    routeId: route.routeId,
    claimIds: [offerClaim.claimId],
    slug: "approved-campaign",
    eyebrow: "Approved campaign",
    title: "Plan a truck consultation",
    summary: "Share the business application you want to review.",
    benefits: ["Approved optional offer detail"],
    modelInterest: "Hino 300",
    leadType: "sales",
    index: false,
  };
  return { campaign, offerClaim, route, routeClaims };
}

test("campaign route retains its URL inside the public route group", () => {
  assert.equal(existsSync(publicRoutePath), true);
  assert.equal(existsSync(oldRoutePath), false);
});

test("campaign lookup, generated params, metadata, and rendering share final eligibility", () => {
  const source = readSource(publicRoutePath);

  assert.match(source, /getEligibleCampaignRoute/);
  assert.match(source, /generateStaticParams[\s\S]*getEligibleCampaignRoutes/);
  assert.match(source, /generateMetadata[\s\S]*getEligibleCampaignRoute/);
  assert.match(source, /notFound\(\)/);
  assert.match(source, /dynamicParams\s*=\s*false/);
  assert.doesNotMatch(source, /\bcampaigns\.(?:find|map)|@\/content\/governance|approval|withheld/i);
});

test("eligible campaign routes publish only retained approved elements", () => {
  const { campaign, offerClaim, route, routeClaims } = approvedCampaignRecords();

  assert.deepEqual(
    campaigns.getEligibleCampaignRoutes(NOW, [campaign], [route], [...routeClaims, offerClaim]),
    [campaign],
  );

  const [reduced] = campaigns.getEligibleCampaignRoutes(NOW, [campaign], [route], routeClaims);
  assert.deepEqual(reduced, { ...campaign, benefits: [] });
  assert.equal(campaigns.getEligibleCampaignRoute("approved-campaign", NOW, [campaign], [route], routeClaims)?.benefits.length, 0);
});

test("withheld and unknown campaigns are absent from every discovery hook", () => {
  const { campaign, offerClaim, route, routeClaims } = approvedCampaignRecords();
  const withheldRoute = {
    ...route,
    minimumTruth: { ...route.minimumTruth, requestSemantics: "CLAIM-MISSING" },
  };

  assert.deepEqual(
    campaigns.getEligibleCampaignRoutes(NOW, [campaign], [withheldRoute], [...routeClaims, offerClaim]),
    [],
  );
  assert.equal(
    campaigns.getEligibleCampaignRoute("approved-campaign", NOW, [campaign], [withheldRoute], [...routeClaims, offerClaim]),
    undefined,
  );
  assert.equal(
    campaigns.getEligibleCampaignRoute("unknown", NOW, [campaign], [route], [...routeClaims, offerClaim]),
    undefined,
  );
});

test("campaign form copy preserves honest request and durable-receipt semantics", () => {
  const route = readSource(publicRoutePath);
  const form = readSource("src/components/forms/LeadForm.tsx");
  const source = `${route}\n${form}`;

  assert.match(route, /getEligibleContactActions/);
  assert.match(route, /contactActions=/);
  assert.match(form, /durableReceipt/);
  assert.match(form, /could not be confirmed/i);
  assert.doesNotMatch(source, /request was received|received for follow-up|response (?:time|window)|we(?:'|’)ll (?:call|contact|respond)/i);
});
