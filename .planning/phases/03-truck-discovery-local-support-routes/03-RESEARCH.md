# Phase 3: Truck Discovery & Local Support Routes - Research

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### Truck Listing Structure
- **D-01:** Build `/trucks` around image-led, application-guided cards for the four configured ranges.
- **D-02:** Application guidance must stay broad and non-prescriptive; it must not imply an automatic recommendation or confirmed suitability.
- **D-03:** Keep the guidance static and pair the listing with a page-level inquiry CTA. Do not add filtering or automatic truck matching.
- **D-04:** The 200 Series and Bus & PUV entries must not become dead ends. The planner may choose lightweight availability pages or another clear in-scope destination.

### 300 and 500 Series Detail Pages
- **D-05:** Organize both representative detail pages around business applications first.
- **D-06:** Ground product content in the official Hino Motors Philippines 300 and 500 Series pages. Use only curated, verified highlights rather than copying complete specification tables.
- **D-07:** Store official source URLs and relevant provenance as internal typed content metadata. Do not show visitor-facing links to the mother site.
- **D-08:** Use one reusable detail-page structure while giving each series distinct applications, imagery, sourced highlights, and copy.
- **D-09:** Official national product information does not establish Cebu availability. Retain explicit availability safeguards and a local inquiry path.

### Inquiry Journey
- **D-10:** Route truck, parts, service, and general inquiry CTAs to one shared inquiry section on `/contact`.
- **D-11:** Carry the originating truck series or support topic into the form so it remains available for Phase 4 attribution.
- **D-12:** During Phase 3, reuse the established local validation and polished demo-success contract. Document the boundary clearly so Phase 4 can replace it with production delivery.
- **D-13:** Keep both the inquiry form and verified click-to-call path available across truck and support routes.

### Local Support Pages
- **D-14:** Give the routes distinct practical roles: `/parts-service` explains support paths, `/contact` owns location and inquiry actions, and `/about` provides concise local credibility.
- **D-15:** Lead `/parts-service` with separate Parts and Service paths. Treat fleet support and maintenance guidance as supporting topics.
- **D-16:** Lead `/about` with local customer commitment, add a short internally sourced Hino Motors Philippines background, and close with practical Cebu support/location details.
- **D-17:** Never turn national corporate statements into unsupported Cebu-dealer history, authorization, legal-entity, availability, or service claims.
- **D-18:** On `/contact`, show the verified phone, address, hours, inquiry form, and the established address-based map. Do not fabricate missing email or directions values or create inactive links.
- **D-19:** Explicitly mark the unresolved email and verified-directions inputs as awaiting confirmation.

### the agent's Discretion
- Decide the exact placement and repetition of suitability and availability notices, with claim safety as the controlling constraint.
- Choose the clearest non-dead-end treatment for 200 Series and Bus & PUV within Phase 3 scope.
- Choose how much model-level information appears on the 300 and 500 pages, subject to source provenance and Cebu availability safeguards.
- Choose whether carried inquiry context is visibly editable, fixed, or presented through another clear accessible treatment; it must remain available for attribution.
- Tune inquiry-versus-call hierarchy by page while preserving both paths.
- Choose exact responsive compositions and component boundaries within the established visual system.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within Phase 3 scope. Secure delivery, provider integrations, and final submission attribution remain in their planned Phase 4 boundary.
</user_constraints>

**Researched:** 2026-08-26  
**Domain:** Next.js App Router content-driven product discovery, local-support routes, and a client-only inquiry prototype  
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DISC-01 | Visitors can view a truck listing with configurable cards and reach detail pages without fabricated technical claims. | Extend the typed truck catalog, render all four cards from configuration, and provide four allowlisted series routes with explicit suitability/availability safeguards. [VERIFIED: `.planning/REQUIREMENTS.md`, `src/content/trucks.ts`] |
| DISC-02 | Visitors can view representative 300 and 500 series pages with approved/configurable content and a clear inquiry action. | Use one static dynamic-route template backed by internally sourced 300/500 content; include only curated narrative highlights, no local availability inference, and link into the shared Contact inquiry. [VERIFIED: official Hino Philippines 300/500 pages + `03-CONTEXT.md`] |
| DISC-03 | Visitors can reach dedicated parts/service, contact, and about/local-dealer pages with clear next actions. | Build three distinct pages from the existing services/site contracts; keep the address map separate from unresolved email/directions inputs and funnel all inquiry contexts into `/contact#inquiry`. [VERIFIED: `src/content/services.ts`, `src/content/site.ts`, `03-CONTEXT.md`] |
| DISC-04 | All primary public routes render correctly on mobile and desktop and maintain consistent navigation and footer information. | Retain the root layout shell, make the mobile quote action route-aware, and verify at 390/768/1024/1440 plus tests, lint, and build. [VERIFIED: `src/app/layout.tsx`, `AGENTS.md`] |
</phase_requirements>

## Summary

Phase 3 should remain a content-and-routing phase, not become a product configurator or lead-delivery phase. The repository already has the correct core stack, a shared public shell, local optimized images, typed site/truck/service modules, and a proven local-only form state machine. No new dependency is needed. [VERIFIED: `package.json`, `src/app/layout.tsx`, `src/content/*`, `src/components/homepage/HomepageQuoteExperience.tsx`]

