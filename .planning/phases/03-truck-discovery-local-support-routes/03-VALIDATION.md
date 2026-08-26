---
phase: 03
slug: truck-discovery-local-support-routes
status: planned
nyquist_compliant: true
wave_0_complete: false
created: 2026-08-26
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (Node 24.14.0) |
| **Config file** | None — test glob is defined in `package.json` |
| **Quick run command** | `node --test tests/discovery-routes.test.mjs tests/support-routes.test.mjs tests/inquiry-demo.test.mjs` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | Under 30 seconds for automated tests; lint/build run separately at the phase gate |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/discovery-routes.test.mjs tests/support-routes.test.mjs tests/inquiry-demo.test.mjs`
- **After every plan wave:** Run `npm test && npm run lint`
- **Before `$gsd-verify-work`:** Run `npm test && npm run lint && npm run build`; all commands must pass
- **Max feedback latency:** 30 seconds for the quick automated suite

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | DISC-01, DISC-02 | T-03-01–T-03-04 | Establish failing contracts for finite discovery routes, internal provenance, safe claims, inquiry paths, and no Promotions | content contract (RED) | `node --test tests/discovery-routes.test.mjs` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | DISC-01, DISC-02 | T-03-01–T-03-04 | Implement typed public projections, four listing cards, finite series pages, qualified highlights, and safe CTA wiring | content + route contract | `node --test tests/discovery-routes.test.mjs` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | DISC-03, DISC-04 | T-03-05–T-03-07 | Establish failing contracts for distinct support routes, national/local separation, configured facts, and no Promotions | content contract (RED) | `node --test tests/support-routes.test.mjs` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | DISC-03, DISC-04 | T-03-05–T-03-07 | Implement Parts/Service and About routes without leaking provenance or implying unsupported local capabilities | content + route contract | `node --test tests/support-routes.test.mjs` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | DISC-03 | T-03-08–T-03-12 | Establish failing allowlist, local validation, truthful demo-state, contact-fact, map, and Phase 4 boundary contracts | unit + content contract (RED) | `node --test tests/inquiry-demo.test.mjs` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 2 | DISC-03 | T-03-08–T-03-12 | Implement normalized editable inquiry context, local-only form states, verified facts, address-search map, and closing call cue | unit + content contract | `node --test tests/inquiry-demo.test.mjs` | ❌ W0 | ⬜ pending |
| 03-04-01 | 04 | 3 | DISC-01, DISC-02, DISC-03, DISC-04 | T-03-13–T-03-16 | Integrate route-aware mobile inquiry behavior, responsive styles, shared-shell/no-Promotions contracts, and full gates | integration + build | `npm test && npm run lint && npm run build` | ❌ W0 | ⬜ pending |
| 03-04-02 | 04 | 3 | DISC-01, DISC-02, DISC-03, DISC-04 | T-03-14, T-03-16 | Verify the complete eight-route by four-width visual, keyboard, form-state, claim-safety, and no-Promotions contract | automated gate + human verification | `npm test && npm run lint && npm run build` | ❌ W0 | ⬜ pending |

*Task IDs, plan waves, and commands are synchronized to finalized Plans 03-01 through 03-04. The three Wave 0 test files do not yet exist, so `wave_0_complete` remains false. Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/discovery-routes.test.mjs` — DISC-01/DISC-02 route, card, sourced-content, provenance, availability, and no-outbound-mother-link contracts
- [ ] `tests/support-routes.test.mjs` — DISC-03/DISC-04 support-route, authoritative-fact, unresolved-state, shared-shell, and CTA contracts
- [ ] `tests/inquiry-demo.test.mjs` — DISC-03 inquiry-topic allowlist/fallback, field validation, and truthful local-only result

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive layouts for every Phase 3 route | DISC-04 | No browser automation or visual-regression package is installed | Check `/trucks`, all four series routes, `/parts-service`, `/contact`, and `/about` at 390px, 768px, 1024px, and 1440px; verify no clipping, overflow, obscured controls, or broken CTA hierarchy |
| Application guidance remains non-prescriptive | DISC-01, DISC-02 | Claim tone and implied recommendation require human review | Review every truck card/detail application statement; confirm it is broad guidance, includes availability safeguards, and does not imply confirmed fit or Cebu stock |
| Official imagery and claims remain launch-safe | DISC-02 | Final authorization is an external commercial approval | Compare visible assets and product highlights with the internal source register/provenance and flag anything lacking approval |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all missing test references
- [x] No watch-mode flags
- [x] Feedback latency under 30 seconds for the quick suite
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** validation plan complete; execution pending
