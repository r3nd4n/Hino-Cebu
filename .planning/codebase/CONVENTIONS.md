# Coding Conventions

**Analysis Date:** 2026-08-18

## Naming Patterns

**Files:**
- Use PascalCase for reusable React component modules: `src/components/forms/LeadForm.tsx`, `src/components/trucks/TruckCard.tsx`, and `src/components/ui/Shared.tsx`.
- Use lowercase framework filenames for Next.js App Router entries: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts`.
- Use lowercase camelCase for content modules named after their exported collection: `src/content/businessApplications.ts`, `src/content/promotions.ts`, and `src/content/trucks.ts`.
- Use lowercase or kebab-case for library modules: `src/lib/analytics.ts`, `src/lib/attribution.ts`, and `src/lib/site-url.ts`.
- Name tests `<subject>.test.mjs`; the current repository contract suite is `tests/foundation.test.mjs`.

**Functions:**
- Use camelCase for utilities and domain operations: `getSiteOrigin` and `absoluteUrl` in `src/lib/site-url.ts`, `createMetadata` and `breadcrumbSchema` in `src/lib/seo.ts`, and `activePromotions` in `src/content/promotions.ts`.
- Use PascalCase for React components: `LeadForm` in `src/components/forms/LeadForm.tsx`, `TruckFinder` in `src/components/trucks/TruckFinder.tsx`, and `RootLayout` in `src/app/layout.tsx`.
- Use framework-prescribed names for route hooks and metadata functions: `generateStaticParams` and `generateMetadata` in `src/app/trucks/[slug]/page.tsx`.
- Use action-oriented handler names for server operations, such as `submitLead` in `src/app/actions/leads.ts`.

**Variables:**
- Use camelCase for local state, derived values, and module constants: `searchParams`, `attributionRef`, `sourceCta`, and `simpleEmail` in `src/components/forms/LeadForm.tsx` and `src/app/actions/leads.ts`.
- Use SCREAMING_SNAKE_CASE only for true module-level constants intended as stable identifiers: `LOCAL_ORIGIN` in `src/lib/site-url.ts` and `ATTRIBUTION_STORAGE_KEY` in `src/lib/attribution.ts`.
- Give exported data collections plural nouns: `trucks` in `src/content/trucks.ts`, `campaigns` in `src/content/campaigns.ts`, and `supportServices` in `src/content/services.ts`.
- Use boolean names that read as conditions: `isPublished` in `src/content/promotions.ts`, `approved` in `src/content/deliveries.ts`, and derived `complete` in `src/components/trucks/TruckFinder.tsx`.

**Types:**
- Use PascalCase for types and interfaces: `Truck` in `src/content/trucks.ts`, `LeadSubmission` and `LeadRouter` in `src/lib/leads/types.ts`, and `MetadataInput` in `src/lib/seo.ts`.
- Model closed domains with string-literal unions or `as const` arrays: `LeadType` in `src/lib/leads/types.ts` and `AnalyticsEvent` in `src/lib/analytics.ts`.
- Derive types from canonical values when possible; `AnalyticsEvent` is derived from `analyticsEvents` in `src/lib/analytics.ts`, and `Attribution` is derived from `attributionKeys` in `src/lib/attribution.ts`.
- Use `Record` for keyed configuration and payload maps: `leadFields` in `src/lib/leads/fields.ts`, `events` in `src/components/forms/LeadForm.tsx`, and lead validation maps in `src/app/actions/leads.ts`.

## Code Style

**Formatting:**
- No dedicated formatter configuration is present; `.prettierrc*`, `prettier.config.*`, `biome.json`, and `.editorconfig` are not detected at the repository root.
- Follow the established TypeScript style: double quotes, semicolons, two-space indentation, trailing commas in multiline objects/arrays, and braces for multiline control flow. Representative files are `src/lib/seo.ts` and `src/app/actions/leads.ts`.
- Keep arrays and object literals multiline when they carry domain content, as in `src/content/trucks.ts`; compact, closely related type fields may share a line, as in `src/lib/leads/fields.ts`.
- JSX is frequently compact and returned directly, including one-line route components such as `src/app/service/page.tsx` and dense shared primitives in `src/components/ui/Shared.tsx`. When modifying a file, preserve its local layout rather than mechanically reformatting unrelated JSX.
- Put `"use client"` or `"use server"` first, followed by a blank line, as shown in `src/components/forms/LeadForm.tsx` and `src/app/actions/leads.ts`.

**Linting:**
- Run ESLint 9 through `npm run lint`; the script in `package.json` executes `eslint .`.
- Inherit Next.js Core Web Vitals and Next.js TypeScript rules from `eslint.config.mjs` via `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Keep generated output excluded through `globalIgnores` in `eslint.config.mjs`: `.next/**`, `out/**`, `build/**`, and `next-env.d.ts`.
- Keep TypeScript strict and emission-free according to `tsconfig.json`: `strict: true`, `noEmit: true`, `isolatedModules: true`, and `moduleResolution: "bundler"`.
- Run `npm run typecheck` separately because lint and type checking are distinct scripts in `package.json`.

