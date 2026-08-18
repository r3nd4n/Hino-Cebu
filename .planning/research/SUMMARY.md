# Project Research Summary

**Project:** Hino Cebu Digital Growth Website
**Domain:** Brownfield local commercial-dealership lead-generation and content-authority website
**Researched:** 2026-08-18
**Confidence:** HIGH for production-readiness priorities and architecture; MEDIUM for provider-specific and post-launch choices

## Executive Summary

Hino Cebu already has a credible Next.js MVP: the route set, product and service journeys, typed repository content, reusable forms, attribution capture, SEO utilities, and responsive UI are validated baseline capabilities. This milestone should not rebuild them. Experts would retain the server-first modular monolith and harden its existing seams so the site can truthfully accept and recover inquiries, publish only approved Cebu-specific facts, respect privacy choices, and prove its behavior in a real commercial deployment.

The recommended approach is to keep Next.js 16, React 19, TypeScript, Zod, repository-managed content, and the vendor-neutral `LeadRouter`; align local, CI, and Vercel runtimes on Node.js 24 LTS; and use a commercial Vercel plan. Work should proceed from external decisions and executable configuration to form correctness and durable lead acceptance, then privacy/security/publication controls, behavioral verification, and production launch. The durable lead destination, function region, consent policy, legal text, production domain, analytics accounts, and monitoring ownership are decisions awaiting approval—not established technology facts.

The highest risks are false-success lead loss, form/schema drift, unsupported local claims, PII or tags operating without approved governance, wrong production origin/indexing, and green builds that never exercise real journeys. Mitigate them by acknowledging a lead only after durable acceptance, sharing form-variant contracts between UI and server validation, making publication and environment rules executable, keeping telemetry PII-safe, testing browser journeys and failure modes, and requiring stakeholder approval plus a real-domain launch rehearsal. Only after delivery and attribution reconcile reliably should the project expand local proof, decision support, content authority, or paid acquisition.

## Key Findings

### Recommended Stack

Retain the current architecture and add narrowly scoped production controls rather than rewrite the application. The stack research is strongest where official framework, runtime, hosting, testing, accessibility, privacy, and search documentation apply. Provider-specific lead delivery remains deliberately unresolved until the dealership approves an operational destination that satisfies durability, audit, retention, deletion, access, and replay requirements.

**Core technologies:**

- **Next.js App Router 16.3.1 + React 19.2.8:** Preserve the existing server-rendered application and small client islands; a rewrite would add risk without closing a launch gap.
- **TypeScript 6.0.2 + Zod 4.4.3:** Keep compile-time contracts and reuse Zod for strict inbound payloads, executable environment validation, and evidence-bearing publication rules.
- **Node.js 24.x LTS:** Use the supported runtime consistently in development, CI, and Vercel; Node 20 is end-of-life.
- **Vercel Pro:** Use a commercial hosting plan with protected previews, environment separation, logs, observability, spend alerts, and controlled production promotion.
- **Vitest, Playwright, axe, and Lighthouse CI:** Add behavior, browser, accessibility, and release-candidate performance verification around revenue-critical journeys.
- **Cloudflare Turnstile Free:** Recommended as one layer of abuse resistance, subject to stakeholder/privacy acceptance; validate server-side and fail closed in production.
- **GTM/GA4/Ads hooks:** Keep one consent-gated, PII-free measurement path disabled until accounts, purposes, ownership, and consent behavior are approved.
- **Durable lead destination:** Required capability, provider pending. An already-owned CRM/Workspace endpoint is acceptable only if it can durably acknowledge, reconcile, retain/delete, alert, and support recovery; otherwise approve a separate durable ingress/store.

### Expected Features

The feature research treats existing MVP screens and journeys as implemented. “Must have” therefore means hardening and production proof, not recreating routes or components.

**Must have (launch-critical):**

- Every lead type and form variant has one UI/server contract, strict validation, honest recovery UX, bounded execution, and browser-level proof.
- A submitted inquiry is acknowledged only after authenticated, idempotent, recoverable acceptance; failures alert an owner and support reconciliation/replay.
- Approved controller identity, privacy notice, consent purposes, retention/deletion, recipients, rights process, and tag behavior govern PII and measurement.
- Verified branch identity, hours, direct directions target, department ownership, local product/support applicability, and request semantics replace provisional claims.
- Publication policy blocks unapproved, unsupported, expired, stale, unreleased, or locally inapplicable content at build time.
- A validated HTTPS production origin drives canonicals, robots, sitemap, structured data, redirects, Search Console, and preview noindex behavior consistently.
- Consent-aware, PII-free attribution and conversion events can reconcile to durable lead references before paid-media scale.
- Mobile journeys, WCAG 2.2 AA practices, optimized media, performance budgets, security headers, CI, monitoring, alerts, rollback, and production smoke tests are operational.

