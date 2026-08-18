import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const pagePath = "src/app/review/approvals/page.tsx";

function reportSource() {
  assert.ok(existsSync(pagePath), `${pagePath} should exist`);
  return readFileSync(pagePath, "utf8");
}

test("approval report hard-404s production before constructing its DTO", () => {
  const source = reportSource();
  const guard = source.indexOf("notFound()");
  const report = source.indexOf("getReviewReport(");

  assert.match(source, /getDeploymentTarget/);
  assert.ok(guard >= 0 && report > guard, "production guard must precede report construction");
  assert.match(source, /getDeploymentTarget\(\) === "production"[\s\S]*?notFound\(\)/);
  assert.doesNotMatch(source, /process\.env|"use client"|useState|useEffect|useActionState/);
});

test("approval report metadata and discovery remain private", () => {
  const source = reportSource();
  assert.match(source, /robots:\s*\{[\s\S]*?index:\s*false[\s\S]*?follow:\s*false[\s\S]*?noarchive:\s*true/);

  for (const path of [
    "src/app/(public)/layout.tsx",
    "src/app/sitemap.ts",
    "src/components/layout/Header.tsx",
    "src/components/layout/Footer.tsx",
    "src/components/layout/StickyMobileActions.tsx",
  ]) {
    assert.doesNotMatch(readFileSync(path, "utf8"), /review\/approvals|Production approval review/);
  }
});

test("approval report renders the fixed information architecture and exact copy", () => {
  const source = reportSource();
  const orderedCopy = [
    "Protected preview",
    "Production approval review",
    "Readiness summary",
    "Production blockers",
    "Approvals and evidence",
    "Route eligibility",
    "Environment isolation",
    "Report limitations",
  ];
  let cursor = -1;
  for (const copy of orderedCopy) {
    const next = source.indexOf(copy, cursor + 1);
    assert.ok(next > cursor, `${copy} should appear in fixed order`);
    cursor = next;
  }

  assert.match(source, /Review redacted approval, evidence, route eligibility, and environment-isolation status before this deployment can be considered for production promotion\./);
  assert.match(source, /Review production blockers/);
  assert.match(source, /Production blocked — resolve every listed blocker and record the required approval evidence before promotion\./);
  assert.match(source, /Ready for release-owner review — automated contract checks passed; final human approval is still required\./);
  assert.match(source, /Approval report unavailable\. Do not promote this deployment\. Re-run the governance and configuration checks, then ask the technical release owner to review the failure\./);

  for (const phrase of [
    "Approved / current", "Pending approval", "Review due", "Expired", "Invalidated",
    "Evidence missing", "Eligible", "Eligible in reduced form", "Withheld",
    "Isolation passed", "Isolation blocked", "Production blocked", "Ready for release-owner review",
  ]) assert.match(source, new RegExp(phrase.replace("/", "\\/")));
});

test("approval report has one main, six descriptive anchors, and semantic data views", () => {
  const source = reportSource();
  assert.equal((source.match(/<main\b/g) ?? []).length, 1);
  assert.match(source, /<main id="main-content"/);

  const ids = ["readiness-summary", "production-blockers", "approvals-evidence", "route-eligibility", "environment-isolation", "report-limitations"];
  for (const id of ids) {
    assert.match(source, new RegExp(`href="#${id}"`));
    assert.match(source, new RegExp(`id="${id}"`));
  }
  assert.equal((source.match(/className="report-section-link"/g) ?? []).length, 6);
  assert.match(source, /<caption>/);
  assert.match(source, /<th scope="col">/);
  assert.match(source, /<th scope="row">/);
  assert.match(source, /<dl className="report-mobile-card"/);
  assert.match(source, /<time dateTime=/);
});

test("D-08 alerts stay inside approvals and expose only redacted operational fields", () => {
  const source = reportSource();
  const approvalsStart = source.indexOf('id="approvals-evidence"');
  const routesStart = source.indexOf('id="route-eligibility"');
  const alertsStart = source.indexOf("Owner alerts", approvalsStart);
  assert.ok(approvalsStart >= 0 && alertsStart > approvalsStart && alertsStart < routesStart);
  for (const field of [
    "responsibleLane", "responsibleOwnerRef", "acknowledgementStatus",
    "acknowledgementEvidenceStatus", "attemptState", "retryEscalationDisposition",
  ]) assert.match(source, new RegExp(`alert\\.${field}`));
  assert.doesNotMatch(source, /alert\.(?:raw|body|content|email|phone|endpoint|token|secret)/i);
});

test("approval report is read-only and responsive without horizontal scrolling", () => {
  const source = reportSource();
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.doesNotMatch(source, /<(?:form|input|select|textarea|button)\b/i);
  assert.doesNotMatch(source, /upload|copy to clipboard|select provider|promote deployment/i);
  assert.match(css, /\.review-summary\s*\{[^}]*grid-template-columns:\s*repeat\(6,/s);
  assert.match(css, /@media \(max-width:\s*1060px\)[\s\S]*?\.review-summary\s*\{[^}]*repeat\(3,/);
  assert.match(css, /@media \(max-width:\s*720px\)[\s\S]*?\.review-summary\s*\{[^}]*1fr/);
  assert.match(css, /\.approval-report[^}]*font-size:\s*16px/);
  assert.match(css, /\.approval-report h1[^}]*font-size:\s*32px/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /overflow-x:\s*clip/);
  assert.doesNotMatch(css, /\.approval-report[^}]*animation:/);
});