## Import Organization

**Order:**
1. Put framework and third-party value/type imports first, such as `next`, `react`, and `zod` in `src/app/actions/leads.ts`, `src/app/layout.tsx`, and `src/components/forms/LeadForm.tsx`.
2. Put side-effect imports after framework imports, before project modules; `src/app/layout.tsx` imports `./globals.css` in this position.
3. Put project modules using the `@/` alias after external imports, as in `src/app/page.tsx` and `src/components/marketing/InquiryPage.tsx`.
4. Use relative imports for tightly coupled siblings within the same library directory, as `src/lib/leads/router.ts` and `src/lib/leads/fields.ts` import `./types`.
5. Mark type-only dependencies with `import type` or inline `type` specifiers to preserve runtime boundaries, as in `src/lib/seo.ts` and `src/components/marketing/TrackedLink.tsx`.

**Path Aliases:**
- Use `@/*` for imports rooted at `src/*`; the mapping is defined in `tsconfig.json`.
- Prefer `@/components/...`, `@/content/...`, `@/lib/...`, and `@/app/...` across directories. Examples include `@/lib/seo` in `src/app/page.tsx` and `@/app/actions/leads` in `src/components/forms/LeadForm.tsx`.
- Do not introduce barrel imports; the repository has no `index.ts` barrel modules. Import directly from the owning file.

## Error Handling

**Patterns:**
- Return expected validation and submission failures as typed state rather than throwing across the UI boundary. `submitLead` in `src/app/actions/leads.ts` returns `LeadFormState` with `status`, a user-safe `message`, and optional field `errors`.
- Validate untrusted form input server-side with Zod `safeParse`, then flatten issues into a single message per field in `src/app/actions/leads.ts`.
- Allow lower-level adapters to throw on transport failure, then translate failures at the server-action boundary. `src/lib/leads/router.ts` throws when the webhook response is not OK; `src/app/actions/leads.ts` catches it and returns a generic retry/call message.
- Fail safely for optional or malformed configuration. `src/lib/site-url.ts` catches invalid URL configuration and falls back to localhost; `src/lib/attribution.ts` catches malformed session JSON and returns an empty object.
- Do not expose raw provider errors or submitted personal data in UI messages or logs. The current catch blocks in `src/app/actions/leads.ts` intentionally discard internal error details.
- Use early returns for guard clauses and unsupported states, as in `src/app/actions/leads.ts`, `src/lib/analytics.ts`, and `src/content/promotions.ts`.

## Logging

**Framework:** Not detected; there is no logger package and no `console.*` usage under `src/` or `tests/`.

**Patterns:**
- Do not log lead payloads, contact details, free-text messages, or attribution values. The development adapter in `src/lib/leads/router.ts` acknowledges submissions without persisting or logging personal data.
- Record browser measurement only through the typed `track` boundary in `src/lib/analytics.ts`.
- Add analytics event names to the `analyticsEvents` tuple in `src/lib/analytics.ts` before emitting them, so callers remain constrained by `AnalyticsEvent`.
- Keep analytics properties non-sensitive and primitive through `AnalyticsProperties` in `src/lib/analytics.ts`; filter `undefined` values before dispatch.

