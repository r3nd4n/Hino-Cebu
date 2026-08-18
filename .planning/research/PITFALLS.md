# Pitfalls Research

**Domain:** Production hardening of a local commercial-dealership lead-generation website
**Project:** Hino Cebu Digital Growth Website
**Researched:** 2026-08-18
**Confidence:** HIGH for codebase-specific and platform findings; MEDIUM for legal/brand implementation until stakeholder and counsel approval

## Risk Ownership Model

This project has two fundamentally different kinds of launch risk. The roadmap must not blur them.

| Risk class | Owner | Correct treatment |
|---|---|---|
| **Code-controlled** | Engineering / deployment owner | Implement, automate, test, observe, and fail closed when unsafe |
| **Stakeholder/external dependency** | Dealership owner, legal/privacy reviewer, brand owner, CRM/lead recipient, advertising-account owner, domain/GBP owner | Record named owner, evidence, due date, and approval; block the dependent feature or publication until supplied |
| **Shared operational** | Engineering plus business team | Define both technical evidence and a real operating procedure; neither code nor a meeting alone is sufficient |

Recommended roadmap phase labels used below:

1. **Production Inputs & Release Contract** — verified identity/content, owners, legal/brand decisions, environment schema, publication policy.
2. **Reliable Lead Operations** — correct form contracts, durable handoff, routing, abuse controls, delivery observability and recovery.
3. **Privacy, Consent & Security** — approved processing rules, consent-aware tags, data minimization, headers and security validation.
4. **Behavioral Quality Gate** — automated unit/integration/browser coverage, accessibility, performance and SEO/configuration tests in CI.
5. **Production Deployment & Launch Validation** — Vercel/domain configuration, real-origin crawl checks, synthetic leads, analytics reconciliation and monitoring.
6. **Measured Growth & Local Authority** — approved local proof/content, paid landing pages, offline outcome reconciliation, then controlled acquisition scaling.

## Critical Pitfalls

### Pitfall 1: A form shows success even though no recoverable lead exists

**What goes wrong:**
The visitor receives a reference and success message, but the inquiry was only acknowledged locally or lost when the optional webhook was absent, slow, or unavailable. In this repository, `src/lib/leads/router.ts` currently generates a development identifier when `LEAD_ROUTING_WEBHOOK_URL` is missing, and the server action presents that path as received. This is the most direct threat to the project's core value.

**Why it happens:**
A demo treats HTTP completion as business delivery. The final sales/service/parts/fleet/financing destinations are still stakeholder inputs, while the current adapter is synchronous and has no durable queue/store, timeout, retry, idempotency key, dead-letter path, or delivery alert.

**Risk ownership:** Shared. Engineering owns fail-closed behavior, durable acceptance, idempotency and telemetry. The dealership owns approved per-lead-type destinations, recipients, escalation owners, service expectations and access credentials.

**How to avoid:**
- Define one stable submission ID before dispatch and retain a permitted, encrypted recovery record before returning success.
- Separate `accepted`, `delivered`, `retrying`, and `terminal_failure`; never translate an unconfigured production router into success.
- Apply a bounded outbound timeout, authenticated destination adapter, idempotent delivery, bounded retries with backoff, and dead-letter/manual replay.
- Route each lead type explicitly and maintain a PII-safe operational ledger containing submission ID, type, timestamps, destination alias, attempts and result—not contact values.
- Validate required production routing configuration at build/startup and expose a protected readiness check.

**Warning signs:**
- A production form succeeds with `LEAD_ROUTING_WEBHOOK_URL` unset.
- No one can locate a test inquiry by reference ID in the destination.
- Success count is greater than accepted/delivered count, or there is no way to calculate that difference.
- Webhook latency equals customer response latency; a recipient outage makes the form hang.
- Retrying a browser request creates multiple CRM/email records.

**Verification evidence:**
- Automated matrix for every lead type and form variant covering destination missing, success, timeout, `4xx`, `5xx`, duplicate submission and replay.
- Production-like synthetic non-PII lead is visible end-to-end with the same submission ID; alert is proven by a controlled failure.
- Dashboard/runbook demonstrates `accepted = delivered + retrying + terminal_failure`, named on-call owner, replay procedure and retention limit.

**Phase to address:** Phase 2, with destination/owner decisions required from Phase 1 and a real production smoke test repeated in Phase 5. This blocks launch and all paid media.

---

### Pitfall 2: Form variants drift from server validation

**What goes wrong:**
A landing page looks complete but cannot submit. This is already present: the compact campaign sales form omits required `timeline`, while the server validates the full sales schema. Other variants can silently break whenever display metadata and server rules evolve separately.

**Why it happens:**
The UI filters a general field list independently from server validation. Source-text tests prove files and strings exist but never submit each rendered form.

**Risk ownership:** Code-controlled, with stakeholder approval needed for the minimum commercially useful fields.

**How to avoid:**
- Define named, typed form contracts by lead type and variant; derive both rendered fields and a strict server schema from the same contract.
- Reject unknown keys, validate enumerated options, normalize Philippine phone/date values conservatively, cap the raw request before JSON parsing, and derive provenance server-side where possible.
- Add a contract invariant: every server-required input is rendered, preset by a trusted server value, or explicitly conditional.
- Keep campaign forms shorter only by consciously making fields optional or moving them to follow-up—not by hiding required controls.

**Warning signs:**
- Generic “check your details” errors with no visible invalid field.
- A field becomes required in `leadFields` without tests changing.
- A campaign has traffic and starts but zero successful submissions.
- Direct requests can submit arbitrary select values or excessively large provenance data.

**Verification evidence:**
- Runtime submission tests for sales, compact campaign, service, parts, fleet and financing contracts, including valid, missing, malformed and tampered payloads.
- Browser tests demonstrate error summary/inline association, correction, resubmission and success for every public variant.
- CI fails when a required schema field has no rendered/trusted source.

