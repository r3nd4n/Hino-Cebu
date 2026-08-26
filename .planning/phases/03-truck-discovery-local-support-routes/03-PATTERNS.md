# Phase 3: Truck Discovery & Local Support Routes - Pattern Map

**Mapped:** 2026-08-26  
**Files analyzed:** 20 proposed new/modified files  
**Analogs found:** 20 / 20

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/app/trucks/page.tsx` | route | request-response (static render) | `src/app/page.tsx` | exact |
| `src/app/trucks/[slug]/page.tsx` | route | request-response (finite static params) | `src/app/page.tsx` + `src/content/trucks.ts` | role-match |
| `src/app/parts-service/page.tsx` | route | request-response (static render) | `src/app/page.tsx` | exact |
| `src/app/contact/page.tsx` | route | request-response (query normalization + render) | `src/app/page.tsx` | role-match |
| `src/app/about/page.tsx` | route | request-response (static render) | `src/app/page.tsx` | exact |
| `src/components/trucks/TruckCard.tsx` | component | transform (typed content to linked card) | `src/components/homepage/TruckRangeSection.tsx` | exact |
| `src/components/trucks/TruckSeriesPage.tsx` | component | transform (typed content to page sections) | `src/components/homepage/TruckRangeSection.tsx` | role-match |
| `src/components/contact/InquiryForm.tsx` | component | event-driven | `src/components/homepage/HomepageQuoteExperience.tsx` | exact |
| `src/components/shared/PageHero.tsx` | component | transform | `src/components/homepage/HomepageSupportSections.tsx` | role-match |
| `src/components/shared/LocalContactCta.tsx` | component | transform | `src/components/homepage/FinalQuoteCta.tsx` | exact |
| `src/components/layout/MobileActionBar.tsx` | component | event-driven / route-aware navigation | existing file itself | exact |
| `src/content/trucks.ts` | config/model | transform (maintainer data to public projection) | existing file itself | exact |
| `src/content/services.ts` | config/model | transform | existing file itself | exact |
| `src/content/about.ts` | config/model | transform (provenance-backed content) | `src/content/trucks.ts` + `src/content/assets.ts` | role-match |
| `src/content/inquiry.ts` | config/utility | transform (allowlist normalization + URL building) | `src/content/trucks.ts` | role-match |
| `src/lib/inquiry-demo.ts` | utility | transform (local validation) | `src/lib/quote-demo.ts` | exact |
| `src/app/globals.css` | config/style | transform (responsive presentation) | existing file itself | exact |
| `tests/discovery-routes.test.mjs` | test | file-I/O / batch assertions | `tests/homepage.test.mjs` | exact |
| `tests/support-routes.test.mjs` | test | file-I/O / batch assertions | `tests/homepage.test.mjs` | exact |
| `tests/inquiry-demo.test.mjs` | test | request-response subprocess / transform assertions | `tests/quote-demo.test.mjs` | exact |

The proposed file list comes from the `03-RESEARCH.md` recommended structure plus the UI contract's required route-aware mobile action and route-level CSS. `src/content/site.ts` and `src/content/assets.ts` are authoritative dependencies, not expected edit targets unless the implementation discovers a missing public projection; their verified/unresolved values must be consumed as-is.

## Pattern Assignments

### Route files: `src/app/trucks/page.tsx`, `src/app/parts-service/page.tsx`, `src/app/about/page.tsx`

**Analog:** `src/app/page.tsx`

**Composition pattern** (lines 3-15):

```tsx
import { FinalQuoteCta } from "@/components/homepage/FinalQuoteCta";
import { HomepageQuoteExperience } from "@/components/homepage/HomepageQuoteExperience";
import { HomepageSupportSections } from "@/components/homepage/HomepageSupportSections";
import { TruckRangeSection } from "@/components/homepage/TruckRangeSection";

export default function HomePage() {
  return (
    <main className="homepage" id="main-content" tabIndex={-1}>
      <HomepageQuoteExperience />
      <TruckRangeSection />
      <HomepageSupportSections />
      <FinalQuoteCta />
    </main>
  );
}
```

Copy the alias import convention and route-as-composition style. New static routes should remain Server Components (omit the homepage's accidental route-level `"use client"`) and preserve one `main#main-content` with ordered semantic sections. Each route composes `PageHero`, its route-specific content, and `LocalContactCta` rather than embedding facts.

