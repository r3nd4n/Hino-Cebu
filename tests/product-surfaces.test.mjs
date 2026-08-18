import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  NOW,
  approvedClaim,
  loadGovernanceModules,
} from "./fixtures/governance/records.mjs";

const { trucks } = loadGovernanceModules();
const readSource = (path) => readFileSync(path, "utf8");

function approvedTruckRecords() {
  const routeClaims = [
    approvedClaim({ claimId: "CLAIM-TRUCKS-IDENTITY", surfaceId: "surface:trucks", category: "identity" }),
    approvedClaim({ claimId: "CLAIM-TRUCKS-PURPOSE", surfaceId: "surface:trucks", category: "purpose" }),
    approvedClaim({ claimId: "CLAIM-TRUCKS-REQUEST", surfaceId: "surface:trucks", category: "request-semantics" }),
    approvedClaim({ claimId: "CLAIM-TRUCKS-CONTACT", surfaceId: "surface:trucks", category: "contact-action" }),
  ];
  const detailClaim = approvedClaim({
    claimId: "CLAIM-HINO-200-DETAIL",
    surfaceId: "surface:hino-200",
    category: "product-detail",
  });
  const route = {
    routeId: "ROUTE-TRUCKS",
    path: "/trucks",
    surfaceId: "surface:trucks",
    minimumTruth: {
      identity: "CLAIM-TRUCKS-IDENTITY",
      purpose: "CLAIM-TRUCKS-PURPOSE",
      requestSemantics: "CLAIM-TRUCKS-REQUEST",
      contactAction: "CLAIM-TRUCKS-CONTACT",
    },
    optionalClaimIds: [detailClaim.claimId],
    unavailablePage: true,
  };
  return { route, routeClaims, detailClaim };
}

test("truck and finder routes retain their URLs inside the public route group", () => {
  for (const route of ["trucks/page.tsx", "trucks/[slug]/page.tsx", "find-your-truck/page.tsx"]) {
    assert.equal(existsSync(`src/app/(public)/${route}`), true);
    assert.equal(existsSync(`src/app/${route}`), false);
  }
});

test("truck discovery, generated params, metadata, and rendering share final eligibility", () => {
  const catalog = readSource("src/app/(public)/trucks/page.tsx");
  const finder = readSource("src/app/(public)/find-your-truck/page.tsx");
  const detail = readSource("src/app/(public)/trucks/[slug]/page.tsx");

  for (const source of [catalog, finder, detail]) {
    assert.match(source, /getEligibleTrucks/);
    assert.match(source, /getEligibleRoutes/);
    assert.match(source, /notFound\(\)/);
  }
  assert.match(detail, /generateStaticParams[\s\S]*getEligibleTrucks/);
  assert.match(detail, /generateMetadata[\s\S]*getEligibleTruck/);
  assert.match(detail, /JsonLd/);
  assert.doesNotMatch(detail, /getTruck\(|\btrucks\.map/);
});

test("cards and finder are eligible DTO consumers without governance imports", () => {
  const card = readSource("src/components/trucks/TruckCard.tsx");
  const finder = readSource("src/components/trucks/TruckFinder.tsx");
  const source = `${card}\n${finder}`;

  assert.doesNotMatch(source, /@\/content\/governance|@\/lib\/governance|getEligibleClaims|getEligibleRoutes|approval|withheld/i);
  assert.match(card, /TruckCardItem/);
  assert.match(finder, /FinderModel/);
  assert.doesNotMatch(finder, /models:\s*\["hino-200",\s*"hino-300",\s*"hino-500"\]/);
});

test("eligible truck records require an eligible route and every attached claim", () => {
  const { route, routeClaims, detailClaim } = approvedTruckRecords();
  const truck = {
    routeId: "ROUTE-TRUCK-HINO-200",
    claimIds: [...routeClaims.map(({ claimId }) => claimId), detailClaim.claimId],
    slug: "hino-200",
    name: "Hino 200",
  };

  assert.deepEqual(
    trucks.getEligibleTrucks(NOW, [truck], [route], [...routeClaims, detailClaim]),
    [truck],
  );
  assert.deepEqual(
    trucks.getEligibleTrucks(NOW, [truck], [route], routeClaims),
    [],
  );
  assert.deepEqual(
    trucks.getEligibleTrucks(NOW, [truck], [{ ...route, minimumTruth: { ...route.minimumTruth, identity: "MISSING" } }], [...routeClaims, detailClaim]),
    [],
  );
});

test("eligible truck lookup cannot return withheld dynamic records", () => {
  const { route, routeClaims, detailClaim } = approvedTruckRecords();
  const records = [
    { routeId: "ROUTE-TRUCK-HINO-200", claimIds: [...routeClaims.map(({ claimId }) => claimId), detailClaim.claimId], slug: "hino-200", name: "Hino 200" },
    { routeId: "ROUTE-TRUCK-HINO-300", claimIds: [...routeClaims.map(({ claimId }) => claimId), "CLAIM-HINO-300-DETAIL"], slug: "hino-300", name: "Hino 300" },
  ];

  assert.equal(trucks.getEligibleTruck("hino-200", NOW, records, [route], [...routeClaims, detailClaim])?.slug, "hino-200");
  assert.equal(trucks.getEligibleTruck("hino-300", NOW, records, [route], [...routeClaims, detailClaim]), undefined);
  assert.equal(trucks.getEligibleTruck("unknown", NOW, records, [route], [...routeClaims, detailClaim]), undefined);
});