**Phase to address:** Phase 2; browser verification becomes a mandatory Phase 4 release gate.

---

### Pitfall 3: “Consent checkbox” is mistaken for privacy governance

**What goes wrong:**
The site collects names, contact details, VIN/chassis or plate identifiers, service concerns and free text without an approved controller identity, recipients, retention period, deletion/rights process or incident workflow. A generic checkbox and draft policy create the appearance of compliance while the actual data lifecycle remains undefined.

**Why it happens:**
Teams conflate UI consent with a lawful, transparent processing system. Philippine law requires purpose limitation, proportionality, security, retention limitation and information about controller, recipients, storage period and rights; whether consent is the proper basis for each processing purpose is a legal/business determination, not a code guess.

**Risk ownership:** External/legal for controller identity, lawful basis, notice, retention, recipients/processors, rights and breach handling; engineering for implementing the approved decision, minimizing collection, securing transfers, deletion controls and evidence.

**How to avoid:**
- Do not invent controller, privacy contact, retention duration, direct-marketing permission or cross-party sharing terms.
- Produce a data inventory for every form field and attribution value: purpose, necessity, recipient, storage, access, retention and deletion.
- Separate inquiry processing from optional direct-marketing permission if counsel requires distinct choices; record notice/consent version and timestamp without sending that evidence to analytics.
- Disable public uploads until storage, malware scanning, access, retention and deletion are explicitly approved.
- Version the approved privacy notice and operational rights-request procedure together.

**Warning signs:**
- Privacy copy says “we may” while no one can name where the data goes or how long it remains.
- The consent box is preselected, bundled with unrelated marketing, or has no notice version.
- Different webhook/email/spreadsheet recipients retain copies indefinitely.
- Developers answer legal questions by adding a banner rather than obtaining a decision.

**Verification evidence:**
- Signed/recorded approval identifies controller/contact, purposes, recipients/processors, retention, rights workflow, lawful basis/consent language and incident owner.
- Field-level data map matches the actual payload and destination; deletion/rights request is exercised in a tabletop test.
- Network/log inspection proves lead PII is absent from analytics, URLs, telemetry and error reports.

**Phase to address:** Decisions and approval in Phase 1; implementation and security verification in Phase 3; production data-flow test in Phase 5. Collection cannot launch without this dependency.

---

### Pitfall 4: Marketing tags fire before an approved consent decision—or GTM bypasses it later

**What goes wrong:**
Adding GTM, GA4, Google Ads or Meta IDs activates global third-party scripts before a valid choice, or a later GTM container publish introduces an unreviewed tag. Consent withdrawal does not change tag behavior. Analytics becomes both a privacy risk and an unreliable measurement system.

**Why it happens:**
The current root-level integration treats presence of an environment ID as authorization. Google's Consent Mode communicates a choice but does not supply the consent banner or decide the legal requirement. GTM is a remote code/configuration boundary outside repository review.

**Risk ownership:** Shared. Legal/privacy owners decide applicable consent requirements and approved vendors; advertising-account owners govern GTM/container access; engineering implements defaults, persistence and withdrawal.

**How to avoid:**
- Default relevant storage/processing states to the approved restrictive state before any tag executes; load only approved providers and avoid simultaneous direct GA plus overlapping GTM tags.
- Make accept, reject and granular choices equally functional; persist and honor withdrawal; define a consent-version migration rule.
- Apply GTM consent checks, least-privilege publishing, change approval and container version rollback.
- Audit outbound requests, cookies/local storage, event payloads and URLs in accepted and rejected states.

**Warning signs:**
- Requests to Google/Meta appear before interaction or after rejection.
- Consent Mode is mentioned but there is no actual user choice mechanism.
- GTM has tags in “Consent Not Configured,” or many users can publish directly.
- Event totals jump after enabling multiple integration paths or page views duplicate.

**Verification evidence:**
- Automated browser/network test for fresh, accepted, rejected and withdrawn states; approved tags/cookies match the decision.
- Google Tag Assistant and GTM Consent Overview evidence; saved container version and named publisher/rollback owner.
- Analytics DebugView/realtime test shows one expected event with allow-listed non-PII parameters.

**Phase to address:** Policy decision in Phase 1, implementation in Phase 3, real IDs/container audit in Phase 5. Advertising tags stay disabled until complete.

---

### Pitfall 5: Attribution exists in code but cannot be trusted commercially

**What goes wrong:**
UTMs, `gclid` and `fbclid` are captured, yet overwritten during navigation, lost at form submission, duplicated across events, associated with the wrong session, or never reconciled with delivered/qualified leads. Ads optimize against client-side “success” rather than accepted business outcomes. PII may leak through URLs or event parameters.

**Why it happens:**
Teams validate events in a debugger but not the full chain from ad landing through lead delivery and offline disposition. This repository already overcounts `truck_finder_started` on every bubbled focus event.

**Risk ownership:** Shared. Engineering owns capture semantics, event deduplication and PII-safe payloads. Marketing/CRM owners define source-of-truth attribution, qualified-lead status, conversion actions and account access.

**How to avoid:**
- Specify first-touch/current-touch behavior, attribution expiry, cross-page persistence and precedence rules.
- Tie the client conversion event and downstream lead to the stable submission ID; fire submitted only after accepted persistence, once.
- Allow-list event fields; never place name, email, phone, VIN/plate, free text or other identifiers in page URLs or ordinary analytics parameters.
- Reconcile landing/source/campaign/lead type/model interest against accepted, delivered and qualified outcomes before bidding or budget decisions.

**Warning signs:**
- GA4 conversions exceed accepted leads, one focus triggers repeated “started” events, or paid leads have `(direct)/(none)` despite tagged test URLs.
- Ad platforms record conversions while the business destination has none.
- Query strings or page paths contain email/phone/form values; Google sends a PII breach notice.
- There is no shared definition of “lead,” “delivered lead,” and “qualified lead.”