## Comments

**When to Comment:**
- Comments are rare; prefer clear names and explicit types over narrating code.
- Add comments only for non-obvious intent or safety constraints. The development lead adapter comment in `src/lib/leads/router.ts` explains why it deliberately does not persist data and what production replacement requires.
- Preserve user-facing caveats as rendered copy rather than code comments when they affect business or legal behavior, as in `src/components/forms/LeadForm.tsx` and `src/app/privacy/page.tsx`.

**JSDoc/TSDoc:**
- Not used in the current source tree. Public types and function signatures carry the contract instead, including `LeadRouter` in `src/lib/leads/types.ts` and `Truck` in `src/content/trucks.ts`.
- Do not add routine JSDoc that merely repeats a self-explanatory signature; use it only if a new API has constraints not representable in TypeScript.

## Function Design

**Size:**
- Keep pure helpers focused on one transformation: `absoluteUrl` in `src/lib/site-url.ts`, `activePromotions` in `src/content/promotions.ts`, and `recommend` in `src/components/trucks/TruckFinder.tsx`.
- Use early returns to keep environment checks and validation paths shallow, as in `track` in `src/lib/analytics.ts` and `submitLead` in `src/app/actions/leads.ts`.
- Route components commonly compose imported data and shared UI directly; reusable behavior belongs in `src/components/` or `src/lib/`, not duplicated across `src/app/**/page.tsx`.
- Keep side effects at explicit boundaries: browser storage in `src/lib/attribution.ts`, analytics dispatch in `src/lib/analytics.ts`, and lead transport in `src/lib/leads/router.ts`.

**Parameters:**
- Destructure React props in the function signature and provide defaults there, as in `CtaBand` in `src/components/ui/Shared.tsx` and `LeadForm` in `src/components/forms/LeadForm.tsx`.
- Use object parameters when a function needs several named inputs, as `createMetadata` does in `src/lib/seo.ts`.
- Use exact domain types for operations (`LeadType`, `LeadSubmission`, `Truck`) and use optional properties only where callers may legitimately omit values in `src/lib/leads/types.ts` and `src/content/trucks.ts`.
- Keep framework-required signatures intact, including promised `params`/`searchParams` in dynamic Next.js routes such as `src/app/trucks/[slug]/page.tsx` and `src/app/quote/page.tsx`.

**Return Values:**
- Return typed result objects for operations with multiple outcomes, such as `LeadFormState` in `src/app/actions/leads.ts` and rule objects from `recommend` in `src/components/trucks/TruckFinder.tsx`.
- Return safe empty values for unavailable browser state (`{}` in `src/lib/attribution.ts`) and `null` only for intentional non-rendering (`src/components/marketing/AttributionCapture.tsx`).
- Preserve pure data transformations where possible: `getTruck` returns the matching item or `undefined` in `src/content/trucks.ts`; route callers decide whether to invoke `notFound`.

## Module Design

**Exports:**
- Use named exports for reusable components, utilities, types, and content collections throughout `src/components/`, `src/lib/`, and `src/content/`.
- Use default exports only where Next.js requires or conventionally expects route/layout components, such as `src/app/page.tsx`, `src/app/layout.tsx`, and `src/app/trucks/[slug]/page.tsx`.
- Keep module-level constants private unless callers need them. Validation details such as `leadTypes` and `simpleEmail` remain private in `src/app/actions/leads.ts`.
- Co-locate a type with the data or operation it describes when ownership is clear, such as `Promotion` with `promotions` in `src/content/promotions.ts`; use a dedicated types module for shared domain contracts, as in `src/lib/leads/types.ts`.

**Barrel Files:**
- Not used. No `index.ts`/`index.tsx` aggregation modules are present under `src/`.
- Add imports from concrete owners, for example `@/components/forms/LeadForm` and `@/lib/leads/types`, to keep dependencies explicit.

---

*Convention analysis: 2026-08-18*
