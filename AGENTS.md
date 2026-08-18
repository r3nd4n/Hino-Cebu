<!-- GSD:project-start source:PROJECT.md -->

## Project

**Hino Cebu Digital Growth Website**

Hino Cebu's local-first digital sales, service, parts, financing, fleet-support, and trust hub for commercial truck buyers and owners in Cebu. The current repository contains a working Next.js MVP; this project now focuses on turning that implementation into a verified, reliable, measurable production website and then growing it into the strongest useful answer for local commercial-truck intent.

The site supports owner-operators, SMEs, fleet managers, existing Hino owners, and research-stage buyers. It complements Hino Philippines as the national authority without copying its website or competing for corporate brand ownership.

**Core Value:** Qualified Cebu prospects can confidently find the right Hino product or support service and complete a reliable, attributable inquiry that reaches the appropriate Hino Cebu team.

### Constraints

- **Existing architecture**: Preserve the sound Next.js App Router, typed repository-content, server-first rendering, and integration-adapter patterns — avoid unnecessary rewrites.
- **Hosting**: Production is intended for a Vercel plan that permits commercial use — the free Hobby plan must not be assumed suitable.
- **Domain**: The production domain is not yet approved — all canonical, sitemap, Open Graph, structured-data, and redirect origins must remain environment-driven through `NEXT_PUBLIC_SITE_URL`.
- **Cost**: Keep recurring infrastructure minimal and prefer static generation, repository content, and already-owned/free marketing tools — discretionary budget should favor acquisition, content, photography, and conversion improvement.
- **Content truth**: Do not publish unverified local facts, inventory, pricing, specifications, availability, promotions, financing terms, warranties, testimonials, or authorization claims — production facts require a source and approval trail.
- **Brand and licensing**: Hino marks, model names, brochures, photography, and customer material require authorized usage and applicable releases — no copied national-site content or unlicensed assets.
- **Performance**: Mobile performance is a marketing requirement — minimize JavaScript, optimize responsive media, avoid layout shift, and gate third-party scripts.
- **Accessibility**: Target WCAG 2.2 AA practices across navigation, forms, error handling, focus, contrast, reduced motion, semantics, and touch interactions.
- **Security and privacy**: Validate and sanitize server-side, prevent abuse, protect secrets and PII, use security headers, and keep analytics payloads free of sensitive lead data.
- **Measurement**: Do not scale paid acquisition until landing page, source, campaign, lead type, completion, and high-intent click data are reliably captured and can be reconciled operationally.
- **Approval dependencies**: Production launch depends on verified stakeholder, legal, brand, routing, analytics, domain, and content inputs outside the codebase.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 6.0.x - Application routes, React components, content models, server actions, and utility modules under `src/`; strict type checking is configured in `tsconfig.json`.
- TSX (TypeScript with JSX) - React Server and Client Components in `src/app/` and `src/components/`.
- CSS - Global design tokens, layout, component, and responsive styling in `src/app/globals.css`; no CSS framework or preprocessor is present.
- JavaScript (ES modules) - Native Node.js tests in `tests/foundation.test.mjs` and tooling configuration in `eslint.config.mjs`.
- JSON - Package metadata and compiler configuration in `package.json`, `package-lock.json`, and `tsconfig.json`.

## Runtime

- Node.js 20.9.0 or newer - Required by Next.js 16.3.1 and documented in `README.md`; the inspected development environment runs Node.js 24.14.0.
- Browser runtime - Client Components use React state, `sessionStorage`, URL search parameters, and optional marketing globals in `src/components/` and `src/lib/attribution.ts`.
- Next.js server runtime - Server Actions and server-rendered App Router routes execute through Next.js; the lead boundary is `src/app/actions/leads.ts`.
- npm - Commands and setup are defined in `package.json` and `README.md`; the inspected npm version is 8.17.0.
- Lockfile: present at `package-lock.json` (lockfile version 2).

## Frameworks