**Verification evidence:**
- A deterministic tagged journey preserves approved parameters through navigation and produces exactly one accepted event and one matching destination record.
- Daily reconciliation report explains differences among browser events, accepted submissions, delivered records and qualified outcomes.
- URL/event/log scanner finds no test PII; duplicate-event tests cover focus, repeat click, back navigation and retry.

**Phase to address:** Core semantics in Phase 2, privacy enforcement in Phase 3, browser/config tests in Phase 4, production reconciliation in Phase 5. Phase 6 paid scaling is gated on stable evidence.

---

### Pitfall 6: Unverified national facts become local dealership promises

**What goes wrong:**
National model specifications, finance programs, parts/service imagery or generic Hino statements are published as locally offered inventory, configurations, financing, service capability, stock, warranty or response-time promises. Expired promotions or customer identities appear without terms/releases. Trust and brand/legal exposure follow.

**Why it happens:**
Official source material feels authoritative, but it does not prove current Hino Cebu applicability. Repository content is easy to publish with a code change, while local availability, service/parts processes, fleet wording, financing participation, promotion terms, photography and releases remain unresolved.

**Risk ownership:** External for factual applicability, brand authorization, terms and releases; engineering for publication schema and fail-closed rendering.

**How to avoid:**
- Require publishable commercial entries to carry claim type, source URL/document, source scope (national/local), local applicability approval, owner, review date, expiry where applicable, and release/license reference.
- Fail the build or omit the item if required evidence is absent, expired or scoped only to national use.
- Use accurate CTA language: “request availability,” “request a service schedule,” and “request financing information,” not stock, booking or approval guarantees.
- Keep neutral placeholders development-only; do not replace missing facts with plausible copy.

**Warning signs:**
- “Available in Cebu,” rates, inventory, turnaround, warranty or exclusivity appears without an evidence ID.
- A copied national page is the only source; branch staff have not confirmed applicability.
- Promotions lack timezone/end date/terms; customer photos lack a release.
- Source and review registers are separate from content and cannot block publication.

**Verification evidence:**
- Build-time content validation rejects intentionally invalid/expired/unapproved fixtures.
- Published claim inventory links every sensitive claim and asset to current approval evidence.
- Stakeholder preview sign-off confirms local applicability; public crawl contains no project placeholders or unsupported claims.

**Phase to address:** Phase 1 for schema and approval register; Phase 4 for automated publication tests; Phase 6 for local stories and authority expansion after releases arrive.

---

### Pitfall 7: Wrong origin, robots or canonical policy pollutes search indexing

**What goes wrong:**
Preview/localhost URLs become canonical or indexable, production is accidentally `noindex`, paid-only duplicate landing pages are indexed, sitemap/structured-data URLs use another origin, or site migration lacks redirects. The existing code can allow crawling when a malformed but truthy `NEXT_PUBLIC_SITE_URL` falls back to localhost.

**Why it happens:**
Multiple SEO surfaces interpret the same optional environment variable independently, and tests inspect source rather than rendered output under real deployment settings. Preview and Production variables are separate on Vercel and changes affect only new deployments.

**Risk ownership:** Code-controlled for centralized origin/indexing rules; external for approved domain, DNS, Search Console and campaign indexing decisions.

**How to avoid:**
- Parse production origin once: required HTTPS, approved host, no localhost/preview host; use that single result for metadata base, canonicals, OG, sitemap, robots and structured data.
- Fail production build on invalid origin. Default non-production and unresolved campaign variants to `noindex, nofollow` and keep them out of sitemaps.
- Create an explicit indexability matrix by route/content state; use canonical content rather than doorway-style city variants.
- Prepare redirects and Search Console/domain verification as launch inputs, not post-launch chores.

**Warning signs:**
- `localhost`, `vercel.app`, HTTP, mixed hosts or duplicate slashes appear in built metadata/sitemap/schema.
- Robots “allow” depends only on a nonempty string; preview URLs appear in search or Search Console.
- Near-identical city/campaign pages funnel to the same form with no unique local value.
- Sitemap includes unpublished, expired, noindex or missing routes.

**Verification evidence:**
- Parameterized tests cover missing, whitespace, malformed, HTTP, localhost, preview and approved production origins across all SEO consumers.
- Deployed crawl asserts status, canonical, robots, sitemap membership, one H1, metadata and structured-data host for every indexable route.
- Search Console ownership/sitemap submission and a post-launch URL inspection are recorded; preview deployment is demonstrably protected/noindex.

**Phase to address:** Contract in Phase 1, automated coverage in Phase 4, real domain/DNS/Search Console validation in Phase 5.

---

### Pitfall 8: Local SEO becomes inconsistent NAP, misleading schema or doorway content

**What goes wrong:**
Address, phone, hours and business identity differ between visible pages, JSON-LD, social profiles and Google Business Profile (GBP). Unverified hours or service areas are marked up. Dozens of thin location pages target Cebu-area cities without distinct service evidence, risking poor user value and Google's doorway-abuse policy.

**Why it happens:**
Branch identity is duplicated in code; direct GBP target and hours remain missing. Structured data is mistaken for proof, while operational profile management happens outside the repository.

**Risk ownership:** Shared. Stakeholder/GBP owner verifies business identity, category, hours, service areas, profile URL and edits; engineering uses one typed source and semantically accurate markup.

**How to avoid:**
- Centralize verified NAP/entity data and derive visible contact details plus Organization/AutoDealer schema from it.
- Omit unknown hours/service areas rather than guessing. Link the verified GBP/directions target when supplied.
- Publish a location/application page only if it has distinct, truthful local utility and supporting evidence; otherwise strengthen the core branch and guide hierarchy.
- Establish a recurring cross-channel NAP/profile audit and owner for holiday-hour changes.

