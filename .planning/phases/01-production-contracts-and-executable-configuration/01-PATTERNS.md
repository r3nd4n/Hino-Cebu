# Phase 1: Production Contracts and Executable Configuration - Pattern Map

**Mapped:** 2026-08-18
**Files analyzed:** 27 proposed new/modified files or file groups
**Analogs found:** 24 / 27

## Scope Notes

- Preserve the current Next.js App Router, server-first rendering, repository-backed content, Zod, plain CSS, native Node tests, and vendor-neutral `LeadRouter` seam.
- Phase 1 records and enforces governance/configuration contracts. It does not select or implement a durable lead provider, create a database/CMS, add application authentication, or replace the existing architecture.
- Approval-dependent values must remain explicitly pending. Never promote research proposals, current MVP copy, generated UUIDs, or environment-variable presence into evidence of approval.
- Public pages and protected previews use the same fail-closed eligible-content selectors. Diagnostics appear only in the redacted review report.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/content/governance/decisions.ts` | model/content | CRUD-like repository records | `src/content/promotions.ts` | role-match |
| `src/content/governance/claims.ts` | model/content | transform | `src/content/promotions.ts` | role + temporal-flow match |
| `src/content/governance/privacy.ts` | model/content | CRUD-like repository records | `src/content/site.ts` | role-match |
| `src/content/governance/leads.ts` | model/config | request-response contract | `src/lib/leads/types.ts` | data-flow match |
| `src/content/governance/release.ts` | model/config | event-driven operational records | `src/content/promotions.ts` | partial |
| `src/lib/governance/schemas.ts` | utility/validation | transform | `src/app/actions/leads.ts` | exact technique |
| `src/lib/governance/eligibility.ts` | utility | transform | `src/content/promotions.ts` | exact flow |
| `src/lib/governance/report.ts` | service/utility | transform | `src/app/actions/leads.ts` | data-flow match |
| `src/lib/runtime-config.ts` | config/utility | transform | `src/app/actions/leads.ts`, `src/lib/site-url.ts` | composite match |
| `src/content/site.ts` | model/content | transform | existing module (modify in place) | exact |
| `src/lib/site-url.ts` | utility/config | request-response | existing module (modify in place) | exact |
| `next.config.ts` | config | build-time | existing module (modify in place) | exact |
| `src/app/review/approvals/page.tsx` | route/component | request-response | `src/app/lp/[slug]/page.tsx` | role-match |
| `src/app/globals.css` | config/style | transform | existing stylesheet (scoped extension) | exact |
| `src/app/robots.ts` | route/config | request-response | existing module (modify in place) | exact |
| `src/app/sitemap.ts` | route/config | batch/transform | existing module (modify in place) | exact |
| `src/lib/seo.ts` | utility | transform | existing module (modify in place) | exact |
| `src/app/layout.tsx` | provider/layout | request-response | existing module (modify in place) | exact |
| `src/components/layout/{Header,Footer,StickyMobileActions}.tsx` | component | transform | existing modules (modify in place) | exact |
| `src/app/{page,trucks/page,trucks/[slug]/page,lp/[slug]/page,contact/page,hino-cebu/page}.tsx` | route/component | request-response | `src/app/lp/[slug]/page.tsx` | role-match |
| `src/app/actions/leads.ts` | server action/controller | request-response | existing module (modify only for Phase 1 gates) | exact |
| `tests/governance.test.mjs` | test | batch | `tests/foundation.test.mjs` | framework-match |
| `tests/configuration.test.mjs` | test | batch | `tests/foundation.test.mjs` | framework-match |
| `tests/fixtures/governance/*` | test fixture | file-I/O | none | no analog |
| `docs/operations/production-decisions.md` | documentation | batch | none under `docs/` | no analog |
| `docs/operations/release-runbook.md` | documentation | event-driven | none under `docs/` | no analog |
| `docs/operations/records/README.md` | documentation/template | event-driven | none under `docs/` | no analog |

## Pattern Assignments

### Governance repository records

**Applies to:** `src/content/governance/{decisions,claims,privacy,leads,release}.ts`

**Analog:** `src/content/promotions.ts`

**Typed data plus focused selector pattern** (lines 1-14):

```typescript
export type Promotion = {
  slug: string; title: string; summary: string; startDate?: string; endDate?: string;
  applicableModels?: string[]; terms?: string[]; ctaLabel: string; ctaHref: string; isPublished: boolean;
};

export const promotions: Promotion[] = [];

export function activePromotions(now = new Date()) {
  return promotions.filter((promotion) => {
    if (!promotion.isPublished) return false;
    if (promotion.startDate && new Date(promotion.startDate) > now) return false;
    if (promotion.endDate && new Date(promotion.endDate) < now) return false;
    return true;
  });
}
```

Copy the ownership pattern, not the weak boolean contract: named exports, exact domain types, repository arrays/objects, early-return selectors, and an injected evaluation time. Upgrade governance records to Zod-parsed approval envelopes with stable IDs/revisions, fixed owner/approver lanes, ISO dates, evidence references, invalidation/supersession, and independently publishable field groups.

Keep raw collections private to governance validators/report builders when possible. Public consumers should import selectors, never raw approval records. Sensitive evidence, names, signatures, credentials, endpoints, and document bodies stay outside Git.

**Branch record integration:** preserve `src/content/site.ts` as the canonical business-content owner, but replace unconditional public exports with an eligible branch selector. The current single-record shape is visible at `src/content/site.ts:1-28`; downstream direct imports are migration sites, not patterns to perpetuate.

### Runtime schemas and deterministic selectors

**Applies to:** `src/lib/governance/schemas.ts`, `src/lib/governance/eligibility.ts`, `src/lib/governance/report.ts`, `src/lib/runtime-config.ts`

**Analog:** `src/app/actions/leads.ts`

**Imports and runtime validation pattern** (lines 1-7, 20-34):

```typescript
"use server";

import { z } from "zod";
import { attributionKeys } from "@/lib/attribution";
import { leadFields } from "@/lib/leads/fields";

const shape: Record<string, z.ZodType> = {};
// Build the canonical runtime shape once.
const result = z.object(shape).safeParse(values);
if (!result.success) {
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message;
  return { status: "error", message: "Please review the highlighted fields.", errors };
}
```

Use Zod for runtime truth, not TypeScript alone. Export schemas and inferred types from their concrete owner; use closed enums/unions for approval lane, status, environment, profile class, crawl policy, lead type, and route eligibility. Cross-record and target-specific rules belong in pure functions/refinements.

**Safe failure translation** (`src/app/actions/leads.ts:37-49`):

```typescript
let attribution: Record<string, string> = {};
try {
  const parsed = JSON.parse(values.attribution || "{}");
  attribution = Object.fromEntries(/* allow-listed keys only */);
} catch { attribution = {}; }