- Next.js 16.3.1 - App Router, React Server Components, Server Actions, metadata, image optimization, sitemap, robots, static generation, and production server; configured in `next.config.ts`.
- React 19.2.8 - UI rendering and client state in `src/app/` and `src/components/`.
- React DOM 19.2.8 - Browser DOM renderer paired with React.
- Plain CSS - Repository-local styling in `src/app/globals.css`; there is no Tailwind, Sass, CSS-in-JS, or component-library dependency.
- Node.js built-in test runner (`node:test`) - Foundation and source-contract tests in `tests/foundation.test.mjs`.
- Node.js strict assertions (`node:assert/strict`) - Assertions in `tests/foundation.test.mjs`.
- Next.js CLI 16.3.1 - `next dev`, `next build`, and `next start` scripts in `package.json`.
- TypeScript 6.0.x - Static checking via `tsc --noEmit`; project settings are in `tsconfig.json`.
- ESLint 9.39.x - Lint runner via `eslint .`; flat configuration is in `eslint.config.mjs`.
- `eslint-config-next` 16.3.1 - Next.js Core Web Vitals and TypeScript lint presets in `eslint.config.mjs`.
- SWC binaries supplied by Next.js - Platform-specific compilation dependencies are recorded in `package-lock.json`.

## Key Dependencies

- `next` 16.3.1 - Owns routing, rendering, build output, metadata endpoints, scripts, links, and images across `src/app/` and `src/components/`.
- `react` 19.2.8 and `react-dom` 19.2.8 - Own component rendering and interactive form/truck-finder behavior.
- `zod` 4.4.3 - Builds and executes server-side lead schemas in `src/app/actions/leads.ts`.
- `@types/node` 26.2.0 - Node.js types used by the TypeScript toolchain.
- `@types/react` 19.2.18 and `@types/react-dom` 19.2.4 - React type declarations.
- No ORM, database driver, cloud SDK, CMS SDK, authentication SDK, email SDK, upload SDK, logging SDK, or test package is declared in `package.json`.

## Configuration