**Warning signs:**
- Phone/address literals appear in several page files; GBP disagrees with website schema.
- JSON-LD contains facts absent from visible content or fake ratings/prices/inventory.
- Location pages differ only by city name.
- No account owner can update GBP or respond to a wrong listing.

**Verification evidence:**
- Automated consistency test compares all rendered identity/schema outputs to the approved entity record.
- Stakeholder evidence links approved NAP/hours/category/profile; manual GBP-to-site audit passes on desktop/mobile.
- Content review shows each indexable local page has distinct user purpose, evidence and internal links.

**Phase to address:** Phase 1 for verified entity and ownership, Phase 4 for consistency tests, Phase 5 for GBP/Search validation, Phase 6 for evidence-backed local content.

---

### Pitfall 9: Green checks create false confidence because they do not execute user journeys

**What goes wrong:**
`npm run check` passes while campaign forms cannot submit, webhook failures lose leads, finder answers do nothing, mobile navigation breaks, metadata uses the wrong host, or screen-reader users cannot recover from errors. The current five tests are repository/source-contract checks without runtime TypeScript behavior, DOM tests, E2E tests or coverage threshold.

**Why it happens:**
Lint, typecheck, build and source regexes are cheap and useful, so teams allow them to stand in for product behavior. Revenue-critical integration seams are left untested because they require fixtures, browser tooling and controlled external boundaries.

**Risk ownership:** Code-controlled; stakeholder/business users also own acceptance of real routing and content outcomes.

**How to avoid:**
- Keep foundation checks, then add a risk-based pyramid: pure unit tests for rules/origin/publication; integration tests for action/router/consent; browser tests for critical journeys.
- Test every lead type/variant, delivery failure mode, attribution path, origin/indexability state, recommendation tie/fallback and content expiry boundary.
- Make CI run clean install, lint, typecheck, behavioral tests, production build and a production-like smoke suite; require stakeholder approval artifacts separately.
- Avoid chasing an arbitrary coverage percentage while critical branches remain unexercised; report required scenario coverage.

**Warning signs:**
- Tests pass without importing application modules or starting/rendering the app.
- A production bug can be reproduced but no test fails.
- Only happy paths exist, or external `fetch` uses live services in tests.
- Release approval is “build passed” with no synthetic lead/crawl/accessibility evidence.

**Verification evidence:**
- Traceable requirement-to-test matrix covers the critical scenarios named above.
- CI artifact includes unit/integration/browser results, production build, accessibility report and deployed smoke results.
- Known compact-form, malformed-origin and finder-event regressions are reproduced by red tests before fixes and remain guarded.

**Phase to address:** Phase 4, but revenue-critical tests should be authored alongside Phase 2/3 changes. Phase 5 adds deployed smoke evidence.

---

### Pitfall 10: Accessibility is reduced to an automated score

**What goes wrong:**
Forms have labels but error focus/announcements fail; sticky mobile actions obscure focused controls; menu state is inaccessible; validation clears user work; targets are difficult to tap; heading/alt text is technically present but misleading. Automated scans pass because they cannot judge full keyboard, screen-reader or task completion behavior.

**Why it happens:**
The MVP implemented accessibility basics but has no browser-level verification. Responsive conversion UI, server-action errors and dynamic recommendations create interaction states not covered by static markup review.

**Risk ownership:** Code-controlled for implementation/testing; content owners share responsibility for meaningful alt text, labels and copy.

**How to avoid:**
- Test the complete Call, Directions, Quote and each inquiry flow at keyboard-only and mobile widths.
- On invalid submission, preserve values, identify fields programmatically, announce an error summary/status and move focus predictably; on success, announce and focus confirmation.
- Verify visible focus is never obscured by sticky UI, menu focus is managed, reduced motion works, zoom/reflow is usable and touch targets meet WCAG 2.2 expectations.
- Pair automated rules with manual keyboard and at least one screen-reader smoke test.

**Warning signs:**
- Error text is only red or not linked to the field; focus remains on Submit after failure.
- Sticky footer overlaps the last control or focused content.
- A “100 accessibility” lab score is the only evidence.
- Required/error states or model recommendations are not announced.

**Verification evidence:**
- Browser assertions for focus target, `aria-describedby`/live status, retained values, keyboard menu and success state.
- Manual checklist records keyboard, zoom/reflow, reduced motion, touch size and screen-reader results on representative devices/routes.
- Automated axe/Lighthouse output is retained as supplementary evidence, not sole acceptance.

**Phase to address:** Phase 4; block launch on critical journey failures and retest production in Phase 5.

---

### Pitfall 11: Marketing scripts and oversized imagery erase mobile conversion performance

**What goes wrong:**
Large official source images, a ~487 KB logo marked priority globally, unscoped GTM/GA/Meta scripts and future social/media embeds degrade LCP/INP, consume mobile data and introduce layout shift. A fast local build hides real-device and third-party cost.

**Why it happens:**
Official assets are assumed web-ready; all tags are placed in the root layout; optimization is judged once in a lab before production traffic. Vercel image transformations and bandwidth also create operating cost.

**Risk ownership:** Code-controlled for derivatives, dimensions, loading and budgets; marketing/content owners for tag and asset discipline.

**How to avoid:**
- Generate approved right-sized AVIF/WebP derivatives, use an optimized SVG/raster logo, declare intrinsic dimensions/sizes and preload only the actual route LCP asset.
- Keep server-first pages, route/consent-gate third parties, avoid heavy feeds/carousels/video and maintain explicit page-weight/third-party budgets.
- Measure representative low-end mobile/slow-network lab runs before launch, then field Core Web Vitals at the 75th percentile when sufficient traffic exists.
- Set alert/budget review for image transformations, data transfer and function execution.

**Warning signs:**
- Mobile hero downloads a desktop original; `sizes` is absent or the same asset is priority on every page.
- Tag count/network/main-thread time grows without a named business KPI.
- Lighthouse is run only on localhost with tags disabled.
- Good lab results but Search Console/field LCP, INP or CLS deteriorate after campaign launch.

