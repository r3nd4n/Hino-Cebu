<!-- refreshed: 2026-08-18 -->
# Architecture

**Analysis Date:** 2026-08-18

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Next.js App Router presentation                                      │
├───────────────────┬────────────────────┬─────────────────────────────┤
│ Static routes     │ Dynamic templates  │ Metadata endpoints          │
│ `src/app/*`       │ `src/app/*/[slug]` │ `src/app/{robots,sitemap}.ts`│
└─────────┬─────────┴──────────┬─────────┴──────────────┬──────────────┘
          │                    │                        │
          ▼                    ▼                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Reusable UI and interaction components                              │
│ `src/components/{layout,ui,marketing,forms,trucks}`                  │
└─────────────────────┬──────────────────────────────┬─────────────────┘
                      │                              │
            reads     ▼                    invokes   ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│ Typed repository content      │     │ Domain/infrastructure helpers │
│ `src/content/*.ts`            │     │ `src/lib/**`                  │
└───────────────────────────────┘     └───────────────┬───────────────┘
                                                     │
                                                     ▼
                                      ┌───────────────────────────────┐
                                      │ Server action / lead webhook  │
                                      │ `src/app/actions/leads.ts`    │
                                      │ `src/lib/leads/router.ts`     │
                                      └───────────────────────────────┘
