import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const outputDirectory = resolve("node_modules/.cache/hino-governance-tests");
const tsc = resolve("node_modules/typescript/bin/tsc");

export function loadGovernanceModules() {
  rmSync(outputDirectory, { force: true, recursive: true });
  mkdirSync(outputDirectory, { recursive: true });
  execFileSync(process.execPath, [tsc, "-p", "tests/fixtures/governance/tsconfig.json", "--outDir", outputDirectory], {
    stdio: "pipe",
  });

  return {
    schemas: require(resolve(outputDirectory, "src/lib/governance/schemas.js")),
    decisions: require(resolve(outputDirectory, "src/content/governance/decisions.js")),
    privacy: require(resolve(outputDirectory, "src/content/governance/privacy.js")),
    leads: require(resolve(outputDirectory, "src/content/governance/leads.js")),
    release: require(resolve(outputDirectory, "src/content/governance/release.js")),
  };
}

export const NOW = new Date("2026-08-18T12:00:00.000Z");

export function evidence(reference = "EVID-SYNTHETIC-001") {
  return { reference };
}

export function approvedDecision(lane, overrides = {}) {
  return {
    status: "approved",
    lane,
    approverRole: `${lane}-approver`,
    approvedAt: "2026-08-01T00:00:00.000Z",
    reviewAt: "2026-09-01T00:00:00.000Z",
    evidence: evidence(),
    invalidatedAt: null,
    invalidationCode: null,
    supersededByRevision: null,
    ...overrides,
  };
}

export function approvedEnvelope(responsibleLane = "sales", overrides = {}) {
  return {
    recordId: "GOV-SYNTHETIC-001",
    revision: 1,
    responsibleLane,
    departmentApproval: approvedDecision(responsibleLane),
    releaseConfirmation: approvedDecision("technical-release", {
      approverRole: "technical-release-owner",
      evidence: evidence("EVID-SYNTHETIC-RELEASE"),
    }),
    ...overrides,
  };
}
