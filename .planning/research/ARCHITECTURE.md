# Architecture Research

**Domain:** Production-ready local commercial-dealership lead-generation website
**Researched:** 2026-08-18
**Confidence:** HIGH for component boundaries and dependency order; MEDIUM for the final durable-lead provider pending stakeholder, privacy, and destination decisions

## Standard Architecture

### System Overview

Preserve the existing Next.js App Router application as a modular monolith. Add production controls at its current seams instead of replacing routes, server components, typed content, forms, or SEO helpers.

```text
Browser / crawler
  |-- server-rendered pages ------> typed, governed repository content
  |-- consent choice ------------> first-party consent state
  |-- PII-free measurement ------> consent-gated tag adapter
  `-- lead form ------------------> existing Server Action
                                      |
                                      v
                              strict form-variant schema
                                      |
                              abuse/risk policy boundary
                                      |
                              stable submission ID
                                      |
                                      v
                              LeadRouter contract (preserved)
                                      |
                         durable acceptance adapter
                                      |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
        accepted/retryable queue                   PII-safe outcome events
                 |                                         |
                 v                                         v
        destination-specific worker                 logs / metrics / alerts
                 |
          CRM, email, or team intake
                 |
        delivery status + dead letter

Build / release plane
  content schemas + environment schema + unit/integration/browser tests
                 -> protected preview -> human approval -> production
