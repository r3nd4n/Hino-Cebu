import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  NOW,
  approvedClaim,
  loadGovernanceModules,
} from "./fixtures/governance/records.mjs";

const { eligibility, services } = loadGovernanceModules();
const readSource = (path) => readFileSync(path, "utf8");

function syntheticRoute(routeId, path, contactClaimId) {
  return {
    routeId,
    path,
    surfaceId: "surface:synthetic",
    minimumTruth: {
      identity: "CLAIM-SYNTHETIC-IDENTITY",
      purpose: "CLAIM-SYNTHETIC-PURPOSE",
      requestSemantics: "CLAIM-SYNTHETIC-REQUEST",
      contactAction: contactClaimId,
    },
    optionalClaimIds: [],
    unavailablePage: true,
  };
}

test("home retains its URL inside the public route group", () => {
  assert.equal(existsSync("src/app/(public)/page.tsx"), true);
  assert.equal(existsSync("src/app/page.tsx"), false);
});

test("home aggregation consumes final eligible projections only", () => {
  const source = readSource("src/app/(public)/page.tsx");

  for (const selector of [
    "getEligibleRoutes",
    "getEligibleClaims",
    "getEligibleBranch",
    "getEligibleContactActions",
    "getEligibleBusinessApplications",
    "getEligibleDeliveries",
    "getEligibleGuides",
    "getEligiblePromotions",
    "getEligibleSupportServices",
    "getEligibleTrucks",
    "getEligibleCampaignRoutes",
  ]) assert.match(source, new RegExp(selector), selector);

  assert.doesNotMatch(source, /import\s*\{[^}]*\b(?:siteConfig|directionsHref|businessApplications|deliveries|guides|supportServices|trucks|campaigns)\b[^}]*\}/s);
  assert.doesNotMatch(source, /review|provisional|diagnostic|approval pending|withheld wording/i);
});

test("sitemap emits only final eligible routes and eligible dynamic records", () => {
  const source = readSource("src/app/sitemap.ts");

  assert.match(source, /getEligibleRoutes/);
  assert.match(source, /getEligibleTrucks/);
  assert.match(source, /getEligibleCampaignRoutes/);
  assert.match(source, /status\.startsWith\("eligible"\)/);
  assert.doesNotMatch(source, /const routes\s*=\s*\[|\/review|provisional|diagnostic/i);
});

test("withheld synthetic routes cannot enter the discovery projection", () => {
  const claims = [
    approvedClaim({ claimId: "CLAIM-SYNTHETIC-IDENTITY", category: "identity" }),
    approvedClaim({ claimId: "CLAIM-SYNTHETIC-PURPOSE", category: "purpose" }),
    approvedClaim({ claimId: "CLAIM-SYNTHETIC-REQUEST", category: "request-semantics" }),
    approvedClaim({ claimId: "CLAIM-SYNTHETIC-CONTACT", category: "contact-action" }),
  ];
  const routes = [
    syntheticRoute("ROUTE-SYNTHETIC-PUBLIC", "/synthetic-public", "CLAIM-SYNTHETIC-CONTACT"),
    syntheticRoute("ROUTE-SYNTHETIC-WITHHELD", "/synthetic-withheld", "CLAIM-MISSING-CONTACT"),
  ];

  const discoveryPaths = eligibility.getEligibleRoutes(NOW, routes, claims)
    .filter(({ status }) => status.startsWith("eligible"))
    .map(({ path }) => path);

  assert.deepEqual(discoveryPaths, ["/synthetic-public"]);
  assert.equal(discoveryPaths.includes("/synthetic-withheld"), false);
});

test("home support records require both final route and attached claim eligibility", () => {
  const routeClaims = [
    approvedClaim({ claimId: "CLAIM-SYNTHETIC-IDENTITY", category: "identity" }),
    approvedClaim({ claimId: "CLAIM-SYNTHETIC-PURPOSE", category: "purpose" }),
    approvedClaim({ claimId: "CLAIM-SYNTHETIC-REQUEST", category: "request-semantics" }),
    approvedClaim({ claimId: "CLAIM-SYNTHETIC-CONTACT", category: "contact-action" }),
  ];
  const serviceClaim = approvedClaim({
    claimId: "CLAIM-SYNTHETIC-SERVICE",
    surfaceId: "surface:synthetic-service",
    category: "purpose",
  });
  const route = syntheticRoute("ROUTE-SYNTHETIC-SERVICE", "/synthetic-service", "CLAIM-SYNTHETIC-CONTACT");
  const service = {
    routeId: route.routeId,
    claimIds: [serviceClaim.claimId],
    title: "Synthetic service",
    description: "Approved service wording",
    href: route.path,
    cta: "View service",
  };

  assert.deepEqual(
    services.getEligibleSupportServices(NOW, [service], [route], [...routeClaims, serviceClaim]),
    [service],
  );
  assert.deepEqual(
    services.getEligibleSupportServices(NOW, [service], [route], routeClaims),
    [],
  );
  assert.deepEqual(
    services.getEligibleSupportServices(NOW, [service], [
      { ...route, minimumTruth: { ...route.minimumTruth, contactAction: "CLAIM-MISSING-CONTACT" } },
    ], [...routeClaims, serviceClaim]),
    [],
  );
});

test("shared metadata and robots use final eligibility and parsed runtime configuration", () => {
  const seo = readSource("src/lib/seo.ts");
  const robots = readSource("src/app/robots.ts");

  assert.match(seo, /getEligibleRoutes/);
  assert.match(seo, /status\.startsWith\("eligible"\)/);
  assert.match(seo, /getRuntimeConfig/);
  assert.doesNotMatch(seo, /siteConfig|review|provisional|diagnostic/i);

  assert.match(robots, /getRuntimeConfig\(\)/);
  assert.match(robots, /getEligibleRoutes/);
  assert.match(robots, /target === "production"/);
  assert.match(robots, /crawlPolicy === "allowed"/);
  assert.doesNotMatch(robots, /process\.env|\/review|provisional|diagnostic/i);
});

test("preview and production discovery share the same selector-backed omission boundary", () => {
  const sources = [
    readSource("src/app/(public)/page.tsx"),
    readSource("src/app/sitemap.ts"),
    readSource("src/lib/seo.ts"),
  ].join("\n");

  assert.doesNotMatch(sources, /target\s*===\s*["']preview["']|VERCEL_ENV|DEPLOYMENT_ENV/);
  assert.doesNotMatch(sources, /review|provisional|diagnostic|withheld wording/i);
});