**Stakeholder/external prerequisites:**

- Approve the lead destination(s), department routing, authentication, durability/retry/replay contract, retention, processor terms, region, and operational owners.
- Approve the final domain/DNS ownership, Vercel commercial account and releasers, Google Business Profile target/ownership, analytics properties, and tag/container ownership.
- Approve controller/privacy contact, legal copy, consent model, marketing purposes, rights/incident workflow, brand usage, local product/service/parts/fleet/finance claims, branch facts, response wording, and content approvers.
- Supply authorized local photography, licenses/releases, promotion evidence, customer approvals, and source/review dates. Missing facts must be omitted, not inferred.

**Should have (post-launch differentiators):**

- Permissioned Cebu customer-delivery stories and a local visual proof system.
- Application-led Cebu Truck Guide content based on observed demand and reviewed local expertise.
- Corrected truck-finder rules, then transparent comparisons and 1–3-option recommendations with reasons and caveats.
- Reviewed aftersales and fleet authority resources grounded in actual branch processes.
- A minimal qualified-lead status loop, followed by offline outcome measurement when staff can maintain reliable stages.
- Measurement-led campaign/content iteration and an ongoing GBP/site accuracy workflow.

**Deliberate deferrals (v2+ or until a named trigger):**

- Real-time inventory, public pricing/payment calculators, online checkout/reservation, or guaranteed service booking without authoritative live systems.
- Public uploads until storage, malware scanning, access, retention, and deletion are approved.
- Full CRM automation, lead scoring, enhanced conversions, broad retargeting, or A/B tooling before durable IDs, consent, volume, and trustworthy outcomes exist.
- Paid CMS until repository publishing demonstrably blocks a sustained multi-author cadence.
- Generic AI adviser/chatbot, scraped reviews, thin city doorway pages, native apps, heavy embeds/video/carousels, and large unowned technical libraries.

### Architecture Approach

Preserve a modular Next.js monolith with explicit boundaries. Pages and small client islands consume governed content and domain interfaces; a thin Server Action validates a named form variant, applies abuse policy, creates a stable submission ID, and calls the existing `LeadRouter`. The selected server-only adapter must durably accept before the UI reports success, while idempotent delivery, bounded retries, dead-letter handling, reconciliation, and PII-safe lifecycle events operate behind that boundary. The same parsed configuration and publication policies must drive pages, metadata, sitemap, robots, tags, previews, and release checks.

**Major components:**

1. **App Router presentation and form variants** — Preserve current routes/components; derive rendered fields and strict server schemas from the same named contract.
2. **Lead action and abuse policy** — Treat submissions as public mutations, cap and validate inputs, apply layered bot/risk controls, and expose accurate accepted/rejected/unavailable states.
3. **`LeadRouter`, durable ingress, and destination adapter** — Preserve vendor neutrality, durably accept with a stable ID, deliver idempotently, classify failures, retry within bounds, dead-letter, and reconcile.
4. **Consent, attribution, and measurement adapters** — Keep inquiry processing separate from analytics/advertising choices; load one tag-control path only after approved consent and emit allow-listed PII-free events.
5. **Content publication policy** — Validate source, approval, local applicability, review/expiry, asset rights, and releases once; feed the same eligible records to pages, links, metadata, and sitemap.
6. **Runtime configuration and observability** — Parse environment state once, fail closed on production-critical inputs, separate preview/production, redact telemetry, and attach owners/alerts to lifecycle states.
7. **CI and release plane** — Combine unit/integration/browser checks, protected preview, human approvals, real-domain smoke tests, synthetic non-PII intake, monitoring, and rollback/configuration audit.

### Resolved Overlaps and Decisions