### `src/app/trucks/[slug]/page.tsx` (route, finite static request-response)

**Analogs:** `src/app/page.tsx` for composition; `src/content/trucks.ts` for the slug registry.

**Slug registry pattern** (`src/content/trucks.ts`, lines 1-13):

```ts
export type TruckSeriesSlug = "200-series" | "300-series" | "500-series" | "bus-puv";

export interface TruckRange {
  slug: TruckSeriesSlug;
  name: string;
  category: string;
  description: string;
  href: string;
  availability: "requires-verification";
  sourceUrl?: string;
}

export const truckRanges: readonly TruckRange[] = [
```

Generate parameters from `truckRanges`, set `dynamicParams = false`, await the Next.js 16 `params`, guard the lookup with `notFound()`, and pass a public series projection to `TruckSeriesPage`. Do not pass provenance fields to the renderer.

### `src/app/contact/page.tsx` (route, query normalization + render)

**Analog:** `src/app/page.tsx` for route composition; `src/content/site.ts` for authoritative branch facts.

**Verified/unresolved contract** (`src/content/site.ts`, lines 1-7 and 18-33):

```ts
export type VerificationStatus = "approved" | "unresolved" | "requires-verification";

export interface ConfiguredValue<T> {
  value: T;
  status: VerificationStatus;
  launchNote?: string;
}

contact: {
  address: "8WC6+Q46, Saint John Paul II Avenue, Brgy, Cebu City, Philippines",
  phone: {
    display: "(032) 346 3322",
    href: "tel:+63323463322",
  },
  email: {
    value: null,
    status: "unresolved",
    launchNote: "Add only a confirmed branch email address.",
  } satisfies ConfiguredValue<string | null>,
```

Await `searchParams`, take only `topic`, normalize it through `src/content/inquiry.ts`, and pass the normalized topic into `InquiryForm`. Render `siteConfig` phone/address/hours directly; render missing email/directions as plain status text, never guessed or disabled links. Reuse the address-derived map approach shown below, while keeping it distinct from a verified directions URL.

### `src/components/trucks/TruckCard.tsx` (component, transform)

**Analog:** `src/components/homepage/TruckRangeSection.tsx`

**Imports and single-link card pattern** (lines 1-7 and 33-55):

```tsx
import Image from "next/image";
import Link from "next/link";

import { officialAssets } from "@/content/assets";
import { truckRanges, type TruckSeriesSlug } from "@/content/trucks";

{truckRanges.map((truck) => {
  const asset = rangeAssets[truck.slug];
  return (
    <Link aria-label={`Explore ${truck.name}`} className="truck-card" href={truck.href} key={truck.slug}>
      <div className="truck-card__media">
        <Image
          alt={asset.alt}
          height={asset.height}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={asset.src}
          width={asset.width}
        />
      </div>
      <div className="truck-card__body">...</div>
    </Link>
  );
})}
```

Extract this into one card receiving public fields and its already-selected asset. Keep the entire card as one `Link`; never nest another button/link. Extend the body with broad application cues and an `Explore the range` cue. Preserve `object-fit: contain`, intrinsic dimensions, and responsive `sizes`.

### `src/components/trucks/TruckSeriesPage.tsx` (component, transform)

**Analog:** `src/components/homepage/TruckRangeSection.tsx`

**Configured rendering and responsive-card pattern** (lines 60-78):