The cleanest implementation is a configured `/trucks` listing plus one `app/trucks/[slug]/page.tsx` template. Generate all four known slugs at build time and reject unknown slugs; give 300 and 500 full application-first narratives, while 200 and Bus & PUV receive honest lightweight pages using only already-approved category copy, an availability notice, and inquiry/call actions. This satisfies the no-dead-end decision without inventing detail. Next.js documents `generateStaticParams` for build-time dynamic routes and `dynamicParams = false` for rejecting unspecified paths. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-static-params]

Use `/contact?topic=<allowlisted-key>#inquiry` as the shared conversion contract. The Contact page should normalize the query value against typed inquiry keys, pass the safe initial value into a narrow client form, visibly let the visitor adjust the inquiry type, and separately retain the original source key for Phase 4. In Next.js 16, page `searchParams` is a Promise and using it makes the page request-dependent; this is acceptable for the Contact route and avoids duplicating browser URL parsing. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/page]

**Primary recommendation:** Implement one typed content graph feeding six route pages, one shared truck-series template, and one allowlisted Contact inquiry contract; do not add packages, technical tables, brochures, provider calls, or visitor-facing mother-site links. [VERIFIED: `03-CONTEXT.md`, `package.json`]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Typed truck/support/about content and provenance | Frontend Server (SSR/static) | Build-time TypeScript | Content modules are imported into Server Components; provenance is used for maintenance and must not be rendered. [VERIFIED: existing content-module pattern] |
| Truck listing and series page rendering | Frontend Server (static) | CDN / Static | Content is local and finite; `generateStaticParams` can produce all known slugs at build time. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-static-params] |
| Local images | CDN / Static | Frontend Server | Existing files live under `public/images`; `next/image` supplies responsive optimization when dimensions and `sizes` are provided. [VERIFIED: `src/content/assets.ts`; CITED: https://nextjs.org/docs/app/api-reference/components/image] |
| Inquiry-origin transport | Browser URL | Frontend Server | CTA adds an allowlisted query key and anchor; Contact normalizes the query before it reaches the interactive form. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/page] |
| Inquiry form interaction and local demo state | Browser / Client | Frontend Server | State, event handlers, validation feedback, loading, and success require a narrow Client Component; the page and surrounding content remain Server Components. [CITED: https://nextjs.org/docs/app/getting-started/server-and-client-components] |
| Real lead validation/delivery | API / Backend | External providers | Explicitly deferred to Phase 4; Phase 3 must expose a replaceable UI boundary only. [VERIFIED: `03-CONTEXT.md`, `.planning/ROADMAP.md`] |
| Phone, address, hours, unresolved fields | Frontend Server (static) | — | Values must come only from authoritative site configuration. [VERIFIED: `src/content/site.ts`, `AGENTS.md`] |

## Project Constraints (from AGENTS.md)

- Read `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and `.planning/STATE.md` before implementation decisions. [VERIFIED: `AGENTS.md`]
- Preserve the conversion-first local Hino Cebu focus and exclude all visible promotions unless scope explicitly changes. [VERIFIED: `AGENTS.md`]
- Never fabricate vehicle specifications, dealer legal/contact details, product availability, or brand authorization. [VERIFIED: `AGENTS.md`]
- Keep business and product facts configurable and clearly mark unresolved launch inputs. [VERIFIED: `AGENTS.md`]
- Keep credentials server-only; validate, sanitize, rate-limit, and safely report lead submissions. Phase 3 must not create a production submission path; Phase 4 owns that boundary. [VERIFIED: `AGENTS.md`, `03-CONTEXT.md`]
- Protect future Google Sheets writes from formula injection. No Sheets write belongs in Phase 3. [VERIFIED: `AGENTS.md`, `.planning/ROADMAP.md`]
- Verify responsive layouts at 390px, 768px, 1024px, and 1440px; run tests, lint, and build before declaring implementation complete. [VERIFIED: `AGENTS.md`]

No `.codex/skills/` or `.agents/skills/` directory exists in the project, so there are no additional project-local skill rules to apply. [VERIFIED: filesystem inspection]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.3.3 | App Router pages, dynamic series route, static generation, metadata, `Link`, `Image` | Already locked and installed; App Router supports the required server-first routing and finite dynamic paths. Published 2026-08-25. [VERIFIED: `package.json`, npm registry, official Next.js docs] |
| React / React DOM | 19.1.0 | Server/Client component composition and inquiry-form state | Already installed with the application; use state only inside the inquiry boundary. Published 2025-03-28. [VERIFIED: `package.json`, npm registry, official Next.js Server/Client docs] |
| TypeScript | 5.8.3 | Typed content, slug unions, inquiry context unions, exhaustive mappings | Already installed with strict mode enabled. Published 2025-04-05. [VERIFIED: `package.json`, `tsconfig.json`, npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/image` | bundled with Next.js 16.3.3 | Responsive local truck/service imagery | Every page image; provide meaningful `alt`, intrinsic dimensions or `fill`, and accurate `sizes`. [CITED: https://nextjs.org/docs/app/api-reference/components/image] |
| `next/link` | bundled with Next.js 16.3.3 | Internal route, query, and fragment navigation | All internal listing/detail/support CTAs. Next.js prefetches linked routes in the viewport by default. [CITED: https://nextjs.org/docs/app/getting-started/linking-and-navigating] |
| Lucide React | 1.34.0 | Existing line-icon vocabulary | Reuse current icons for phone, map, support, and directional cues; do not add an icon package. Published 2026-08-24. [VERIFIED: `package.json`, npm registry, `src/components/*`] |
| Node test runner | Node 24.14.0 | Fast content-contract and pure-validation tests | Continue the existing `node --test` pattern. [VERIFIED: environment probe, `package.json`, `tests/*.test.mjs`] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| One dynamic `[slug]` series template | Four separate page implementations | Separate pages allow completely bespoke layouts but contradict the locked shared-structure decision and invite content/notice drift. [VERIFIED: `03-CONTEXT.md`] |
| Typed local modules | CMS or external product API | A CMS/API could help later at scale, but v1 explicitly excludes a CMS and currently has only four ranges. [VERIFIED: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`] |
| Query key plus anchor | Duplicated forms on every page | Embedded forms preserve context naturally but contradict the locked shared `/contact` inquiry journey. [VERIFIED: `03-CONTEXT.md`] |
| Native React form state | New form library | The current form is small, already validated/tested, and no Phase 3 requirement needs a form abstraction dependency. [VERIFIED: `HomepageQuoteExperience.tsx`, `quote-demo.ts`] |

**Installation:** No installation. Use the existing lockfile and dependencies. [VERIFIED: `package-lock.json`, `package.json`]

## Package Legitimacy Audit

Not applicable: Phase 3 should install no external packages. Existing package versions were confirmed against the npm registry, and none of the checked packages (`next`, `react`, `lucide-react`) declares a `postinstall` script at the pinned version. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```text
Typed local content
  trucks.ts + services.ts + site.ts + about/inquiry content
  (includes internal provenance; never rendered)
                  |
                  v
        Server-rendered public routes
  /trucks ----> /trucks/[slug] ----> 300/500 rich branch
      |                 |              200/Bus lightweight branch
      |                 v
      +----------> inquiry CTA --------------------+
  /parts-service ----> topic=parts|service --------+
  /about ------------> topic=general --------------+
                                                    v
                          /contact?topic=<key>#inquiry
                                      |
                              allowlist normalization
                                      |
                                      v
                          client InquiryForm state
                    validation -> loading -> local success
                                      |
                         call Cebu remains available

  Phase 4 boundary (not implemented now):
  InquiryForm -> secure server endpoint -> Sheets / Resend
```

The graph shows the only decision branch that matters: 300/500 receive sourced detail content; 200/Bus remain useful but intentionally lightweight. All branches converge on Contact. [VERIFIED: `03-CONTEXT.md`]

### Recommended Project Structure

```text
src/
├── app/
│   ├── trucks/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── parts-service/page.tsx
│   ├── contact/page.tsx
│   └── about/page.tsx
├── components/
│   ├── trucks/
│   │   ├── TruckCard.tsx
│   │   └── TruckSeriesPage.tsx
│   ├── contact/InquiryForm.tsx
│   └── shared/
│       ├── PageHero.tsx
│       └── LocalContactCta.tsx
├── content/
│   ├── trucks.ts        # extend existing range/detail contract + provenance
│   ├── services.ts      # extend existing support page content
│   ├── site.ts          # unchanged authority for branch facts/statuses
│   ├── about.ts         # local copy + internal national source metadata
│   └── inquiry.ts       # topic keys, labels, CTA URL builder
└── lib/
    └── inquiry-demo.ts       # pure local validation/result contract

tests/
├── discovery-routes.test.mjs
├── support-routes.test.mjs
└── inquiry-demo.test.mjs
```

This structure follows the repository's existing separation of typed facts, route composition, narrow client interaction, and pure testable validation. [VERIFIED: `src/content/*`, `src/components/homepage/*`, `tests/*`]

### Pattern 1: Finite Typed Dynamic Routes

**What:** Use the truck catalog as the single slug registry, generate every known slug at build time, disable unknown dynamic params, and still guard lookup with `notFound()`. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-static-params]

**When to use:** The four configured series routes.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
export const dynamicParams = false;

export function generateStaticParams() {
  return truckRanges.map(({ slug }) => ({ slug }));
}

export default async function TruckSeriesRoute({ params }: PageProps<"/trucks/[slug]">) {
  const { slug } = await params;
  const series = getTruckSeries(slug);
  if (!series) notFound();
  return <TruckSeriesPage series={series} />;
}
```

`params` is asynchronous in the current page API; do not copy older synchronous examples. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/page]

### Pattern 2: Internal Provenance, Public Content Projection

**What:** Keep a typed `source` object adjacent to every sourced series/about claim, but pass only public fields to rendering components. A source should identify URL, publisher, retrieval/review date, and which fields it supports. [VERIFIED: locked D-06/D-07; existing `sourceUrl` and asset-manifest patterns]

**When to use:** Every 300/500 highlight and the national-company paragraph.

```typescript
type ContentSource = {
  publisher: "Hino Motors Philippines";
  url: string;
  reviewedOn: `${number}-${number}-${number}`;
  supports: readonly string[];
};

type TruckSeries = TruckRange & {
  applications: readonly string[];
  highlights: readonly { title: string; body: string }[];
  source?: ContentSource; // maintenance-only; never render this object
};
```

Do not render `source.url`, do not add brochure links, and add a test that route/component sources do not reference `sourceUrl` or `source.url`. [VERIFIED: locked D-07]

### Pattern 3: Allowlisted Inquiry Context

**What:** Define stable machine keys separately from visitor labels. Normalize untrusted query input to a safe fallback; preserve the normalized origin separately from the editable inquiry type. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

**When to use:** Every truck/support/general CTA into Contact and the future Phase 4 attribution handoff.

```typescript
export const inquiryTopics = {
  "200-series": "Hino 200 Series",
  "300-series": "Hino 300 Series",
  "500-series": "Hino 500 Series",
  "bus-puv": "Bus & PUV",
  parts: "Parts",
  service: "Service",
  fleet: "Fleet inquiry",
  general: "General inquiry",
} as const;

export type InquiryTopic = keyof typeof inquiryTopics;

export function normalizeInquiryTopic(value: unknown): InquiryTopic {
  return typeof value === "string" && value in inquiryTopics ? (value as InquiryTopic) : "general";
}
```

Recommended CTA shape: `/contact?topic=300-series#inquiry`. On Contact, present an editable labeled inquiry-type select initialized from the normalized value and keep `originTopic` in form state for Phase 4 attribution. [VERIFIED: locked D-10/D-11; recommendation within agent discretion]

### Pattern 4: Server-First Page, Narrow Client Form

**What:** Keep listing, detail, Parts & Service, About, Contact facts, and map markup as Server Components. Put only form state/events in `InquiryForm.tsx` with `"use client"`. [CITED: https://nextjs.org/docs/app/getting-started/server-and-client-components]

**When to use:** `/contact`.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/page
export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const query = await searchParams;
  const initialTopic = normalizeInquiryTopic(query.topic);
  return <InquiryForm initialTopic={initialTopic} />;
}
```

Reading `searchParams` on the page opts Contact into request-time rendering. The other routes remain static because their content is local. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/page]

### Pattern 5: Honest Unresolved-State Rendering

**What:** Render a real value/action only when its configured status permits it. For unresolved email and directions, render plain status text such as “Email: awaiting confirmation” and “Verified directions link: awaiting confirmation”; do not render disabled anchors or guessed values. Continue embedding the established address-search map from the configured address. [VERIFIED: locked D-18/D-19; `siteConfig.contact`]

**When to use:** Contact, About practical details, and any shared local-contact component.

### Anti-Patterns to Avoid

- **Flattening provenance into visitor content:** It risks exposing mother-site links and coupling public UI to maintenance metadata. Project only the approved public fields into JSX. [VERIFIED: D-07]
- **Copying specification tables:** Model tables are volatile, qualifiers differ by model, and the user explicitly chose curated highlights. [VERIFIED: D-06; official 300/500 pages]
- **Treating national catalog presence as local inventory:** Every range remains `requires-verification`; repeat a clear availability notice near conversion actions. [VERIFIED: D-09; `src/content/trucks.ts`]
- **Application-to-model matching:** Static application examples orient visitors but must never select or recommend a model. [VERIFIED: D-02/D-03]
- **Using arbitrary query text as a label or hidden attribution:** Query input is untrusted; normalize against typed keys. [CITED: https://owasp.org/www-project-application-security-verification-standard/]
- **Making every route a Client Component:** This expands the browser bundle and can serialize data unnecessarily. Keep client scope at the form and existing shell interactions. [CITED: https://nextjs.org/docs/app/getting-started/server-and-client-components]
- **Claiming a local form was sent:** The Phase 3 success state must remain truthful and local-only until Phase 4 adds the server/provider pipeline. [VERIFIED: D-12; `src/lib/quote-demo.ts`]
- **Active placeholder contact links:** A disabled or guessed email/directions link looks operational but is not. Use visible status text. [VERIFIED: D-18/D-19]
- **Adding Promotions from the mother site:** The official source navigation contains Promotions, but the Cebu v1 scope explicitly excludes every visible promotion surface. [VERIFIED: official Hino pages; `AGENTS.md`]

## Content Research and Safe Curated Highlights

### 300 Series

The official page positions the 300 Series around compact dimensions, reliability, economy/functionality, and business use. It organizes detail under Performance, Comfort, Safety, and functional cab design. [CITED: https://hino.com.ph/300-series]

Use three short, paraphrased highlights:

1. **Business-ready performance:** Official material describes the N04C engine range as balancing power and economy and meeting Euro 4. [CITED: https://hino.com.ph/300-series]
2. **Driver-focused cab:** Official material describes a roomy, intuitive cab; conveniences vary by selected model. [CITED: https://hino.com.ph/300-series]
3. **Safety and service access:** Official material lists ABS/SRS only for particular models and describes the tilt cab as supporting inspection access. Any public copy must retain “select models”/“varies by model” qualification. [CITED: https://hino.com.ph/300-series]

Recommended applications should remain broad: delivery/distribution, logistics/fleet, food/cold-chain body conversations, and general commercial operations. These are orientation categories already present in project content, not fitment guarantees. [VERIFIED: `src/content/trucks.ts`, `HINO_CEBU_WEBSITE_SPEC.md`; qualification required by D-02]

Do not reproduce the official numerical engine/output/torque, wheelbase, GVW, or model table in Phase 3. Do not show brochure links. [VERIFIED: D-06/D-07]

### 500 Series

The official page positions the 500 Series around operational uptime, demanding conditions, durability/reliability, ease of operation, and safety. It describes a robust chassis/suspension and notes that automatic transmission and some equipment apply only to selected models. [CITED: https://www.hino.com.ph/500-series]

Use three short, paraphrased highlights:

1. **Demanding operations:** Frame the series around durable commercial work and operational continuity, without promising uptime or local suitability. [CITED: https://www.hino.com.ph/500-series]
2. **Durability-focused design:** Paraphrase the official chassis and suspension themes without numerical load or model claims. [CITED: https://www.hino.com.ph/500-series]
3. **Driver operation and safety:** Paraphrase visibility, cab operation, and braking themes; retain select-model qualifications and avoid listing feature availability as universal. [CITED: https://www.hino.com.ph/500-series]

Recommended applications should remain broad: cargo/hauling, construction, and fleet operations. These are inquiry prompts, not recommendations or body-fit approvals. [VERIFIED: `src/content/trucks.ts`, `HINO_CEBU_WEBSITE_SPEC.md`; qualification required by D-02]

Do not reproduce the official output/torque, GVW/GCM, axle, wheelbase, transmission, tractor-head, or model tables. [VERIFIED: D-06; official 500 page]

### 200 Series and Bus & PUV

Use lightweight pages generated by the same template. Render the existing approved range name/category/description/image, state that Cebu availability and specifications require confirmation, and offer “Ask about this range” plus Call. Do not add features, models, history, or technical claims because Phase 3 has no approved source package for them. [VERIFIED: `src/content/trucks.ts`; recommendation within D-04 discretion]

### About: National Background Boundary

The safest useful national paragraph is limited to this substance: Hino Motors Philippines Corporation was established in March 1975 and the official page describes its work as assembling/distributing Hino trucks, buses, and spare parts, alongside parts and maintenance services. Keep this explicitly about Hino Motors Philippines Corporation, not Hino Cebu. [CITED: https://www.hino.com.ph/corporate-information]

Do not reproduce “45th year,” dealer-count, “only company,” certification, leadership, or other time-sensitive/superlative claims from the page. The page simultaneously states a 1975 establishment date and “45th year,” which is temporally inconsistent in 2026; that is evidence to curate, not copy. [VERIFIED: official corporate page retrieved 2026-08-26]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive image loading | Custom `srcset` or remote hotlink logic | Existing local assets with `next/image` | Next Image calculates responsive candidates and reserves aspect ratio from intrinsic dimensions. [CITED: https://nextjs.org/docs/app/api-reference/components/image] |
| Internal navigation | Manual click handlers and `window.location` | `next/link` with pathname/query/hash | It provides framework navigation and route prefetching. [CITED: https://nextjs.org/docs/app/getting-started/linking-and-navigating] |
| Series routing | Switch statements in four duplicated pages | Typed catalog lookup + `[slug]` + `generateStaticParams` | One template enforces structure and notices consistently. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-static-params] |
| Inquiry-origin parsing | Free-form text parsing | Typed allowlist map and normalizer | Stable keys are safe, testable, and ready for Phase 4 attribution. [CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| Form controls | Custom select/checkbox widgets | Native labeled HTML controls | Existing form patterns already provide labels, `aria-describedby`, and keyboard behavior. [VERIFIED: `HomepageQuoteExperience.tsx`; CITED: https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels] |
| Form delivery | Mock API, local storage queue, Sheets/Resend calls | Existing local-only demo state in Phase 3; secure server pipeline in Phase 4 | Provider delivery, server validation, rate limiting, and formula escaping are explicitly a later boundary. [VERIFIED: D-12, `.planning/ROADMAP.md`, `AGENTS.md`] |
| Maps API integration | Keyed custom map client | Existing address-based Google Maps iframe | The current project already uses a keyless address-search iframe and no Phase 3 feature needs a Maps SDK. [VERIFIED: `HomepageSupportSections.tsx`, D-18] |

**Key insight:** The difficult part is claim governance and consistent conversion context, not UI mechanics. Typed content/provenance and one normalized inquiry path eliminate the largest drift risks without adding infrastructure. [VERIFIED: project constraints and current architecture]

## Common Pitfalls

### Pitfall 1: Source Metadata Leaks into Public Output
**What goes wrong:** A “Source” link appears on a series page or provenance is passed wholesale into a Client Component.  
**Why it happens:** The content and source fields share one object.  
**How to avoid:** Render through a public projection and keep components ignorant of source metadata.  
**Warning signs:** `sourceUrl` in JSX, external Hino anchors, or provenance fields in client props. [VERIFIED: D-07]

### Pitfall 2: Model-Specific Features Become Series-Wide Claims
**What goes wrong:** ABS, airbags, automatic transmission, or power equipment is presented as universal.  
**Why it happens:** Official narrative sections include footnotes tying features to particular models.  
**How to avoid:** Prefer theme-level copy; if a feature is retained, say “on select models” and record which source passage supports it.  
**Warning signs:** Feature cards with no qualifier or source-supported model scope. [CITED: https://hino.com.ph/300-series; https://www.hino.com.ph/500-series]

### Pitfall 3: “Best Suited For” Reads as a Recommendation
**What goes wrong:** Visitors infer confirmed payload/body/application fit.  
**Why it happens:** Application headings are too categorical.  
**How to avoid:** Use “Common business conversations” or “Explore this range for…” plus “Talk with Hino Cebu about your body and operating requirements.”  
**Warning signs:** “ideal for,” “perfect for,” automatic selection, or checked suitability badges. [VERIFIED: D-02/D-03]

### Pitfall 4: Query Context Is Lost or Over-Trusted
**What goes wrong:** Every inquiry becomes “general,” or arbitrary query text is reflected into the page.  
**Why it happens:** CTA construction and form options use unrelated strings.  
**How to avoid:** One exported topic registry must build URLs, normalize query input, label the form, and seed future attribution.  
**Warning signs:** Handwritten `?topic=` strings scattered across components or type casts without membership checks. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Pitfall 5: Demo Success Implies Delivery
**What goes wrong:** A success message says “sent” although no endpoint ran.  
**Why it happens:** Production UX copy is reused before the provider layer exists.  
**How to avoid:** Reuse the approved thank-you/call state and keep implementation comments explicit that Phase 4 replaces the local timer.  
**Warning signs:** “We received your inquiry,” lead IDs, redirects, or provider errors in Phase 3. [VERIFIED: D-12; `HomepageQuoteExperience.tsx`]

### Pitfall 6: Unresolved Directions Becomes a Fabricated Link
**What goes wrong:** A generated map-search URL is presented as the verified dealership listing.  
**Why it happens:** Map embedding and verified directions are treated as the same datum.  
**How to avoid:** Embed the address-based map, but show verified directions as awaiting confirmation until `directionsUrl.status` is approved.  
**Warning signs:** A Contact “Get directions” anchor built with `??` fallback. [VERIFIED: D-18/D-19; existing `siteConfig`]

### Pitfall 7: Mobile CTA Still Sends Every Route Back Home
**What goes wrong:** On truck/support pages the sticky quote action loses the selected topic and jumps to the homepage.  
**Why it happens:** `MobileActionBar.tsx` currently hardcodes `/#request-a-quote`.  
**How to avoid:** Make its destination pathname-aware: homepage preserves the current anchor behavior; other public routes use Contact, with page-specific topic when available.  
**Warning signs:** `/#request-a-quote` remains the only mobile quote href. [VERIFIED: `src/components/layout/MobileActionBar.tsx`, D-10/D-11]

### Pitfall 8: Responsive Work Stops at Existing Breakpoints
**What goes wrong:** New grids look acceptable at broad mobile/desktop CSS ranges but fail at the mandated 390, 768, 1024, or 1440 widths.  
**Why it happens:** Current CSS mainly switches at 639/767/1023 and visual verification is manual.  
**How to avoid:** Add explicit phase verification at all four widths for every primary route and check sticky actions do not cover content.  
**Warning signs:** horizontal overflow, clipped hero images, excessively tall card media, or obscured form controls. [VERIFIED: `globals.css`, `AGENTS.md`]

## Code Examples

### Safe CTA Builder

```typescript
// Source basis: locked D-10/D-11 and typed Next.js Link href support
export function inquiryHref(topic: InquiryTopic) {
  return `/contact?topic=${topic}#inquiry` as const;
}
```

Use this builder everywhere instead of interpolating query strings. [VERIFIED: D-10/D-11; CITED: https://nextjs.org/docs/app/getting-started/linking-and-navigating]

### Truthful Demo State

```typescript
// Source: established Phase 2 local-only behavior in HomepageQuoteExperience.tsx
function submitInquiry(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const result = validateInquiryDraft(draft);
  if (!result.ok) {
    setErrors(result.errors);
    return;
  }
  setStatus("loading");
  window.setTimeout(() => setStatus("success"), 300);
  // Phase 4 replaces this local transition with the secure lead endpoint.
}
```

Do not add `fetch`, a Server Action, local persistence, or provider imports in Phase 3. [VERIFIED: D-12]

### Accessible Field Errors and Status

```tsx
// Source: https://www.w3.org/WAI/WCAG22/Understanding/error-identification
<label htmlFor="inquiry-email">Email address</label>
<input
  aria-describedby={errors.email ? "inquiry-email-error" : undefined}
  aria-invalid={Boolean(errors.email)}
  id="inquiry-email"
  type="email"
/>
{errors.email ? <p id="inquiry-email-error">{errors.email}</p> : null}
<p aria-live="polite">{statusMessage}</p>
```

Textual error identification and programmatically exposed status updates are required accessibility patterns for this interaction. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/error-identification; https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html]

### Responsive Local Image

```tsx
// Source: https://nextjs.org/docs/app/api-reference/components/image
<Image
  alt={asset.alt}
  fill
  sizes="(min-width: 1024px) 50vw, 100vw"
  src={asset.src}
/>
```

The positioned parent must reserve an aspect ratio/minimum height; `sizes` must match the rendered layout. [CITED: https://nextjs.org/docs/app/api-reference/components/image]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Synchronous page `params`/`searchParams` | Promise-based page props | Next.js 15 RC | Phase 3 route and Contact page must `await` props; older snippets are stale. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/page] |
| Pages Router `getStaticPaths` | App Router `generateStaticParams` | App Router introduction | Use the catalog directly to generate finite series routes. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-static-params] |
| Broad client-rendered pages | Server Components by default, narrow client boundaries | App Router | Keep static product/support content out of the inquiry client bundle. [CITED: https://nextjs.org/docs/app/getting-started/server-and-client-components] |
| Unrestricted Next Image qualities | Explicit allowed qualities when customizing quality | Next.js 16 | No change is needed if default quality is used; do not introduce arbitrary quality props without config. [CITED: https://nextjs.org/docs/app/api-reference/components/image] |

**Deprecated/outdated:**
- Synchronous `params` and `searchParams` page typing is outdated for this installed Next.js version. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/page]
- `getStaticPaths` is a Pages Router API; `generateStaticParams` is the App Router mechanism. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-static-params]
- `onLoadingComplete` on `next/image` is deprecated; this phase does not need it. [CITED: https://nextjs.org/docs/app/api-reference/components/image]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Manual browser responsive inspection is available to the implementer through a local or deployed preview. | Environment Availability | If unavailable, the mandatory four-width visual gate needs a browser-based alternative or explicit stakeholder verification. |

## Open Questions

1. **Are the curated product words approved for public launch, beyond being sourced?**
   - What we know: The user required official Hino Philippines sources and internal provenance, and Phase 2 records authorization to use official visual assets. [VERIFIED: `03-CONTEXT.md`, Phase 2 D-01]
   - What's unclear: Product-claim approval/brand review remains a launch dependency in project state. [VERIFIED: `.planning/STATE.md`]
   - Recommendation: Implement claims as configurable sourced content with `reviewedOn` and keep the availability disclaimer; carry final commercial approval into the launch checklist rather than blocking Phase 3. [VERIFIED: project constraints]

2. **Should model names appear at all?**
   - What we know: User left model-level depth to agent discretion; official pages list models, but qualifiers and tables create maintenance risk. [VERIFIED: `03-CONTEXT.md`; official product pages]
   - What's unclear: No local model availability is verified. [VERIFIED: `.planning/STATE.md`]
   - Recommendation: Omit model names in Phase 3. Series-level highlights are useful and safer; ask visitors to confirm the current Cebu lineup. [Recommendation within D-09 discretion]

3. **Is a new hero asset required for the 500 page?**
   - What we know: Distinct local card images exist for all four ranges, but only a 300 Series wide hero exists. [VERIFIED: `public/images/official`, `src/content/assets.ts`]
   - What's unclear: No second wide hero is locally available. [VERIFIED: filesystem inspection]
   - Recommendation: Use the existing distinct 500 card image inside a contained light-background media panel rather than scraping/downloading a new asset during this phase. This preserves local optimization and source metadata. [Recommendation based on existing assets]

4. **How should the global sticky quote action preserve per-page context?**
   - What we know: The existing component hardcodes the homepage quote anchor; detail and support CTAs must converge on Contact with context. [VERIFIED: `MobileActionBar.tsx`, D-10/D-11]
   - What's unclear: Root layout does not directly know a series object. [VERIFIED: `src/app/layout.tsx`]
   - Recommendation: Give page-level CTAs precise topics; change the global mobile bar to a general `/contact#inquiry` action outside the homepage. Do not complicate the root shell with route-to-topic inference. [Recommendation within D-13 discretion]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Tests/build | ✓ | 24.14.0 | — [VERIFIED: environment probe] |
| npm | Scripts/dependency integrity | ✓ | 8.17.0 | — [VERIFIED: environment probe] |
| Next.js CLI | Build/dev/type generation | ✓ | 16.3.3 | — [VERIFIED: `npx next --version`] |
| Git | Repository operations | ✓ | 2.55.0.windows.4 | — [VERIFIED: environment probe] |
| Hino Philippines pages | Content research/review only | ✓ during research | web | Keep already-reviewed provenance and flag future refresh if unavailable. [VERIFIED: web retrieval] |
| Browser viewport inspection | Manual responsive gate | Not CLI-probed | — | Use the project's preview/deployed build and browser responsive mode. [ASSUMED] |

**Missing dependencies with no fallback:** None found for implementation. [VERIFIED: environment probe]

**Missing dependencies with fallback:** Context7 CLI was unavailable; official Next.js documentation was used directly. [VERIFIED: environment probe and official docs retrieval]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner, Node 24.14.0 [VERIFIED: `package.json`, environment probe] |
| Config file | None; glob is defined in `package.json`. [VERIFIED: `package.json`] |
| Quick run command | `node --test tests/discovery-routes.test.mjs tests/support-routes.test.mjs tests/inquiry-demo.test.mjs` |
| Full suite command | `npm test` |

The pre-research baseline is green: 16/16 tests passed, lint passed, and the Next.js 16.3.3 production build passed on 2026-08-26. [VERIFIED: commands executed during research]

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DISC-01 | Four configured cards link to four valid series routes; no invented technical fields; listing has inquiry action and notice | content-contract / build | `node --test tests/discovery-routes.test.mjs` | ❌ Wave 0 |
| DISC-02 | 300/500 use shared structure, distinct sourced highlights, internal-only provenance, availability notice, and contextual inquiry links | content-contract / build | `node --test tests/discovery-routes.test.mjs` | ❌ Wave 0 |
| DISC-03 | Parts/Service, Contact, About exist; contexts normalize; form validates locally; unresolved email/directions render as status not links | unit + content-contract | `node --test tests/support-routes.test.mjs tests/inquiry-demo.test.mjs` | ❌ Wave 0 |
| DISC-04 | Routes retain root shell/main landmark, no Promotions, and build successfully | content-contract + production build + manual responsive | `npm test && npm run lint && npm run build` | ⚠️ Existing baseline tests, Phase 3 assertions missing |

### Sampling Rate

- **Per task commit:** `node --test tests/discovery-routes.test.mjs tests/support-routes.test.mjs tests/inquiry-demo.test.mjs`
- **Per wave merge:** `npm test && npm run lint`
- **Phase gate:** `npm test && npm run lint && npm run build`, then manual route checks at 390px, 768px, 1024px, and 1440px before `$gsd-verify-work`. [VERIFIED: `AGENTS.md`]

### Wave 0 Gaps

- [ ] `tests/discovery-routes.test.mjs` — covers DISC-01/DISC-02: route files, static params, configured cards, source metadata, notices, no visitor mother links, no Promotions.
- [ ] `tests/support-routes.test.mjs` — covers DISC-03/DISC-04: three route contracts, authoritative facts, unresolved-state display, shared shell/CTA contracts.
- [ ] `tests/inquiry-demo.test.mjs` — covers DISC-03: topic allowlist/fallback, field validation, and truthful local-only result.
- [ ] Manual responsive matrix for `/trucks`, all four series routes, `/parts-service`, `/contact`, and `/about` at all four mandated widths; no browser automation package is currently installed. [VERIFIED: `package.json`, `AGENTS.md`]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No authentication exists in public Phase 3 routes. [VERIFIED: phase scope/codebase] |
| V3 Session Management | no | No session is created or consumed. [VERIFIED: phase scope/codebase] |
| V4 Access Control | no | All Phase 3 routes are intentionally public and read-only. [VERIFIED: phase scope] |
| V5 Input Validation | yes | Typed allowlist for `topic`; pure field validation for demo UX; Phase 4 must repeat validation server-side. [CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| V6 Cryptography | no | Phase 3 handles no credentials, secrets, or persisted sensitive data. [VERIFIED: phase boundary] |

### Known Threat Patterns for Next.js/React Public Forms

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Reflected arbitrary query content | Tampering / information integrity | Normalize `topic` against a typed allowlist before display or state initialization; fallback to `general`. [CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| XSS through interpolated user content | Tampering | Render plain React text, never `dangerouslySetInnerHTML`; keep query values allowlisted. [CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| Client-only validation mistaken for security | Spoofing / tampering | Treat Phase 3 validation as UX only; Phase 4 must validate/sanitize/rate-limit at the server boundary. [VERIFIED: `AGENTS.md`, Phase 4 requirements] |
| Accidental provider/secret exposure | Information disclosure | Do not add provider calls or import server credential modules into Client Components. Next.js recommends narrow Client boundaries and server-only handling for secrets. [CITED: https://nextjs.org/docs/app/getting-started/server-and-client-components] |
| False successful-delivery claim | Repudiation / integrity | Use truthful local-only status copy and preserve Call as the operational path. [VERIFIED: D-12, existing quote contract] |

Security enforcement is enabled because `.planning/config.json` does not disable it. [VERIFIED: `.planning/config.json`]

## Sources

### Primary (HIGH confidence)

- `03-CONTEXT.md`, `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, `AGENTS.md` — locked scope, requirements, safety constraints, and unresolved facts. [VERIFIED: codebase]
- `src/content/*`, `src/components/homepage/*`, `src/components/layout/*`, `tests/*`, `package.json`, `tsconfig.json` — current architecture, content contracts, form behavior, shell behavior, and test stack. [VERIFIED: codebase]
- https://hino.com.ph/300-series — official 300 Series positioning, feature themes, model qualifiers, and tables reviewed for curation. [CITED: official Hino Motors Philippines]
- https://www.hino.com.ph/500-series — official 500 Series positioning, feature themes, model qualifiers, and tables reviewed for curation. [CITED: official Hino Motors Philippines]
- https://www.hino.com.ph/corporate-information — official national-company background reviewed for a minimal About paragraph. [CITED: official Hino Motors Philippines]
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params — finite dynamic-route generation and unknown-param handling. [CITED: official Next.js docs, updated 2026-02-27]
- https://nextjs.org/docs/app/api-reference/file-conventions/page — Promise-based `params`/`searchParams` and dynamic rendering behavior. [CITED: official Next.js docs, updated 2026-02-27]
- https://nextjs.org/docs/app/getting-started/server-and-client-components — server-first architecture and narrow client boundaries. [CITED: official Next.js docs, updated 2026-03-16]
- https://nextjs.org/docs/app/api-reference/components/image — responsive local image behavior. [CITED: official Next.js docs, updated 2026-03-16]
- https://www.w3.org/WAI/WCAG22/Understanding/error-identification — textual, associated form errors. [CITED: W3C WAI]
- https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html — programmatically exposed dynamic form status. [CITED: W3C WAI]
- https://owasp.org/www-project-application-security-verification-standard/ — validation/encoding security baseline; latest stable listed as ASVS 5.0.0. [CITED: OWASP]

### Secondary (MEDIUM confidence)

- npm registry metadata — pinned package existence, source repositories, versions, publication timestamps, and absence of checked `postinstall` fields. [VERIFIED: npm registry]

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — existing exact versions were inspected locally and checked against npm/official docs.
- Architecture: HIGH — derived from locked decisions and established repository patterns, with Next.js APIs checked against current official documentation.
- Product content: HIGH for national-source attribution; MEDIUM for launch readiness because final claim/brand approval remains an external launch input.
- Pitfalls: HIGH — directly evidenced by official model qualifiers, unresolved config states, locked decisions, and current hardcoded shell behavior.

**Research date:** 2026-08-26  
**Valid until:** 2026-09-25 for framework guidance; product claims must be re-reviewed at commercial approval because source content and availability can change.
