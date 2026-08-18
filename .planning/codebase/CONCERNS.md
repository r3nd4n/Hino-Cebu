# Codebase Concerns

**Analysis Date:** 2026-08-18

## Tech Debt

**Production lead routing is optional and silently degrades to a no-op:**
- Issue: `leadRouter` acknowledges a submission with a generated reference when `LEAD_ROUTING_WEBHOOK_URL` is absent, while the server action tells the visitor that the request was received for follow-up.
- Files: `src/lib/leads/router.ts`, `src/app/actions/leads.ts`, `README.md`
- Impact: A production configuration mistake loses every lead without warning while presenting a success state to the customer.
- Fix approach: Fail closed outside development, validate required production environment variables during build/startup, and expose a health check or deployment test that proves the destination accepts a synthetic non-PII request.

**Lead delivery is a minimal synchronous webhook adapter:**
- Issue: The adapter has no request timeout, retry policy, idempotency key, durable queue, destination-specific authentication header, or structured delivery telemetry.
- Files: `src/lib/leads/router.ts`, `src/lib/leads/types.ts`, `src/app/actions/leads.ts`
- Impact: Slow or transient destination failures hold open the server action, duplicate retries cannot be reconciled, and failed high-value inquiries are not recoverable.
- Fix approach: Put an approved adapter behind `LeadRouter`, use an abort timeout and stable submission ID, authenticate explicitly, queue or durably persist before acknowledging, and record PII-safe delivery outcome metrics.

**Content management requires source edits and redeployment:**
- Issue: Product data, campaigns, promotions, guides, branch details, and navigation are repository-managed constants.
- Files: `src/content/trucks.ts`, `src/content/campaigns.ts`, `src/content/promotions.ts`, `src/content/guides.ts`, `src/content/site.ts`
- Impact: Commercial updates require developer access and a deployment; stale specifications, expired wording, and operational details can stay public until a code release.
- Fix approach: Keep the typed content contract, add schema validation and review-date checks, and introduce an approved content source or a documented owner/review cadence for data in `src/content/`.

**Page and component implementations are compressed into single-line JSX:**
- Issue: Several complete pages and reusable components place metadata, content, conditionals, and markup on one physical line.
- Files: `src/app/contact/page.tsx`, `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/components/marketing/InquiryPage.tsx`, `src/components/forms/LeadForm.tsx`
- Impact: Reviews produce coarse diffs, accessibility and content mistakes are easy to overlook, and isolated changes cause merge conflicts.
- Fix approach: Format JSX into semantic blocks and extract repeated branch identity, legal notices, schema builders, and field-rendering logic into focused components.

**Production configuration has no executable schema:**
- Issue: Environment variables are read ad hoc; IDs, URLs, required-in-production values, and mutually exclusive marketing configurations are not validated centrally.
- Files: `src/lib/site-url.ts`, `src/lib/leads/router.ts`, `src/components/marketing/MarketingTags.tsx`, `src/app/robots.ts`, `README.md`
- Impact: Invalid values can generate localhost metadata, enable crawling incorrectly, disable lead delivery, or inject malformed third-party tag configuration.
- Fix approach: Add a server-only environment schema, validate HTTPS origins and webhook URLs, validate public tag ID formats, and terminate production startup/build on missing critical values.

## Known Bugs

**Compact campaign form cannot satisfy server validation:**
- Symptoms: The campaign form renders a reduced sales field set but the server validates the complete sales schema. The required `timeline` field is omitted by the compact form, so submission always returns a validation error that the user cannot correct.
- Files: `src/components/forms/LeadForm.tsx`, `src/app/actions/leads.ts`, `src/app/lp/[slug]/page.tsx`, `src/lib/leads/fields.ts`
- Trigger: Submit `/lp/hino-300-cebu`; `compact` excludes `timeline`, while `leadFields.sales` marks it required.
- Workaround: Use the full `/quote` form. The code fix is to define a shared form variant/schema contract and ensure every server-required field is rendered or intentionally optional for that variant.