```tsx
<style jsx>{`
  .truck-range__grid { display: grid; gap: var(--space-md); grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .truck-card { background: var(--color-paper); border: 1px solid var(--color-border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); color: inherit; display: flex; flex-direction: column; min-width: 0; overflow: hidden; text-decoration: none; transition: box-shadow 180ms ease, transform 180ms ease; }
  .truck-card__media { align-items: center; aspect-ratio: 4 / 5; background: #f7f7f5; display: flex; justify-content: center; overflow: hidden; }
  .truck-card__media :global(img) { height: 100%; object-fit: contain; width: 100%; }
  @media (max-width: 1023px) { .truck-range__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 639px) { .truck-range__grid { grid-template-columns: 1fr; } }
  @media (prefers-reduced-motion: reduce) { .truck-card { transition: none; } .truck-card:hover { transform: none; } }
`}</style>
```

Use one component for all four slugs. Branch on whether configured highlights exist: 300/500 render exactly three highlights; 200/Bus render the honest lightweight panel. Applications always precede highlights. Repeat availability guidance immediately before `LocalContactCta`. The component must accept a public view model without `sourceUrl`, publisher, review date, or replacement metadata.

### `src/components/shared/PageHero.tsx` (component, transform)

**Analogs:** `src/components/homepage/HomepageSupportSections.tsx` and `TruckRangeSection.tsx`.

**Semantic section and content-import pattern** (`HomepageSupportSections.tsx`, lines 14-30):

```tsx
export function HomepageSupportSections() {
  const { service, valuePoints, visit } = homepageContent;

  return (
    <>
      <section aria-labelledby="why-hino-heading" className="why-hino">
        <div className="container">
          <p className="eyebrow">Why Hino Cebu</p>
          <h2 id="why-hino-heading">A practical local partner</h2>
          <div className="why-hino__rule" />
          <ul className="why-hino__points">...</ul>
        </div>
      </section>
```

Expose typed text/action/media props; keep one route H1 and an `aria-labelledby` relationship. Text-only support heroes and split product heroes should be variants of the same component. For product media, use `next/image`, a reserved aspect-ratio box, `contain`, and approved alt text.

### `src/components/shared/LocalContactCta.tsx` (component, transform)

**Analog:** `src/components/homepage/FinalQuoteCta.tsx`

**Dark conversion panel pattern** (lines 6-23):

```tsx
export function FinalQuoteCta() {
  return (
    <section aria-labelledby="final-quote-heading" className="final-quote">
      <div className="container final-quote__panel">
        <div>
          <p className="eyebrow">Hino Cebu</p>
          <h2 id="final-quote-heading">{homepageContent.finalCta.title}</h2>
        </div>
        <a className="button button--primary" href="#request-a-quote">...</a>
      </div>
    </section>
  );
}
```

Replace the local anchor with an allowlisted `/contact?topic=<key>#inquiry` link built by `src/content/inquiry.ts`; add the verified `siteConfig.contact.phone.href` as the secondary action. Keep the near-black panel and mobile stacked actions.

### `src/components/contact/InquiryForm.tsx` (component, event-driven)

**Analog:** `src/components/homepage/HomepageQuoteExperience.tsx`

**Client boundary and state-machine pattern** (lines 1-8 and 29-40):

```tsx
"use client";

import { type FormEvent, useState } from "react";
import { type QuoteDraft, type QuoteField, validateQuoteDraft } from "@/lib/quote-demo";

export function HomepageQuoteExperience() {
  const [draft, setDraft] = useState<QuoteDraft>(initialDraft);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<QuoteStatus>("idle");

  function updateDraft<K extends QuoteField>(field: K, value: QuoteDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
  }
```

**Validation/loading/local-confirmation pattern** (lines 52-71):

```tsx
function submitQuote(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (status === "loading") return;

  const validation = validateQuoteDraft(draft);
  if (!validation.ok) {
    setErrors(validation.errors);
    setStatus("idle");
    return;
  }

  setErrors({});
  setStatus("loading");
  try {
    // Phase 2 intentionally performs no lead delivery. Phase 4 replaces this local state with the secure endpoint.
    window.setTimeout(() => setStatus("success"), 300);
  } catch {
    setStatus("failure");
  }
}
```

**Accessible field pattern** (lines 206-223):

```tsx
const errorId = `${id}-error`;
return <div className="quote-field"><label htmlFor={id}>{label}</label><input aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} autoComplete={autoComplete} id={id} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} type={type} value={value} />{error && <p className="field-error" id={errorId}>{error}</p>}</div>;
```

Initialize `inquiryTopic` from the normalized server prop, keep `originTopic` separately immutable for the Phase 4 handoff, and make the visible topic select editable. Follow the UI-SPEC field order. Add textarea and checkbox helpers using the same persistent-label, `aria-invalid`, and `aria-describedby` contract. Keep the truthful local-only success wording and safe failure text; do not claim the inquiry was sent or received.

### `src/components/layout/MobileActionBar.tsx` (component, event-driven/navigation)

**Analog:** existing file itself.

**Current observation and action pattern** (lines 14-35):

```tsx
useEffect(() => {
  const hero = document.getElementById("homepage-hero");
  if (!hero || !("IntersectionObserver" in window)) {
    const fallbackVisibilityTimer = window.setTimeout(() => setIsVisible(true), 0);
    return () => window.clearTimeout(fallbackVisibilityTimer);
  }
  const observer = new IntersectionObserver(([entry]) => setIsVisible(!entry.isIntersecting));
  observer.observe(hero);
  return () => observer.disconnect();
}, []);

return (
  <nav aria-label="Quick actions" className="mobile-action-bar">
    <a href={siteConfig.contact.phone.href}>...</a>
    <Link href="/#request-a-quote">Request a Quote</Link>
  </nav>
);
```

Use `usePathname()` to preserve homepage behavior while routing every non-homepage inquiry action to `/contact#inquiry`. Do not infer a topic from arbitrary path text. Preserve the call action, observer cleanup, fallback timer cleanup, and accessible nav label.

### `src/content/trucks.ts` (config/model, transform)

**Analog:** existing file itself.

**Typed immutable content pattern** (lines 3-13 and 48-59):

```ts
export interface TruckRange {
  slug: TruckSeriesSlug;
  name: string;
  category: string;
  description: string;
  href: string;
  availability: "requires-verification";
  sourceUrl?: string;
}

export const truckRanges: readonly TruckRange[] = [ ... ] as const;
export const businessUses = [ ... ] as const;
```

Extend this module with applications, public highlights, asset key, and structured maintainer-only provenance (`publisher`, `url`, `reviewedOn`, `supports`). Keep every range `requires-verification`. Provide a helper/public projection so source metadata never crosses into component props or rendered markup. The 200/Bus records should intentionally have no invented highlights.

### `src/content/services.ts` (config/model, transform)

**Analog:** existing file itself.

**Offering contract pattern** (lines 1-7):

```ts
export interface ServiceOffering {
  name: string;
  description: string;
  href: string;
}

export const serviceOfferings: readonly ServiceOffering[] = [
```

Extend records with presentation role (`primary`/`supporting`), approved bullets, inquiry topic, and CTA label as needed. Preserve the current four configured offerings and keep all support language non-guaranteeing. CTAs should converge on Contact rather than inventing local submission points.

### `src/content/about.ts` (config/model, provenance-backed transform)

**Analogs:** `src/content/trucks.ts` for typed public content and `src/content/assets.ts` for explicit provenance.

**Provenance convention** (`src/content/assets.ts`, lines 8-19):

```ts
export interface OfficialAsset {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  sourceUrl: string;
  sourceSite: "Hino Philippines";
  authorizedUse: true;
  assetRole: OfficialAssetRole;
  replaceWithCebuPhoto: true;
  replacementNote: string;
}
```

Use the same adjacency of public content and maintainer metadata, but define content-source fields appropriate to copy. Project only approved national background and local commitment into rendering. Never expose the official URL or transfer national facts into Cebu dealer history/authorization claims.

### `src/content/inquiry.ts` (config/utility, transform)

**Analog:** `src/content/trucks.ts` slug union plus readonly registry.

Define an `InquiryTopic` union for `general`, `200-series`, `300-series`, `500-series`, `bus-puv`, `parts`, and `service`, a readonly label registry, a type guard/normalizer with `general` fallback, and one URL builder. Stable keys and visitor labels must be separate. This module is the only source of contextual inquiry URLs and must never reflect arbitrary query text.

### `src/lib/inquiry-demo.ts` (utility, transform)

**Analog:** `src/lib/quote-demo.ts`

**Pure discriminated validation pattern** (lines 1-16 and 24-40):

```ts
export interface QuoteDraft { ... }
export type QuoteField = keyof QuoteDraft;
export type QuoteValidationResult =
  | { ok: false; errors: Partial<Record<QuoteField, string>> }
  | { ok: true; message: string };

export function validateQuoteDraft(draft: Partial<QuoteDraft>): QuoteValidationResult {
  const errors: Partial<Record<QuoteField, string>> = {};
  if (!draft.name?.trim()) errors.name = "Enter your name.";
  if (!draft.mobile?.trim()) errors.mobile = "Enter your mobile number.";
  else if (!mobilePattern.test(draft.mobile.replace(/[\s()-]/g, ""))) errors.mobile = "Enter a valid Philippine mobile number.";
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, message: localConfirmation };
}
```

Mirror the pure function, field-ordered errors, trimmed strings, Philippine mobile validation, email format validation, and discriminated result. Add topic and message fields per UI-SPEC. This utility performs no network call, sanitization pipeline, provider action, or persistence; those remain Phase 4.

### `src/app/globals.css` (config/style, responsive transform)

**Analog:** existing file itself.

**Token and shared primitive pattern** (lines 1-27 and 48-65):

```css
:root {
  --color-paper: #ffffff;
  --color-dark: #151719;
  --color-muted-surface: #f4f4f2;
  --color-red: #e31b23;
  --color-border: #d9dcdd;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --radius-control: 0.25rem;
  --radius-card: 0.5rem;
}

:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.container { width: min(calc(100% - (var(--gutter) * 2)), var(--container-max)); margin-inline: auto; }
.button { min-height: 3rem; ... }
.card { background: var(--color-paper); border: 1px solid var(--color-border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
.panel--dark { background: var(--color-charcoal); ... }
```

Add route styles using existing tokens and BEM-like classes. Preserve gutters at 20/32/48px, mobile bottom clearance, `scroll-margin-block-start` for `#inquiry`, 44px minimum targets, 48-54px form controls, 16:10 map, 390/768/1024/1440 compositions, and the existing reduced-motion override (`globals.css`, lines 204-207).

### `tests/discovery-routes.test.mjs` and `tests/support-routes.test.mjs` (tests, file-I/O assertions)

**Analog:** `tests/homepage.test.mjs`

**Source-contract test pattern** (lines 1-5 and 41-80):

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("the home route composes the approved conversion journey from local contracts", async () => {
  const [page, quote, trucks] = await Promise.all([
    readSource("src/app/page.tsx"),
    readSource("src/components/homepage/HomepageQuoteExperience.tsx"),
    readSource("src/components/homepage/TruckRangeSection.tsx"),
  ]);
  assert.match(page, /id="main-content"/);
  assert.match(trucks, /truckRanges\.map/);
});

assert.doesNotMatch(publicSource, /promotions?/i);
assert.doesNotMatch(publicSource, /sourceUrl|authorizedUse|replacementNote|replaceWithCebuPhoto|sourceSite/);
```

Test route existence/composition, all four finite slugs, rich versus lightweight content branches, Contact topic normalization, support/about content sources, verified contact fields, unresolved status text, no promotions, and absence of provenance/mother-site URLs in public source files. Use parallel reads and `assert.match`/`doesNotMatch` consistently.

### `tests/inquiry-demo.test.mjs` (test, subprocess validation)

**Analog:** `tests/quote-demo.test.mjs`

**TypeScript utility execution pattern** (lines 1-17):

```js
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const executeFile = promisify(execFile);
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

async function validate(draft) {
  const script = `
    const { validateQuoteDraft } = await import('./src/lib/quote-demo.ts');
    process.stdout.write(JSON.stringify(validateQuoteDraft(${JSON.stringify(draft)})));
  `;
  const { stdout } = await executeFile(process.execPath, ["--experimental-strip-types", "--input-type=module", "--eval", script], { cwd: projectRoot });
  return JSON.parse(stdout);
}
```

Import `validateInquiryDraft` instead, assert deterministic field-error order, valid local-only confirmation, malformed email/mobile rejection, allowed topic handling, and no delivery claim.

## Shared Patterns

### Alias Imports and Server-First Boundaries

**Source:** `src/components/homepage/TruckRangeSection.tsx`, lines 1-7.  
**Apply to:** all route and component files.

Use framework imports first, then blank line, then `@/` project aliases. Server Components are the default; only `InquiryForm` and already-interactive layout behavior receive `"use client"`. Do not pass maintainer provenance objects into Client Components.

### Authoritative Facts and Honest Unresolved States

**Source:** `src/content/site.ts`, lines 1-7 and 18-45.  
**Apply to:** Contact, About, series availability notices, CTA phone actions.

Read verified phone/address/hours from `siteConfig`. For `ConfiguredValue` entries with `null`, render an explicit plain-text awaiting-confirmation row. Never create fallback email or verified-directions anchors. The address-derived search/embed is allowed only when labeled as an address search.

### Image Provenance and Public Projection

**Source:** `src/content/assets.ts`, lines 8-19; `src/components/homepage/TruckRangeSection.tsx`, lines 39-46.  
**Apply to:** listing cards, series heroes, optional Parts/Service media.

Assets remain local and versioned. Use dimensions and `sizes`; use `contain` for product imagery. Source URL, authorization, and replacement metadata stay in content modules and must not appear in public component props, DOM, alt text, or links.

### Inquiry Navigation Contract

**Source:** `src/components/layout/MobileActionBar.tsx`, lines 31-35; `src/content/trucks.ts`, lines 1 and 13.  
**Apply to:** all primary route CTAs and the mobile action bar.

Every contextual CTA uses a finite `InquiryTopic` and converges on `/contact?topic=<allowlisted-key>#inquiry`; general shell actions use `/contact#inquiry`. The verified call action remains adjacent. Do not construct topic values from arbitrary URL path/query strings.

### Form Validation and Error Handling

**Source:** `src/components/homepage/HomepageQuoteExperience.tsx`, lines 52-71 and 141-190; `src/lib/quote-demo.ts`, lines 24-40.  
**Apply to:** `InquiryForm`, `inquiry-demo`, interaction/validation tests.

Client submission prevents duplicates, invokes a pure validator, renders field-specific errors, enters loading, then shows a truthful local-only confirmation. Safe failure copy is fixed public text. There is no auth, server endpoint, external provider error, raw exception output, credential, persistence, or redirect in Phase 3.

### Accessibility

**Source:** `HomepageQuoteExperience.tsx`, lines 141-190 and 206-223; `HomepageSupportSections.tsx`, lines 51-72.  
**Apply to:** every new public route/component.

Use persistent labels, `aria-describedby`, `aria-invalid`, live regions, disabled loading submit, one H1, logical H2/H3 order, semantic `section`/`article`/`form`/`address`, meaningful map title, and single-link navigable cards. Anchor targets receive sticky-header scroll margin.

### Responsive Visual Language

**Source:** `src/app/globals.css`, lines 1-65 and 165-207; `TruckRangeSection.tsx`, lines 60-78.  
**Apply to:** all new routes/components.

Reuse `.container`, `.eyebrow`, `.button`, `.card`, `.panel--dark`, existing spacing/color/radius tokens, 400/700 type weights, and restrained transitions. Use one-column mobile layouts, two-column tablet layouts where content remains at least 280px, four listing cards at desktop, and the 55/45 Contact split from 1024px. Honor reduced motion.

## No Analog Found

No proposed file lacks a useful local analog. The only genuinely new mechanism is the finite App Router `[slug]` route (`generateStaticParams`, `dynamicParams = false`, async `params`) and async Contact `searchParams`; the planner should use the verified Next.js patterns in `03-RESEARCH.md` for those API-specific lines while retaining local composition/content conventions.

## Planner Guardrails

- Do not add packages, a CMS, technical tables, brochures, filtering, comparison, automatic recommendations, provider calls, production lead delivery, or visitor-facing mother-site links.
- 300/500 receive exactly three curated theme-level highlights; 200/Bus remain useful lightweight pages with no invented features/models/specifications.
- National product/corporate sources support configurable copy but never imply Cebu inventory, authorization, history, legal identity, or service capability.
- Contact owns the only inquiry form and `#inquiry` anchor. Preserve normalized origin separately from the visitor-editable topic.
- Tests, lint, build, and responsive visual verification at 390/768/1024/1440 remain required before implementation completion.

## Metadata

**Analog search scope:** `src/app`, `src/components/homepage`, `src/components/layout`, `src/content`, `src/lib`, `tests`  
**Files scanned:** 16 current implementation/test files plus Phase 3 context, research, UI contract, and project planning guidance  
**Strong analog set:** `src/app/page.tsx`, `src/components/homepage/TruckRangeSection.tsx`, `src/components/homepage/HomepageQuoteExperience.tsx`, `src/components/homepage/HomepageSupportSections.tsx`, `tests/homepage.test.mjs` (with direct target/dependency reads for content, CSS, mobile action, and validation details)  
**Pattern extraction date:** 2026-08-26