```

The key reliability rule is: **the visitor sees success only after an approved durable system has accepted the lead**. A generated UUID or an outbound `fetch()` attempt is not durable acceptance. Delivery to the final sales/service/parts destination may happen asynchronously after that acceptance.

### Component Responsibilities

| Component | Responsibility | Typical implementation in this repository |
|-----------|----------------|--------------------------------------------|
| App Router presentation | Routing, server rendering, metadata, form composition, and small client islands | Keep `src/app/` and `src/components/` structure unchanged |
| Form contract | Named form variants, rendered fields, strict server schema, normalization, and consent wording/version | Extend `src/lib/leads/fields.ts`; both renderer and action consume the same variant definition |
| Lead action boundary | Treat the action as a public POST endpoint; cap/validate all fields, invoke abuse controls, create submission ID, and translate outcomes to safe UI states | Refactor `src/app/actions/leads.ts`, without provider logic |
| Abuse policy | Layer honeypot/timing signals, request quotas, risk escalation, and destination circuit breaking | New server-only module under `src/lib/abuse/`; platform WAF as outer layer |
| Lead durability boundary | Return an acceptance reference only after durable write; make writes idempotent | Preserve `LeadRouter`, strengthen its result/error contract, select adapter through server configuration |
| Delivery worker/adapter | Map the canonical lead envelope to the approved destination, retry transient errors, classify terminal errors, and dead-letter failures | Provider-specific server-only adapter/worker outside UI and action modules |
| Consent store | Hold separate, versioned analytics/advertising choices and support withdrawal | Small client island plus first-party cookie/storage policy approved by legal |
| Measurement adapter | Load one approved tag-control path only after applicable consent; emit typed, PII-free events | Evolve `MarketingTags.tsx` and `analytics.ts`; do not scatter provider calls |
| Attribution boundary | Allow-list and bound campaign fields, apply approved retention, attach them to a lead without treating them as consent to advertising | Evolve `attribution.ts`; document storage classification and expiry |
| Publication policy | Validate approval, source, local applicability, review date, expiry, asset rights, and release evidence before content is public | Shared Zod schemas and pure publication selectors under `src/content/` or `src/lib/content/` |
| Runtime configuration | Parse environment values once, distinguish development/preview/production, and fail closed for production-critical inputs | Server-only environment schema plus a public-safe derived configuration |
| Operational telemetry | Record outcome, latency, attempt, deployment, lead type, and error category without payload/contact fields | `instrumentation.ts`/provider adapter plus structured server events |
| CI/release gate | Prove contracts, journeys, deployment configuration, and human approvals before promotion | GitHub Actions, Vercel preview/deployment checks, protected production promotion |

### Architectural Invariants

1. Content remains independent; components may read content and libraries; route modules compose them. Provider SDKs never enter page or form components.
2. Client code never receives server secrets. `NEXT_PUBLIC_*` values are identifiers, not secrets.
3. A lead is acknowledged only after durable acceptance. Delivery is at-least-once, so every downstream write must use the stable submission ID as an idempotency key.
4. No lead payload, contact field, free text, VIN, plate, raw IP address, or full webhook URL enters analytics, logs, traces, alerts, or test fixtures.
5. Tag consent, inquiry-processing consent/notice, and optional future marketing-contact consent are separate purposes and states.
6. Preview deployments cannot write to production lead destinations or production analytics properties.
7. Publishable content is selected by policy, not by a page component checking one boolean.
8. Production configuration fails closed: invalid origin blocks indexing; missing durability configuration blocks a production build or lead submission; absent measurement IDs simply disables measurement.

## Recommended Project Structure

This is an additive target, not a bulk reorganization.

```text
src/
|-- app/
|   |-- actions/leads.ts            # thin public mutation boundary
|   |-- robots.ts                   # consumes validated site configuration
|   `-- ...                         # existing routes preserved
|-- components/
|   |-- forms/LeadForm.tsx          # renders named form variant
|   `-- marketing/
|       |-- ConsentControls.tsx     # choice and withdrawal UI
|       `-- MarketingTags.tsx       # consent-gated provider loader
|-- content/
|   |-- schemas.ts                  # governance metadata contracts
|   |-- publication.ts              # pure publishability selectors
|   `-- ...                         # existing typed records
|-- lib/
|   |-- config/
|   |   |-- server.ts               # production env schema; server-only
|   |   `-- public.ts               # derived browser-safe config
|   |-- abuse/
|   |   |-- policy.ts               # decision contract
|   |   `-- limiter.ts              # platform/store adapter
|   |-- consent/
|   |   |-- types.ts                # granular, versioned choices
|   |   `-- storage.ts              # persistence and expiry
|   |-- leads/
|   |   |-- types.ts                # canonical envelope and outcomes
|   |   |-- variants.ts             # UI/schema contract
|   |   |-- router.ts               # selected durable adapter
|   |   |-- adapters/               # provider-specific acceptance/delivery
|   |   `-- telemetry.ts            # PII-safe lifecycle events
|   `-- observability/
|       |-- events.ts               # structured event envelope
|       `-- redact.ts               # defensive redaction
|-- instrumentation.ts              # server error/trace registration
`-- instrumentation-client.ts       # lightweight client error/perf hook if approved

tests/
|-- unit/                            # policies and pure functions
|-- integration/                     # action, router, config, publication contracts
`-- e2e/                             # critical browser journeys and accessibility
```

### Structure Rationale

- **`src/lib/leads/`:** Keeps the canonical domain envelope stable while provider choice changes. Durability is an implementation of the existing boundary, not a new application architecture.
- **`src/lib/config/`:** One parser must drive site origin, robots, tags, lead routing, and observability so consumers cannot disagree about whether a deployment is production-ready.
- **`src/content/publication.ts`:** Keeps editorial eligibility testable and reusable by pages, sitemap, metadata, and internal links.
- **`src/lib/consent/`:** Prevents legal/policy state from being hidden inside a tag-rendering component.
- **`src/lib/observability/`:** Makes safe telemetry the default and keeps redaction testable.

## Architectural Patterns

### Pattern 1: Durable Acceptance Behind the Existing `LeadRouter`

**What:** Strengthen `LeadRouter.submit()` to accept a canonical envelope containing a stable `submissionId`, schema/consent versions, lead type, normalized payload, bounded attribution, and timestamp. The selected adapter must synchronously persist or enqueue it before returning `accepted`. A separate worker performs final delivery with bounded retry and dead-letter handling.

**When to use:** Every production lead form. Development may use a clearly labelled non-persisting adapter, but that adapter must be impossible to select in production.

**Trade-offs:** Introduces a small amount of state, privacy governance, and operational cost. It removes webhook latency from the user path after acceptance and makes transient destination failure recoverable. The final provider requires a focused feasibility decision: data region, encryption, retention, deletion, access controls, replay tooling, and cost must be approved. Vercel Queues now provides replicated, at-least-once delivery and idempotency features, but remains Beta and documents limited retention/data-residency behavior; do not select it merely because hosting is already on Vercel.

```typescript
type LeadAcceptance =
  | { status: "accepted"; submissionId: string; reference: string }
  | { status: "rejected"; reason: "invalid" | "abuse" }
  | { status: "unavailable"; retryAfterSeconds?: number };

