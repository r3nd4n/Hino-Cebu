import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const deliveryContentPath = "src/content/deliveries.ts";
const applicationContentPath = "src/content/businessApplications.ts";
const publicRoutePath = "src/app/(public)/hino-cebu/customer-deliveries/page.tsx";
const oldRoutePath = "src/app/hino-cebu/customer-deliveries/page.tsx";

test("delivery route moves into the governed public surface", () => {
  assert.ok(existsSync(publicRoutePath), "the public route-group delivery page should exist");
  assert.ok(!existsSync(oldRoutePath), "the old delivery route should be removed");

  const source = readFileSync(publicRoutePath, "utf8");
  assert.match(source, /getEligibleDeliveries\(now\)/);
  assert.match(source, /getEligibleRoutes\(now\)/);
  assert.match(source, /serveUnavailablePage/);
  assert.doesNotMatch(source, /approved|evidenceRef|withheldCategories|ownerLane/);
});

test("delivery records require stable claims and selector-only publication", () => {
  const source = readFileSync(deliveryContentPath, "utf8");

  assert.match(source, /claimIds:\s*string\[\]/);
  assert.match(source, /const deliveryCatalog:\s*readonly DeliveryStory\[\]/);
  assert.match(source, /export function getEligibleDeliveries\(/);
  assert.match(source, /getEligibleClaims\("surface:customer-deliveries"/);
  assert.match(source, /getEligibleRoutes\(/);
  assert.match(source, /claimIds\.length > 0/);
  assert.match(source, /claimIds\.every/);
  assert.doesNotMatch(source, /approved:\s*boolean/);
  assert.doesNotMatch(source, /export const deliveryCatalog/);
});

test("business application claims fail closed behind canonical selectors", () => {
  const source = readFileSync(applicationContentPath, "utf8");

  assert.match(source, /claimIds:\s*string\[\]/);
  assert.match(source, /const businessApplicationCatalog:\s*readonly BusinessApplication\[\]/);
  assert.match(source, /export function getEligibleBusinessApplications\(/);
  assert.match(source, /getEligibleClaims\("surface:business-applications"/);
  assert.match(source, /getEligibleRoutes\(/);
  assert.match(source, /claimIds\.length > 0/);
  assert.match(source, /claimIds\.every/);
  assert.doesNotMatch(source, /export const businessApplicationCatalog/);
});

test("expired or invalidated delivery and application claims never bypass eligibility", () => {
  for (const path of [deliveryContentPath, applicationContentPath]) {
    const source = readFileSync(path, "utf8");
    assert.match(source, /getEligibleClaims\([^\n]+now, claims\)/);
    assert.doesNotMatch(source, /\.filter\(\([^)]*approved/);
  }
});