**Verification evidence:**
- CI performance smoke on representative home/model/landing/form pages with documented budgets; production Lighthouse/WebPageTest trace with real tags and consent states.
- Asset audit proves responsive derivatives, dimensions and no unnecessary priority images.
- Field dashboard tracks LCP/INP/CLS by page template and device; “good” assessment targets the 75th percentile.

**Phase to address:** Asset/tag budgets in Phase 3, enforce in Phase 4, real production baseline in Phase 5, monitor during Phase 6 campaigns.

---

### Pitfall 12: Honeypot-only protection turns lead delivery into a spam and cost amplifier

**What goes wrong:**
Bots bypass the hidden field, flood downstream email/CRM/webhooks, exhaust serverless/destination quotas, poison attribution and bury real commercial leads. Client-controlled provenance and weak string-only validation make abuse cheaper.

**Why it happens:**
Honeypots stop only simple bots. No rate policy, circuit breaker, payload cap or abuse monitoring exists; public uploads would multiply storage/malware/privacy exposure.

**Risk ownership:** Shared. Engineering implements layered controls; stakeholder/privacy owner approves tradeoffs and escalation; destination owner provides quotas and abuse response.

**How to avoid:**
- Enforce strict schemas, body/field caps and allow-lists before expensive work; derive trusted metadata server-side.
- Apply privacy-approved rate limits at appropriate keys/layers, destination concurrency/backpressure, circuit breaker and anomaly alerts. Add a challenge only when risk justifies its accessibility/privacy cost.
- Separate abuse rejection metrics from lead analytics and never log full malicious/PII payloads.
- Keep uploads disabled until a complete file-security/data lifecycle is approved and tested.

**Warning signs:**
- Sudden submission bursts, identical payloads, high rejection/destination latency or serverless spend.
- Honeypot catches nothing while business inbox fills with spam.
- Rate-limit behavior is undocumented or blocks all users behind shared networks.
- Arbitrarily large attribution/free-text requests reach JSON parsing or the webhook.

**Verification evidence:**
- Automated burst, bypass, oversized-body, malformed-field and downstream-slow tests prove bounded resource use and usable responses.
- Monitoring distinguishes accepted, validation-rejected, rate-limited and delivery-failed counts without PII.
- Runbook demonstrates threshold adjustment, allow/review path and circuit-breaker recovery.

**Phase to address:** Phase 2 for endpoint controls and telemetry, Phase 3 for privacy/security review, Phase 5 for controlled production verification.

---

### Pitfall 13: Vercel deployment succeeds but the commercial production system is misconfigured

**What goes wrong:**
The dealership runs on a non-commercial Hobby setup, Preview and Production variables drift, a new variable is assumed to affect an old deployment, DNS/canonical/lead credentials differ, or an automatic promotion reaches the public domain without the launch gate. Runtime logs expire before lead failures are investigated.

**Why it happens:**
“Deployed” is treated as “production-ready.” Vercel has separate Local, Preview and Production environments, and environment-variable changes apply only to new deployments. Vercel states Hobby is for non-commercial personal use; this project requires a business-approved commercial plan and owner.

**Risk ownership:** External for plan/payment, team ownership, domain/DNS and account access; engineering for validated configuration, release process, smoke tests and observability.

**How to avoid:**
- Confirm commercial plan, billing/spend alerts, team owner/admins, production branch, domain/DNS owner and rollback authority.
- Maintain an executable environment schema with public/secret classification and environment-specific required values; never copy production PII destinations into unprotected previews by default.
- Deploy an immutable candidate, run production-like smoke tests, then promote; document redeployment after variable changes and immediate rollback.
- Export/retain only approved PII-safe operational metrics for the required investigation period rather than relying solely on transient console logs.

**Warning signs:**
- Personal Hobby team hosts the public dealership site; only one individual owns the project/domain.
- Preview submissions reach live sales, or production uses test IDs/webhooks.
- Changing a dashboard variable is believed to update the current deployment.
- No one can name the currently deployed commit, rollback path, usage alert or log retention.

**Verification evidence:**
- Recorded plan/team/domain ownership, least-privilege access and spend/usage alert test.
- Environment-schema report for Preview/Production without exposing secrets; deployment maps to commit and configuration version.
- Candidate smoke suite proves origin, robots, forms, consent/tags and headers before promotion; rollback drill succeeds.

**Phase to address:** Ownership and configuration contract in Phase 1; deployed gate and rollback in Phase 5. It blocks public launch.

---

### Pitfall 14: Security headers are added mechanically and either remain weak or break measurement

**What goes wrong:**
The site has some headers but lacks a tested CSP/HSTS policy; or a strict CSP is copied in late and breaks Next.js scripts, analytics, maps or forms. Secrets/PII leak into client bundles, logs or third-party error tools despite server-side validation.

**Why it happens:**
Header checklists ignore the actual script/style/connect/image/frame sources and deployment behavior. Next.js CSP nonce designs can require dynamic rendering, affecting the static-first performance model, so this must be designed rather than pasted.

**Risk ownership:** Code-controlled, with external approval for permitted vendors/domains and production HTTPS ownership.

**How to avoid:**
- Inventory required origins and select a CSP approach compatible with the actual Next.js rendering/tag strategy; begin with Report-Only, review violations, then enforce.
- Keep `frame-ancestors`, `object-src`, `base-uri`, `form-action`, referrer and permissions policy restrictive; enable HSTS only on the final HTTPS domain with an intentional subdomain policy.
- Prove server-only secrets never enter `NEXT_PUBLIC_*`, browser bundles, source maps, error messages or logs.
- Treat any new vendor/tag as a security/privacy/performance change requiring policy review.

