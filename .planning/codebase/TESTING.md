# Testing Patterns

**Analysis Date:** 2026-08-18

## Test Framework

**Runner:**
- Node.js built-in test runner (`node:test`), using the repository's installed Node.js runtime; no separate test-runner package is declared in `package.json`.
- Config: Not detected. Test discovery is specified directly by the `test` script in `package.json` as `tests/*.test.mjs`.
- The checked-in suite uses ECMAScript modules in `tests/foundation.test.mjs` and imports `test` from `node:test`.

**Assertion Library:**
- Node.js strict assertion API from `node:assert/strict`, imported as `assert` in `tests/foundation.test.mjs`.
- Current assertions are `assert.ok`, `assert.match`, and `assert.doesNotMatch`.

**Run Commands:**
```bash
npm test                 # Run all tests matched by tests/*.test.mjs
node --test tests/*.test.mjs  # Direct equivalent of npm test
npm run check            # Lint, typecheck, test, then production build
```

- No watch-mode script is defined in `package.json`. For local Node runner watch mode, use `node --test --watch tests/*.test.mjs` only as an ad hoc command; it is not a repository-defined workflow.
- No coverage script or threshold is defined in `package.json`.
- On 2026-08-18, `npm test` passes all 5 tests in `tests/foundation.test.mjs`; `npm run typecheck` and `npm run lint` also pass.

## Test File Organization

**Location:**
- Keep tests in the separate root-level `tests/` directory. The only current suite is `tests/foundation.test.mjs`; tests are not co-located with `src/` modules.
- Run tests from the repository root because current checks use repo-relative paths such as `src/app/page.tsx` and `public/images/official/hino-logo.png`.
- Keep framework/build validation outside the test file: `npm run check` in `package.json` composes lint, strict TypeScript checking, native tests, and `next build`.

**Naming:**
- Name suites `*.test.mjs` so they match the literal `tests/*.test.mjs` glob in `package.json`.
- Use behavior or invariant language for test names: `"required route foundation exists"`, `"site origin is environment driven"`, and `"uploads are presented as disabled"` in `tests/foundation.test.mjs`.
- If nested test directories are introduced, update the `package.json` glob because the current `tests/*.test.mjs` pattern only selects files directly under `tests/`.

**Structure:**
```text
tests/
└── foundation.test.mjs   # Repository structure and source-content contract checks
```

## Test Structure

**Suite Organization:**
```javascript
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("site origin is environment driven", () => {
  const source = readFileSync("src/lib/site-url.ts", "utf8");
  assert.match(source, /NEXT_PUBLIC_SITE_URL/);
  assert.doesNotMatch(source, /hinocebu\.(com|ph)/i);
});
```

**Patterns:**
- Define shared expected path lists once at module scope, then iterate inside a test. `routes` in `tests/foundation.test.mjs` is the canonical example.
- Use synchronous filesystem APIs for small repository-contract checks; `existsSync` and `readFileSync` keep these tests deterministic and dependency-free in `tests/foundation.test.mjs`.
- Add an assertion message when iterating across expected files so failures identify the missing item, as in ``assert.ok(existsSync(route), `${route} should exist`)`` in `tests/foundation.test.mjs`.
- Use regular-expression assertions for source-level invariants. `tests/foundation.test.mjs` verifies environment-driven origins, empty unverified collections, and upload-disabled copy with `assert.match`/`assert.doesNotMatch`.
- Keep each test focused on one repository or product invariant. Related files may be checked together when they implement the same rule, as promotions and deliveries are in `tests/foundation.test.mjs`.
- No `describe`, `before`, `after`, `beforeEach`, or `afterEach` hooks are used. The suite is flat and every test owns its setup.

## Mocking

**Framework:** Not detected. No mocking package is declared in `package.json`, and `tests/foundation.test.mjs` does not use `node:test` mocks.

**Patterns:**
```javascript
// Current tests avoid mocks by inspecting deterministic repository files.
const source = readFileSync("src/lib/site-url.ts", "utf8");
assert.match(source, /NEXT_PUBLIC_SITE_URL/);
```

**What to Mock:**
- For future unit tests, isolate external boundaries represented by `fetch` in `src/lib/leads/router.ts`, browser globals in `src/lib/analytics.ts`, and `sessionStorage` in `src/lib/attribution.ts`.
- Mock time when testing promotion date boundaries in `src/content/promotions.ts`, or pass an explicit `Date` to `activePromotions(now)` to avoid a global clock mock.
- Mock Next.js navigation hooks only for component tests that directly exercise `usePathname` or `useSearchParams` in `src/components/forms/LeadForm.tsx` and `src/components/marketing/AttributionCapture.tsx`.

