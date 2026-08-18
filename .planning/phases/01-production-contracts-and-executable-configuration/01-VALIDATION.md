---
phase: 1
slug: production-contracts-and-executable-configuration
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-08-18
updated: 2026-08-19
---

# Phase 1 — Validation Strategy

> Executable verification and manual-gate map for every Phase 1 task. Nyquist completion means the checks exist and are mapped; it does not approve external evidence, hosting access, or promotion authority.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in `node:test` and `node:assert/strict` |
| **Config file** | None — test discovery is defined by `package.json`; fixture compilation is isolated under `tests/fixtures/governance/` |
| **Quick run command** | `node --test tests/governance.test.mjs tests/configuration.test.mjs` |
| **Full suite command** | `npm run check` |
| **Measured runtime** | Plan 12 owner/regression suite: 5.4 seconds; full local gate: 113.2 seconds on 2026-08-19 |

The focused suite meets the 10-second target. The full local gate exceeds 60 seconds because it includes lint, strict type checking, 89 native tests (including a nested invalid-production build smoke), and another production build. This measured exception is recorded instead of misrepresenting the target as passed.

## Sampling Rate

- **After every task commit:** Run the task-owned focused segment below.
- **After every plan wave:** Run the final/regression smoke segments, including `npm run check` where owned by the plan.
- **Before `$gsd-verify-work`:** The full suite must be green; protected preview, external evidence, and release authority remain blocking Plan 01-14 manual gates.
- **No watch mode:** Every command terminates and is suitable for CI.

## Per-Task Verification Map

“Owner” is the task-owned focused suite; “regression” is a cross-owner suite or typecheck; “final smoke” is `npm run check`. Commands are copied exactly from their owning PLAN.