**Warning signs:**
- CSP contains broad `*`/`unsafe-eval` allowances without rationale, or is absent because “GTM needs it.”
- Console CSP violations are ignored; form or tag failures appear only in production.
- Webhook URLs/tokens or lead payloads appear in client JavaScript/logs.
- HSTS preload/subdomain options are enabled before domain inventory.

**Verification evidence:**
- Automated production header test plus stored CSP Report-Only review; enforced policy passes critical journey and tag/network tests.
- Bundle/log scan detects seeded secret/PII canaries nowhere outside approved destination.
- Dependency audit and secret scanning run in CI; security owner signs off permitted external origins.

**Phase to address:** Phase 3 design/implementation, Phase 4 automated regression, Phase 5 final-domain enforcement.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|---|---|---|---|
| Return a fake/dev lead reference without persistence | Demo works without integration | Invisible loss of every production inquiry | Development only, with unmistakable non-production response |
| Synchronously `fetch` one webhook | Minimal code | Customer latency, no retry/recovery, duplicates | Temporary staging spike only |
| Treat field metadata as both schema and UI while filtering variants separately | Fast form creation | Hidden required fields and tampering gaps | Never without a compiled variant contract and tests |
| Leave content approval in comments/checklists | Easy publishing | Unsupported claims, stale terms and releases | Draft content only; never a production publication gate |
| Source-regex tests as the full suite | Zero additional dependencies | Green build with broken revenue journeys | Keep only as supplemental repository invariants |
| Put all marketing tags in root layout | Simple installation | Consent, duplication and performance problems | Only when approved, consent-governed and budgeted |
| Repository content with no owner/review date | No CMS cost | Stale operating facts and developer bottleneck | Launch only with schema, named owner and review cadence |
| Add city/model landing pages by template | Fast keyword coverage | Thin/doorway content and maintenance debt | Paid noindex variants, or genuinely distinct approved content |
| Enable public uploads “for convenience” | Better parts/service detail | Malware, storage, access and retention burden | Never until a separate approved secure-upload design exists |
| Trust Vercel dashboard configuration manually | Quick deployment | Environment drift and irreproducible incidents | Never for launch-critical values; validate executable schema |

## Integration Gotchas

| Integration | Common mistake | Correct approach |
|---|---|---|
| Lead webhook/CRM/email | Success means `fetch` returned or fallback ID was made | Durable acceptance, stable ID, authenticated adapter, timeout/retry/dead letter, reconciliation |
| GA4 / Google Ads | Event fires on button click or optimistic UI | Fire once after durable acceptance; reconcile with delivered/qualified outcomes |
| GTM | Environment ID is treated as consent and any publisher may add tags | Restrictive default, consent initialization/checks, least-privilege publishing, version rollback |
| Meta Pixel | Loads globally with no approved consent/parameter audit | Gate by approved state; allow-list non-PII event fields; verify network behavior |
| Vercel variables | One value is assumed across Preview/Production or applies immediately | Scope explicitly, validate per environment, redeploy after changes, smoke the deployment |
| Vercel Preview | Preview is assumed private and production-safe | Protect access where appropriate, noindex, use test destinations/IDs, never expose production secrets casually |
| Custom domain/DNS | Domain switch is just a DNS task | Align HTTPS, redirects, canonical, sitemap, schema, Search Console, GBP and rollback |
| Google Business Profile | Website schema is assumed to update or verify GBP | Assign external owner; verify NAP/category/hours/profile separately and audit consistency |
| Maps/directions | Address search URL is assumed to be the verified listing | Use direct approved GBP/place target when supplied; test mobile destination |
| Search Console | Sitemap submission is postponed until after launch | Verify ownership before launch; submit/inspect on real production origin |

## Performance Traps

| Trap | Symptoms | Prevention | When it breaks |
|---|---|---|---|
| Original dealership/product imagery served as-is | Slow LCP and large mobile transfer | Responsive derivatives, dimensions, correct `sizes`, route-specific priority | Immediately on mobile/slow networks |
| Global tag stack | Growing requests/main-thread work and worse INP | One control path, consent/route gating, tag budget | As soon as real IDs/container tags are enabled |
| Synchronous lead destination | Spinner tracks external latency/timeouts | Durable handoff with bounded delivery worker | First slow/outage/rate-limited destination |
| Dynamic nonce CSP applied globally without design | Static pages become dynamically rendered or cache behavior changes | Evaluate hash/nonce tradeoff against current Next.js architecture and measure | At CSP rollout, before traffic scale |
| Heavy local/gallery/social media growth | Layout shift, transfer, transformation cost | Curated static content, optimized media, pagination/lazy loading | Once delivery stories/galleries expand |
| Lab-only performance | Local scores stay green while field data worsens | Test production tags and use field p75 metrics | At launch/campaign traffic |

## Security Mistakes

| Mistake | Risk | Prevention |
|---|---|---|
| Honeypot as sole abuse control | Spam, quota/cost exhaustion, buried real leads | Strict caps/schema, layered rate policy, backpressure/circuit breaker, alerts |
| Client-controlled provenance outside strict schema | Oversized/malicious downstream data and false attribution | Single strict payload schema, server-derived fields, raw-size limit |
| Arbitrary select/date/phone values accepted | Operational garbage or injection into destination workflows | Enum/type validation and conservative normalization |
| PII in analytics, URLs or error logs | Privacy/policy breach and uncontrolled replication | Allow-list telemetry, scrub logs, canary tests, never encode form data in URLs |
| Secrets in `NEXT_PUBLIC_*` or preview | Credential exposure | Server-only schema, secret scanning, scoped preview credentials |
| Late untested CSP/HSTS | Either weak protection or production breakage | Report-Only rollout, actual origin inventory, final-domain tests |
| Public uploads without approved lifecycle | Malware and unauthorized sensitive-file retention | Defer; later isolate, scan, authorize, expire and delete |
| Unlimited webhook retries | Duplicate leads and self-inflicted outage | Idempotency keys, bounded retry/backoff, dead letter and circuit breaker |