interface LeadRouter {
  submit(lead: CanonicalLead): Promise<LeadAcceptance>;
}
```

**Failure paths:**

- Durable ingress timeout/unavailable: do not show success; retain form state and present retry plus verified phone fallback.
- Worker transient failure: retry with exponential backoff/jitter under a maximum attempt/age policy.
- Destination terminal rejection: dead-letter with error category and alert; never log payload.
- Duplicate browser or worker attempt: same `submissionId` returns the existing reference and causes no duplicate destination record.
- Destination backlog/circuit open: ingress may continue only within approved capacity/retention; otherwise fail visibly instead of accepting unrecoverable work.

### Pattern 2: Layered Abuse Controls With a Progressive Challenge

**What:** Combine platform firewall/rate rules, strict body limits and schemas, honeypot plus minimum-fill-time signals, a server-side quota/risk decision, and an optional challenge only for suspicious traffic. Rate limits protect capacity; they are not the sole bot defense.

**When to use:** Before durable storage and before any costly destination call.

**Trade-offs:** IP-only limits can punish offices, carriers, and shared mobile networks. Use coarse, privacy-approved identifiers, lead-type/source signals, and conservative thresholds. Store only the minimum abuse key for a short documented period. Next.js documents same-origin checks for Server Actions and a default 1 MB action body limit, but these do not replace authorization-quality validation or application abuse controls.

**Operational rule:** WAF rules are deployment configuration owned with code-visible documentation and smoke tests. Application policy remains the authoritative final decision because Server Action transport URLs are framework-managed.

### Pattern 3: Consent as a State Machine, Not a Banner Boolean

**What:** Model `necessary`, `analytics`, and `advertising` choices separately with policy version, timestamp, and source. Default optional categories to the legally approved state before any tags execute; load exactly one tag-control path; update and persist changes; expose a permanent preferences link and withdrawal.

**When to use:** Before enabling GTM, GA4, Google Ads, Meta, or any future non-essential browser storage.

**Trade-offs:** Basic consent mode yields less pre-consent measurement but has the clearest no-transmission boundary. Advanced Google consent mode can transmit cookieless pings under denied storage; legal/stakeholder approval must explicitly select the mode. Do not infer advertising consent from submitting a lead.

The Philippine National Privacy Commission requires clear, accessible notices, specified purposes, proportional collection, granular consent for unrelated purposes, an express assenting action, and evidence of what was presented. Google requires consent defaults to be set before measurement commands and supports later updates/withdrawal. Therefore the consent policy and notice version are stakeholder-controlled launch inputs, while code enforces the selected policy.

### Pattern 4: Policy-Driven Repository Publishing

**What:** Add governance fields to content types and validate all records at build time. A pure `publicationDecision(record, now, environment)` returns publishable or explicit reasons. Pages, sitemap, metadata, feeds, and internal links consume only the eligible collection.

**Required metadata by content class:**

| Content | Required evidence before publication |
|---------|--------------------------------------|
| Branch identity/hours/contact | owner, source/reference, approval ID/date, review due date |
| Truck/spec/application | source, local applicability, technical reviewer, review due date |
| Promotion | approval, applicable models/area, timezone-aware start/end, terms, owner |
| Delivery/customer story | customer release reference, asset rights, approval, publish window |
| Legal/consent copy | legal version, approver, effective date, superseded version handling |
| Campaign | owner, destination, indexability decision, expiry/archive action |

**Trade-offs:** Builds may intentionally fail while business evidence is incomplete. That is the desired failure mode. Draft records can remain in the repository, but no boolean alone may make them public. A CMS is unnecessary until editorial volume warrants it; a later CMS adapter must return the same validated domain records.

### Pattern 5: PII-Safe Lifecycle Observability

**What:** Emit a fixed event envelope at lead stages: `validation_rejected`, `abuse_rejected`, `durability_accepted`, `durability_failed`, `delivery_succeeded`, `delivery_retry`, and `delivery_dead_lettered`. Include only submission reference, lead type, form variant, adapter name, outcome, latency, attempt count, error category, environment, and deployment ID.

**When to use:** Across the Server Action, durable adapter, and worker. Use Next.js `instrumentation.ts`/`onRequestError` for uncaught server errors and the hosting platform for request/function signals.

**Trade-offs:** Platform logs alone do not prove lead delivery. Business lifecycle metrics must be emitted explicitly. A telemetry outage must not block durable lead acceptance. Alerts should cover acceptance failures, dead letters, abnormal abuse rate, queue age/backlog, and a zero-lead anomaly during normally active periods.

## Data Flow

### Lead Request Flow

```text
LeadForm(form variant, attribution, consent notice version)
  -> Server Action
     -> strict total schema (including provenance fields)
     -> normalize/allow-list values
     -> abuse policy
     -> create/reuse stable submissionId
     -> LeadRouter durable acceptance [short timeout]
        -> accepted: return reference and show success
        -> rejected: return actionable validation/abuse-safe response
        `-> unavailable: preserve fields, show retry + phone fallback

Durable ingress
  -> worker leases message
  -> destination adapter sends idempotently
     -> success: acknowledge + delivery metric
     -> transient: retry
     `-> terminal/max age: dead-letter + alert + authorized manual replay