| Task ID | Plan | Wave | Requirements | Threats | Automated command | Classification | Status |
|---------|------|------|--------------|---------|-------------------|----------------|--------|
| 01-01-1 | 01-01 | 1 | PROD-01, PROD-03, PROD-04, PROD-05 | T-01, T-02, T-04, T-07 | <code>node --test --test-name-pattern="production estate&#124;privacy&#124;lead contract&#124;approval&#124;owner alert" tests/governance.test.mjs && npm run typecheck</code> | Owner: governance; regression: typecheck | Passed; assertions exist |
| 01-02-1 | 01-02 | 2 | PROD-06, PROD-07 | T-04–T-09 | <code>node --test --test-name-pattern="production&#124;isolation" tests/configuration.test.mjs && npm run typecheck</code> | Owner: configuration/build gate; regression: typecheck | Passed; assertions exist |
| 01-02-2 | 01-02 | 2 | PROD-06, PROD-07 | T-04–T-09 | `node --test tests/configuration.test.mjs && node --test tests/governance.test.mjs && npm run check` | Owner: configuration; regression: governance; final smoke | Passed; assertions exist |
| 01-03-1 | 01-03 | 2 | PROD-02, PROD-03 | T-01, T-02, T-04, T-06 | <code>node --test --test-name-pattern="branch&#124;eligibility&#124;route&#124;owner alert" tests/governance.test.mjs && npm run typecheck</code> | Owner: selectors; regression: typecheck | Passed; assertions exist |
| 01-04-1 | 01-04 | 3 | PROD-02, PROD-03, PROD-07 | T-02, T-03, T-04 | <code>node --test --test-name-pattern="public layout&#124;organization&#124;public 404" tests/governance.test.mjs && npm run typecheck</code> | Owner: shell boundary; regression: typecheck | Passed; assertions exist |
| 01-04-2 | 01-04 | 3 | PROD-02, PROD-03, PROD-07 | T-02, T-03, T-04 | <code>node --test --test-name-pattern="navigation&#124;surface" tests/governance.test.mjs && npm run check</code> | Owner: shell DTO/discovery; final smoke | Passed; assertions exist |
| 01-13-1 | 01-13 | 3 | PROD-01, PROD-03, PROD-04, PROD-05, PROD-07 | T-01, T-04, T-07, T-08 | `node --test tests/operations.test.mjs && node --test tests/governance.test.mjs tests/configuration.test.mjs && npm run check` | Owner: operations; regression: governance/configuration; final smoke | Passed; assertions exist |
| 01-05-1 | 01-05 | 4 | PROD-02, PROD-03 | T-02, T-06 | <code>node --test --test-name-pattern="branch&#124;contact" tests/branch-surfaces.test.mjs && npm run check</code> | Owner: branch/contact; final smoke | Passed; assertions exist |
| 01-06-1 | 01-06 | 4 | PROD-03, PROD-05 | T-04, T-07 | <code>node --test --test-name-pattern="sales&#124;inquiry" tests/sales-surfaces.test.mjs && npm run check</code> | Owner: sales/inquiry; final smoke | Passed; assertions exist |
| 01-07-1 | 01-07 | 4 | PROD-03 | T-02, T-04 | <code>node --test --test-name-pattern="guide&#124;promotion" tests/editorial-surfaces.test.mjs && npm run check</code> | Owner: editorial; final smoke | Passed; assertions exist |
| 01-08-1 | 01-08 | 4 | PROD-02, PROD-03, PROD-04, PROD-05 | T-01, T-04 | <code>node --test --test-name-pattern="aftersales&#124;legal&#124;privacy" tests/legal-aftersales-surfaces.test.mjs && npm run check</code> | Owner: aftersales/legal; final smoke | Passed; assertions exist |
| 01-09-1 | 01-09 | 4 | PROD-03 | T-02, T-04 | <code>node --test --test-name-pattern="truck&#124;finder&#124;generated params" tests/product-surfaces.test.mjs && npm run check</code> | Owner: product/finder; final smoke | Passed; assertions exist |
| 01-15-1 | 01-15 | 4 | PROD-03 | T-02, T-04 | <code>node --test --test-name-pattern="delivery&#124;application&#124;expired" tests/delivery-surfaces.test.mjs && npm run check</code> | Owner: delivery/application; final smoke | Passed; assertions exist |
| 01-16-1 | 01-16 | 4 | PROD-03, PROD-05 | T-02, T-04, T-07 | <code>node --test --test-name-pattern="campaign&#124;generated params&#124;metadata" tests/campaign-surfaces.test.mjs && npm run check</code> | Owner: campaigns; final smoke | Passed; assertions exist |
| 01-10-1 | 01-10 | 5 | PROD-02, PROD-03, PROD-06, PROD-07 | T-02, T-03, T-04, T-06 | `node --test tests/surface-coherence.test.mjs && node --test tests/governance.test.mjs tests/configuration.test.mjs tests/branch-surfaces.test.mjs tests/sales-surfaces.test.mjs tests/editorial-surfaces.test.mjs tests/delivery-surfaces.test.mjs tests/legal-aftersales-surfaces.test.mjs tests/product-surfaces.test.mjs tests/campaign-surfaces.test.mjs && npm run check` | Owner: discovery coherence; regression: upstream suites; final smoke | Passed; assertions exist |
| 01-11-1 | 01-11 | 6 | PROD-01–PROD-07 | T-03, T-04, T-05, T-09 | `node --test tests/review-report.test.mjs && node --test tests/governance.test.mjs tests/configuration.test.mjs tests/surface-coherence.test.mjs && npm run check` | Owner: report DTO; regression: governance/config/discovery; final smoke | Passed; assertions exist |
| 01-12-1 | 01-12 | 7 | PROD-01–PROD-07 | T-03, T-04, T-09 | `node --test tests/report-ui.test.mjs tests/review-report.test.mjs && npm run check` | Owner: report UI; regression: report DTO; final smoke | Passed 2026-08-19 |
| 01-12-2 | 01-12 | 7 | PROD-01–PROD-07 | T-03, T-04, T-09 | `node --test tests/governance.test.mjs tests/configuration.test.mjs tests/branch-surfaces.test.mjs tests/sales-surfaces.test.mjs tests/editorial-surfaces.test.mjs tests/delivery-surfaces.test.mjs tests/legal-aftersales-surfaces.test.mjs tests/product-surfaces.test.mjs tests/campaign-surfaces.test.mjs tests/surface-coherence.test.mjs tests/review-report.test.mjs tests/report-ui.test.mjs && npm run check` | Owner: complete phase map; final smoke | Passed 2026-08-19 |
| 01-14-1 | 01-14 | 8 | PROD-01–PROD-07 | T-01–T-09 | `node --test tests/governance.test.mjs tests/configuration.test.mjs tests/branch-surfaces.test.mjs tests/sales-surfaces.test.mjs tests/editorial-surfaces.test.mjs tests/delivery-surfaces.test.mjs tests/legal-aftersales-surfaces.test.mjs tests/product-surfaces.test.mjs tests/campaign-surfaces.test.mjs tests/surface-coherence.test.mjs tests/review-report.test.mjs tests/report-ui.test.mjs tests/operations.test.mjs && npm run check` | Regression: complete phase suite; final smoke | **Blocking human-action evidence gate**; automation retained |
| 01-14-2 | 01-14 | 8 | PROD-01–PROD-07 | T-01–T-09 | <code>npm run check && node --test --test-name-pattern="production&#124;isolation&#124;review" tests/configuration.test.mjs tests/report-ui.test.mjs</code> | Final smoke; focused protection/isolation regression | **Blocking human-verification Vercel/protection/authority gate**; automation retained |

All 20 task rows are present. Every command references an existing script/test file, and every focused pattern has matching native-test assertions.

## Threat Reference Index

- **T-01:** An unapproved actor changes approval state.
- **T-02:** A governed fact is altered without evidence, revision history, or reapproval.
- **T-03:** The protected review report becomes publicly accessible.
- **T-04:** A secret or sensitive value enters a public variable, evidence reference, report, log, or Git history.
- **T-05:** Preview traffic sends leads or marketing events to production systems.
- **T-06:** A malicious or insecure URL is accepted for evidence, directions, origin, or provider configuration.
- **T-07:** The application acknowledges a lead without durable acceptance.
- **T-08:** Rollback leaves incompatible runtime configuration active.
- **T-09:** Configuration errors disclose environment values.