try {
  await leadRouter.submit(/* normalized value */);
  return { status: "success", message: "..." };
} catch {
  return { status: "error", message: "We could not send your request right now. Please call Hino Cebu instead." };
}
```

For the report, construct a new allow-listed DTO field by field; never spread or serialize raw governance/config/environment objects. For build configuration, throw stable error codes/variable names without interpolating values. For temporal selectors, accept `now: Date`; a review boundary equal to `now` is due and ineligible.

### Target-aware configuration and origin

**Applies to:** `src/lib/runtime-config.ts`, `src/lib/site-url.ts`, `next.config.ts`, and only the Phase 1 safety gate in `src/app/actions/leads.ts`

**Existing origin boundary to retain and harden:** `src/lib/site-url.ts:1-15`

```typescript
const LOCAL_ORIGIN = "http://localhost:3000";

export function getSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return LOCAL_ORIGIN;
  try {
    return new URL(configured).origin;
  } catch {
    return LOCAL_ORIGIN;
  }
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteOrigin()}/`).toString();
}
```

Preserve the centralized `getSiteOrigin`/`absoluteUrl` API so metadata consumers do not parse environment values independently. Change semantics by target: development may use the local origin; preview requires an isolated HTTPS preview origin and blocked crawling; production requires the exact approved HTTPS origin or throws before build. Reject credentials, paths, query strings, hashes, localhost, and mismatches with the approved estate record.

`parseRuntimeConfig(rawEnv, approvedDecisions)` must be exported as a pure function for matrix tests. A separately exported parsed application value may call it with selected environment keys. Do not pass raw `process.env` into rendering/report data.

**Build invocation point:** retain the existing typed `NextConfig` export in `next.config.ts:1-21` and invoke the validation boundary before exporting the config. Preserve the existing security headers. Do not add packages or replace the current scripts.

**Lead boundary:** keep `LeadRouter` vendor-neutral (`src/lib/leads/types.ts:3-13`) and keep provider implementation details in `src/lib/leads/router.ts`. Phase 1 may prevent unsafe production deployment/use, but must not implement a provider, custom queue, database, or optimistic acceptance. The current random-reference fallback at `src/lib/leads/router.ts:3-7` is development-only behavior and is never evidence of durable receipt.