**Malformed site origin can make localhost URLs indexable:**
- Symptoms: `getSiteOrigin()` falls back to `http://localhost:3000` for an invalid configured URL, but `robots()` only checks whether the raw environment string is truthy and then allows all crawling.
- Files: `src/lib/site-url.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/lib/seo.ts`
- Trigger: Set `NEXT_PUBLIC_SITE_URL` to whitespace or an invalid URL and build/deploy.
- Workaround: Supply a valid HTTPS origin. The code fix is to share one validated origin result and allow indexing only when that result is a valid non-local production URL.

**Truck finder requires answers that do not affect its result:**
- Symptoms: Users must answer cargo, body, and timeline questions, but no recommendation rule reads those values. Equal scores are resolved by fixed rule order, so a single weak match can determine the recommendation.
- Files: `src/components/trucks/TruckFinder.tsx`
- Trigger: Change only `cargo`, `body`, or `timeline`; the result is unchanged. Create tied matches; the first rule in `rules` wins.
- Workaround: Treat output as a conversation starter. The code fix is to define reviewed weights/tie behavior, use every required answer or remove irrelevant questions, and test the decision table.

**Truck-finder start analytics overcounts sessions:**
- Symptoms: `truck_finder_started` fires on every focus event that bubbles from any field rather than once per finder interaction.
- Files: `src/components/trucks/TruckFinder.tsx`, `src/lib/analytics.ts`
- Trigger: Tab or click through multiple finder fields.
- Workaround: Deduplicate downstream. The code fix is to guard the event with a ref as `src/components/forms/LeadForm.tsx` already does.

## Security Considerations

**Public lead endpoint lacks effective automated-abuse controls:**
- Risk: The honeypot is trivial to bypass; there is no IP/user throttling, proof-of-work/CAPTCHA alternative, request quota, or destination circuit breaker.
- Files: `src/app/actions/leads.ts`, `src/components/forms/LeadForm.tsx`, `README.md`, `BUSINESS_INPUTS_REQUIRED.md`
- Current mitigation: Lead type and field names are allow-listed, Zod enforces required values and length caps for rendered fields, and a hidden `website` field catches basic bots.
- Recommendations: Add privacy-approved rate limiting at the edge/server action, destination backpressure, abuse monitoring, and tests for burst and bypass behavior before production traffic.

**Lead provenance fields are client-controlled and unbounded:**
- Risk: `sourcePage`, `sourceCta`, and the raw `attribution` JSON input bypass the main Zod object. The first two are forwarded without length or format checks, and the JSON string can be arbitrarily large before selected attribution values are sliced.
- Files: `src/app/actions/leads.ts`, `src/components/forms/LeadForm.tsx`, `src/lib/attribution.ts`
- Current mitigation: Attribution output is reduced to seven keys and each retained value is capped at 250 characters; contact fields are capped at 250 or 2,000 characters.
- Recommendations: Include every submitted field in one strict schema, cap the raw request fields before parsing, derive `sourcePage` server-side where practical, and reject unexpected keys/types.

**Input validation permits invalid operational data:**
- Risk: Telephone, date, and select fields are validated only as strings. A direct caller can send arbitrary model, timeline, date, phone, and vehicle identifier values to the downstream lead system.
- Files: `src/app/actions/leads.ts`, `src/lib/leads/fields.ts`
- Current mitigation: Required fields, email shape, whitespace trimming, and maximum lengths are enforced in `src/app/actions/leads.ts`.
- Recommendations: Generate server schemas from field type and option values, normalize Philippine phone numbers and dates, validate VIN/plate formats conservatively, and preserve raw values only when explicitly required.

