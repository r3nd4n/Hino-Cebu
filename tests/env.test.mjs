import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { promisify } from "node:util";

const executeFile = promisify(execFile);
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const loaderUrl = pathToFileURL(
  fileURLToPath(new URL("./fixtures/env-server-only-loader.mjs", import.meta.url)),
).href;
const providerKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "LEAD_NOTIFICATION_EMAIL",
  "GOOGLE_SHEETS_SPREADSHEET_ID",
  "GOOGLE_SHEETS_CLIENT_EMAIL",
  "GOOGLE_SHEETS_PRIVATE_KEY",
  "GOOGLE_SHEETS_WORKSHEET_NAME",
  "TURNSTILE_SECRET_KEY",
];

async function loadEnvironment(overrides = {}) {
  const environment = { ...process.env, ...overrides };

  for (const key of providerKeys) {
    if (!(key in overrides)) {
      delete environment[key];
    }
  }

  const script = `
    const environment = await import('./src/lib/env.ts');
    process.stdout.write(JSON.stringify({
      publicEnv: environment.publicEnv,
      publicEnvKeys: Object.keys(environment.publicEnv),
      readiness: environment.getLeadIntegrationReadiness(),
    }));
  `;
  const { stdout } = await executeFile(
    process.execPath,
    ["--experimental-loader", loaderUrl, "--experimental-strip-types", "--input-type=module", "--eval", script],
    { cwd: projectRoot, env: environment },
  );

  return JSON.parse(stdout);
}

test("normalizes valid public site URLs and rejects unsafe values", async () => {
  const normalized = await loadEnvironment({
    NEXT_PUBLIC_SITE_URL: " https://www.hinocebu.example/quote?source=test ",
  });
  const invalid = await loadEnvironment({ NEXT_PUBLIC_SITE_URL: "javascript:alert(1)" });

  assert.deepEqual(normalized.publicEnv, { siteUrl: "https://www.hinocebu.example" });
  assert.deepEqual(invalid.publicEnv, {});
  assert.deepEqual(invalid.publicEnvKeys, ["siteUrl"]);
});

test("keeps optional provider integrations disabled when credentials are absent or incomplete", async () => {
  const absent = await loadEnvironment();
  const incomplete = await loadEnvironment({
    RESEND_API_KEY: "resend-key",
    GOOGLE_SHEETS_SPREADSHEET_ID: "spreadsheet-id",
    TURNSTILE_SECRET_KEY: "turnstile-secret",
  });

  assert.deepEqual(absent.readiness, {
    sheetsReady: false,
    emailReady: false,
    turnstileEnabled: false,
    leadDeliveryReady: false,
  });
  assert.deepEqual(incomplete.readiness, {
    sheetsReady: false,
    emailReady: false,
    turnstileEnabled: true,
    leadDeliveryReady: false,
  });
});

test("reports provider readiness only for complete credential sets without exposing secrets", async () => {
  const result = await loadEnvironment({
    RESEND_API_KEY: "resend-key",
    RESEND_FROM_EMAIL: "leads@hinocebu.example",
    LEAD_NOTIFICATION_EMAIL: "sales@hinocebu.example",
    GOOGLE_SHEETS_SPREADSHEET_ID: "spreadsheet-id",
    GOOGLE_SHEETS_CLIENT_EMAIL: "service-account@hinocebu.example",
    GOOGLE_SHEETS_PRIVATE_KEY: "private-key",
    GOOGLE_SHEETS_WORKSHEET_NAME: "Website Leads",
    TURNSTILE_SECRET_KEY: "turnstile-secret",
  });

  assert.deepEqual(result.readiness, {
    sheetsReady: true,
    emailReady: true,
    turnstileEnabled: true,
    leadDeliveryReady: true,
  });
  assert.deepEqual(result.publicEnv, {});
  assert.deepEqual(result.publicEnvKeys, ["siteUrl"]);
  assert.doesNotMatch(JSON.stringify(result.publicEnv), /key|email|spreadsheet|secret/i);
});
