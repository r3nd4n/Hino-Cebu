import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");

const decisionGuide = () => read("docs/operations/production-decisions.md");
const providerScorecard = () => read("docs/operations/lead-provider-scorecard.md");
const releaseRunbook = () => read("docs/operations/release-runbook.md");
const recordsGuide = () => read("docs/operations/records/README.md");

test("operating procedures cover every locked decision with roles and stable records", () => {
  const sources = [decisionGuide(), providerScorecard(), releaseRunbook(), recordsGuide()];
  const combined = sources.join("\n");

  for (let number = 1; number <= 16; number += 1) {
    const id = `D-${String(number).padStart(2, "0")}`;
    assert.match(combined, new RegExp(`## ${id}\\b`), `${id} needs an executable procedure`);
  }

  assert.match(combined, /responsible role/i);
  assert.match(combined, /GOV-PRODUCTION-ESTATE/);
  assert.match(combined, /GOV-PRIVACY-CONTRACT/);
  assert.match(combined, /GOV-LEAD-(?:SALES|PARTS|SERVICE|FLEET|FINANCING)/);
  assert.match(combined, /GOV-RELEASE-AUTHORITY/);
  assert.match(combined, /npm run check/);
});

test("provider scorecard keeps selection blocked behind primary evidence and sandbox proof", () => {
  const source = providerScorecard();

  assert.match(source, /D-09 through D-12/);
  assert.match(source, /primary evidence/i);
  assert.match(source, /sandbox proof/i);
  assert.match(source, /no selection/i);
  assert.match(source, /all five GOV-LEAD-\* records/i);
  assert.match(source, /stable reference/i);
  assert.match(source, /reconciliation/i);
  assert.match(source, /recovery after delivery failure/i);
  assert.match(source, /retry\/replay/i);
  assert.match(source, /retention/i);
  assert.match(source, /secondary intake/i);
  assert.doesNotMatch(source, /winner:\s*(?!pending|none)/i);
});

test("release runbook separates promotion, emergency, rollback, restoration, and drift closeout", () => {
  const source = releaseRunbook();

  for (const heading of [
    "Ordinary protected-preview promotion",
    "Emergency change",
    "Deployment rollback",
    "Configuration restoration",
    "Closeout",
    "Next-release drift reconciliation gate",
  ]) {
    assert.match(source, new RegExp(`## ${heading}`, "i"));
  }
  assert.match(source, /pending policy/i);
  assert.match(source, /technical-release-owner|technical release owner/i);
  assert.match(source, /technical-release-backup|technical release backup/i);
});

test("owner alerts are provider-neutral, redacted, acknowledged, retried or escalated, and evidence-closed", () => {
  const source = releaseRunbook();

  assert.match(source, /## D-08\b/);
  assert.match(source, /responsibleLane/);
  assert.match(source, /responsibleOwnerRef/);
  assert.match(source, /ALERT-/);
  assert.match(source, /acknowledgedAt/);
  assert.match(source, /acknowledgementEvidenceReference/);
  assert.match(source, /operator-selected approved channel/i);
  assert.match(source, /retryEscalationDisposition/);
  assert.match(source, /close only/i);
  assert.match(source, /redacted/i);
  assert.match(source, /provider-neutral/i);
});

test("record instructions forbid sensitive evidence and invented approvals", () => {
  const sources = [decisionGuide(), providerScorecard(), releaseRunbook(), recordsGuide()];
  const combined = sources.join("\n");

  assert.match(combined, /do not record/i);
  assert.match(combined, /PII/i);
  assert.match(combined, /credentials/i);
  assert.match(combined, /signed URLs/i);
  assert.match(combined, /evidence bod(?:y|ies)/i);
  assert.match(combined, /provider/i);
  assert.match(combined, /numeric policy/i);
  assert.doesNotMatch(combined, /https?:\/\/[^\s`)]+/i);
});

test("README links operators to procedures without copying governance values", () => {
  const source = read("README.md");

  assert.match(source, /docs\/operations\/production-decisions\.md/);
  assert.match(source, /docs\/operations\/lead-provider-scorecard\.md/);
  assert.match(source, /docs\/operations\/release-runbook\.md/);
  assert.match(source, /docs\/operations\/records\/README\.md/);
  assert.match(source, /node --test tests\/operations\.test\.mjs/);
  assert.match(source, /authoritative typed governance records/i);
});
