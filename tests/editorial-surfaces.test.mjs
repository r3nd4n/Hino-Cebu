import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  NOW,
  approvedClaim,
  loadGovernanceModules,
} from "./fixtures/governance/records.mjs";

const { guides, promotions } = loadGovernanceModules();
const readSource = (path) => readFileSync(path, "utf8");

function editorialRoute({ routeId, path, surfaceId, claimPrefix }) {
  return {
    routeId,
    path,
    surfaceId,
    minimumTruth: {
      identity: `${claimPrefix}-IDENTITY`,
      purpose: `${claimPrefix}-PURPOSE`,
      requestSemantics: `${claimPrefix}-REQUEST`,
      contactAction: `${claimPrefix}-CONTACT`,
    },
    optionalClaimIds: [],
    unavailablePage: true,
  };
}

function approvedEditorialClaims(surfaceId, claimPrefix) {
  return [
    approvedClaim({ claimId: `${claimPrefix}-IDENTITY`, surfaceId, category: "identity" }),
    approvedClaim({ claimId: `${claimPrefix}-PURPOSE`, surfaceId, category: "purpose" }),
    approvedClaim({ claimId: `${claimPrefix}-REQUEST`, surfaceId, category: "request-semantics" }),
    approvedClaim({ claimId: `${claimPrefix}-CONTACT`, surfaceId, category: "contact-action" }),
  ];
}

test("guide and promotion routes retain their URLs inside the public route group", () => {
  for (const route of ["guides", "promotions"]) {
    assert.equal(existsSync(`src/app/(public)/${route}/page.tsx`), true);
    assert.equal(existsSync(`src/app/${route}/page.tsx`), false);
  }
});

test("guide and promotion pages consume canonical selectors without withheld wording", () => {
  const source = ["guides", "promotions"]
    .map((route) => readSource(`src/app/(public)/${route}/page.tsx`))
    .join("\n");

  assert.match(source, /getEligibleRoutes/);
  assert.match(source, /getEligibleGuides/);
  assert.match(source, /getEligiblePromotions/);
  assert.doesNotMatch(source, /import\s*\{\s*(?:guides|promotions|activePromotions)\s*\}|status:\s*["']preview|approval pending|withheld wording/i);
});

test("approved guide records pass while pending or invalidated claims fail closed", () => {
  const route = editorialRoute({
    routeId: "ROUTE-GUIDES",
    path: "/guides",
    surfaceId: "surface:guides",
    claimPrefix: "CLAIM-GUIDES",
  });
  const routeClaims = approvedEditorialClaims("surface:guides", "CLAIM-GUIDES");
  const guideClaim = approvedClaim({
    claimId: "CLAIM-GUIDE-SYNTHETIC",
    surfaceId: "surface:guides",
    category: "purpose",
  });
  const guide = {
    routeId: route.routeId,
    claimIds: [guideClaim.claimId],
    slug: "synthetic-guide",
    title: "Approved guide",
    category: "Guide",
    summary: "Approved summary",
  };

  assert.deepEqual(
    guides.getEligibleGuides(NOW, [guide], [route], [...routeClaims, guideClaim]),
    [guide],
  );
  assert.deepEqual(
    guides.getEligibleGuides(NOW, [guide], [route], [
      ...routeClaims,
      { ...guideClaim, approval: { ...guideClaim.approval, departmentApproval: { status: "pending", lane: "sales" } } },
    ]),
    [],
  );
  assert.deepEqual(
    guides.getEligibleGuides(NOW, [guide], [route], [
      ...routeClaims,
      {
        ...guideClaim,
        approval: {
          ...guideClaim.approval,
          departmentApproval: {
            ...guideClaim.approval.departmentApproval,
            invalidatedAt: "2026-08-17T00:00:00.000Z",
            invalidationCode: "source-changed",
          },
        },
      },
    ]),
    [],
  );
});

test("approved promotion records pass and expire at their end boundary", () => {
  const route = editorialRoute({
    routeId: "ROUTE-PROMOTIONS",
    path: "/promotions",
    surfaceId: "surface:promotions",
    claimPrefix: "CLAIM-PROMOTIONS",
  });
  const routeClaims = approvedEditorialClaims("surface:promotions", "CLAIM-PROMOTIONS");
  const offerClaim = approvedClaim({
    claimId: "CLAIM-PROMOTION-SYNTHETIC",
    surfaceId: "surface:promotions",
    category: "offer",
  });
  const promotion = {
    routeId: route.routeId,
    claimIds: [offerClaim.claimId],
    slug: "synthetic-offer",
    title: "Approved offer",
    summary: "Approved offer summary",
    startDate: "2026-08-01T00:00:00.000Z",
    endDate: "2026-08-18T12:00:00.000Z",
    ctaLabel: "Ask about this offer",
    ctaHref: "/contact",
  };

  assert.deepEqual(
    promotions.getEligiblePromotions(new Date("2026-08-18T11:59:59.999Z"), [promotion], [route], [...routeClaims, offerClaim]),
    [promotion],
  );
  assert.deepEqual(
    promotions.getEligiblePromotions(NOW, [promotion], [route], [...routeClaims, offerClaim]),
    [],
  );
});