## Required Test Matrices

### Approval Matrix

The governance suite covers pending, approved/current, approved without evidence, review due at the evaluation instant, expired, invalidated, wrong lane, wrong locality, superseded revision, and malformed evidence-reference shape.

### Environment Matrix

The configuration suite covers development, preview, and production; missing/HTTP/local/wrong origins; crawl policy; disabled/sandbox/production lead profiles; disabled/test/production analytics profiles; and matching/mismatching `VERCEL_ENV`.

### Surface Coherence

The surface suites prove withheld claims/routes are absent from selectors, navigation, internal discovery, metadata/JSON-LD, sitemap, and public shell. Reduced-form publication must pass minimum viable truth.

### Security Assertions

- Governance exports and review DTOs reject secret-like keys and forbidden values recursively.
- No raw `process.env` object is serialized; report output uses classifications and stable safe code/key diagnostics.
- The production report route invokes `notFound()` before `getReviewReport()` and is absent from discovery surfaces.
- URL-bearing configuration accepts only target-safe origins; the report never fetches evidence references.
- D-08 alert UI displays only stable IDs, lane/opaque owner reference, acknowledgement state, attempt state, and retry/escalation disposition.

## Wave 0 Completion Evidence

- [x] `tests/governance.test.mjs` covers approval, branch, privacy, lead-contract, eligibility, route, and owner-alert contracts.
- [x] `tests/configuration.test.mjs` covers pure parsing, redaction, build gate, and target isolation.
- [x] `tests/fixtures/governance/` contains synthetic records without real secrets, PII, or sensitive evidence.
- [x] `src/lib/runtime-config.ts` exports testable parsing and conservative deployment-target classification.
- [x] Invalid production configuration is proven to fail before compilation completes.
- [x] `tests/review-report.test.mjs` and `tests/report-ui.test.mjs` cover redaction, allow-listing, production/discovery absence, accessibility, and responsive contracts.
- [x] No new framework or package was introduced.

## Manual-Only Verifications

| Gate | Requirement | Why manual | Test instructions | State |
|------|-------------|------------|-------------------|-------|
| Plan 12 responsive/accessibility review | PROD-01–PROD-07 | Browser reflow, zoom, and visual hierarchy are not established by source contracts | In protected preview inspect 320px, 800px, and desktop; verify keyboard traversal/focus; one H1 and ordered headings; visible captions/scoped headers and equivalent mobile definitions; at 200% zoom verify no loss, overlap, clipping, or two-dimensional scrolling. | Required before Plan 01-14 completion |
| Protected preview access | PROD-01, PROD-07 | Vercel Deployment Protection/account permissions require the approved project | Signed out, verify preview denial. Signed in as an authorized reviewer, verify report access. Verify the production URL returns the shared shell-free 404 without report title/data. | Blocking 01-14-2 human-verification gate |
| Approval evidence validity | PROD-01–PROD-05 | External evidence and named approvers cannot be proven from fixtures | Verify role, date, next review/expiry, revision, and opaque reference in the authoritative system without copying sensitive content into Git. | Blocking 01-14-1 human-action gate |
| Promotion and rollback authority | PROD-01, PROD-07 | Hosting permissions and roles are external controls | Verify only the named owner/backup can promote or roll back; rehearse preview promotion and record closeout evidence without changing unapproved facts. | Blocking 01-14-2 human-verification gate |

## Requirements and Threat Coverage

| Requirement | Automated owners | Manual dependency |
|-------------|------------------|-------------------|
| PROD-01 | 01-01, 01-11, 01-12 | Evidence and release authority |
| PROD-02 | 01-03–01-05, 01-08, 01-10–01-12 | Branch-fact verification |
| PROD-03 | 01-01, 01-03–01-13, 01-15, 01-16 | Evidence authority and visual review |
| PROD-04 | 01-01, 01-08, 01-11–01-13 | Privacy/legal approval |
| PROD-05 | 01-01, 01-06, 01-08, 01-11–01-13, 01-16 | Provider/operating approval |
| PROD-06 | 01-02, 01-10–01-12 | Approved live values |
| PROD-07 | 01-02, 01-04, 01-10–01-13 | Vercel protection and authority |

T-01 through T-09 are assigned to executable task rows and retained on both Plan 01-14 release gates.

## Validation Sign-Off

- [x] All 20 tasks have exact automated commands and owner/regression/final-smoke classification.
- [x] Sampling continuity has no three consecutive tasks without automation.
- [x] Wave 0 files, fixtures, parser/build gate, and report tests exist.
- [x] No watch-mode flags are used.
- [x] Focused feedback is below 10 seconds; the 113.2-second full-gate exception is documented.
- [x] T-01–T-09 and PROD-01–PROD-07 have executable traceability.
- [x] External Vercel, evidence, visual, and authority checks remain manual and blocking.
- [x] `wave_0_complete: true` and `nyquist_compliant: true` describe complete executable mapping, not external approval.

**Nyquist approval:** complete. **Production approval:** pending Plan 01-14 manual gates.