- **Lead work:** FEATURES emphasizes immediate form correctness; ARCHITECTURE emphasizes stakeholder contracts first. Resolve this by making approval/configuration the first roadmap phase while immediately following with lead correctness and durability. No acquisition or content growth precedes both.
- **Durability mechanism:** STACK allows an approved existing destination when it meets the acceptance contract; ARCHITECTURE illustrates durable ingress plus a worker. Treat the pattern as mandatory but the topology/provider as a phase decision. Do not assume Vercel Queues, a CRM, email, spreadsheet, or database is already selected.
- **Abuse controls:** STACK recommends Turnstile now; ARCHITECTURE describes progressive layered controls; FEATURES notes policy approval. Use Turnstile as the technical default for planning, but record provider/privacy approval and observed false-positive thresholds as prerequisites. Honeypot alone is insufficient.
- **Testing:** Architecture interleaves tests with every implementation phase, while PITFALLS maps a dedicated release-gate phase. Do both: require task-level tests continuously, then complete the cross-cutting browser/preview/production gate after contracts stabilize.
- **Content timing:** Local photography and proof should be obtained early, but public differentiator expansion remains post-launch. Launch may include only approved baseline facts/assets; stories and broad authority content wait for releases, stable measurement, and operational capacity.
- **Analytics:** Durable lead delivery does not depend on marketing tags. Launch with tags disabled if consent/accounts are unresolved; paid-media scaling and conversion claims require reconciliation first.

### Critical Pitfalls

1. **False success and unrecoverable leads** — Never equate a UUID or successful `fetch()` with acceptance; require durable acknowledgement, idempotency, bounded retries, dead letter, alerts, replay, and reconciliation.
2. **Form/schema drift** — Compile each variant’s renderer and server validation from the same contract and test every type/variant, including compact campaigns and failure recovery.
3. **Privacy and consent reduced to UI controls** — Approve controller, purposes, recipients, retention, rights, processors, and withdrawal; keep inquiry processing distinct from tag/marketing consent and audit actual network behavior.
4. **Unsupported claims or unsafe publication** — Require evidence, local applicability, approver, review/expiry, rights, and releases in schema; fail closed and omit unknown facts.
5. **Production confidence based on shallow checks** — Exercise real browser journeys, accessibility, assets/tags, headers, origins, crawl policy, preview isolation, synthetic intake, alerts, rollback, and the final domain—not only lint/build or local Lighthouse.

## Implications for Roadmap

Based on combined research, use six dependency-driven phases. These phases close production gaps around the validated MVP; they must not be scoped as route, component, or design-system rebuilds.

### Phase 1: Production Contracts and Executable Configuration

**Rationale:** Every later guarantee depends on agreed definitions of production, approved content, lawful processing, durable acceptance, and operational ownership.
**Delivers:** Decision register and sign-offs for controller/privacy/consent, branch facts, local offering, request semantics, routing/durability, domain/accounts, brand/content approval, and escalation; central environment schema; explicit Development/Preview/Production separation; commercial hosting ownership.
**Addresses:** Verified branch identity, privacy governance, local applicability, honest semantics, configuration safety.
**Avoids:** Speculative provider coupling, localhost canonicals, preview-to-production leakage, unsupported claims, and deployment ownership drift.

### Phase 2: Lead Correctness, Durable Acceptance, and Recovery

**Rationale:** Lead delivery is the core value and must be reliable before measurement, campaigns, or content expansion can be commercially meaningful.
**Delivers:** Shared form-variant contracts, strict normalization/validation, fixed compact campaign form, stable submission IDs, timeout/error taxonomy, approved durable adapter, idempotent destination delivery, bounded retry/dead letter, reconciliation/replay, honest failure UX, layered abuse controls, and PII-safe lifecycle alerts.
**Addresses:** Every sales/service/parts/fleet/finance/campaign submission, department routing, abuse resistance, recovery, and delivery ownership.
**Avoids:** False success, silent loss, duplicate leads/conversions, schema drift, spam amplification, raw-PII logging, and serverless fire-and-forget work.

### Phase 3: Truthful Publishing, Privacy, Measurement, and Security Controls

**Rationale:** With stable identities and lead IDs, the site can enforce factual publication, lawful tag behavior, bounded attribution, and defenses without guessing downstream contracts.
**Delivers:** Evidence-bearing content schemas/selectors, approved baseline Cebu content/assets, versioned granular consent and withdrawal, basic consent-mode implementation, one tag adapter, bounded/validated attribution, PII-free typed events, CSP report-only tuning, security headers, asset optimization, and initial performance budgets.
**Addresses:** Publication safety, local accuracy, privacy notice/consent, analytics readiness, production media, and security.
**Avoids:** Expired or nationally inapplicable claims, unreleased stories, pre-consent tags, analytics PII, multiple tag stacks, breaking CSP, and mobile performance erosion.