**PII processing governance is not approved:**
- Risk: Forms collect names, contact details, VIN/chassis data, plate numbers, service concerns, and free text, but controller identity, privacy contact, retention, rights handling, and final lead destinations are unresolved.
- Files: `src/lib/leads/fields.ts`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `BUSINESS_INPUTS_REQUIRED.md`
- Current mitigation: Explicit consent is required, uploads are disabled, the development router does not persist, and draft privacy/terms pages describe intended handling.
- Recommendations: Do not treat the site as production-ready until business/legal approval, processor agreements, retention/deletion rules, incident handling, and the rights-request contact are documented and implemented.

**Marketing tags can load without an implemented consent mechanism:**
- Risk: Enabling GTM, GA4, or Meta environment IDs loads third-party scripts globally and may write identifiers before any jurisdiction-appropriate consent choice.
- Files: `src/components/marketing/MarketingTags.tsx`, `src/app/layout.tsx`, `src/app/privacy/page.tsx`, `README.md`, `BUSINESS_INPUTS_REQUIRED.md`
- Current mitigation: Tags are absent unless environment IDs are configured, and analytics event properties intentionally exclude form contact fields and free text.
- Recommendations: Gate tag loading by an approved consent state, document cookie/storage behavior, support withdrawal, and verify GTM cannot introduce PII-bearing variables.

**Browser hardening is incomplete:**
- Risk: Security headers omit a Content Security Policy and an explicit HSTS policy while global inline marketing snippets and third-party scripts widen script execution exposure.
- Files: `next.config.ts`, `src/components/marketing/MarketingTags.tsx`
- Current mitigation: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a restrictive `Permissions-Policy` are configured in `next.config.ts`.
- Recommendations: Design a nonce- or hash-based CSP compatible with Next.js and approved tag vendors, enable HSTS only on the final HTTPS domain, and add automated header checks.

## Performance Bottlenecks

**Oversized source images increase deployment and image-processing cost:**
- Problem: Seven official raster assets total about 4.4 MB; the globally displayed logo source is about 487 KB and individual page images range from about 372 KB to 977 KB.
- Files: `public/images/official/hino-logo.png`, `public/images/official/hino-200.jpg`, `public/images/official/hino-300.jpg`, `public/images/official/hino-500.jpg`, `public/images/official/genuine-parts.png`, `public/images/official/quality-service.jpg`, `public/images/official/financial-services.jpg`
- Cause: Original PNG/JPEG assets are committed without a documented derivative optimization step; `src/components/layout/Header.tsx` marks the logo as priority on every page.
- Improvement path: Generate right-sized WebP/AVIF derivatives, replace the logo with an approved compact SVG or optimized transparent raster, retain originals outside the deployed bundle, and verify rendered responsive sizes with production metrics.

**Lead requests depend directly on webhook latency:**
- Problem: Every form submission waits for the external destination with no abort timeout.
- Files: `src/lib/leads/router.ts`, `src/app/actions/leads.ts`
- Cause: The server action synchronously awaits a bare `fetch()` request.
- Improvement path: Apply a short explicit timeout and durable handoff; return success only after accepted persistence, and expose retryable versus terminal failures without revealing internals.

**Marketing scripts are global rather than purpose-scoped:**
- Problem: Once configured, GTM/direct GA4 and Meta code is inserted from the root layout on every route, including legal and non-conversion pages.
- Files: `src/app/layout.tsx`, `src/components/marketing/MarketingTags.tsx`
- Cause: Tag loading is centralized but has no consent, route, or performance-budget gate.
- Improvement path: Load only approved providers after consent, keep one tag-control path, and monitor third-party main-thread/network cost with a page-performance budget.

## Fragile Areas

**Dynamic validation is coupled to rendered field metadata:**
- Files: `src/lib/leads/fields.ts`, `src/components/forms/LeadForm.tsx`, `src/app/actions/leads.ts`
- Why fragile: One configuration drives UI and server validation, but form variants filter the UI independently. Adding or requiring a field can break a variant without a type error, as the compact campaign form demonstrates.
- Safe modification: Define named field sets/form variants, derive both renderer and strict server schema from the same variant, and add submission tests for every `LeadType` and variant.
- Test coverage: `tests/foundation.test.mjs` checks only that upload-disabled text exists; it never submits or validates a form.