**What NOT to Mock:**
- Do not mock filesystem access in repository-foundation tests; their purpose is to verify real paths and checked-in content in `tests/foundation.test.mjs`.
- Do not mock pure domain functions such as `activePromotions` in `src/content/promotions.ts`, `recommend` in `src/components/trucks/TruckFinder.tsx`, `absoluteUrl` in `src/lib/site-url.ts`, or `breadcrumbSchema` in `src/lib/seo.ts`; call them with explicit inputs.
- Do not mock static content collections when testing their publication rules; use the actual module or extracted pure logic from `src/content/`.

## Fixtures and Factories

**Test Data:**
```javascript
const routes = [
  "src/app/page.tsx",
  "src/app/trucks/page.tsx",
  "src/app/trucks/[slug]/page.tsx",
  // Additional required routes are listed in the real suite.
];

for (const route of routes) {
  assert.ok(existsSync(route), `${route} should exist`);
}
```

**Location:**
- Fixtures/factories are not separated into helper files. The path list and official asset names are inline in `tests/foundation.test.mjs`.
- Keep small, suite-specific fixture arrays beside their tests. Introduce `tests/fixtures/` only when data is reused or too large to keep the invariant readable.
- No snapshot files, fixture directories, seed data, or factory libraries are present.

## Coverage

**Requirements:** None enforced. `package.json` has no coverage script, provider configuration, minimum percentage, or CI coverage gate.

**View Coverage:**
```bash
# Not configured. There is no repository-supported coverage command.
```

- The current suite covers repository shape and selected source-text safeguards only; it does not measure executable line, branch, or function coverage.
- `npm run check` in `package.json` is the effective quality gate, but successful lint, typecheck, tests, and build are not substitutes for behavioral coverage.

## Test Types

**Unit Tests:**
- Not currently implemented as runtime unit tests. Exported pure functions with clear unit-test seams include `recommend` in `src/components/trucks/TruckFinder.tsx`, `activePromotions` in `src/content/promotions.ts`, `absoluteUrl`/`getSiteOrigin` in `src/lib/site-url.ts`, and `breadcrumbSchema` in `src/lib/seo.ts`.
- Current source-text assertions in `tests/foundation.test.mjs` should be treated as contract/smoke checks, not unit tests of TypeScript behavior.

**Integration Tests:**
- Limited to repository-level integration contracts in `tests/foundation.test.mjs`: required routes/assets exist and safety-critical source conventions remain present.
- There are no tests executing the lead server action in `src/app/actions/leads.ts`, the webhook adapter in `src/lib/leads/router.ts`, or rendered App Router pages under `src/app/`.
- There is no DOM test environment or React testing dependency in `package.json`.

**E2E Tests:**
- Not used. Playwright, Cypress, WebdriverIO, and browser test configuration are not detected.
- User flows through `src/components/forms/LeadForm.tsx`, `src/components/trucks/TruckFinder.tsx`, mobile navigation in `src/components/layout/Header.tsx`, and dynamic routes are not automated in a browser.

## Common Patterns

**Async Testing:**
```javascript
// No async tests currently exist in tests/foundation.test.mjs.
// Use the native runner's promise-aware form for future async boundaries:
test("descriptive behavior", async () => {
  const result = await operation();
  assert.equal(result.status, "success");
});
```

- Return or await the promise from asynchronous operations; the Node test runner waits for the async test function.
- Use explicit inputs and restore any modified globals or environment variables within the same test because there is no shared teardown convention yet.
- For `src/lib/leads/router.ts`, cover the no-endpoint development fallback, successful webhook response, and non-OK webhook rejection without sending real network requests.

**Error Testing:**
```javascript
test("site origin is environment driven", () => {
  const source = readFileSync("src/lib/site-url.ts", "utf8");
  assert.match(source, /NEXT_PUBLIC_SITE_URL/);
  assert.doesNotMatch(source, /hinocebu\.(com|ph)/i);
});
```

- Current negative assertions use `assert.doesNotMatch` to prevent a forbidden hardcoded production domain in `tests/foundation.test.mjs`.
- For future thrown-error tests, use `assert.throws` or `assert.rejects` from `node:assert/strict`, especially for the rejected webhook path in `src/lib/leads/router.ts`.
- For expected application failures, assert returned state rather than thrown exceptions. `submitLead` in `src/app/actions/leads.ts` represents validation and transport errors as `LeadFormState` with `status: "error"`.

---

*Testing analysis: 2026-08-18*