## UX Pitfalls

| Pitfall | User impact | Better approach |
|---|---|---|
| Calling a request a confirmed booking/availability | False expectation and lost trust | “Request schedule/availability”; show follow-up expectation approved by operations |
| Generic validation error for hidden/missing field | User cannot recover | Variant-derived schema, field-linked errors, summary and focus |
| Long sales form copied onto paid landing page | Lower mobile completion | Approved minimum contract, progressive follow-up, no hidden required fields |
| Sticky Call/Quote/Directions covers form/focus | Mobile journey becomes unusable | Reserve safe area, test zoom/keyboard/focus on devices |
| Truck finder appears authoritative despite weak rules | Wrong purchasing expectation | Reviewed decision table, explain rationale/caveat and route to consultation |
| Stock/price/finance language without live systems | Misleading promise | Request-oriented language and current approved evidence |
| Consent dark pattern | Users cannot make a meaningful choice | Clear equal choices, purpose detail and withdrawal |
| Success page has no reference/follow-up state | User resubmits or calls uncertainly | Durable reference, accurate next-step text and accessible confirmation |

## “Looks Done But Isn’t” Checklist

- [ ] **Lead forms:** A success screen exists—verify every lead type and compact variant creates a recoverable destination record with the same ID.
- [ ] **Routing:** A webhook URL exists—verify auth, timeout, idempotency, retry, dead-letter, alerts and manual replay.
- [ ] **Consent:** A checkbox/banner exists—verify approved controller/purposes/retention/rights plus pre-consent, rejection and withdrawal network behavior.
- [ ] **Analytics:** DebugView sees events—verify exactly-once semantics, attribution persistence, PII exclusion and reconciliation to accepted/qualified leads.
- [ ] **SEO:** Metadata/robots/sitemap files exist—verify rendered output against malformed, preview and real production origins.
- [ ] **Local SEO:** AutoDealer schema exists—verify every value matches visible approved NAP and GBP; omit unknown hours/claims.
- [ ] **Content:** Official Hino sources exist—verify local Cebu applicability, brand usage, freshness, promotion terms and customer releases.
- [ ] **Accessibility:** Automated scan passes—verify keyboard, focus/error recovery, screen reader, zoom/reflow, touch size and sticky UI.
- [ ] **Performance:** Local Lighthouse passes—verify production tags/assets and field p75 LCP/INP/CLS.
- [ ] **Security:** Headers and honeypot exist—verify CSP behavior, rate/burst handling, payload caps, secret/PII scanning and circuit breaker.
- [ ] **Vercel:** Production deploy is green—verify commercial plan, owners, scoped env, deployed commit, real domain, rollback and spend alerts.
- [ ] **Paid landing pages:** Page and pixel exist—verify form completion, noindex/canonical decision, conversion reconciliation and qualified-lead economics before scaling.

## Recovery Strategies

| Pitfall | Recovery cost | Recovery steps |
|---|---|---|
| Leads falsely acknowledged/lost | HIGH | Pause forms/ads; switch to an accurate fallback CTA; inspect destination logs; contact identifiable affected users only under approved process; implement durable ledger and replay before reopening |
| Duplicate lead delivery/conversions | MEDIUM | Stop retry worker/event; deduplicate by submission ID; correct downstream status; patch idempotency; annotate affected reporting period |
| Tags fired without approved consent | HIGH | Disable IDs/container version; preserve incident evidence without expanding PII; notify privacy owner; assess scope/obligations; implement/test consent gate before re-enable |
| PII leaked to analytics/URLs/logs | HIGH | Stop collection, remove offending parameters, restrict access/retention, follow approved incident process, request vendor deletion where available, validate with canary scan |
| Wrong claims/promotion/customer content published | HIGH | Unpublish/fail closed; preserve revision/source evidence; notify business/legal/brand owner; correct caches/search where needed; add build-time evidence rule |
| Wrong canonical/preview indexing | MEDIUM | Correct centralized origin/index policy, redeploy, update sitemap/redirects, use Search Console removal/inspection where appropriate, protect previews |
| Accessibility blocker | MEDIUM | Provide accessible alternative/contact path, disable obstructive UI, patch and regression-test complete task |
| Performance regression from tag/asset | LOW–MEDIUM | Roll back container/deployment, remove offending tag/asset, restore budget, compare production traces and field trend |
| Spam flood/downstream exhaustion | MEDIUM | Trip circuit breaker, tighten bounded controls, separate genuine backlog, coordinate destination recovery, replay clean accepted leads |
| Bad Vercel production promotion | MEDIUM | Roll back to known deployment, correct environment/domain, rerun smoke gate, document incident/config drift |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention phase | Verification |
|---|---|---|
| False-success / unrecoverable leads | Phase 2; production proof Phase 5 | Failure-mode matrix, synthetic lead, reconciliation ledger, alert/replay drill |
| Form/schema drift | Phase 2; gate Phase 4 | Contract invariant plus browser submission for every type/variant |
| Privacy governance absent | Phase 1 decision; Phase 3 implementation | Approved data map/notice/retention/rights and exercised request workflow |
| Consent/tag bypass | Phase 3; real account audit Phase 5 | Network tests for fresh/accept/reject/withdraw; GTM consent/version evidence |
| Untrustworthy attribution | Phases 2–5; scaling gate Phase 6 | One tagged journey maps to one accepted/delivered/qualified record with no PII |
| Unsupported dealership claims | Phase 1; publication gate Phase 4 | Evidence-bearing schema rejects unapproved/expired/local-inapplicable content |
| Origin/indexing errors | Phase 1 contract; Phase 4 tests; Phase 5 domain | Environment matrix and deployed crawl/Search Console evidence |
| NAP/schema/doorway local SEO | Phases 1, 4, 5 and 6 | Single-source consistency test, GBP audit, distinct-value content review |
| Shallow green test suite | Phase 4 | Risk-based unit/integration/browser matrix in CI plus deployed smoke suite |
| Accessibility treated as score | Phase 4; production retest Phase 5 | Automated plus keyboard/screen-reader/zoom/mobile manual evidence |
| Mobile performance regression | Phases 3–5; continuous Phase 6 | Asset/tag budgets, production trace and field p75 LCP/INP/CLS |
| Spam/cost amplification | Phase 2; privacy review Phase 3 | Burst/oversize/downstream-slow tests and abuse metrics/runbook |
| Vercel configuration/ownership drift | Phase 1 contract; Phase 5 release | Commercial plan/owners, env report, commit mapping, smoke and rollback drill |
| Weak/breaking security headers | Phase 3; regression Phase 4; enforce Phase 5 | CSP report/enforcement evidence, header test, critical journey and secret scan |