- Environment variable names and their intended roles are documented in `README.md`; an `.env.example` file is present, but environment-file contents are not part of this audit.
- Set `NEXT_PUBLIC_SITE_URL` for production canonical URLs, Open Graph URLs, JSON-LD, sitemap, and robots behavior through `src/lib/site-url.ts`, `src/app/robots.ts`, and `src/app/sitemap.ts`.
- `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, and `NEXT_PUBLIC_META_PIXEL_ID` optionally enable browser marketing tags in `src/components/marketing/MarketingTags.tsx` and event dispatch in `src/lib/analytics.ts`.
- `LEAD_ROUTING_WEBHOOK_URL` enables server-side lead delivery in `src/lib/leads/router.ts`; without it the development adapter acknowledges but does not persist submissions.
- `ENABLE_UPLOADS` is documented as reserved in `README.md`; no source file consumes it and uploads remain disabled in `src/components/forms/LeadForm.tsx`.
- `.env` and `.env.local` are excluded by `.gitignore`; keep environment-specific values outside version control.
- `next.config.ts` enables React strict mode, disables the `X-Powered-By` header, and adds security-oriented response headers.
- `tsconfig.json` targets ES2017, uses bundler module resolution, enables strict/no-emit/incremental compilation, and maps `@/*` to `src/*`.
- `eslint.config.mjs` composes Next.js Core Web Vitals and TypeScript presets and ignores generated build outputs.
- `package.json` provides `dev`, `build`, `start`, `lint`, `typecheck`, `test`, and aggregate `check` commands.
- Generated Next.js and TypeScript artifacts live in `.next/`, `next-env.d.ts`, and `tsconfig.tsbuildinfo`; `.next/` and `*.tsbuildinfo` are ignored by `.gitignore`.

## Platform Requirements

- Use Node.js 20.9.0 or newer and npm as specified in `README.md`.
- Install from `package-lock.json` and run `npm run dev`; the default local origin is `http://localhost:3000` in `src/lib/site-url.ts`.
- Run `npm run check` to execute linting, strict type checking, native Node tests, and a production Next.js build as defined in `package.json`.
- Network access is required only when exercising configured external marketing scripts, official outbound links, or the lead webhook; normal repository content is stored under `src/content/` and `public/`.
- The documented deployment target is Vercel in `README.md`; no `vercel.json` is required or present.
- A production deployment requires an exact HTTPS `NEXT_PUBLIC_SITE_URL`; `src/app/robots.ts` disallows crawling when that variable is absent.
- Production form delivery requires an approved HTTPS endpoint in `LEAD_ROUTING_WEBHOOK_URL`; no leads are persisted locally by `src/lib/leads/router.ts`.
- Configure Preview and Production environment values separately in the hosting platform as directed by `README.md`.

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Use PascalCase for reusable React component modules: `src/components/forms/LeadForm.tsx`, `src/components/trucks/TruckCard.tsx`, and `src/components/ui/Shared.tsx`.
- Use lowercase framework filenames for Next.js App Router entries: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts`.
- Use lowercase camelCase for content modules named after their exported collection: `src/content/businessApplications.ts`, `src/content/promotions.ts`, and `src/content/trucks.ts`.
- Use lowercase or kebab-case for library modules: `src/lib/analytics.ts`, `src/lib/attribution.ts`, and `src/lib/site-url.ts`.
- Name tests `<subject>.test.mjs`; the current repository contract suite is `tests/foundation.test.mjs`.
- Use camelCase for utilities and domain operations: `getSiteOrigin` and `absoluteUrl` in `src/lib/site-url.ts`, `createMetadata` and `breadcrumbSchema` in `src/lib/seo.ts`, and `activePromotions` in `src/content/promotions.ts`.
- Use PascalCase for React components: `LeadForm` in `src/components/forms/LeadForm.tsx`, `TruckFinder` in `src/components/trucks/TruckFinder.tsx`, and `RootLayout` in `src/app/layout.tsx`.
- Use framework-prescribed names for route hooks and metadata functions: `generateStaticParams` and `generateMetadata` in `src/app/trucks/[slug]/page.tsx`.
- Use action-oriented handler names for server operations, such as `submitLead` in `src/app/actions/leads.ts`.
- Use camelCase for local state, derived values, and module constants: `searchParams`, `attributionRef`, `sourceCta`, and `simpleEmail` in `src/components/forms/LeadForm.tsx` and `src/app/actions/leads.ts`.
- Use SCREAMING_SNAKE_CASE only for true module-level constants intended as stable identifiers: `LOCAL_ORIGIN` in `src/lib/site-url.ts` and `ATTRIBUTION_STORAGE_KEY` in `src/lib/attribution.ts`.
- Give exported data collections plural nouns: `trucks` in `src/content/trucks.ts`, `campaigns` in `src/content/campaigns.ts`, and `supportServices` in `src/content/services.ts`.
- Use boolean names that read as conditions: `isPublished` in `src/content/promotions.ts`, `approved` in `src/content/deliveries.ts`, and derived `complete` in `src/components/trucks/TruckFinder.tsx`.
- Use PascalCase for types and interfaces: `Truck` in `src/content/trucks.ts`, `LeadSubmission` and `LeadRouter` in `src/lib/leads/types.ts`, and `MetadataInput` in `src/lib/seo.ts`.
- Model closed domains with string-literal unions or `as const` arrays: `LeadType` in `src/lib/leads/types.ts` and `AnalyticsEvent` in `src/lib/analytics.ts`.
- Derive types from canonical values when possible; `AnalyticsEvent` is derived from `analyticsEvents` in `src/lib/analytics.ts`, and `Attribution` is derived from `attributionKeys` in `src/lib/attribution.ts`.
- Use `Record` for keyed configuration and payload maps: `leadFields` in `src/lib/leads/fields.ts`, `events` in `src/components/forms/LeadForm.tsx`, and lead validation maps in `src/app/actions/leads.ts`.

## Code Style

- No dedicated formatter configuration is present; `.prettierrc*`, `prettier.config.*`, `biome.json`, and `.editorconfig` are not detected at the repository root.
- Follow the established TypeScript style: double quotes, semicolons, two-space indentation, trailing commas in multiline objects/arrays, and braces for multiline control flow. Representative files are `src/lib/seo.ts` and `src/app/actions/leads.ts`.
- Keep arrays and object literals multiline when they carry domain content, as in `src/content/trucks.ts`; compact, closely related type fields may share a line, as in `src/lib/leads/fields.ts`.
- JSX is frequently compact and returned directly, including one-line route components such as `src/app/service/page.tsx` and dense shared primitives in `src/components/ui/Shared.tsx`. When modifying a file, preserve its local layout rather than mechanically reformatting unrelated JSX.
- Put `"use client"` or `"use server"` first, followed by a blank line, as shown in `src/components/forms/LeadForm.tsx` and `src/app/actions/leads.ts`.
- Run ESLint 9 through `npm run lint`; the script in `package.json` executes `eslint .`.
- Inherit Next.js Core Web Vitals and Next.js TypeScript rules from `eslint.config.mjs` via `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Keep generated output excluded through `globalIgnores` in `eslint.config.mjs`: `.next/**`, `out/**`, `build/**`, and `next-env.d.ts`.
- Keep TypeScript strict and emission-free according to `tsconfig.json`: `strict: true`, `noEmit: true`, `isolatedModules: true`, and `moduleResolution: "bundler"`.
- Run `npm run typecheck` separately because lint and type checking are distinct scripts in `package.json`.

## Import Organization

- Use `@/*` for imports rooted at `src/*`; the mapping is defined in `tsconfig.json`.
- Prefer `@/components/...`, `@/content/...`, `@/lib/...`, and `@/app/...` across directories. Examples include `@/lib/seo` in `src/app/page.tsx` and `@/app/actions/leads` in `src/components/forms/LeadForm.tsx`.
- Do not introduce barrel imports; the repository has no `index.ts` barrel modules. Import directly from the owning file.

## Error Handling

- Return expected validation and submission failures as typed state rather than throwing across the UI boundary. `submitLead` in `src/app/actions/leads.ts` returns `LeadFormState` with `status`, a user-safe `message`, and optional field `errors`.
- Validate untrusted form input server-side with Zod `safeParse`, then flatten issues into a single message per field in `src/app/actions/leads.ts`.
- Allow lower-level adapters to throw on transport failure, then translate failures at the server-action boundary. `src/lib/leads/router.ts` throws when the webhook response is not OK; `src/app/actions/leads.ts` catches it and returns a generic retry/call message.
- Fail safely for optional or malformed configuration. `src/lib/site-url.ts` catches invalid URL configuration and falls back to localhost; `src/lib/attribution.ts` catches malformed session JSON and returns an empty object.
- Do not expose raw provider errors or submitted personal data in UI messages or logs. The current catch blocks in `src/app/actions/leads.ts` intentionally discard internal error details.
- Use early returns for guard clauses and unsupported states, as in `src/app/actions/leads.ts`, `src/lib/analytics.ts`, and `src/content/promotions.ts`.

## Logging

- Do not log lead payloads, contact details, free-text messages, or attribution values. The development adapter in `src/lib/leads/router.ts` acknowledges submissions without persisting or logging personal data.
- Record browser measurement only through the typed `track` boundary in `src/lib/analytics.ts`.
- Add analytics event names to the `analyticsEvents` tuple in `src/lib/analytics.ts` before emitting them, so callers remain constrained by `AnalyticsEvent`.
- Keep analytics properties non-sensitive and primitive through `AnalyticsProperties` in `src/lib/analytics.ts`; filter `undefined` values before dispatch.

## Comments

- Comments are rare; prefer clear names and explicit types over narrating code.
- Add comments only for non-obvious intent or safety constraints. The development lead adapter comment in `src/lib/leads/router.ts` explains why it deliberately does not persist data and what production replacement requires.
- Preserve user-facing caveats as rendered copy rather than code comments when they affect business or legal behavior, as in `src/components/forms/LeadForm.tsx` and `src/app/privacy/page.tsx`.
- Not used in the current source tree. Public types and function signatures carry the contract instead, including `LeadRouter` in `src/lib/leads/types.ts` and `Truck` in `src/content/trucks.ts`.
- Do not add routine JSDoc that merely repeats a self-explanatory signature; use it only if a new API has constraints not representable in TypeScript.

## Function Design

- Keep pure helpers focused on one transformation: `absoluteUrl` in `src/lib/site-url.ts`, `activePromotions` in `src/content/promotions.ts`, and `recommend` in `src/components/trucks/TruckFinder.tsx`.
- Use early returns to keep environment checks and validation paths shallow, as in `track` in `src/lib/analytics.ts` and `submitLead` in `src/app/actions/leads.ts`.
- Route components commonly compose imported data and shared UI directly; reusable behavior belongs in `src/components/` or `src/lib/`, not duplicated across `src/app/**/page.tsx`.
- Keep side effects at explicit boundaries: browser storage in `src/lib/attribution.ts`, analytics dispatch in `src/lib/analytics.ts`, and lead transport in `src/lib/leads/router.ts`.
- Destructure React props in the function signature and provide defaults there, as in `CtaBand` in `src/components/ui/Shared.tsx` and `LeadForm` in `src/components/forms/LeadForm.tsx`.
- Use object parameters when a function needs several named inputs, as `createMetadata` does in `src/lib/seo.ts`.
- Use exact domain types for operations (`LeadType`, `LeadSubmission`, `Truck`) and use optional properties only where callers may legitimately omit values in `src/lib/leads/types.ts` and `src/content/trucks.ts`.
- Keep framework-required signatures intact, including promised `params`/`searchParams` in dynamic Next.js routes such as `src/app/trucks/[slug]/page.tsx` and `src/app/quote/page.tsx`.
- Return typed result objects for operations with multiple outcomes, such as `LeadFormState` in `src/app/actions/leads.ts` and rule objects from `recommend` in `src/components/trucks/TruckFinder.tsx`.
- Return safe empty values for unavailable browser state (`{}` in `src/lib/attribution.ts`) and `null` only for intentional non-rendering (`src/components/marketing/AttributionCapture.tsx`).
- Preserve pure data transformations where possible: `getTruck` returns the matching item or `undefined` in `src/content/trucks.ts`; route callers decide whether to invoke `notFound`.

## Module Design

- Use named exports for reusable components, utilities, types, and content collections throughout `src/components/`, `src/lib/`, and `src/content/`.
- Use default exports only where Next.js requires or conventionally expects route/layout components, such as `src/app/page.tsx`, `src/app/layout.tsx`, and `src/app/trucks/[slug]/page.tsx`.
- Keep module-level constants private unless callers need them. Validation details such as `leadTypes` and `simpleEmail` remain private in `src/app/actions/leads.ts`.
- Co-locate a type with the data or operation it describes when ownership is clear, such as `Promotion` with `promotions` in `src/content/promotions.ts`; use a dedicated types module for shared domain contracts, as in `src/lib/leads/types.ts`.
- Not used. No `index.ts`/`index.tsx` aggregation modules are present under `src/`.
- Add imports from concrete owners, for example `@/components/forms/LeadForm` and `@/lib/leads/types`, to keep dependencies explicit.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | Applies global shell, metadata base, organization JSON-LD, navigation, attribution capture, marketing tags, and mobile actions | `src/app/layout.tsx` |
| Static route pages | Compose content and reusable components for each public URL | `src/app/page.tsx`, `src/app/contact/page.tsx`, `src/app/quote/page.tsx` |
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

- Keep routes declarative: page modules in `src/app/**/page.tsx` select typed content and compose components rather than owning persistence or provider code.
- Keep most rendering server-side. Add `"use client"` only to browser-state boundaries such as `src/components/layout/Header.tsx`, `src/components/forms/LeadForm.tsx`, `src/components/trucks/TruckFinder.tsx`, `src/components/marketing/TrackedLink.tsx`, and `src/components/marketing/AttributionCapture.tsx`.
- Treat `src/content/*.ts` as the repository-backed content layer. Dynamic pages resolve records by slug from `src/content/trucks.ts` and `src/content/campaigns.ts`.
- Put integration details behind a domain contract. `LeadRouter` in `src/lib/leads/types.ts` is implemented by `src/lib/leads/router.ts`, while callers use only the exported `leadRouter`.
- Use the `@/*` alias for cross-directory imports as configured in `tsconfig.json`; reserve relative imports for tightly coupled files within `src/lib/leads/`.

## Layers

- Purpose: Map URLs to server-rendered React output, route metadata, 404 handling, sitemap output, and robots policy.
- Location: `src/app/`
- Contains: `layout.tsx`, `page.tsx`, nested route folders, `not-found.tsx`, `sitemap.ts`, `robots.ts`, and `actions/leads.ts`.
- Depends on: `src/components/`, `src/content/`, `src/lib/`, Next.js primitives, and React.
- Used by: The Next.js runtime through App Router filesystem conventions in `src/app/`.
- Purpose: Render the global shell, shared visual primitives, inquiry experiences, truck UI, and client-side interactions.
- Location: `src/components/`
- Contains: layout components in `src/components/layout/`, visual primitives in `src/components/ui/`, measurement/inquiry composition in `src/components/marketing/`, forms in `src/components/forms/`, and truck-specific UI in `src/components/trucks/`.
- Depends on: Next.js UI APIs, React, `src/content/`, and `src/lib/`.
- Used by: Route modules in `src/app/` and other higher-level components such as `src/components/marketing/InquiryPage.tsx`.
- Purpose: Hold approved, typed, repository-managed business and product content independently of page presentation.
- Location: `src/content/`
- Contains: object/array exports and their local TypeScript types, including `Truck`, `Campaign`, `Promotion`, and `DeliveryStory` in their corresponding files.
- Depends on: No application layer; content modules are leaf dependencies such as `src/content/trucks.ts` and `src/content/site.ts`.
- Used by: Routes, layout components, cards, metadata, sitemap generation, and the truck finder links in `src/app/`, `src/components/`, and `src/lib/seo.ts`.
- Purpose: Define lead types/contracts, dynamic lead fields, URL handling, metadata construction, analytics, and browser attribution.
- Location: `src/lib/`
- Contains: `src/lib/leads/{types,fields,router}.ts`, `src/lib/{seo,site-url,analytics,attribution}.ts`.
- Depends on: Platform APIs, Zod at the server-action boundary, and limited content configuration through `src/lib/seo.ts`.
- Used by: `src/app/` server routes/actions and interactive components under `src/components/`.
- Purpose: Supply public brand/product images, social images, favicon assets, and global design rules.
- Location: `public/`, `src/app/globals.css`
- Contains: official raster assets under `public/images/official/`, SVG entry assets under `public/`, and all CSS tokens/layout/component styles in `src/app/globals.css`.
- Depends on: No application modules.
- Used by: `next/image`, metadata, and class names emitted throughout `src/app/` and `src/components/`.

## Data Flow

### Primary Page Request Path

### Lead Submission Flow

### Attribution and Analytics Flow

- Server-rendered content has no shared mutable runtime store; authoritative content is module data in `src/content/*.ts`.
- Local UI state stays inside client components: navigation state in `src/components/layout/Header.tsx`, form lifecycle in `src/components/forms/LeadForm.tsx`, and finder answers/results in `src/components/trucks/TruckFinder.tsx`.
- Cross-page attribution is the only browser-persisted state and uses `sessionStorage` through `src/lib/attribution.ts`; submitted lead data is not persisted by the application when no webhook is configured in `src/lib/leads/router.ts`.

## Key Abstractions

- Purpose: Separate editable facts from page composition and constrain record shape at compile time.
- Examples: `Truck` in `src/content/trucks.ts`, `Campaign` in `src/content/campaigns.ts`, `Promotion` in `src/content/promotions.ts`, `DeliveryStory` in `src/content/deliveries.ts`.
- Pattern: Export a type and a typed array; expose a focused lookup/filter helper where needed, such as `getTruck` in `src/content/trucks.ts` and `activePromotions` in `src/content/promotions.ts`.
- Purpose: Keep the lead destination replaceable and prevent UI/server-action code from depending on a vendor SDK.
- Examples: Contract in `src/lib/leads/types.ts`; webhook and development implementations in `src/lib/leads/router.ts`; consumer in `src/app/actions/leads.ts`.
- Pattern: Structural interface with one asynchronous `submit` operation and a single selected module export.
- Purpose: Drive both form rendering and server-side validation from one per-lead-type definition.
- Examples: `LeadField` and `leadFields` in `src/lib/leads/fields.ts`; renderer in `src/components/forms/LeadForm.tsx`; validator builder in `src/app/actions/leads.ts`.
- Pattern: Declarative field metadata keyed by the `LeadType` union from `src/lib/leads/types.ts`.
- Purpose: Keep spacing, hierarchy, calls to action, breadcrumbs, and JSON-LD output consistent across routes.
- Examples: `Container`, `PageHero`, `SectionHeading`, `Breadcrumbs`, `CtaBand`, and `JsonLd` in `src/components/ui/Shared.tsx`.
- Pattern: Small stateless server-compatible React components styled through classes in `src/app/globals.css`.
- Purpose: Apply canonical, robots, Open Graph, and Twitter defaults consistently.
- Examples: `createMetadata` and `breadcrumbSchema` in `src/lib/seo.ts`; origin normalization in `src/lib/site-url.ts`.
- Pattern: Pure factory functions consumed by each `src/app/**/page.tsx` metadata export.

## Entry Points

- Location: `src/app/layout.tsx`
- Triggers: Every App Router document request.
- Responsibilities: Define global metadata, import `src/app/globals.css`, render the site shell, install client measurement islands, and emit organization schema.
- Location: `src/app/page.tsx`
- Triggers: HTTP requests for `/`.
- Responsibilities: Aggregate the primary tasks, truck catalog, support services, guides, promotions, deliveries, contact actions, and home metadata.
- Location: `src/app/{contact,financing,find-your-truck,fleet,guides,hino-cebu,parts,privacy,promotions,quote,service,terms,trucks}/page.tsx`
- Triggers: Their corresponding public route paths.
- Responsibilities: Compose page-specific content and shared components; keep business integration logic outside route modules.
- Location: `src/app/trucks/[slug]/page.tsx`
- Triggers: `/trucks/:slug` for slugs enumerated from `src/content/trucks.ts`.
- Responsibilities: Static parameter generation, content lookup, 404 handling, route metadata, product/breadcrumb schema, and truck detail composition.
- Location: `src/app/lp/[slug]/page.tsx`
- Triggers: `/lp/:slug` for slugs enumerated from `src/content/campaigns.ts`.
- Responsibilities: Static parameter generation, campaign lookup, index/noindex metadata, and compact lead capture.
- Location: `src/app/actions/leads.ts`
- Triggers: Form submissions from `src/components/forms/LeadForm.tsx` through `useActionState`.
- Responsibilities: Validate and normalize untrusted form data, sanitize attribution, route the lead, and return UI-safe status.
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

### Large Inline Route Markup

### Shared UI Grab Bag

## Error Handling

- Use `notFound()` for unknown dynamic records after typed content lookup in `src/app/trucks/[slug]/page.tsx` and `src/app/lp/[slug]/page.tsx`; render the shared fallback in `src/app/not-found.tsx`.
- Return structured validation errors through `LeadFormState` from `src/app/actions/leads.ts` rather than throwing expected input failures.
- Catch malformed attribution JSON and reduce it to an empty allow-listed object in `src/app/actions/leads.ts`; browser session parsing follows the same safe fallback in `src/lib/attribution.ts`.
- Throw provider rejection inside `src/lib/leads/router.ts`, then translate it into a generic retry/call message in `src/app/actions/leads.ts` so provider details are not exposed to the client.
- Fall back to the localhost origin on missing or invalid configuration in `src/lib/site-url.ts`, paired with indexing denial in `src/app/robots.ts` when production origin is absent.

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