```

The application is a content-driven marketing and lead-generation site. Next.js owns routing, rendering, metadata, and server actions in `src/app/`; repository-managed TypeScript modules in `src/content/` are the content store; React components in `src/components/` provide presentation and browser interaction; utilities and the lead boundary live in `src/lib/`.

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | Applies global shell, metadata base, organization JSON-LD, navigation, attribution capture, marketing tags, and mobile actions | `src/app/layout.tsx` |
| Static route pages | Compose content and reusable components for each public URL | `src/app/page.tsx`, `src/app/(public)/contact/page.tsx`, `src/app/quote/page.tsx` |
| Truck route template | Statically enumerates truck slugs, resolves typed truck content, builds SEO/product schema, and renders details | `src/app/trucks/[slug]/page.tsx` |
| Campaign route template | Statically enumerates campaign slugs, controls indexability, and renders a compact campaign lead form | `src/app/lp/[slug]/page.tsx` |
| Inquiry page composition | Provides the shared presentation for sales, parts, service, fleet, and financing routes | `src/components/marketing/InquiryPage.tsx` |
| Lead form | Renders type-specific fields, captures browser attribution, invokes the server action, and emits submission events | `src/components/forms/LeadForm.tsx` |
| Lead server action | Allow-lists inquiry types, builds Zod validation from field definitions, sanitizes attribution, and delegates delivery | `src/app/actions/leads.ts` |
| Lead router | Implements the vendor-neutral `LeadRouter` contract using a webhook with a non-persisting development fallback | `src/lib/leads/router.ts`, `src/lib/leads/types.ts` |
| Truck finder | Holds a client-side rules engine and interactive recommendation state | `src/components/trucks/TruckFinder.tsx` |
| Content repository | Defines branch, truck, campaign, guide, promotion, delivery, service, and application data | `src/content/site.ts`, `src/content/trucks.ts`, `src/content/campaigns.ts` |
| SEO helpers | Centralizes canonical, Open Graph, Twitter, breadcrumb, and origin construction | `src/lib/seo.ts`, `src/lib/site-url.ts` |
| Measurement layer | Loads optional provider scripts, captures campaign parameters, and emits typed analytics events | `src/components/marketing/MarketingTags.tsx`, `src/lib/analytics.ts`, `src/lib/attribution.ts` |

## Pattern Overview

**Overall:** Layered, content-driven Next.js App Router application with server-rendered pages and small client islands.

**Key Characteristics:**
- Keep routes declarative: page modules in `src/app/**/page.tsx` select typed content and compose components rather than owning persistence or provider code.
- Keep most rendering server-side. Add `"use client"` only to browser-state boundaries such as `src/components/layout/Header.tsx`, `src/components/forms/LeadForm.tsx`, `src/components/trucks/TruckFinder.tsx`, `src/components/marketing/TrackedLink.tsx`, and `src/components/marketing/AttributionCapture.tsx`.
- Treat `src/content/*.ts` as the repository-backed content layer. Dynamic pages resolve records by slug from `src/content/trucks.ts` and `src/content/campaigns.ts`.
- Put integration details behind a domain contract. `LeadRouter` in `src/lib/leads/types.ts` is implemented by `src/lib/leads/router.ts`, while callers use only the exported `leadRouter`.
- Use the `@/*` alias for cross-directory imports as configured in `tsconfig.json`; reserve relative imports for tightly coupled files within `src/lib/leads/`.

## Layers

**Routing and Page Composition:**
- Purpose: Map URLs to server-rendered React output, route metadata, 404 handling, sitemap output, and robots policy.
- Location: `src/app/`
- Contains: `layout.tsx`, `page.tsx`, nested route folders, `not-found.tsx`, `sitemap.ts`, `robots.ts`, and `actions/leads.ts`.
- Depends on: `src/components/`, `src/content/`, `src/lib/`, Next.js primitives, and React.
- Used by: The Next.js runtime through App Router filesystem conventions in `src/app/`.

**Reusable Presentation:**
- Purpose: Render the global shell, shared visual primitives, inquiry experiences, truck UI, and client-side interactions.
- Location: `src/components/`
- Contains: layout components in `src/components/layout/`, visual primitives in `src/components/ui/`, measurement/inquiry composition in `src/components/marketing/`, forms in `src/components/forms/`, and truck-specific UI in `src/components/trucks/`.
- Depends on: Next.js UI APIs, React, `src/content/`, and `src/lib/`.
- Used by: Route modules in `src/app/` and other higher-level components such as `src/components/marketing/InquiryPage.tsx`.

**Content Model:**
- Purpose: Hold approved, typed, repository-managed business and product content independently of page presentation.
- Location: `src/content/`
- Contains: object/array exports and their local TypeScript types, including `Truck`, `Campaign`, `Promotion`, and `DeliveryStory` in their corresponding files.
- Depends on: No application layer; content modules are leaf dependencies such as `src/content/trucks.ts` and `src/content/site.ts`.
- Used by: Routes, layout components, cards, metadata, sitemap generation, and the truck finder links in `src/app/`, `src/components/`, and `src/lib/seo.ts`.

**Application and Domain Utilities:**
- Purpose: Define lead types/contracts, dynamic lead fields, URL handling, metadata construction, analytics, and browser attribution.
- Location: `src/lib/`
- Contains: `src/lib/leads/{types,fields,router}.ts`, `src/lib/{seo,site-url,analytics,attribution}.ts`.
- Depends on: Platform APIs, Zod at the server-action boundary, and limited content configuration through `src/lib/seo.ts`.
- Used by: `src/app/` server routes/actions and interactive components under `src/components/`.

**Static Assets and Styling:**
- Purpose: Supply public brand/product images, social images, favicon assets, and global design rules.
- Location: `public/`, `src/app/globals.css`
- Contains: official raster assets under `public/images/official/`, SVG entry assets under `public/`, and all CSS tokens/layout/component styles in `src/app/globals.css`.
- Depends on: No application modules.
- Used by: `next/image`, metadata, and class names emitted throughout `src/app/` and `src/components/`.

## Data Flow

### Primary Page Request Path

1. Next.js resolves a filesystem route such as `src/app/trucks/[slug]/page.tsx:13` inside the global shell from `src/app/layout.tsx:20`.
2. The route resolves repository content through `getTruck` in `src/content/trucks.ts:96`; invalid slugs terminate through `notFound()` in `src/app/trucks/[slug]/page.tsx:14`.
3. Metadata is generated with `createMetadata` in `src/lib/seo.ts:12`, which builds absolute URLs using `src/lib/site-url.ts:3` and branch identity from `src/content/site.ts:1`.
4. The route composes server components from `src/components/ui/Shared.tsx` and truck content into HTML; Next.js image handling serves assets referenced from `public/images/official/`.
5. The root layout adds header, footer, mobile actions, optional provider tags, attribution capture, and organization JSON-LD in `src/app/layout.tsx:26`.

### Lead Submission Flow

1. Inquiry routes such as `src/app/quote/page.tsx:4` render `InquiryPage`, which delegates the form to `src/components/forms/LeadForm.tsx:18`.
2. The client form derives fields from `src/lib/leads/fields.ts:12`, reads session attribution from `src/lib/attribution.ts:5`, and submits through React `useActionState` to `submitLead` in `src/app/actions/leads.ts:15`.
3. The server action verifies the lead type and honeypot, constructs a Zod schema from the same field definitions, validates consent/length/email, and sanitizes attribution in `src/app/actions/leads.ts:16`.
4. Valid data is normalized to `LeadSubmission` from `src/lib/leads/types.ts:4` and passed to `leadRouter.submit` in `src/app/actions/leads.ts:46`.
5. `src/lib/leads/router.ts:10` posts JSON to `LEAD_ROUTING_WEBHOOK_URL`; when the endpoint is absent, `src/lib/leads/router.ts:3` returns an ephemeral UUID without storing personal data.
6. The server action returns a small `LeadFormState` to `src/components/forms/LeadForm.tsx:19`; success triggers typed submission analytics without including form payload fields.

### Attribution and Analytics Flow

1. `src/components/marketing/AttributionCapture.tsx:7` observes the current query string from the root layout.
2. `captureAttribution` allow-lists UTM and click identifiers and merges them into session storage in `src/lib/attribution.ts:10`.
3. `src/components/forms/LeadForm.tsx:27` serializes the stored attribution into a hidden field immediately before the server action runs.
4. `track` in `src/lib/analytics.ts:15` emits a typed, PII-free event to available `dataLayer`, GA4, and Meta browser globals initialized by `src/components/marketing/MarketingTags.tsx`.

**State Management:**
- Server-rendered content has no shared mutable runtime store; authoritative content is module data in `src/content/*.ts`.
- Local UI state stays inside client components: navigation state in `src/components/layout/Header.tsx`, form lifecycle in `src/components/forms/LeadForm.tsx`, and finder answers/results in `src/components/trucks/TruckFinder.tsx`.
- Cross-page attribution is the only browser-persisted state and uses `sessionStorage` through `src/lib/attribution.ts`; submitted lead data is not persisted by the application when no webhook is configured in `src/lib/leads/router.ts`.

## Key Abstractions

**Typed Content Records:**
- Purpose: Separate editable facts from page composition and constrain record shape at compile time.
- Examples: `Truck` in `src/content/trucks.ts`, `Campaign` in `src/content/campaigns.ts`, `Promotion` in `src/content/promotions.ts`, `DeliveryStory` in `src/content/deliveries.ts`.
- Pattern: Export a type and a typed array; expose a focused lookup/filter helper where needed, such as `getTruck` in `src/content/trucks.ts` and `activePromotions` in `src/content/promotions.ts`.

**LeadRouter:**
- Purpose: Keep the lead destination replaceable and prevent UI/server-action code from depending on a vendor SDK.
- Examples: Contract in `src/lib/leads/types.ts`; webhook and development implementations in `src/lib/leads/router.ts`; consumer in `src/app/actions/leads.ts`.
- Pattern: Structural interface with one asynchronous `submit` operation and a single selected module export.

**Lead Field Schema:**
- Purpose: Drive both form rendering and server-side validation from one per-lead-type definition.
- Examples: `LeadField` and `leadFields` in `src/lib/leads/fields.ts`; renderer in `src/components/forms/LeadForm.tsx`; validator builder in `src/app/actions/leads.ts`.
- Pattern: Declarative field metadata keyed by the `LeadType` union from `src/lib/leads/types.ts`.

**Shared Page Primitives:**
- Purpose: Keep spacing, hierarchy, calls to action, breadcrumbs, and JSON-LD output consistent across routes.
- Examples: `Container`, `PageHero`, `SectionHeading`, `Breadcrumbs`, `CtaBand`, and `JsonLd` in `src/components/ui/Shared.tsx`.
- Pattern: Small stateless server-compatible React components styled through classes in `src/app/globals.css`.

**Metadata Factory:**
- Purpose: Apply canonical, robots, Open Graph, and Twitter defaults consistently.
- Examples: `createMetadata` and `breadcrumbSchema` in `src/lib/seo.ts`; origin normalization in `src/lib/site-url.ts`.
- Pattern: Pure factory functions consumed by each `src/app/**/page.tsx` metadata export.

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every App Router document request.
- Responsibilities: Define global metadata, import `src/app/globals.css`, render the site shell, install client measurement islands, and emit organization schema.

**Home Route:**
- Location: `src/app/page.tsx`
- Triggers: HTTP requests for `/`.
- Responsibilities: Aggregate the primary tasks, truck catalog, support services, guides, promotions, deliveries, contact actions, and home metadata.

**Static Route Pages:**
- Location: `src/app/(public)/{contact,hino-cebu}/page.tsx` and the remaining static routes under `src/app/**/page.tsx`
- Triggers: Their corresponding public route paths.
- Responsibilities: Compose page-specific content and shared components; keep business integration logic outside route modules.

**Dynamic Truck Route:**
- Location: `src/app/trucks/[slug]/page.tsx`
- Triggers: `/trucks/:slug` for slugs enumerated from `src/content/trucks.ts`.
- Responsibilities: Static parameter generation, content lookup, 404 handling, route metadata, product/breadcrumb schema, and truck detail composition.

**Dynamic Campaign Route:**
- Location: `src/app/lp/[slug]/page.tsx`
- Triggers: `/lp/:slug` for slugs enumerated from `src/content/campaigns.ts`.
- Responsibilities: Static parameter generation, campaign lookup, index/noindex metadata, and compact lead capture.

**Lead Server Action:**
- Location: `src/app/actions/leads.ts`
- Triggers: Form submissions from `src/components/forms/LeadForm.tsx` through `useActionState`.
- Responsibilities: Validate and normalize untrusted form data, sanitize attribution, route the lead, and return UI-safe status.

**Metadata Endpoints:**
- Location: `src/app/sitemap.ts`, `src/app/robots.ts`
- Triggers: Requests for `/sitemap.xml` and `/robots.txt`.
- Responsibilities: Enumerate public/indexable routes and block indexing until `NEXT_PUBLIC_SITE_URL` is configured.

## Architectural Constraints

- **Rendering boundary:** Default to server components under `src/app/` and `src/components/`; only modules that need hooks, browser storage, or event handlers may declare `"use client"`, following `src/components/forms/LeadForm.tsx` and `src/components/trucks/TruckFinder.tsx`.
- **Threading:** Application code assumes the Next.js request/runtime model. Do not rely on long-lived background threads or in-memory request persistence in `src/app/actions/leads.ts` or `src/lib/leads/router.ts`.
- **Global state:** Static module constants in `src/content/*.ts` and `src/lib/analytics.ts` are immutable configuration/data. Browser-global analytics functions are declared and accessed only through `src/lib/analytics.ts` and installed by `src/components/marketing/MarketingTags.tsx`.
- **Persistence:** No database, CMS, upload store, or local PII store exists. All production lead delivery must stay behind `src/lib/leads/router.ts`; the fallback deliberately discards submissions after validation.
- **Content trust:** Publish branch/product/promotional/customer data through typed modules in `src/content/`; empty approved-data collections in `src/content/promotions.ts` and `src/content/deliveries.ts` intentionally render honest empty states.
- **URL origin:** Generate public absolute URLs only through `src/lib/site-url.ts`; `src/app/robots.ts` depends on the same configuration to prevent accidental indexing with a localhost origin.
- **Import direction:** Routes may depend on components, content, and libraries; components may depend on content and libraries; content should remain independent. No circular import chain is present in the inspected `src/` imports.
- **Styling:** All component class contracts currently resolve through the single global stylesheet `src/app/globals.css`; changing a shared class can affect routes across `src/app/` and components across `src/components/`.

## Anti-Patterns

### Duplicated Route Registries

**What happens:** Public route paths are manually listed separately in `src/app/sitemap.ts` and `tests/foundation.test.mjs`, while filesystem routing is independently defined under `src/app/`.
**Why it's wrong:** Adding or renaming a route can leave sitemap coverage or foundation checks stale even though the page itself builds.
**Do this instead:** When route growth warrants it, centralize the explicit public-route catalog in a non-framework module under `src/lib/` and consume it from `src/app/sitemap.ts` and `tests/foundation.test.mjs`; continue deriving dynamic truck/campaign paths from `src/content/trucks.ts` and `src/content/campaigns.ts`.

### Large Inline Route Markup

**What happens:** Several route components place full-page JSX and copy on one long return expression, notably `src/app/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, and `src/app/trucks/[slug]/page.tsx`.
**Why it's wrong:** Content boundaries, review diffs, and reusable section extraction become harder to see, and route modules take on presentation detail that belongs in component/content layers.
**Do this instead:** Keep route-level composition in `src/app/`, but extract repeated or semantically independent sections to the relevant folder under `src/components/` and move reusable structured copy into `src/content/`, following `src/components/marketing/InquiryPage.tsx` and `src/content/trucks.ts`.

### Shared UI Grab Bag

**What happens:** Unrelated primitives are co-located in `src/components/ui/Shared.tsx` and imported as a multi-purpose module throughout `src/app/`.
**Why it's wrong:** The module becomes a broad dependency and makes per-component ownership, focused testing, and future client/server boundary changes harder.
**Do this instead:** Keep new primitives server-compatible, but place them in focused files under `src/components/ui/` once the set grows; preserve the current named-export API during migration from `src/components/ui/Shared.tsx`.

## Error Handling

**Strategy:** Convert expected user/content failures into framework or typed UI states, and contain integration failures at the server-action boundary.

**Patterns:**
- Use `notFound()` for unknown dynamic records after typed content lookup in `src/app/trucks/[slug]/page.tsx` and `src/app/lp/[slug]/page.tsx`; render the shared fallback in `src/app/not-found.tsx`.
- Return structured validation errors through `LeadFormState` from `src/app/actions/leads.ts` rather than throwing expected input failures.
- Catch malformed attribution JSON and reduce it to an empty allow-listed object in `src/app/actions/leads.ts`; browser session parsing follows the same safe fallback in `src/lib/attribution.ts`.
- Throw provider rejection inside `src/lib/leads/router.ts`, then translate it into a generic retry/call message in `src/app/actions/leads.ts` so provider details are not exposed to the client.
- Fall back to the localhost origin on missing or invalid configuration in `src/lib/site-url.ts`, paired with indexing denial in `src/app/robots.ts` when production origin is absent.

## Cross-Cutting Concerns

**Logging:** No server logging framework is present; `src/app/actions/leads.ts` deliberately avoids logging personal data, and browser measurement is isolated to typed, PII-free events in `src/lib/analytics.ts`.

**Validation:** Treat all form data as untrusted in `src/app/actions/leads.ts`; derive field validation from `src/lib/leads/fields.ts`, enforce consent and length bounds with Zod, and allow-list attribution keys from `src/lib/attribution.ts`.

**Authentication:** Not applicable to the public site. No authenticated routes or identity provider exist under `src/app/`; abuse protection is limited to the honeypot in `src/components/forms/LeadForm.tsx`.

**SEO:** Route metadata must use `src/lib/seo.ts`, absolute URL generation must use `src/lib/site-url.ts`, and structured data should render through `JsonLd` in `src/components/ui/Shared.tsx`.

**Privacy:** Do not pass contact details or free-text lead fields to `src/lib/analytics.ts`; only sanctioned attribution keys and typed event properties flow through measurement code in `src/components/marketing/`.

---

*Architecture analysis: 2026-08-18*