## Research Flags for Roadmap Planning

- **Phase 1 needs decision tracking, not speculative implementation.** Legal basis/consent, controller identity, retention, lead recipients, local product/service/finance applicability, brand usage, commercial Vercel account, domain and GBP ownership are unresolved external dependencies in `BUSINESS_INPUTS_REQUIRED.md`.
- **Phase 2 needs phase-specific design research** once the destination is selected: durability mechanism, processor/security terms, quotas, retry semantics and replay access depend on whether the approved endpoint is CRM, email, spreadsheet, webhook or another system.
- **Phase 3 needs a legal/privacy checkpoint.** Engineering can implement a conservative technical default, but cannot approve the privacy notice, direct-marketing consent, processor relationships or retention period.
- **Phase 4 should introduce browser tooling deliberately.** The codebase currently has only Node source-contract tests; select tooling based on Next.js Server Actions and CI/Vercel compatibility during phase planning.
- **Phase 5 must use the real domain and account configuration.** Local or Preview proof alone cannot validate canonical host, DNS/HTTPS, production recipients, GTM containers, Search Console or GBP.
- **Phase 6 must remain gated by operational reconciliation.** Do not scale ads or publish large local-content variants until qualified-lead economics and factual approval workflows are working.

## Sources

### Project evidence (HIGH confidence)

- `.planning/PROJECT.md` — active production-readiness requirements, constraints and unresolved dependencies.
- `.planning/codebase/CONCERNS.md` — confirmed lead-routing, form-contract, SEO-origin, security, performance, content and observability gaps.
- `.planning/codebase/TESTING.md` — current five source-contract tests and absent behavioral/E2E coverage.
- `HINO_CEBU_MASTER_WEBSITE_SPEC.md` — business, funnel, SEO, accessibility, hosting and paid-media requirements.
- `BUSINESS_INPUTS_REQUIRED.md` — unresolved legal, operational, analytics, domain, brand and lead-destination inputs.
- `ASSET_REQUIREMENTS.md` — approved national sources and missing local photography/releases.

### Official external guidance

- [Philippines Data Privacy Act of 2012 — National Privacy Commission](https://privacy.gov.ph/data-privacy-act/) — consent definition, transparency, legitimate purpose, proportionality, retention and data-subject notice/rights requirements (HIGH).
- [NPC Circular No. 2023-04: Guidelines on Consent](https://privacy.gov.ph/wp-content/uploads/2023/11/NPC-Circular-No.-2023-04_Guidelines-on-Consent_07Nov2023.pdf) — current official consent guidance; final application still requires the project's legal/privacy owner (HIGH source authority, MEDIUM project interpretation).
- [Google Analytics: About consent mode](https://support.google.com/analytics/answer/10000067?hl=en) — Consent Mode consumes choices from a banner/CMP and does not itself provide consent collection; basic and advanced behavior differ (HIGH).
- [Google Tag Manager consent mode support](https://support.google.com/analytics/answer/10718549?hl=en) — consent initialization, checks and Consent Overview (HIGH).
- [Google Ads: PII in URLs](https://support.google.com/google-ads/answer/6389382?hl=en) — Google tags capture current URLs and PII leakage can trigger enforcement (HIGH).
- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies) — doorway abuse includes substantially similar regional/city pages that funnel users onward (HIGH).
- [Next.js Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) and [generateMetadata reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — current App Router metadata/file conventions and `metadataBase` behavior (HIGH).
- [Next.js Content Security Policy guide](https://nextjs.org/docs/app/guides/content-security-policy) — framework-specific CSP guidance; approach must be evaluated against rendering strategy (HIGH).
- [Vercel Environments](https://vercel.com/docs/deployments/environments) and [Environment Variables](https://vercel.com/docs/environment-variables) — Local/Preview/Production separation and redeployment behavior (HIGH).
- [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) — Hobby teams are restricted to non-commercial personal use; commercial usage requires Pro or Enterprise (HIGH).
- [Web Vitals](https://web.dev/articles/vitals) and [Largest Contentful Paint](https://web.dev/articles/lcp) — current LCP/INP/CLS field measurement and 75th-percentile assessment (HIGH).
- [W3C: What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) — WCAG 2.2 focus and target-size additions relevant to sticky mobile actions/forms (HIGH).

## What Might Have Been Missed

- The selected lead destination is unknown, so exact durability, data-location, processor, authentication and retry constraints cannot yet be verified.
- The final production domain, prior-site migration/redirect inventory, DNS registrar and GBP ownership are unknown.
- This research is not legal advice; Philippine privacy/marketing obligations and Hino trademark/dealer authorization need named professional/business approval.
- No production analytics, Search Console, GBP, Vercel or destination account was available for direct configuration audit.
- Real-device network quality, expected campaign volume and dealership lead-response staffing/SLA are not yet measured; performance, abuse and operational alert thresholds must be calibrated after controlled launch.

---
*Pitfalls research for: Hino Cebu MVP-to-production and growth milestone*
*Researched: 2026-08-18*