### Phase 4: Behavioral Verification and Release Gate

**Rationale:** The current source-contract tests cannot prove revenue or compliance behavior; cross-cutting gates should be finalized after domain contracts are stable.
**Delivers:** Vitest unit/integration coverage, Playwright critical journeys for every form variant, axe plus manual WCAG 2.2 AA checks, canonical/robots/sitemap/schema coherence tests, Lighthouse budgets, config/secret/dependency checks, CI jobs, protected preview smoke tests, approval checks, and documented rollback/runbook evidence.
**Addresses:** Form correctness, responsive navigation, accessibility, SEO/configuration, performance, security, and release repeatability.
**Avoids:** Green builds with broken journeys, automated-score-only accessibility, lab-only performance, secrets in previews, and untested configuration drift.

### Phase 5: Real-Environment Launch and Operations Handoff

**Rationale:** DNS, account permissions, destinations, tags, GBP, Search Console, and rollback state can only be proven in the approved production environment.
**Delivers:** Vercel Pro production configuration, final domain/DNS/HTTPS, canonical/indexing and redirect proof, Search Console and GBP alignment, production destination and consent/tag verification, synthetic non-PII end-to-end intake, uptime/delivery alerts, spend guardrails, incident/replay/rollback rehearsal, and named operational handoff.
**Addresses:** Commercial launch, monitoring, local discovery consistency, reliable attribution baseline, and stakeholder acceptance.
**Avoids:** Production as the first integration test, wrong crawl state, bad NAP/directions, test leads in live workflows, silent outages, and stale configuration rollback.

### Phase 6: Local Authority and Closed-Loop Growth

**Rationale:** Growth should follow trustworthy lead delivery, factual governance, baseline measurement, and observed Cebu demand—not precede them.
**Delivers:** A small approved cadence of delivery stories and local photography, application guides, corrected truck finder, comparison/aftersales/fleet resources, GBP operations, qualified-lead stages, and measurement-led campaign/content iteration. Offline conversion automation is added only when data quality and volume justify it.
**Addresses:** Post-launch differentiators, organic/local authority, decision support, repeat-owner value, and revenue-led optimization.
**Avoids:** Scaling ads into a leaky funnel, thin doorway content, unsupported advice, unowned editorial sprawl, noisy experiments, and premature CRM/CMS/tooling spend.

### Phase Ordering Rationale

- External approvals and configuration define the contracts; lead durability implements the core commercial promise; governance/security/measurement build on stable identities; verification proves those contracts; the real environment proves integrations; growth follows operational evidence.
- Publication work may begin alongside lead implementation once owners and schemas are approved, but it must complete before production SEO validation. Tests should accompany every phase even though Phase 4 completes the integrated gate.
- Phase 5 is a hard launch gate. Phase 6 is a post-launch track and must remain gated by reconciliation, factual approvals, response capacity, and sufficient measurement quality.
- If stakeholder inputs stall, engineering may build deterministic adapters and tests, but must not select a production provider, publish provisional claims, activate tags, or promote the site by assumption.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 1:** Decision facilitation and account/business discovery are required for legal/privacy interpretation, routing ownership, final domain, GBP, Vercel, brand, and local applicability; research cannot substitute for approval.
- **Phase 2:** Run provider-specific research only after the durable destination candidates are known. Validate API semantics, authentication, regional processing, quotas, acknowledgement durability, retries, idempotency, retention/deletion, audit/replay, alerting, and cost.
- **Phase 3:** Use a legal/privacy checkpoint for Philippine notice, consent, direct marketing, processors, and retention. Security-header design also needs final approved tag/origin inventory.
- **Phase 5:** Requires live-account and real-domain investigation rather than generic research: DNS, redirects, platform permissions, Search Console, GBP, tag containers, destination routing, and operational contacts.
- **Phase 6:** Research each guide/finder/comparison/aftersales slice against Search Console demand, Cebu sales/service expertise, approved Hino sources, customer evidence, and measured lead quality.

Phases with established patterns where a separate research phase can usually be skipped:

