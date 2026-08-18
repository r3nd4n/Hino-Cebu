import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  approvedRuntimeDecisions,
  loadConfigurationModules,
} from "./fixtures/configuration/loader.mjs";

const { runtimeConfig } = loadConfigurationModules();
const { parseRuntimeConfig } = runtimeConfig;

const development = {
  DEPLOYMENT_ENV: "development",
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  LEAD_PROFILE: "development",
  ANALYTICS_PROFILE: "disabled",
  CRAWL_POLICY: "blocked",
  REVIEW_ACCESS: "protected",
};

const preview = {
  DEPLOYMENT_ENV: "preview",
  VERCEL_ENV: "preview",
  NEXT_PUBLIC_SITE_URL: "https://preview.example",
  LEAD_PROFILE: "sandbox",
  ANALYTICS_PROFILE: "test",
  CRAWL_POLICY: "blocked",
  REVIEW_ACCESS: "protected",
};

const production = {
  DEPLOYMENT_ENV: "production",
  VERCEL_ENV: "production",
  NEXT_PUBLIC_SITE_URL: "https://approved.example",
  LEAD_PROFILE: "production",
  ANALYTICS_PROFILE: "production",
  CRAWL_POLICY: "allowed",
  REVIEW_ACCESS: "disabled",
};

test("isolation matrix accepts only target-safe profiles", () => {
  assert.equal(parseRuntimeConfig(development).target, "development");
  assert.equal(parseRuntimeConfig(preview).target, "preview");
  assert.equal(parseRuntimeConfig(production, approvedRuntimeDecisions).target, "production");

  const rejected = [
    [preview, { LEAD_PROFILE: "production" }],
    [preview, { ANALYTICS_PROFILE: "production" }],
    [preview, { CRAWL_POLICY: "allowed" }],
    [production, { LEAD_PROFILE: "sandbox" }],
    [production, { ANALYTICS_PROFILE: "test" }],
    [production, { REVIEW_ACCESS: "protected" }],
  ];
  for (const [base, override] of rejected) {
    assert.throws(
      () => parseRuntimeConfig({ ...base, ...override }, approvedRuntimeDecisions),
      /CFG_PROFILE_MISMATCH/,
    );
  }
});

test("production origin and target checks fail closed without leaking values", () => {
  const secretValue = "https://user:super-secret@wrong.example/private?q=secret#hash";
  const invalid = [
    [{ ...production, NEXT_PUBLIC_SITE_URL: secretValue }, approvedRuntimeDecisions],
    [{ ...production, NEXT_PUBLIC_SITE_URL: "http://approved.example" }, approvedRuntimeDecisions],
    [{ ...production, NEXT_PUBLIC_SITE_URL: "https://localhost:3000" }, approvedRuntimeDecisions],
    [{ ...production, NEXT_PUBLIC_SITE_URL: "https://wrong.example" }, approvedRuntimeDecisions],
    [{ ...production, VERCEL_ENV: "preview" }, approvedRuntimeDecisions],
    [{ ...production, NEXT_PUBLIC_SITE_URL: undefined }, approvedRuntimeDecisions],
    [production, { productionEstateApproved: false, productionOrigin: "https://approved.example" }],
  ];

  for (const [environment, decisions] of invalid) {
    assert.throws(() => parseRuntimeConfig(environment, decisions), (error) => {
      assert.match(error.message, /^CFG_[A-Z_]+(?:: [A-Z0-9_]+)?$/);
      assert.doesNotMatch(error.message, /super-secret|wrong\.example|private|approved\.example/);
      return true;
    });
  }
});

test("isolation output contains classifications and a non-secret fingerprint", () => {
  const first = parseRuntimeConfig(preview);
  const second = parseRuntimeConfig({ ...preview, UNUSED_SECRET: "must-not-flow" });
  assert.deepEqual(first, second);
  assert.match(first.fingerprint, /^[a-f0-9]{16}$/);
  assert.deepEqual(Object.keys(first).sort(), [
    "analyticsProfile",
    "crawlPolicy",
    "fingerprint",
    "leadProfile",
    "reviewAccess",
    "siteOrigin",
    "target",
  ].sort());
  assert.doesNotMatch(JSON.stringify(first), /must-not-flow/);
});

test("production build smoke rejects invalid configuration before compilation", () => {
  const next = resolve("node_modules/next/dist/bin/next");
  assert.throws(() => execFileSync(process.execPath, [next, "build"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...production,
      NEXT_PUBLIC_SITE_URL: "https://wrong.example",
    },
    encoding: "utf8",
    stdio: "pipe",
    timeout: 30_000,
  }), (error) => {
    const output = `${error.stdout || ""}${error.stderr || ""}`;
    assert.match(output, /CFG_PRODUCTION_ESTATE_UNAPPROVED/);
    assert.doesNotMatch(output, /wrong\.example/);
    return true;
  });
});

test("production configuration is allow-listed at the build boundary", () => {
  const source = readFileSync("next.config.ts", "utf8");
  assert.match(source, /getRuntimeConfig\(\)/);
  assert.doesNotMatch(source, /\.\.\.process\.env/);
});