```

### Consent and Measurement Flow

```text
First request
  -> render policy-approved consent defaults before provider tags
  -> read versioned first-party choice if present
  -> load consent UI
     -> analytics granted: enable approved analytics path
     -> advertising granted: enable approved advertising path
     -> denied/unset: no non-essential provider load in basic mode
  -> typed event adapter filters properties and consent state
  -> provider(s), never lead payload

Preferences link
  -> update or withdraw choice
  -> persist new version
  -> notify tag adapter immediately
```

Campaign attribution is a separate first-party data flow. Its keys, storage mechanism, duration, relationship to consent, and transfer to the lead destination require explicit privacy approval. Regardless of policy, validate it again on the server and never treat `gclid`, `fbclid`, or UTM values as trusted.

### Publication Flow

```text
Stakeholder evidence + repository content change
  -> schema validation
  -> publication policy (approval, source, local scope, dates, releases)
  -> unit/content tests
  -> protected preview for business/legal/brand review
  -> recorded approval
  -> production build selects eligible content
  -> pages + sitemap + metadata consume the same eligible set
```

### Release Flow

```text
Pull request
  -> lint + typecheck + unit/integration tests + production build
  -> dependency/security review
  -> Vercel preview with non-production destinations/analytics
  -> browser smoke, accessibility, SEO/header/config checks
  -> business/legal/brand approval when affected
  -> staged production deployment/deployment checks
  -> synthetic no-PII lead acceptance test
  -> promote custom domain
  -> monitor lead acceptance, delivery, errors, CWV
  -> instant rollback code when needed; separately verify mutable env/provider state