**Site-origin behavior crosses SEO endpoints and metadata:**
- Files: `src/lib/site-url.ts`, `src/lib/seo.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`
- Why fragile: Multiple consumers independently interpret one optional environment variable, and localhost is a silent fallback for invalid configuration.
- Safe modification: Parse once into a validated configuration object and test missing, whitespace, malformed, HTTP, localhost, preview, and production values together.
- Test coverage: `tests/foundation.test.mjs` performs source-text assertions, not behavioral URL or robots tests.

**Business identity and legal copy are duplicated:**
- Files: `src/content/site.ts`, `src/app/layout.tsx`, `src/app/contact/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`
- Why fragile: Address and phone literals appear both through `siteConfig` and directly in structured data/legal pages, allowing inconsistent corrections.
- Safe modification: Read branch identity from one typed source and construct organization/address schemas through one helper; keep legally required snapshots explicitly versioned if counsel requires fixed copy.
- Test coverage: No test verifies consistent identity, valid structured data, or approved legal version across these files.

**Publication safety depends on manual discipline:**
- Files: `src/content/trucks.ts`, `src/content/promotions.ts`, `src/content/deliveries.ts`, `src/content/campaigns.ts`, `SOURCE_REGISTER.md`, `BUSINESS_INPUTS_REQUIRED.md`
- Why fragile: Local availability, approval state, source age, promotion terms, and customer releases are not enforced by a publishing schema or automated gate.
- Safe modification: Add runtime/build-time schemas with approval status, source URL, review date, expiry, release reference, and local-applicability fields; fail the build for publishable entries missing required evidence.
- Test coverage: `tests/foundation.test.mjs` only asserts that promotions and deliveries are empty and selected asset files exist.

## Scaling Limits

**Lead throughput and durability:**
- Current capacity: One outbound webhook request is issued per submission from `src/lib/leads/router.ts`; no repository evidence defines a tested throughput target.
- Limit: Destination latency, outages, or rate limits directly become customer-facing failures, and accepted leads have no local recovery record.
- Scaling path: Use a managed queue or durable approved store, idempotent consumers, bounded retries/dead-letter handling, rate limits, and delivery success/latency metrics.

**Repository-backed publishing:**
- Current capacity: Small static arrays for three truck families, one campaign, three guide previews, and no published promotions or delivery stories live in `src/content/`.
- Limit: Every update requires a code review/build/deploy, and list/page behavior has no pagination, archive workflow, or editorial roles.
- Scaling path: Preserve the typed domain models while adding an approved CMS/data adapter, preview workflow, cache/revalidation policy, and migration tests.

## Dependencies at Risk

**No known package vulnerability detected:**
- Risk: `npm audit --json` reports zero known vulnerabilities across the lockfile on 2026-08-18; this is a point-in-time check, not continuous monitoring.
- Impact: Future advisories or permissive caret ranges can affect `next`, `react`, `zod`, and the development toolchain between maintenance cycles.
- Migration plan: Keep `package-lock.json` committed, enable automated dependency/security review in CI, run `npm audit` and `npm run check` on updates, and test framework upgrades before deployment.
- Files: `package.json`, `package-lock.json`

## Missing Critical Features

**Production lead operations:**
- Problem: An approved lead destination, per-team routing, rate-limit policy, delivery monitoring, and failure recovery are not implemented.
- Blocks: Safe production use of sales, parts, service, fleet, financing, and campaign forms in `src/components/forms/LeadForm.tsx` and `src/app/actions/leads.ts`.
- Files: `src/lib/leads/router.ts`, `README.md`, `BUSINESS_INPUTS_REQUIRED.md`