- **Phase 4:** Vitest, Playwright, axe, Lighthouse CI, GitHub Actions, and standard Next.js test/release patterns are well documented; focus planning on the project’s risk matrix and acceptance evidence.
- **Phase 3 publication/config implementation:** Zod-backed policy selectors, consent state, PII allow-listing, responsive image optimization, and report-only CSP rollout are standard once business decisions and allowed origins are supplied.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Current versions, runtime support, hosting terms, and test/security practices are grounded in official documentation. Lead provider and function region remain MEDIUM pending approval and processor location. |
| Features | HIGH for launch; MEDIUM post-launch | Launch blockers come directly from repository/project evidence and authoritative privacy/search guidance. Differentiator order needs production demand, customer releases, and sales-team data. |
| Architecture | HIGH for boundaries/order; MEDIUM provider topology | Existing code seams support the modular-monolith recommendation. Durable acknowledgement/idempotency are firm requirements; the exact CRM/queue/store/worker arrangement is unselected. |
| Pitfalls | HIGH | Risks are corroborated by current codebase gaps, operational failure modes, and official framework/platform/privacy/search/accessibility guidance. Thresholds need live calibration. |

**Overall confidence:** HIGH for roadmap structure; MEDIUM for unresolved external integrations and growth prioritization.

### Gaps to Address

- **Lead destination/provider:** Select only after comparing approved candidates against the acceptance, privacy, audit, replay, and cost contract; record the outcome as a decision.
- **Legal/privacy policy:** A named business/privacy owner must approve controller identity, lawful basis/consent, processors, retention/deletion, rights, incidents, cookies/tags, and direct-marketing behavior.
- **Business truth and brand authority:** Verify branch facts, local lineup and support processes, financing/fleet wording, response expectations, Hino asset rights, and customer releases before publishing.
- **Production estate:** Confirm domain/registrar, existing-site redirect inventory, Vercel account/roles, Git host/CI, analytics/GTM/Ads/Meta accounts, Search Console, and GBP ownership.
- **Operational capacity:** Define department owners, response windows, alert/escalation coverage, replay authority, synthetic-lead handling, and minimal stage taxonomy.
- **Observed baselines:** Calibrate rate limits, performance budgets, incident thresholds, content priorities, and paid-media scale using real devices, traffic, Search Console, qualified-lead outcomes, and branch workflow.
- **Provider costs and regions:** Recurring cost beyond Vercel Pro and data-processing location are unknown until the destination and alerting/monitoring approach are approved.

## Sources

### Primary (HIGH confidence)

- Project evidence: `.planning/PROJECT.md`, `.planning/codebase/CONCERNS.md`, `.planning/codebase/TESTING.md`, `HINO_CEBU_MASTER_WEBSITE_SPEC.md`, `BUSINESS_INPUTS_REQUIRED.md`, and `ASSET_REQUIREMENTS.md`.
- Next.js official documentation — App Router metadata, environment behavior, Content Security Policy, testing, and deployment patterns.
- Node.js release schedule and Vercel Node.js runtime documentation — Node 24 LTS recommendation and Node 20 end-of-life.
- Vercel official documentation — commercial plan/fair use, environments, sensitive variables, deployment protection, observability, logs, firewall controls, regions, and rollback behavior.
- Zod, Vitest, Playwright, axe-core, Lighthouse CI, and GitHub Actions official documentation — validation and release-gate capabilities/compatibility.
- Cloudflare Turnstile official documentation — server-side Siteverify, hostname/action checks, token lifetime, and free-plan production use.
- Philippine National Privacy Commission — Data Privacy Act and Circular No. 2023-04 consent guidance.
- Google official documentation — Consent Mode/GTM consent controls, Ads PII restrictions, lead-generation/offline outcome measurement, Search spam policies, Search Console, and Business Profile accuracy.
- W3C WCAG 2.2 and web.dev Web Vitals guidance — accessibility and production performance criteria.
- Official Hino Motors Philippines, Isuzu Philippines, and FUSO Philippines materials — national product/support context and dealership contact expectations; local Hino Cebu applicability still requires approval.

### Secondary (MEDIUM confidence)

- Cross-document synthesis of likely post-launch differentiation — Cebu delivery proof, application guides, reviewed decision support, and aftersales/fleet authority; validate priority against real search and lead data.
- Architecture inference that a separate worker is preferable when the selected destination cannot acknowledge durable persistence quickly; exact topology depends on the approved provider.

### Tertiary (LOW confidence)

- None used as a basis for launch requirements. Unverified stakeholder facts, provider assumptions, scraped claims, and unsourced local availability/pricing are explicitly excluded.

---
*Research completed: 2026-08-18*
*Ready for roadmap: yes*
