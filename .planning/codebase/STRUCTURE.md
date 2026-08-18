# Codebase Structure

**Analysis Date:** 2026-08-18

## Directory Layout

```text
HINO-CEBU Jay Project/
├── public/                         # Browser-served static assets
│   ├── favicon.svg                 # Site icon
│   ├── social-card.svg             # Default social preview image
│   └── images/official/            # Approved Hino logo/product/program images
├── src/
│   ├── app/                        # Next.js App Router, metadata, styles, server action
│   │   ├── actions/leads.ts        # Lead validation and routing server action
│   │   ├── (public)/                # Public-shell route group
│   │   │   ├── contact/page.tsx    # Governed `/contact` route
│   │   │   └── hino-cebu/page.tsx  # Governed `/hino-cebu` route
│   │   ├── financing/page.tsx      # Shared inquiry route
│   │   ├── find-your-truck/page.tsx# Truck finder route
│   │   ├── fleet/page.tsx          # Shared inquiry route
│   │   ├── guides/page.tsx         # Guide listing route
│   │   ├── hino-cebu/              # Customer-delivery routes
│   │   ├── lp/[slug]/page.tsx      # Data-driven campaign route template
│   │   ├── parts/page.tsx          # Shared inquiry route
│   │   ├── promotions/page.tsx     # Active-promotion listing route
│   │   ├── quote/page.tsx          # Sales lead route
│   │   ├── service/page.tsx        # Shared inquiry route
│   │   ├── trucks/[slug]/page.tsx  # Data-driven truck detail template
│   │   ├── trucks/page.tsx         # Truck catalog route
│   │   ├── layout.tsx              # Root document shell
│   │   ├── page.tsx                # Home route
│   │   ├── globals.css             # Global tokens and component styles
│   │   ├── not-found.tsx           # App Router 404 UI
│   │   ├── robots.ts               # Dynamic robots metadata endpoint
│   │   └── sitemap.ts              # Dynamic sitemap metadata endpoint
│   ├── components/
│   │   ├── forms/                  # Reusable lead form renderer
│   │   ├── layout/                 # Header, footer, mobile actions
│   │   ├── marketing/              # Inquiry layout, tracking, attribution, provider tags
│   │   ├── trucks/                 # Truck cards and recommendation UI/rules
│   │   └── ui/                     # Generic visual/page primitives
│   ├── content/                    # Typed repository-managed site content
│   └── lib/
│       ├── leads/                  # Lead contract, fields, destination adapter
│       ├── analytics.ts            # Typed browser measurement facade
│       ├── attribution.ts          # Session attribution capture
│       ├── seo.ts                  # Metadata and schema factories
│       └── site-url.ts             # Environment-aware absolute URLs
├── tests/                          # Native Node structural/foundation tests
├── .planning/codebase/             # Generated codebase reference documents
├── ASSET_REQUIREMENTS.md           # Asset inventory and approval requirements
├── BUSINESS_INPUTS_REQUIRED.md     # Production business-data checklist
├── SOURCE_REGISTER.md              # Content/asset provenance register
├── IMPLEMENTATION_PLAN.md          # Implementation status and phases
├── README.md                       # Setup, architecture, operations guidance
├── eslint.config.mjs               # ESLint flat configuration
├── next.config.ts                  # Next.js and response-header configuration
├── package.json                    # Scripts and dependency manifest
├── package-lock.json               # npm dependency lockfile
└── tsconfig.json                   # Strict TypeScript and `@/*` alias configuration
```

Generated or dependency directories `.next/` and `node_modules/` exist locally but are excluded by `.gitignore`; `.env` and `.env.local` are also ignored and their contents are outside the code structure.

## Directory Purposes

**`src/app/`:**
- Purpose: Own URL structure and all Next.js framework entry points.
- Contains: Server component pages, dynamic route segments, the root layout, server action, global CSS, sitemap, robots, and 404 handling.
- Key files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/actions/leads.ts`, `src/app/trucks/[slug]/page.tsx`, `src/app/lp/[slug]/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`.
- Placement rule: Add URL-facing modules here; keep reusable presentation and domain logic in `src/components/` and `src/lib/`.

**`src/components/`:**
- Purpose: Own reusable React presentation and explicit client interaction boundaries.
- Contains: Feature-oriented subdirectories rather than a flat component list.
- Key files: `src/components/forms/LeadForm.tsx`, `src/components/marketing/InquiryPage.tsx`, `src/components/trucks/TruckFinder.tsx`, `src/components/layout/Header.tsx`, `src/components/ui/Shared.tsx`.
- Placement rule: Choose the narrowest feature folder; create a new feature subdirectory when a component does not belong to forms, layout, marketing, trucks, or generic UI.

**`src/components/layout/`:**
- Purpose: Own components rendered across most or all routes by the root layout.
- Contains: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/StickyMobileActions.tsx`.
- Key files: All three files are composed by `src/app/layout.tsx`.
- Placement rule: Put only site-shell/navigation components here; route-specific sections belong elsewhere under `src/components/`.

**`src/components/marketing/`:**
- Purpose: Own reusable inquiry composition, tracked links, campaign attribution capture, and optional provider script installation.
- Contains: `src/components/marketing/InquiryPage.tsx`, `src/components/marketing/TrackedLink.tsx`, `src/components/marketing/AttributionCapture.tsx`, `src/components/marketing/MarketingTags.tsx`.
- Key files: `src/components/marketing/InquiryPage.tsx` is the common route template for sales/support inquiry pages; `src/components/marketing/MarketingTags.tsx` is the provider-loading boundary.
- Placement rule: Keep browser vendor globals out of route pages; route analytics through `src/lib/analytics.ts` and provider installation through this directory.

**`src/components/forms/`:**
- Purpose: Own shared user-input rendering and client form lifecycle.
- Contains: `src/components/forms/LeadForm.tsx`.
- Key files: `src/components/forms/LeadForm.tsx` consumes field definitions from `src/lib/leads/fields.ts` and calls `src/app/actions/leads.ts`.
- Placement rule: Add lead-form UI behavior here; put server validation in `src/app/actions/` and vendor routing in `src/lib/leads/`.

**`src/components/trucks/`:**
- Purpose: Own truck-specific display and decision-support interfaces.
- Contains: `src/components/trucks/TruckCard.tsx`, `src/components/trucks/TruckFinder.tsx`.
- Key files: `src/components/trucks/TruckFinder.tsx` includes the current recommendation rules and client state.
- Placement rule: Put truck-domain visual components here; canonical truck facts remain in `src/content/trucks.ts`.

**`src/components/ui/`:**
- Purpose: Own feature-neutral, server-compatible page primitives.
- Contains: `src/components/ui/Shared.tsx` with containers, headings, breadcrumbs, CTA band, placeholders, and JSON-LD rendering.
- Key files: `src/components/ui/Shared.tsx`.
- Placement rule: Add generic primitives here and avoid domain data access; split focused component files out of `Shared.tsx` as the set grows.

**`src/content/`:**
- Purpose: Act as the typed, Git-managed content repository and source of business/product truth for rendering.
- Contains: `src/content/businessApplications.ts`, `src/content/campaigns.ts`, `src/content/deliveries.ts`, `src/content/guides.ts`, `src/content/promotions.ts`, `src/content/services.ts`, `src/content/site.ts`, `src/content/trucks.ts`.
- Key files: `src/content/site.ts` for branch identity/navigation/external source URLs; `src/content/trucks.ts` for truck detail records; `src/content/campaigns.ts` for paid landing pages.
- Placement rule: Add structured, reusable approved content here; do not couple these modules to React, Next.js, browser APIs, or provider SDKs.

**`src/lib/`:**
- Purpose: Own reusable application/domain helpers that are not React components or route entry points.
- Contains: Analytics, attribution, SEO, URL utilities, and the nested lead domain/integration boundary.
- Key files: `src/lib/analytics.ts`, `src/lib/attribution.ts`, `src/lib/seo.ts`, `src/lib/site-url.ts`, `src/lib/leads/types.ts`, `src/lib/leads/fields.ts`, `src/lib/leads/router.ts`.
- Placement rule: Put pure or platform-facing utilities here; keep browser-only execution guarded as in `src/lib/analytics.ts` and `src/lib/attribution.ts`.

**`src/lib/leads/`:**
- Purpose: Own the lead domain contract, per-type field catalog, and outbound routing adapter.
- Contains: `src/lib/leads/types.ts`, `src/lib/leads/fields.ts`, `src/lib/leads/router.ts`.
- Key files: `src/lib/leads/types.ts` is the contract root; `src/lib/leads/router.ts` is the only current destination adapter.
- Placement rule: Add provider adapters here behind `LeadRouter`; do not import vendor-specific code into `src/components/forms/LeadForm.tsx` or `src/app/actions/leads.ts`.

**`public/`:**
- Purpose: Hold static files addressed from the public URL root.
- Contains: `public/favicon.svg`, `public/social-card.svg`, and approved images under `public/images/official/`.
- Key files: `public/images/official/hino-logo.png`, `public/images/official/hino-200.jpg`, `public/images/official/hino-300.jpg`, `public/images/official/hino-500.jpg`.
- Placement rule: Put approved static assets under an ownership/provenance-specific subdirectory and reference them as `/images/...` from `src/content/` or components.

**`tests/`:**
- Purpose: Hold repository-level tests outside production source.
- Contains: `tests/foundation.test.mjs`, which verifies route/asset existence and a small set of content/configuration invariants.
- Key files: `tests/foundation.test.mjs`.
- Placement rule: Continue using `*.test.mjs` here for Node-native structural tests; colocate component/unit tests only if the test toolchain changes and the convention is documented.

**Root documentation:**
- Purpose: Record project setup, business dependencies, source provenance, and implementation expectations.
- Contains: `README.md`, `ASSET_REQUIREMENTS.md`, `BUSINESS_INPUTS_REQUIRED.md`, `SOURCE_REGISTER.md`, `IMPLEMENTATION_PLAN.md`, and the two Hino specification/prompt documents at repository root.
- Key files: `README.md`, `SOURCE_REGISTER.md`, `BUSINESS_INPUTS_REQUIRED.md`.
- Placement rule: Keep developer operating instructions in `README.md`, source evidence in `SOURCE_REGISTER.md`, and business-launch inputs in `BUSINESS_INPUTS_REQUIRED.md`; application runtime code must stay under `src/`.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Global App Router document shell and site-wide component composition.
- `src/app/page.tsx`: `/` route.
- `src/app/**/page.tsx`: Filesystem-defined static public routes.
- `src/app/trucks/[slug]/page.tsx`: Data-driven truck-detail route family.
- `src/app/lp/[slug]/page.tsx`: Data-driven campaign landing-page route family.
- `src/app/actions/leads.ts`: Server-only form submission entry point.
- `src/app/sitemap.ts`: `/sitemap.xml` metadata route.
- `src/app/robots.ts`: `/robots.txt` metadata route.

**Configuration:**
- `package.json`: npm lifecycle commands and runtime/development dependencies.
- `package-lock.json`: Exact npm dependency resolution.
- `tsconfig.json`: Strict TypeScript, bundler module resolution, Next.js plugin, and `@/*` → `src/*` alias.
- `next.config.ts`: React strict mode, framework header suppression, and global security response headers.
- `eslint.config.mjs`: ESLint flat config extending Next.js core-web-vitals and TypeScript rules.
- `.env.example`: Environment-variable names and safe setup placeholders; do not put secret values in committed code or documentation.
- `.gitignore`: Excludes `.next/`, `node_modules/`, local environment files, Vercel state, logs, and TypeScript build info.

**Core Logic:**
- `src/app/actions/leads.ts`: Dynamic Zod validation and lead orchestration.
- `src/lib/leads/fields.ts`: Single field catalog shared by client rendering and server validation.
- `src/lib/leads/router.ts`: Webhook integration and non-persisting development fallback.
- `src/lib/leads/types.ts`: `LeadType`, `LeadSubmission`, and `LeadRouter` contracts.
- `src/components/trucks/TruckFinder.tsx`: Rules-based recommendation scoring and interaction.
- `src/lib/attribution.ts`: Allow-listed session attribution.
- `src/lib/analytics.ts`: Typed event vocabulary and provider-neutral event emission.
- `src/lib/seo.ts`: Route metadata and breadcrumb schema factories.

**Content:**
- `src/content/site.ts`: Branch identity, navigation, social links, and reviewed official source URLs.
- `src/content/trucks.ts`: Truck types, records, FAQs, and slug lookup.
- `src/content/campaigns.ts`: Landing-page records and indexability flags.
- `src/content/promotions.ts`: Date-aware published promotion filtering.
- `src/content/deliveries.ts`: Approval-aware delivery story collection.
- `src/content/guides.ts`, `src/content/services.ts`, `src/content/businessApplications.ts`: Home/list-page content collections.

**Testing:**
- `tests/foundation.test.mjs`: Native Node test suite for route foundation, origin configuration, approved empty states, disabled uploads, and required assets.
- `package.json`: `test`, `lint`, `typecheck`, `build`, and aggregate `check` commands.

## Naming Conventions

**Files:**
- Use Next.js reserved lowercase names for framework entries: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts`.
- Use PascalCase filenames for React components with matching named exports: `src/components/forms/LeadForm.tsx`, `src/components/trucks/TruckCard.tsx`, `src/components/layout/StickyMobileActions.tsx`.
- Use camelCase filenames for content and utility modules: `src/content/businessApplications.ts`, `src/lib/site-url.ts` (kebab-case only where the semantic module name is a hyphenated phrase), `src/lib/analytics.ts`.
- Use `*.test.mjs` for the existing Node test convention: `tests/foundation.test.mjs`.
- Use uppercase descriptive Markdown names for project control/reference documents: `SOURCE_REGISTER.md`, `BUSINESS_INPUTS_REQUIRED.md`, `.planning/codebase/ARCHITECTURE.md`.

**Directories:**
- Use lowercase route segments matching public URLs: `src/app/find-your-truck/`, `src/app/hino-cebu/customer-deliveries/`.
- Use square brackets for dynamic App Router parameters: `src/app/trucks/[slug]/`, `src/app/lp/[slug]/`.
- Use lowercase feature nouns for component grouping: `src/components/marketing/`, `src/components/trucks/`, `src/components/forms/`.
- Use plural domain collection names where modules export collections: `src/content/trucks.ts`, `src/content/campaigns.ts`, `src/content/promotions.ts`.

**Imports and Exports:**
- Use `@/` absolute imports across `src/` directory boundaries, as configured in `tsconfig.json`; examples are `@/content/site` in `src/components/layout/Header.tsx` and `@/lib/seo` in route pages.
- Use relative imports only inside a cohesive local module family, as in `src/lib/leads/router.ts` importing `./types`.
- Use default exports only where Next.js requires route/layout conventions in `src/app/`; use named exports for components, content, types, and helpers in `src/components/`, `src/content/`, and `src/lib/`.

## Where to Add New Code

**New Static Page:**
- Primary code: `src/app/<route-segment>/page.tsx`.
- Shared page sections: the appropriate feature directory under `src/components/`; use `src/components/ui/` only for domain-neutral primitives.
- Metadata: export metadata created by `src/lib/seo.ts` from the new `page.tsx`.
- Sitemap registration: `src/app/sitemap.ts` when the route is intended to be indexable.
- Foundation coverage: add the expected route to `tests/foundation.test.mjs`.

**New Data-Driven Route Family:**
- Route template: `src/app/<collection>/[slug]/page.tsx`, following `src/app/trucks/[slug]/page.tsx`.
- Typed content: `src/content/<collection>.ts`, following `src/content/trucks.ts` or `src/content/campaigns.ts`.
- Static paths and metadata: export `generateStaticParams` and `generateMetadata` from the route template.
- Invalid record handling: call `notFound()` so `src/app/not-found.tsx` renders the fallback.

**New Inquiry Type:**
- Domain union and submission contract: `src/lib/leads/types.ts`.
- Field metadata: `src/lib/leads/fields.ts`.
- Server allow-list/validation orchestration: `src/app/actions/leads.ts`.
- Form event mapping: `src/components/forms/LeadForm.tsx`.
- Shared inquiry route composition: reuse `src/components/marketing/InquiryPage.tsx` from a new `src/app/<route>/page.tsx`.

**New Lead Destination:**
- Adapter implementation: `src/lib/leads/`, implementing `LeadRouter` from `src/lib/leads/types.ts`.
- Adapter selection: `src/lib/leads/router.ts`.
- Environment documentation: `.env.example` for a safe placeholder name and `README.md` for configuration behavior; never commit values.
- Server-action caller: keep `src/app/actions/leads.ts` dependent only on the selected `leadRouter`, not the provider implementation.

**New Component/Module:**
- Global shell/navigation: `src/components/layout/`.
- Marketing, inquiry, attribution, or measurement UI: `src/components/marketing/`.
- Form UI: `src/components/forms/`.
- Truck-domain UI: `src/components/trucks/`.
- Generic stateless UI: `src/components/ui/`.
- New feature domain: create `src/components/<feature>/` rather than placing unrelated code in `src/components/ui/Shared.tsx`.

**New Structured Content:**
- Site-wide branch/navigation data: `src/content/site.ts`.
- Existing domain record: append to the matching `src/content/*.ts` collection after approval/source review.
- New content domain: `src/content/<pluralDomain>.ts`, exporting its type and typed collection.
- Supporting approved asset: `public/images/<provenance-or-domain>/`; follow the current official-source convention in `public/images/official/`.

**Utilities:**
- Shared pure/platform helpers: `src/lib/<concern>.ts`.
- Domain-specific related files: `src/lib/<domain>/`, following `src/lib/leads/`.
- URL and canonical logic: extend `src/lib/site-url.ts` and `src/lib/seo.ts` instead of rebuilding URLs inside routes.
- Browser measurement: extend the event union and facade in `src/lib/analytics.ts`; provider loading remains in `src/components/marketing/MarketingTags.tsx`.

**Tests:**
- Repository structural/invariant tests: `tests/<concern>.test.mjs`, following `tests/foundation.test.mjs`.
- Route existence expectations: `tests/foundation.test.mjs`.
- Test command registration: `package.json` only if the runner or file glob changes.

## Special Directories

**`src/app/`:**
- Purpose: Next.js filesystem router and server entry points.
- Generated: No.
- Committed: Yes.
- Constraint: Folder/file names form public URLs and framework behavior; preserve reserved filenames such as `page.tsx`, `layout.tsx`, and `not-found.tsx`.

**`public/images/official/`:**
- Purpose: Approved brand, product, parts, service, and financing images referenced by `src/content/trucks.ts` and inquiry routes under `src/app/`.
- Generated: No.
- Committed: Yes.
- Constraint: Keep source/provenance updates aligned with `SOURCE_REGISTER.md`.

**`.planning/codebase/`:**
- Purpose: Store generated codebase maps used by planning and execution workflows.
- Generated: Yes, by GSD mapping.
- Committed: Intended to be committed by the orchestrator; this mapper does not commit.
- Constraint: Treat `ARCHITECTURE.md` and `STRUCTURE.md` as references to current paths, not runtime inputs.

**`.next/`:**
- Purpose: Next.js development/build output and generated route/type artifacts.
- Generated: Yes.
- Committed: No; excluded by `.gitignore`.
- Constraint: Never add source changes here; edit `src/` or configuration instead.

**`node_modules/`:**
- Purpose: Installed npm dependencies.
- Generated: Yes, from `package-lock.json`.
- Committed: No; excluded by `.gitignore`.
- Constraint: Never patch dependency files directly; change `package.json`/lockfile through npm workflows.

---

*Structure analysis: 2026-08-18*
