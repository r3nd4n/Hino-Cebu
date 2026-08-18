import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const aftersalesRoutes = ["parts", "service"];
const legalRoutes = ["privacy", "terms"];
const readSource = (path) => readFileSync(path, "utf8");

test("aftersales and legal routes retain their URLs inside the public route group", () => {
  for (const route of [...aftersalesRoutes, ...legalRoutes]) {
    assert.equal(existsSync(`src/app/(public)/${route}/page.tsx`), true);
    assert.equal(existsSync(`src/app/${route}/page.tsx`), false);
  }
});

test("aftersales routes require canonical route, claim, and contact eligibility", () => {
  for (const route of aftersalesRoutes) {
    const source = readSource(`src/app/(public)/${route}/page.tsx`);
    assert.match(source, /getEligibleRoutes/);
    assert.match(source, /getEligibleClaims/);
    assert.match(source, /getEligibleContactActions/);
    assert.match(source, new RegExp(`surface:${route}`));
    assert.match(source, /notFound\(\)/);
    assert.doesNotMatch(source, /siteConfig|approval|pending|withheld|officialSummary|officialPoints|sourceUrl/i);
  }
});

test("canonical governance catalog assigns aftersales ownership to parts and service", () => {
  const claims = readSource("src/content/governance/claims.ts");

  for (const route of aftersalesRoutes) {
    assert.match(claims, new RegExp(`path: "\\/${route}"`));
    assert.match(claims, new RegExp(`surface:${route}`));
    for (const category of ["IDENTITY", "PURPOSE", "REQUEST", "CONTACT"]) {
      assert.match(claims, new RegExp(`CLAIM-${route.toUpperCase()}-${category}`));
    }
  }
});

test("privacy uses only eligible legal topics and canonical branch contact data", () => {
  const source = readSource("src/app/(public)/privacy/page.tsx");

  assert.match(source, /getEligiblePrivacyTopics/);
  assert.match(source, /getEligibleBranch/);
  assert.match(source, /getEligibleContactActions/);
  assert.match(source, /const eligibleBranch = getEligibleBranch\(\)/);
  assert.match(source, /const contactActions = getEligibleContactActions\(\)/);
  assert.doesNotMatch(source, /privacyContract|siteConfig|approval|pending|draft|diagnostic|withheld/i);
});

test("terms sources branch identity and contact details only from eligible selectors", () => {
  const source = readSource("src/app/(public)/terms/page.tsx");

  assert.match(source, /getEligibleBranch/);
  assert.match(source, /getEligibleContactActions/);
  assert.match(source, /const eligibleBranch = getEligibleBranch\(\)/);
  assert.match(source, /const contactActions = getEligibleContactActions\(\)/);
  assert.doesNotMatch(source, /siteConfig|approval|pending|draft|diagnostic|withheld/i);
});

test("legal route owners contain no hardcoded branch facts or unapproved conclusions", () => {
  const sources = legalRoutes
    .map((route) => readSource(`src/app/(public)/${route}/page.tsx`))
    .join("\n");

  assert.doesNotMatch(sources, /Hino Cebu|377 P\. Almendras Extension|Cebu City, Central Visayas|\+63 32 346 3322|tel:\+63323463322/i);
  assert.doesNotMatch(sources, /we may collect|information is used|may be shared|subject to applicable law|intellectual property|binding agreement|governed by their respective operators/i);
  assert.doesNotMatch(sources, /request was received|received for follow-up|response (?:time|window)|we(?:'|â€™)ll (?:call|contact|respond)/i);
});

test("privacy selector releases all required topics only through approved policy values", () => {
  const source = readSource("src/content/governance/privacy.ts");

  assert.match(source, /getEligiblePrivacyTopics/);
  assert.match(source, /isApprovedPolicyValue/);
  assert.match(source, /privacyContract\.topics\.length/);
});
