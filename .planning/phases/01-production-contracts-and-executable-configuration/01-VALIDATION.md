---
phase: 1
slug: production-contracts-and-executable-configuration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-18
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in `node:test` and `node:assert/strict` |
| **Config file** | None — test discovery is defined by `package.json`; Wave 0 adds focused test files and fixtures |
| **Quick run command** | `node --test tests/governance.test.mjs tests/configuration.test.mjs` |
| **Full suite command** | `npm run check` |
| **Estimated runtime** | Quick target: <10 seconds; full target: <60 seconds on the supported local/CI runtime |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/governance.test.mjs tests/configuration.test.mjs`
- **After every plan wave:** Run `npm run check`
- **Before `$gsd-verify-work`:** Full suite must be green; protected preview must be reviewed; every production-blocking decision must be approved; a deliberately invalid production configuration must be proven to fail before the Next.js build completes.
- **Max feedback latency:** 10 seconds for the focused suite; 60 seconds for the full local gate.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-W0-01 | TBD | 0 | PROD-01 | T-01, T-02 | Required estate and authority decisions are evidence-backed; pending/missing decisions block production | unit/schema | `node --test tests/governance.test.mjs --test-name-pattern="production estate"` | ❌ W0 | ⬜ pending |
| 01-W0-02 | TBD | 0 | PROD-02 | T-01, T-02 | Public branch fields come from one approved/current selector and omit ineligible values | unit | `node --test tests/governance.test.mjs --test-name-pattern="branch"` | ❌ W0 | ⬜ pending |
| 01-W0-03 | TBD | 0 | PROD-03 | T-02, T-06 | Unapproved, expired, invalidated, or nationally inapplicable claims cannot reach public surfaces | unit/integration | `node --test tests/governance.test.mjs --test-name-pattern="eligibility|route"` | ❌ W0 | ⬜ pending |
| 01-W0-04 | TBD | 0 | PROD-04 | T-01, T-02, T-04 | Privacy contract requires all approved topics and contains no secrets or sensitive evidence | schema | `node --test tests/governance.test.mjs --test-name-pattern="privacy"` | ❌ W0 | ⬜ pending |
| 01-W0-05 | TBD | 0 | PROD-05 | T-04, T-06, T-07 | Every lead type has a complete approved operating contract; optimistic or missing-provider profiles fail production | schema/contract | `node --test tests/governance.test.mjs --test-name-pattern="lead contract"` | ❌ W0 | ⬜ pending |
| 01-W0-06 | TBD | 0 | PROD-06 | T-04, T-06, T-09 | Production configuration fails before build on missing/malformed/mismatched values and errors never echo values | unit/build smoke | `node --test tests/configuration.test.mjs --test-name-pattern="production"` | ❌ W0 | ⬜ pending |
| 01-W0-07 | TBD | 0 | PROD-07 | T-03, T-05, T-08 | Preview rejects production profiles and production rejects preview/test profiles; review route is absent in production | matrix/integration | `node --test tests/configuration.test.mjs --test-name-pattern="isolation|review"` | ❌ W0 | ⬜ pending |

### Threat Reference Index

- **T-01:** An unapproved actor changes approval state.
- **T-02:** A governed fact is altered without evidence, revision history, or reapproval.
- **T-03:** The protected review report becomes publicly accessible.
- **T-04:** A secret or sensitive value enters a public variable, evidence reference, report, log, or Git history.
- **T-05:** Preview traffic sends leads or marketing events to production systems.
- **T-06:** A malicious or insecure URL is accepted for evidence, directions, origin, or provider configuration.
- **T-07:** The application acknowledges a lead without durable acceptance.
- **T-08:** Rollback leaves incompatible runtime configuration active.
- **T-09:** Configuration errors disclose environment values.

---

## Required Test Matrices

### Approval Matrix

- Pending
- Approved and current
- Approved without evidence
- Review due exactly at the evaluation instant
- Expired
- Explicitly invalidated
- Wrong approval lane
- National source without Cebu applicability
- Superseded revision
- Malformed evidence-reference shape

### Environment Matrix

Exercise development, preview, and production against:

- Missing origin
- HTTP versus HTTPS
- Localhost versus approved or wrong origin
- Crawl blocked versus allowed
- Disabled, sandbox, and production lead profiles
- Disabled, test, and production analytics profiles
- Matching and mismatching `VERCEL_ENV`

### Surface Coherence

A withheld claim or route must be absent from its page selector, navigation, internal-link registry, metadata/JSON-LD, sitemap, and public review route. Reduced-form publication must satisfy the minimum viable truth predicate.

### Security Assertions

- Governance exports and review DTOs contain no secret-like keys.
- No raw `process.env` object is serialized.
- Production review route returns 404 and is absent from public discovery surfaces.
- Error snapshots contain stable codes and variable names but never values.
- URL-bearing configuration allows only approved HTTPS schemes and hosts; evidence URLs are never server-fetched by the review report.

---

## Wave 0 Requirements

- [ ] `tests/governance.test.mjs` — synthetic approval, branch, privacy, lead-contract, eligibility, and route tests for PROD-01 through PROD-05.
- [ ] `tests/configuration.test.mjs` — pure environment parser, value-redaction, review-route, and target-isolation matrix for PROD-06 and PROD-07.
- [ ] `tests/fixtures/governance/` — synthetic records containing no real secrets, personal data, unapproved business facts, or externally sensitive evidence.
- [ ] `src/lib/runtime-config.ts` — testable pure parser export; avoid module-load-only parsing in unit tests.
- [ ] A build-time invocation path that proves invalid production configuration fails before `next build` completes.
- [ ] Redaction and source-contract assertions for the protected review report and its DTO.
- [ ] No framework installation is required; reuse the native Node test runner and existing Zod dependency.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Protected preview access | PROD-01, PROD-07 | Vercel Deployment Protection and account permissions require the approved live project | Open the protected preview while signed out and verify access is denied; sign in with an authorized reviewer and verify the report is accessible; verify the equivalent production URL returns 404. |
| Approval evidence validity | PROD-01–PROD-05 | External evidence and named approvers cannot be proven from repository fixtures | For each blocking decision, verify the approver role, date, next-review/expiry, revision, and external evidence reference against the authoritative system without copying sensitive material into the repository. |
| Manual promotion and rollback authority | PROD-01, PROD-07 | Hosting permissions and named operational roles are external controls | Verify only the named release owner/backup can promote or roll back; execute a preview promotion rehearsal and record the closeout evidence without changing live customer-facing facts. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verification or explicit Wave 0 dependencies.
- [ ] Sampling continuity: no three consecutive tasks lack automated verification.
- [ ] Wave 0 covers all missing references above.
- [ ] No watch-mode flags are used.
- [ ] Focused feedback latency is below 10 seconds and the full gate is below 60 seconds in CI or any measured exceptions are documented.
- [ ] Every plan threat model cites the relevant T-IDs and blocks unresolved HIGH-severity threats.
- [ ] `wave_0_complete: true` and `nyquist_compliant: true` are set after all Wave 0 tests and task mappings exist.

**Approval:** pending
