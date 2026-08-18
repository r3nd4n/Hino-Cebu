import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const routes = ["financing", "fleet", "quote"];
const readSource = (path) => readFileSync(path, "utf8");

test("sales inquiry routes retain their URLs inside the public route group", () => {
  for (const route of routes) {
    assert.equal(existsSync(`src/app/(public)/${route}/page.tsx`), true);
    assert.equal(existsSync(`src/app/${route}/page.tsx`), false);
  }
});

test("sales inquiry routes require canonical route, claim, and contact eligibility", () => {
  for (const route of routes) {
    const source = readSource(`src/app/(public)/${route}/page.tsx`);
    assert.match(source, /getEligibleRoutes/);
    assert.match(source, /getEligibleClaims/);
    assert.match(source, /getEligibleContactActions/);
    assert.match(source, /notFound\(\)/);
    assert.doesNotMatch(source, /siteConfig|leadOperatingContracts|approval|pending|withheld/i);
  }
});

test("shared inquiry UI renders only selector-backed claims and contact alternatives", () => {
  const inquiry = readSource("src/components/marketing/InquiryPage.tsx");
  const form = readSource("src/components/forms/LeadForm.tsx");

  assert.match(inquiry, /claims/);
  assert.match(inquiry, /contactActions/);
  assert.doesNotMatch(inquiry, /Hino Philippines program|reviewed August|Confirm Cebu applicability|\/contact/);
  assert.match(form, /contactActions/);
  assert.match(form, /could not be confirmed/i);
  assert.doesNotMatch(form, /request was received|received for follow-up|response (?:time|window)|we(?:'|’)ll (?:call|contact|respond)/i);
});

test("sales inquiry source owners contain no provisional claims or review diagnostics", () => {
  const sources = [
    ...routes.map((route) => readSource(`src/app/(public)/${route}/page.tsx`)),
    readSource("src/components/marketing/InquiryPage.tsx"),
    readSource("src/components/forms/LeadForm.tsx"),
  ].join("\n");

  assert.doesNotMatch(sources, /approval (?:pending|required)|unapproved|withheld|provisional|placeholder|review report|diagnostic/i);
  assert.doesNotMatch(sources, /vehicle loan|finance lease|specific account support|right conversation|team review|team can discuss/i);
});

test("canonical governance catalog includes all sales inquiry route contracts", () => {
  const claims = readSource("src/content/governance/claims.ts");
  for (const route of routes) {
    assert.match(claims, new RegExp(`path: "\\/${route}"`));
    assert.match(claims, new RegExp(`surface:${route}`));
  }
});
