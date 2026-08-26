---
phase: 03
slug: truck-discovery-local-support-routes
status: draft
nyquist_compliant: false
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
| 03-01-01 | 01 | 1 | DISC-01, DISC-02 | T-03-01 | Internal provenance and non-public source URLs never render in visitor output | content contract | `node --test tests/discovery-routes.test.mjs` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | DISC-03, DISC-04 | T-03-02 | Unresolved email and directions values never become fabricated or inactive links | content contract | `node --test tests/support-routes.test.mjs` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | DISC-03 | T-03-03 | Inquiry topic is allowlisted and demo success does not imply provider delivery | unit + content contract | `node --test tests/inquiry-demo.test.mjs` | ❌ W0 | ⬜ pending |
| 03-04-01 | 04 | 2 | DISC-04 | All primary routes retain shared shell, main landmark, CTA paths, and no Promotions surfaces | integration + build | `npm test && npm run lint && npm run build` | ⚠️ baseline only | ⬜ pending |

*Task and plan IDs are provisional until PLAN.md files are finalized. Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

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

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all missing test references
- [ ] No watch-mode flags
- [ ] Feedback latency under 30 seconds for the quick suite
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