### Protected review route

**Applies to:** `src/app/review/approvals/page.tsx`

**Analog:** `src/app/lp/[slug]/page.tsx`

**Server route, metadata, and fail-closed lookup pattern** (lines 1-9):

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { campaigns } from "@/content/campaigns";
import { Container } from "@/components/ui/Shared";

export async function generateMetadata(/* ... */): Promise<Metadata> {
  const campaign = /* server-side lookup */;
  if (!campaign) return {};
  return createMetadata(/* ... */);
}

export default async function CampaignPage(/* ... */) {
  const campaign = /* server-side lookup */;
  if (!campaign) notFound();
  return <section><Container>{/* server-rendered content */}</Container></section>;
}
```

The new route stays a Server Component: no `"use client"`, hooks, filters, tabs, sorting, refresh, clipboard controls, or mutation controls. Export static metadata with `robots: { index: false, follow: false, noarchive: true }`; call `notFound()` before building the report when `deploymentEnv === "production"`; render only `getReviewReport()`'s redacted DTO.

Use one `<main id="main-content">`, semantic sections, lists, tables with visible captions and scoped headers, and mobile `<dl>` equivalents. The fixed content order, status vocabulary, copy, sorting, and disclosure limits come from `01-UI-SPEC.md` and are protected contracts.

**Important no-analog issue:** the current root layout always renders `Header`, `Footer`, `StickyMobileActions`, marketing tags, attribution capture, and organization JSON-LD (`src/app/layout.tsx:26`). A child page cannot remove its parent shell. The planner must choose the smallest App Router layout arrangement that gives the report a shell-free document while preserving public routes; there is no current codebase analog. Do not solve this with client pathname checks or by merely hiding sensitive shell content in CSS.

### Report styling

**Applies to:** scoped additions in `src/app/globals.css`

**Analog:** the existing global token and responsive system.

**Tokens/accessibility base** (`src/app/globals.css:1-23`):

```css
:root {
  --brand: #d71920; --ink: #17191b; --paper: #fff;
  --surface: #f3f4f4; --muted: #62676b; --border: #d9dcde;
  --success: #117a46; --warning: #a45e00; --max: 1180px;
}
.container { width: min(calc(100% - 2rem), var(--max)); margin-inline: auto; }
:focus-visible { outline: 3px solid #1378d0; outline-offset: 3px; }
```

**Responsive/reduced-motion pattern** (`src/app/globals.css:126-141`): use existing breakpoints `1060px` and `720px`, collapse grids to one column on small screens, avoid horizontal page scrolling, and retain the existing `prefers-reduced-motion` rule.

Add only scoped classes such as `.approval-report`, `.review-summary`, and `.status-label`; do not change shared public class semantics. Follow the UI contract's four sizes, two weights, status text, 44px targets, six/three/one summary columns, and table-to-definition-card reflow.

### Public surface coherence

**Applies to:** `src/content/site.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo.ts`, `src/app/layout.tsx`, layout navigation components, and governed public pages/content collections.

**Current batch registry to replace with eligible routes:** `src/app/sitemap.ts:1-5`

```typescript
import type { MetadataRoute } from "next";
import { campaigns } from "@/content/campaigns";
import { trucks } from "@/content/trucks";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [/* static, truck, and campaign routes */];
  return routes.map((route) => ({ url: absoluteUrl(route || "/"), /* ... */ }));
}
```

Keep the typed `MetadataRoute` return and pure map, but source paths from `getEligibleRoutes(now)` rather than independent raw arrays. Apply the same selectors to navigation, cards/internal links, route lookup, metadata/JSON-LD, and sitemap in the same plan so a withheld record cannot leak through a secondary surface.

**Current crawl boundary:** `src/app/robots.ts:1-3` already centralizes robots output. Replace the `Boolean(NEXT_PUBLIC_SITE_URL)` test with parsed target/crawl approval. Development and preview always disallow; production allows only when the explicit production crawl decision is approved. Keep sitemap/host generation behind the shared origin boundary.

**Structured-data safety:** continue using `JsonLd`'s `<` escaping from `src/components/ui/Shared.tsx:26`, but provide it only eligible, public-safe data. Never render governance/report DTOs as JSON-LD.

**Lead action:** retain server-side Zod validation and typed UI-safe states. If Phase 1 adds a target/readiness guard, it must fail closed before `leadRouter.submit` and preserve the verified phone/contact alternative. Do not claim “request received” based on honeypot handling, a successful network call, or a generated UUID; durable-success behavior itself belongs to Phase 2.

### Native Node tests

**Applies to:** `tests/governance.test.mjs`, `tests/configuration.test.mjs`

**Analog:** `tests/foundation.test.mjs`

**Imports and test organization** (lines 1-16):

```javascript
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("required route foundation exists", () => {
  for (const route of routes) assert.ok(existsSync(route), `${route} should exist`);
});
```

**Source-contract assertion pattern** (lines 18-26):

```javascript
test("site origin is environment driven", () => {
  const source = readFileSync("src/lib/site-url.ts", "utf8");
  assert.match(source, /NEXT_PUBLIC_SITE_URL/);
  assert.doesNotMatch(source, /hinocebu\.(com|ph)/i);
});
```

Reuse `node:test` and `node:assert/strict`; add no test package or config. Prefer direct tests of exported pure parsers/selectors for approval and environment matrices. Use source/file assertions only for integration contracts that cannot be imported cleanly, including production `notFound`, report redaction, discovery exclusions, and build invocation.

Fixtures must be synthetic and non-sensitive. Cover pending; current approved; missing evidence; exactly-due; expired; invalidated; wrong lane; wrong locality; superseded; malformed reference; every deployment target/origin/crawl/profile combination; mismatched `VERCEL_ENV`; and errors that expose codes/names but never values.

## Shared Patterns

### Import and module ownership

- Use direct `@/content/...`, `@/lib/...`, and `@/components/...` imports across directories; use relative imports only inside tightly coupled folders.
- Use named exports for schemas, records, selectors, DTO builders, and configuration helpers. Use default exports only for Next.js route/config conventions.
- Do not create barrel `index.ts` modules.

### Approval and publication

- Eligibility is: approved status + correct lane/scope + evidence present + current review/expiry + not invalidated/superseded + local applicability.
- Inject `now` into temporal selectors. Treat equality with the review boundary as due/ineligible.
- Use one canonical record with field-group approvals for branch facts; use atomic IDs for independently publishable claims.
- Preserve an honest contact/request task when approved minimum truth exists; otherwise withhold the route and all discovery links.

### Security and error handling

- Validate URL schemes/hosts; never server-fetch arbitrary evidence URLs.
- Store opaque evidence references, not signed URLs, bodies, credentials, names, or sensitive locations.
- Return/throw stable value-free errors. Never serialize `process.env` or log leads/contact data.
- Vercel Deployment Protection is the preview authentication boundary. `noindex` and a production 404 are defense in depth, not authentication.

### Release and lead boundaries

- Keep proposal values separate from approved policy for review cadences, response windows, escalation thresholds, and rollback triggers.
- Keep provider choice out of components and server actions. Phase 1 records the provider-neutral durable acceptance scorecard; Phase 2 implements the selected adapter.
- Manual promotion, emergency change, rollback, closeout, and configuration reconciliation remain explicit operator steps with external evidence references.

## No Analog Found

| File/Concern | Role | Data Flow | Planner Guidance |
|---|---|---|---|
| `tests/fixtures/governance/*` | fixture | file-I/O | Create minimal synthetic exports/data shaped for tests; include no real business facts, people, secrets, or external evidence. |
| `docs/operations/{production-decisions,release-runbook}.md`, `docs/operations/records/README.md` | documentation | batch/event-driven | No `docs/` convention exists. Keep typed records authoritative; docs explain roles, sequence, checkpoints, and external-reference handling without duplicating decision values. |
| Shell-free protected review route | layout/provider | request-response | Root layout currently always emits the public shell. Choose an App Router layout boundary during planning; do not add app authentication or client-side pathname hiding. |

## Metadata

**Analog search scope:** `src/content`, `src/lib`, `src/app`, `src/components`, `tests`, root configuration
**Primary analogs:** `src/content/promotions.ts`, `src/app/actions/leads.ts`, `src/lib/site-url.ts`, `src/app/lp/[slug]/page.tsx`, `tests/foundation.test.mjs`
**Modified-file patterns additionally inspected:** `src/content/site.ts`, `src/app/{robots,sitemap}.ts`, `src/components/ui/Shared.tsx`, `src/app/globals.css`, `next.config.ts`, `src/lib/leads/{types,router}.ts`
**Pattern extraction date:** 2026-08-18