**Legal and consent approval:**
- Problem: Privacy/controller details, retention, rights process, terms, trademark use, and marketing consent requirements are drafts or unresolved inputs.
- Blocks: Approved collection of personal data and activation of marketing tags in `src/app/layout.tsx`.
- Files: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/components/marketing/MarketingTags.tsx`, `BUSINESS_INPUTS_REQUIRED.md`

**Operational observability and CI gate:**
- Problem: No CI workflow, error tracker, structured application logging, uptime check, alerting, or lead-delivery dashboard is present.
- Blocks: Reliable detection of broken deployments, webhook failures, analytics regressions, and lost leads.
- Files: `package.json`, `src/app/actions/leads.ts`, `src/lib/leads/router.ts`

**Approved Cebu-specific content:**
- Problem: Local product availability, service/parts/fleet processes, financing applicability, operating hours, branch photography, promotions, and customer releases are unresolved.
- Blocks: Replacing visible placeholders and publishing locally authoritative commercial content.
- Files: `BUSINESS_INPUTS_REQUIRED.md`, `ASSET_REQUIREMENTS.md`, `src/components/ui/Shared.tsx`, `src/content/promotions.ts`, `src/content/deliveries.ts`

## Test Coverage Gaps

**Lead handling and abuse boundary:**
- What's not tested: Successful and failed submissions, every lead type, compact variants, honeypot behavior, malformed/tampered fields, webhook absence, webhook timeout/error, duplicate delivery, and PII-safe telemetry.
- Files: `src/app/actions/leads.ts`, `src/lib/leads/router.ts`, `src/components/forms/LeadForm.tsx`, `tests/foundation.test.mjs`
- Risk: Revenue-impacting data loss, spam exposure, and the compact-form blocker can ship while all tests pass.
- Priority: High

**SEO and deployment configuration:**
- What's not tested: Valid/invalid production origins, canonical output, sitemap entries, robots allow/disallow behavior, metadata, noindex campaigns, and structured-data validity.
- Files: `src/lib/site-url.ts`, `src/lib/seo.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/lp/[slug]/page.tsx`, `tests/foundation.test.mjs`
- Risk: Search engines can index localhost-based metadata, omit content, or index paid-only pages.
- Priority: High

**Truck-finder decision logic:**
- What's not tested: Rule matches, ties, fallback, whether all questions affect output, link generation, event deduplication, and reviewed business expectations.
- Files: `src/components/trucks/TruckFinder.tsx`, `tests/foundation.test.mjs`
- Risk: Users receive inconsistent or weak recommendations that appear more authoritative than the underlying four-rule heuristic.
- Priority: High

**User journeys and accessibility:**
- What's not tested: Navigation, responsive menu, forms in a browser, keyboard/focus behavior, screen-reader announcements, mobile action bar, image/layout behavior, and outbound tracking.
- Files: `src/components/layout/Header.tsx`, `src/components/layout/StickyMobileActions.tsx`, `src/components/forms/LeadForm.tsx`, `src/app/globals.css`, `tests/foundation.test.mjs`
- Risk: Build-time checks pass despite broken conversion journeys or accessibility regressions.
- Priority: Medium

**Content publication rules:**
- What's not tested: Promotion boundary dates/time zones, approved delivery filtering, content-source freshness, local availability flags, campaign publication rules, and legal-copy versioning.
- Files: `src/content/promotions.ts`, `src/content/deliveries.ts`, `src/content/campaigns.ts`, `src/content/trucks.ts`, `tests/foundation.test.mjs`
- Risk: Expired, unapproved, stale, or nationally applicable-only information can be published as local content.
- Priority: Medium

**Current suite quality:**
- What's not tested: The five native Node tests assert file presence and source-code text rather than executing TypeScript behavior; no coverage threshold or report is configured.
- Files: `tests/foundation.test.mjs`, `package.json`
- Risk: `npm run check` can pass lint, typecheck, tests, and build while functional regressions remain undetected.
- Priority: High

---

*Concerns audit: 2026-08-18*
