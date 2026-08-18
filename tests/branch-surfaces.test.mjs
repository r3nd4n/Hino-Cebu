import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const contactRoute = "src/app/(public)/contact/page.tsx";
const branchRoute = "src/app/(public)/hino-cebu/page.tsx";

function readSource(path) {
  return readFileSync(path, "utf8");
}

test("branch and contact routes keep their public URLs inside the public route group", () => {
  assert.equal(existsSync(contactRoute), true);
  assert.equal(existsSync(branchRoute), true);
  assert.equal(existsSync("src/app/contact/page.tsx"), false);
  assert.equal(existsSync("src/app/hino-cebu/page.tsx"), false);
});

test("branch and contact surfaces use canonical eligible branch and action selectors", () => {
  for (const route of [contactRoute, branchRoute]) {
    const source = readSource(route);

    assert.match(source, /getEligibleBranch/);
    assert.match(source, /getEligibleContactActions/);
    assert.match(source, /const eligibleBranch = getEligibleBranch\(\)/);
    assert.match(source, /const contactActions = getEligibleContactActions\(\)/);
    assert.match(source, /contactActions\.map/);
    assert.doesNotMatch(source, /siteConfig|directionsHref/);
    assert.doesNotMatch(source, /377 P\. Almendras|\+63 32 346 3322|google\.com\/maps/i);
    assert.doesNotMatch(source, /pending approval|stakeholder-provided|provisional|diagnostic|withheld/i);
  }
});

test("contact structured data is built only from independently eligible branch fields", () => {
  const source = readSource(contactRoute);

  assert.match(source, /eligibleBranch\.identity \? <JsonLd/);
  assert.match(source, /eligibleBranch\.identity/);
  assert.match(source, /eligibleBranch\.address/);
  assert.match(source, /eligibleBranch\.phone/);
  assert.match(source, /eligibleBranch\.hours/);
  assert.doesNotMatch(source, /streetAddress:\s*["']/);
  assert.doesNotMatch(source, /telephone:\s*["']/);
});

test("branch page renders only selector-backed contact actions", () => {
  const source = readSource(branchRoute);

  assert.doesNotMatch(source, /href=["']\/(?:quote|contact|hino-cebu\/customer-deliveries)/);
  assert.doesNotMatch(source, /<CtaBand|<Link/);
});