```

Vercel documents that environment changes apply only to new deployments and that instant rollback can restore a deployment with stale built configuration. The release runbook must therefore audit configuration and destination compatibility during both promotion and rollback.

## Testing and CI Boundaries

| Layer | Must prove | Blocks |
|------|------------|--------|
| Unit | form variants match server schemas; publication dates/timezones; consent transitions; event redaction; config parsing; retry/error classification; idempotency helpers | Pull request |
| Integration | every lead type/variant; malformed and oversized provenance; missing production config; ingress timeout/rejection/duplicate; dead-letter transitions; robots/canonical/sitemap coherence | Pull request |
| Browser | mobile/desktop critical journeys, compact campaign submission, keyboard/focus/error announcements, consent before tag load, withdrawal, outbound CTA tracking | Pull request or preview promotion |
| Preview smoke | correct preview origin/noindex, sandbox lead destination, no production tags, headers/CSP, synthetic non-PII acceptance | Production promotion |
| Production smoke | canonical/domain/robots/sitemap, tag consent behavior, verified phone/directions, synthetic no-PII intake and alert routing | Launch/go-live |

Use deterministic fakes for the durable adapter in PR tests. Never send realistic personal data to preview or production smoke tests. A recognizable `synthetic: true` contract must be approved by the destination and excluded from sales operations and marketing conversion counts.

## Deployment Configuration and Ownership

| Input/control | Owner | Enforcement |
|---------------|-------|-------------|
| Production domain and canonical origin | Business + engineering | Environment schema requires HTTPS, non-local origin; robots uses parsed result |
| Lead destinations, team routing, escalation SLA | Sales/service/parts/fleet stakeholders | Durable adapter configuration and acceptance smoke test |
| Controller identity, notice, retention, deletion, rights contact, consent mode | Legal/privacy + business | Versioned content/config; build gate and consent state machine |
| Analytics IDs, GTM container contents, conversion definitions | Marketing + privacy | Separate preview/production IDs; consent-gated single control path; container audit |
| Content sources, local applicability, technical facts, promotion terms, releases | Content owner + approver | Publication schema and recorded preview approval |
| Secrets and sensitive provider credentials | Engineering/authorized platform admin | Server-only sensitive environment values, least privilege, rotation runbook |
| WAF/rate thresholds and challenge mode | Engineering + operations | Platform config, documented baseline, alert review, false-positive procedure |
| Alert recipients and incident/lead replay authority | Dealership operations + engineering | On-call/escalation runbook and least-privilege access |
| Production promotion/rollback | Authorized releaser | Protected environment/deployment checks and approval record |

Environment sets must be intentionally different:

- **Development:** local origin, fake/non-persisting lead adapter with unmistakable UI/log labeling, tags disabled.
- **Preview:** protected URL, noindex, sandbox durable ingress/destination, test analytics or tags disabled, synthetic data only.
- **Production:** approved origin, durable ingress required, production destinations, approved consent policy/tags, alerts enabled.

## Build Order and Phase Dependencies

The remaining work should be sequenced by the guarantees later phases depend on.

1. **Stakeholder contracts and executable configuration**
   - Decide data controller/notice, lead destinations and owners, durability/retention/replay requirements, consent mode, production domain, tag ownership, and content approvers.
   - Implement the central environment schema and environment separation first.
   - Reason: every other production control depends on knowing what “production,” “accepted,” “approved,” and “consented” mean.

2. **Lead correctness and durability foundation**
   - Fix named form variants and strict total validation; add stable submission IDs, timeout/error taxonomy, durable acceptance, idempotent delivery, retries/dead letter, and failure UX.
   - Reason: abuse testing, telemetry, synthetic checks, and paid measurement are meaningless while forms can reject valid variants or silently lose accepted leads.

3. **Abuse controls and lead operational telemetry**
   - Add layered quotas/risk/challenge, circuit/backpressure policy, lifecycle metrics, alerts, safe synthetic health check, replay procedure, and retention/deletion operations.
   - Depends on: stable action contract and durable lifecycle states.

4. **Publication governance and verified launch content**
   - Add governance schemas/selectors, source and release evidence, expiry/freshness behavior, and preview approval workflow.
   - Can begin in parallel with phase 2 after stakeholder roles exist, but must precede launch SEO validation because metadata/sitemap must reflect the governed set.

5. **Consent-aware measurement and attribution reconciliation**
   - Implement granular consent state, approved tag mode, withdrawal, bounded attribution policy, typed conversions, and reconciliation of browser conversions with durable lead references.
   - Depends on: approved privacy policy and durable lead identifiers. Do not scale ads before this phase is production-verified.

6. **Automated test pyramid and CI/release gate**
   - Unit/integration tests should be added with phases 1-5; complete browser, preview, accessibility, SEO/header, dependency, and production-config gates here.
   - Reason: the release gate can only assert stable contracts that preceding phases define.

7. **Protected deployment, launch rehearsal, and operations handoff**
   - Configure preview protection, production promotion checks, DNS/domain, WAF, secrets, alerts, dashboards, rollback/config audit, incident contacts, and a synthetic end-to-end rehearsal.
   - Depends on all previous guarantees; production traffic is the final integration test, not the first.

## Scaling Considerations

| Scale | Architecture adjustments |
|-------|--------------------------|
| Launch / low volume | One Next.js application, one durable intake, one worker/consumer, repository content, platform WAF, focused lifecycle metrics |
| Sustained campaigns | Tune quotas by observed false positives, add queue-age/backlog dashboards, per-destination concurrency/circuit breakers, delivery reconciliation, and formal replay tooling |
| Multiple branches/destinations | Keep canonical lead envelope; add routing policy and independent consumer groups/adapters; partition operational access by branch, not UI forks |
| High editorial volume | Introduce a CMS adapter only when staffing/volume justifies it; preserve the same governance schema, preview, and publication decision contract |

### Scaling Priorities

1. **First bottleneck:** destination availability and operating-team follow-up, not Next.js rendering. Buffer delivery and measure time-to-accept/time-to-deliver before adding compute.
2. **Second bottleneck:** abuse and campaign bursts. Apply backpressure and adaptive challenge before raising downstream concurrency.
3. **Third bottleneck:** editorial governance. Migrate the content source only after repository review cadence becomes the constraint.

## Anti-Patterns

### Direct Webhook Equals Durability

**What people do:** Await a single webhook and report success for any 2xx response.
**Why it is wrong:** There is no durable acceptance contract, replay, idempotency, or proof of final delivery.
**Do this instead:** Acknowledge only a durable write, then deliver asynchronously with status and dead-letter operations.

### In-Memory Retry or Fire-and-Forget After the Action

**What people do:** Start an unawaited promise, timer, or module-level retry loop in a serverless function.
**Why it is wrong:** Instance shutdowns, timeouts, and deployments discard work.
**Do this instead:** Use an approved durable service and an idempotent consumer.

### Provider Logic in Forms or Routes

**What people do:** Import CRM, CAPTCHA, or analytics SDKs directly into `LeadForm` or page modules.
**Why it is wrong:** It couples UI, secrets, testing, consent, and vendor changes.
**Do this instead:** Keep domain interfaces and server/client adapters at explicit boundaries.

### Consent by Script Presence or Form Submission

**What people do:** Load all tags when IDs exist, or assume a lead-form checkbox grants advertising consent.
**Why it is wrong:** Purposes are bundled, withdrawal is impossible, and tags may transmit before choice.
**Do this instead:** Versioned granular state, approved defaults before tags, immediate update/withdrawal, and separate inquiry notice.

### `isPublished` as the Whole Editorial Workflow

**What people do:** Let one boolean expose content.
**Why it is wrong:** It cannot prove local applicability, source freshness, promotion validity, asset rights, or customer release.
**Do this instead:** Schema-backed evidence plus one reusable publication policy.

### Logging for Debugging With Raw Lead Objects

**What people do:** Log request bodies or provider errors containing payloads/URLs.
**Why it is wrong:** Logs become an uncontrolled PII store and secret leak.
**Do this instead:** Fixed safe event fields, defensive redaction, provider error categories, and restricted access.

### Preview Connected to Production

**What people do:** Reuse production webhooks and analytics IDs because previews are “temporary.”
**Why it is wrong:** Test leads reach staff, metrics are polluted, and preview URLs may expose unapproved content.
**Do this instead:** protected previews, sandbox adapters, distinct configuration, noindex, and synthetic fixtures.

## Integration Points

### External Services

| Service | Integration pattern | Notes |
|---------|---------------------|-------|
| Durable lead ingress | `LeadRouter` server adapter with short timeout and idempotency key | Final provider is a gated decision; require encryption, retention/deletion, region/failover disclosure, access control, export/replay, and cost review |
| CRM/email/team destination | Worker-side destination adapter | Never call directly from UI; 2xx/4xx/5xx mapping and destination reference must be specified |
| Vercel WAF/observability/deployments | Platform configuration plus code-visible tests/runbook | WAF rate limiting is available but may have plan/usage cost; platform logs do not replace lead lifecycle metrics |
| GTM or direct GA4 | One consent-aware adapter | Prefer GTM as the single control plane if marketing owns multiple tags; audit container permissions and prohibit PII variables |
| Meta Pixel | Consent-gated advertising adapter | Disabled until advertising consent policy and identifier are approved |
| GitHub Actions | Required PR checks and protected production environment | Use least-privilege tokens; pin action versions; avoid two competing deployment/promotion authorities |
| Alerting/error provider | PII-safe structured events from Next instrumentation and lead lifecycle | Start with platform capabilities if they meet retention/alert needs; add SaaS only for a documented gap |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `LeadForm` ↔ form variant | typed direct import | Variant determines both rendered fields and strict server schema |
| Server Action ↔ abuse policy | server function/result | Reject before durable/costly work; safe reason returned to client |
| Server Action ↔ `LeadRouter` | canonical lead envelope/result | Existing seam retained; result becomes explicit acceptance state |
| Durable ingress ↔ delivery worker | at-least-once message/record lease | Stable ID and idempotent destination are mandatory |
| Content records ↔ publication policy | pure validated data | Same eligible collection feeds pages, sitemap, metadata, links |
| Consent controls ↔ tag adapter | versioned state/events | No provider-specific state in general UI |
| Runtime config ↔ SEO/leads/tags/telemetry | parsed immutable config | Public-safe and server-secret views must be separate |

## Sources

- [Next.js Server Actions configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions) — same-origin protection and request body limits; HIGH confidence.
- [Next.js data security guide](https://nextjs.org/docs/app/guides/data-security) — Server Actions are public HTTP endpoints and require normal security treatment; HIGH confidence.
- [Next.js instrumentation](https://nextjs.org/docs/pages/api-reference/file-conventions/instrumentation) — server initialization and `onRequestError`; HIGH confidence.
- [Google consent mode implementation](https://developers.google.com/tag-platform/security/guides/consent) — defaults before measurement, updates, persistence, and withdrawal; HIGH confidence.
- [Philippine National Privacy Commission Circular 2023-04](https://privacy.gov.ph/wp-content/uploads/2023/11/NPC-Circular-No.-2023-04_Guidelines-on-Consent_07Nov2023.pdf) — transparency, proportionality, granularity, express action, and proof of consent; HIGH confidence for the cited principles, but implementation still requires project counsel/privacy approval.
- [Vercel Queues](https://vercel.com/docs/queues) — current Beta status, at-least-once delivery, retries, idempotency, retention, and region behavior; HIGH confidence for capabilities, MEDIUM confidence for project suitability.
- [Vercel WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting) — platform outer-layer quotas and pricing consideration; HIGH confidence.
- [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks) — staged promotion gated by checks; HIGH confidence.
- [Vercel environment management](https://vercel.com/docs/environment-variables/manage-across-environments) — distinct development, preview, and production configuration; HIGH confidence.
- [Vercel production checklist](https://vercel.com/docs/production-checklist) — CSP, deployment protection, WAF, log retention, observability, and operational readiness; HIGH confidence.
- [Vercel Instant Rollback](https://vercel.com/docs/instant-rollback) — rollback behavior and stale build-time configuration caveat; HIGH confidence.
- [GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments) — required reviewers, protected environments, and branch restrictions; HIGH confidence.
- Context7 `/vercel/next.js/v16.2.9` documentation snapshot — Server Action body limits/allowed origins, App Router environment access, and instrumentation conventions; HIGH confidence.

---
*Architecture research for: Hino Cebu production-readiness milestone*
*Researched: 2026-08-18*
