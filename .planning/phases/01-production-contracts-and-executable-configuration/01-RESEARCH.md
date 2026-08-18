# Phase 1: Production Contracts and Executable Configuration - Research

**Researched:** 2026-08-18
**Domain:** Repository-backed governance contracts, environment safety, protected review, and release operations
**Confidence:** HIGH for implementation architecture; MEDIUM for approval-dependent operational values

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### Approval Ownership

- **D-01:** Use two-tier approval. Each responsible department approves its facts and claims; one release owner confirms that every required approval is complete before promotion.
- **D-02:** Use fixed specialized lanes: sales approves trucks, financing, and fleet; aftersales approves service and parts; privacy/legal approves data handling and consent; brand/content approves assets and public wording; the technical release owner approves configuration and deployment readiness.
- **D-03:** The repository records approval status, approver role, approval date, next-review or expiry date, and a reference to authoritative evidence. Signatures, personal data, credentials, and sensitive approval documents remain outside Git.
- **D-04:** Every approved fact or claim has a scheduled review date. Relevant operational, legal, product, contact, pricing, or source changes invalidate the approval immediately and require reapproval.

### Missing Information Behavior

- **D-05:** Public production omits unapproved facts, claims, and offers. When useful, it preserves the customer's task with an honest contact or request action. Developer placeholders and provisional claims never render publicly.
- **D-06:** Protected previews use the same omission behavior as production. A separate protected review report lists missing approvals, evidence references, owners, and blockers.
- **D-07:** A route may publish in reduced form only when its identity, purpose, request semantics, and contact action meet the approved minimum viable truth contract. Otherwise it is excluded from navigation, internal links, sitemap eligibility, and indexing until ready.
- **D-08:** Expired or invalidated content immediately loses active eligibility and alerts its owner. It is removed from active listings, claims, links, and sitemap eligibility; an existing URL may remain only as a truthful expired or unavailable page when that still helps users.

### Lead Operating Contract

- **D-09:** The website may confirm “request received” only after an approved system has persisted the complete normalized inquiry, returned a stable reference, and made the record available for reconciliation and recovery even if later departmental delivery fails.
- **D-10:** Sales owns quote, financing, and fleet inquiries. Aftersales owns service and parts inquiries. A central operations owner monitors routing, reconciliation, aging, and escalation across all lead types.
- **D-11:** Use two-stage escalation: notify central operations immediately when routing or delivery fails; notify the department owner and named backup when an accepted inquiry remains unacknowledged beyond its approved lead-type response window.
- **D-12:** A secondary intake may be used only when pre-approved and contract-equivalent for durable receipt, stable references, reconciliation, and recovery. If neither intake can confirm durability, fail closed with retry and verified phone/contact alternatives—never optimistic success.

### Release Authority

- **D-13:** Ordinary production releases are manually promoted from a protected preview after technical gates pass and all required business/content approvals are recorded. The designated technical release owner performs promotion.
- **D-14:** Only the named technical release owner or named backup may perform an emergency production change, and only to contain customer, lead, privacy, security, indexing, or availability risk. Affected business owners are notified and the change receives retrospective review.
- **D-15:** The release owner or backup may roll back immediately without new approval when lead delivery, privacy/consent, indexing, security, core customer journeys, or availability breaches a predefined threshold. Relevant owners are notified immediately.
- **D-16:** Every emergency change or rollback requires a closeout record covering the trigger, authority, affected release/configuration, customer or lead impact, evidence, notifications, recovery result, and follow-up owner. Configuration drift must be reconciled before the next ordinary release.

### the agent's Discretion

- Choose the exact typed schemas, file boundaries, and report presentation that best fit the established repository-content and Zod patterns.
- Propose concrete review cadences, response windows, escalation thresholds, and rollback triggers for named owners to approve; do not invent them as approved business facts.
- Research and compare provider candidates against D-09 through D-12, but do not select a production lead provider without recorded approval.
- Keep the review report simple, protected, and non-public; its visual treatment is implementation discretion.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROD-01 | A release operator can identify approved production account/domain/authority facts. | Versioned decision records, role-based approvals, external evidence references, and release-policy records. |
| PROD-02 | Editors use one approved branch/business record across public and structured-data surfaces. | Field-group approval envelopes plus a single eligible branch selector consumed by every surface. |
| PROD-03 | Visitors see only approved locally applicable claims and honest request semantics. | Fail-closed eligibility selectors, minimum-viable-truth route gates, and shared omission rules. |
| PROD-04 | Privacy/business owners can identify the approved processing contract. | A typed privacy decision record whose values remain pending until named legal/business approval. |
| PROD-05 | Operations can identify the approved lead operating contract for every lead type. | Provider-neutral acceptance schema, candidate scorecard, routing matrix, recovery/escalation fields, and approval gate. |
| PROD-06 | Release fails before deployment for unsafe or inconsistent critical configuration. | One Zod-backed configuration parser invoked during configuration loading/build, with target/register cross-checks and negative tests. |
| PROD-07 | Development, preview, and production remain isolated. | Explicit deployment target, per-target integration profiles, preview protection, crawl policy, origin rules, and environment matrix tests. |
</phase_requirements>

## Summary

Phase 1 should create one executable governance boundary, not a parallel documentation system. Store non-sensitive decisions and public facts as typed repository data, validate them with the existing Zod dependency, and make all consumers call shared eligibility/configuration selectors. The current code already centralizes branch facts, site-origin construction, lead routing, metadata, robots, and sitemap generation, but invalid production origins fall back to localhost and the lead adapter can return an optimistic random reference without persistence. Those behaviors are safe only for development and are the principal contract gaps this phase must close. [VERIFIED: codebase grep]

Production readiness must remain blocked while the domain, commercial Vercel estate, legal/privacy terms, local claims, responsible people, and durable lead destination are unapproved. The implementation can represent every pending item, render a protected review report, and deterministically reject a production build; it must not convert missing stakeholder input into a default. The Philippine Data Privacy Act and implementing rules require declared purposes, transparency, proportionality, retention limits, controller/recipient information, rights processes, and safeguards, but determining the site's concrete controller, lawful criteria, retention schedule, consent policy, and incident procedure is an approval task rather than an engineering inference. [CITED: https://privacy.gov.ph/data-privacy-act/] [CITED: https://privacy.gov.ph/implementing-rules-regulations-data-privacy-act-2012/]

**Primary recommendation:** Build a typed approval/decision registry plus pure eligibility and environment parsers; wire them into the existing server-first content, SEO, lead, preview, and release boundaries; make unresolved production decisions fail the build and appear only in the protected review report.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Approval and decision records | Repository content | External evidence store | Git contains status, roles, dates, and opaque references; sensitive evidence remains in the approved external system. |
| Branch/business truth | Repository content | Frontend server | One typed record owns facts; server selectors expose only currently eligible fields. |
| Claim and route eligibility | Frontend server/build | Repository content | Server/build-time selectors enforce status, evidence, local applicability, and time gates before rendering or indexing. |
| Environment parsing | Build/server runtime | Vercel environment configuration | Code validates shape and cross-environment invariants; Vercel supplies target-scoped values and secrets. |
| Protected review report | Frontend server | Vercel Deployment Protection | The route assembles non-sensitive diagnostics; platform authentication protects the whole preview deployment. |
| Lead acceptance contract | API/backend contract | Approved durable provider | The existing `LeadRouter` seam owns application semantics; the selected provider must prove durable acknowledgement and recovery. |
| Manual promotion and rollback | Release plane/Vercel | Repository operations records | Vercel performs promotion/rollback; versioned policy and closeout records establish authority and auditability. |

## Project Constraints (from AGENTS.md)

- Preserve the Next.js App Router, typed repository content, server-first rendering, and adapter boundaries; do not rebuild the MVP. [VERIFIED: AGENTS.md]
- Keep production origin environment-driven through `NEXT_PUBLIC_SITE_URL`; do not hardcode an unapproved domain. [VERIFIED: AGENTS.md]
- Use a Vercel plan approved for commercial use, keep recurring infrastructure minimal, and do not assume Hobby is the production plan. [VERIFIED: AGENTS.md]
- Publish no unverified local fact, product availability, price, specification, promotion, finance term, warranty, testimonial, authorization claim, or unlicensed asset. [VERIFIED: AGENTS.md]
- Keep server-side validation, abuse resistance, secret/PII protection, security headers, and PII-free analytics as explicit constraints. [VERIFIED: AGENTS.md]
- Keep routes declarative, use server components by default, and restrict client components to browser-state/event boundaries. [VERIFIED: AGENTS.md]
- Keep content independent and repository-backed; routes may depend on components/content/lib, and integrations remain behind domain contracts. [VERIFIED: AGENTS.md]
- Use the `@/*` alias across directories, direct owner imports rather than barrels, named exports for reusable code, and default exports only where Next.js expects them. [VERIFIED: AGENTS.md]
- Follow existing TypeScript style: strict/no-emit, double quotes, semicolons, two-space indentation, multiline trailing commas, focused pure helpers, early returns, typed result objects, and minimal intent-focused comments. [VERIFIED: AGENTS.md]
- Keep expected failures typed and user-safe; never expose provider errors, credentials, lead payloads, contact details, free text, or attribution in logs. [VERIFIED: AGENTS.md]
- Generate all absolute public URLs through the shared site-origin boundary and keep production lead delivery behind `LeadRouter`; do not use long-lived in-memory/serverless background work. [VERIFIED: AGENTS.md]
- Run `npm run check` for lint, type checking, native Node tests, and production build; use Node.js 20.9+ and the lockfile-managed npm stack. [VERIFIED: AGENTS.md]
- Target WCAG 2.2 AA and protect mobile performance; the protected review page should remain server-rendered and JavaScript-light. [VERIFIED: AGENTS.md]
- No project-local skills were found in `.codex/skills/` or `.agents/skills/`. [VERIFIED: filesystem check]

## Standard Stack

### Core

| Library/Platform | Version | Purpose | Why Standard |
|------------------|---------|---------|--------------|
| Next.js | 16.3.1 (locked) | App Router, build/config boundary, server rendering, metadata, robots, sitemap | Existing application framework; changing it is outside phase scope. [VERIFIED: package-lock/codebase grep] |
| TypeScript | 6.0.2 (locked) | Decision/content contracts and exact closed-domain types | Existing strict toolchain and project convention. [VERIFIED: package-lock/codebase grep] |
| Zod | 4.4.3 (locked; registry checked 2026-08-18) | Runtime parsing of decision records and deployment configuration | Already installed and already used for untrusted server input; Zod supports object, enum, URL, ISO date/time, refinement, and safe parsing primitives needed here. [VERIFIED: package-lock/codebase grep] [CITED: https://zod.dev/api] |
| Node built-in test runner | Node 24.14.0 locally; project minimum 20.9.0 | Deterministic policy/configuration tests | Existing test framework and scripts; no phase-specific test dependency is required. [VERIFIED: local environment/codebase grep] |
| Vercel environments and Deployment Protection | Account/plan approval pending | Development/Preview/Production variable isolation, protected preview, promotion, rollback | Intended hosting boundary; Vercel exposes distinct environments and `VERCEL_ENV`, and supports protected previews/manual promotion. [CITED: https://vercel.com/docs/deployments/environments] [CITED: https://vercel.com/docs/deployment-protection] |

### Supporting

| Facility | Version | Purpose | When to Use |
|----------|---------|---------|-------------|
| Repository TypeScript records | Project pattern | Non-sensitive decision register, branch record, privacy/lead/release contracts | Use for reviewable, versioned fields and external evidence references. [VERIFIED: codebase grep] |
| Vercel system environment variables | Current service | Cross-check declared deployment target against `VERCEL_ENV` and derive preview deployment origin from `VERCEL_URL` when appropriate | Use only server/build-side; system values do not replace the approved production origin. [CITED: https://vercel.com/docs/environment-variables/system-environment-variables] |
| External approved document/evidence store | Unselected | Sensitive approvals, signatures, credentials, legal documents | Store only opaque stable references in Git; actual system and access policy require owner approval. [RECOMMENDATION] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing Zod dependency | Handwritten predicates or another schema library | Adds duplicate edge-case logic or a new package without benefit; reject. |
| Repository TypeScript records | New CMS/database | Adds cost, credentials, persistence, and operational ownership that Phase 1 does not need; reject. |
| Platform Deployment Protection | Application-local preview login | Adds authentication/session scope and can still expose other preview routes; reject for this phase. |
| Explicit target plus `VERCEL_ENV` cross-check | `NODE_ENV` alone | `NODE_ENV=production` does not distinguish preview from production; reject. [CITED: https://vercel.com/docs/environment-variables/system-environment-variables] |

**Installation:** No external package installation is recommended. Preserve the lockfile and use the existing dependencies. [VERIFIED: package.json]

## Package Legitimacy Audit

No new packages are recommended or installed in this phase, so the package legitimacy gate is not applicable. Zod is already locked in the repository; its version was checked against the registry and its capability claims were checked against official Zod documentation. [VERIFIED: package-lock/codebase grep] [CITED: https://zod.dev/api]

## Architecture Patterns

### System Architecture Diagram

```text
Stakeholder decision / approval
        |
        +--> sensitive evidence, signature, credential --> approved external store
        |                                                    |
        +--> status + role + dates + opaque reference -------+
                              |
                              v
                 typed repository decision records
                              |
                  Zod validation + eligibility rules
                     /                 |                 \
                    v                  v                  v
          public-content selector   config parser   protected review DTO
             /       |       \          |                  |
            v        v        v         v                  v
         pages   metadata   sitemap  build/runtime     preview-only route
                    |       robots    fail closed            |
                    |          |          |             Vercel Authentication
                    +----------+----------+                  |
                               v                             v
                      eligible public site             authorized reviewers

Lead contract record --> provider scorecard --> approved selection
        |                                          |
        +----------> existing LeadRouter seam <----+
                          (Phase 2 implementation)

Protected preview + checks + approvals --> manual promotion --> production
                                                    |
                                  incident threshold met?
                                      /         \
                                    no           yes
                                    |             v
                                  operate     rollback/emergency change
                                                   |
                                                   v
                                             closeout + config reconciliation
```

### Recommended Project Structure

```text
src/
├── content/
│   ├── site.ts                         # one eligible branch/business export
│   └── governance/
│       ├── decisions.ts                # non-sensitive register entries
│       ├── claims.ts                   # claim/local-applicability approval records
│       ├── privacy.ts                  # approved/pending privacy operating contract
│       ├── leads.ts                    # per-lead-type acceptance/routing decisions
│       └── release.ts                  # authority, thresholds, and closeout metadata contracts
├── lib/
│   ├── governance/
│   │   ├── schemas.ts                  # runtime Zod schemas
│   │   ├── eligibility.ts              # pure now-injected selectors
│   │   └── report.ts                   # redacted review DTO
│   ├── runtime-config.ts               # one parsed, target-aware server/build boundary
│   └── site-url.ts                     # delegates origin choice to parsed config
└── app/
    └── review/approvals/page.tsx       # preview/development only; 404 in production
tests/
├── governance.test.mjs                 # approval/expiry/eligibility matrices
├── configuration.test.mjs              # environment target and fail-closed matrices
└── fixtures/governance/                # synthetic, non-sensitive records only
docs/operations/
├── production-decisions.md             # human-readable register guidance, not duplicate values
├── release-runbook.md                   # ordinary/emergency/rollback flow
└── records/README.md                    # closeout template and storage rule
```

Do not duplicate decision values in Markdown and TypeScript. Typed records are authoritative; Markdown explains the workflow and links to record IDs. [RECOMMENDATION]

### Pattern 1: Approval Envelope + Atomic Claim IDs

**What:** Give every independently publishable fact or claim a stable ID and an approval envelope: `status`, `ownerRole`, `approverRole`, `approvedAt`, `reviewAt` or `expiresAt`, `evidenceRefs`, optional `invalidatedAt`, and optional non-sensitive invalidation reason. Keep the value beside the envelope or point to a canonical typed record. [RECOMMENDATION]

**When to use:** Use one envelope per field group whose approval can change independently. Address/phone/hours/directions can live in one branch record but must not force an all-or-nothing record when only hours are pending. [RECOMMENDATION]

**Eligibility rule:** `approved` is necessary but insufficient. A claim is eligible only when required evidence exists, the approval and local-applicability scope match its surface, its review/expiry boundary is in the future, and it has not been invalidated. Inject `now` into selectors so tests are deterministic. [RECOMMENDATION]

### Pattern 2: One Public Selector per Surface Family

**What:** `getEligibleBranch(now)`, `getEligibleClaims(scope, now)`, and `getEligibleRoutes(now)` are the only public-content entry points. Pages, navigation, internal links, JSON-LD, metadata, sitemap, and robots consume these selectors rather than raw arrays. [RECOMMENDATION]

**When to use:** Apply wherever a withheld record could leak through a secondary surface. The current sitemap enumerates all trucks/campaigns directly, so it must be migrated to eligible selectors in the same change as page/navigation consumers. [VERIFIED: codebase grep]

### Pattern 3: Parse Configuration Once, Then Cross-Check Decisions

**What:** Create `parseRuntimeConfig(rawEnv, approvedDecisions)` as a pure function and export one parsed result for application use. Validate shape first, then target-specific invariants: declared target agrees with `VERCEL_ENV`; production origin is exact HTTPS and matches the approved decision; production routing uses an approved durable profile; preview cannot use production profiles/IDs; production is the only target allowed to crawl. [RECOMMENDATION]

**When to use:** Call it during Next configuration/build so invalid production configuration stops before deployment, and reuse the same parsed value in server/runtime modules. `NEXT_PUBLIC_*` variables are inlined at build time and do not change after the build, which makes pre-build validation mandatory. [CITED: https://nextjs.org/docs/pages/guides/environment-variables]

**Target policy matrix:**

| Target | Origin | Leads | Analytics | Crawl | Review report |
|--------|--------|-------|-----------|-------|---------------|
| development | Local HTTP allowed | disabled/non-persisting only | disabled/test only | block | local only |
| preview | Unique HTTPS preview origin; never approved production origin | disabled or approved sandbox profile | disabled/test identifiers only | block | enabled, platform-protected |
| production | Exact approved `NEXT_PUBLIC_SITE_URL`, HTTPS, no credentials/path/query/hash | approved durable profile only | disabled or approved production profile | allow only after explicit approval | hard 404 |

Vercel has distinct Development, Preview, and Production variable scopes; preview variables can also be branch-specific, and changes apply only to new deployments. [CITED: https://vercel.com/docs/environment-variables]

### Pattern 4: Redacted Protected Review Report

**What:** Build a server-rendered report from a deliberately small DTO: record ID, public-safe label, status, owner/approver role, review/expiry date, evidence reference label/opaque ID, blocker code, and affected surfaces. Never pass secret values, credentials, document bodies, personal names unless specifically approved for repository publication, or PII. [RECOMMENDATION]

**Protection:** Return `notFound()` in production, force `noindex/noarchive`, omit the route from navigation/sitemap, and require Vercel Authentication/Standard Protection on preview deployments. Vercel Deployment Protection applies authentication to protected deployment requests; application-level hiding alone is not authentication. [CITED: https://vercel.com/docs/deployment-protection]

### Pattern 5: Provider-Neutral Durable Acceptance Contract

**What:** Keep provider choice out of components and server actions. Extend the `LeadRouter` contract in Phase 2 only after Phase 1 records an approved provider profile that proves: complete normalized record persistence before acknowledgement, provider-issued or provider-confirmed stable reference, idempotency behavior, reconciliation lookup, bounded timeout/retry, replay, terminal/dead-letter handling, retention/deletion, department routing, authentication, access controls, audit evidence, alerting, and an approved secondary path. [RECOMMENDATION]

**Important boundary:** A successful HTTP status, generated UUID, email send, spreadsheet append attempt, or queued request is not durable acceptance unless the approved provider contract explicitly guarantees D-09 and the record is recoverable/reconcilable. The current router violates this production contract by generating a UUID when no durable destination or reference header exists; keep that behavior development-only. [VERIFIED: codebase grep]

### Provider Selection Scorecard (No Selection in Research)

| Criterion | Required evidence before approval |
|----------|-----------------------------------|
| Durable acknowledgement | Documentation/test showing acknowledgement occurs after recoverable persistence |
| Stable reference/idempotency | Reference format, duplicate request behavior, idempotency key scope/lifetime |
| Recovery | Query/reconcile API or operator UI, replay rules, terminal-failure handling |
| Routing | Per-lead-type destination and owner mapping without client-controlled trust |
| Security | Server-side authentication, least-privilege access, TLS, secret rotation, audit access |
| Privacy | Processor/recipient role, data location/subprocessors, approved fields, retention/deletion, rights support, incident path |
| Reliability | Timeouts, quotas, retry semantics, outage behavior, secondary intake equivalence |
| Operations | Central owner, department owner/backup, alerts, aging/reconciliation workflow |
| Cost/ownership | Approved commercial account, billing owner, limits, exit/export path |

The provider decision remains `pending` until an authorized approver attaches primary evidence and records the selected profile. No provider candidate is recommended by name because no approved candidate set was supplied. [RECOMMENDATION]

### Pattern 6: Manual Promotion + Auditable Recovery

**Ordinary path:** identify exact preview deployment/commit → verify config fingerprint and protected report → run technical gates → record department/legal/brand/technical approvals → designated release owner promotes → verify production origin/crawl/core journeys → record release evidence. Vercel documents inspecting/testing a preview and promoting it; promotion from preview rebuilds with Production environment variables, so the promoted code and production configuration must both be recorded. [CITED: https://vercel.com/docs/deployments/promote-preview-to-production]

**Emergency path:** named release owner or backup documents qualifying risk → contains risk with the narrowest change/rollback → immediately notifies affected owners → records impact/evidence → verifies recovery → assigns follow-up → reconciles drift before the next ordinary release. Threshold values remain named `proposal` records until approved. [RECOMMENDATION]

**Rollback caveat:** Vercel Instant Rollback restores a previous deployment/build, but environment-variable changes are not rebuilt into that deployment and can leave configuration stale. Therefore a deployment rollback and configuration restoration/reconciliation are separate checklist items. [CITED: https://vercel.com/docs/instant-rollback]

### Anti-Patterns to Avoid

- **Boolean `approved` alone:** It cannot prove who approved, scope, evidence, freshness, or invalidation. Use the full envelope.
- **Markdown as executable truth:** Human docs drift from code. Store values once in typed records and derive reports.
- **Raw record imports in pages/sitemap:** This bypasses eligibility. Export raw collections only to governance validators/report builders.
- **Fallback-to-localhost in production:** A malformed production origin must throw during build, not silently generate localhost canonicals.
- **`NODE_ENV` as deployment identity:** It does not distinguish preview and production on a production build.
- **Inline placeholders in preview:** Preview must mirror public omission; diagnostics belong in the protected report.
- **Environment variable as approval:** Presence proves configuration, not authorization. Cross-check non-secret identifiers/origin against approved records.
- **Secrets in `NEXT_PUBLIC_*` or Git:** Next.js exposes `NEXT_PUBLIC_*` values to browser bundles. [CITED: https://nextjs.org/docs/app/guides/data-security]
- **App-only protection for review data:** A hidden URL, `noindex`, or production 404 does not authenticate preview users; require platform protection.
- **Automatic production branch promotion:** It conflicts with D-13. Disable automatic domain assignment/use staged production promotion according to the approved Vercel workflow. [CITED: https://vercel.com/docs/deployments/promoting-a-deployment]

## Decision and Approval Register Design

### Required record types

| Record type | Minimum non-sensitive fields | Production blocker when pending? |
|-------------|------------------------------|----------------------------------|
| Production estate | domain origin, Vercel project/account reference, commercial-plan approval reference, DNS owner role, deployment owner role, rollback owner/backup roles | Yes |
| Branch/business | approved business name, address, phone, hours or explicit omission, directions target, department contact actions | Yes for minimum viable truth fields; optional fields omit |
| Claim catalog | claim ID/value or content ref, local-applicability scope, source, owner lane, approval, review/expiry, asset/release evidence | Yes only for surfaces trying to publish it |
| Privacy operating contract | controller identity, privacy contact, purposes/lawful criteria decision, collected categories, recipients/processors, retention/deletion, rights handling, incident process, inquiry vs marketing-consent policy | Yes for production personal-data collection |
| Lead operating contract | lead type, primary/secondary destination profile IDs, auth method label (not credential), durable acceptance evidence, routing, retry/replay, retention, escalation/backup roles, response-window proposal/approval | Yes for production forms |
| Release policy | ordinary promoter, emergency authority/backup, qualifying risks, approved thresholds, notification roles, rollback/config restoration steps | Yes |
| Closeout | incident/release IDs, trigger, authority role, affected deployment/config fingerprint, non-PII impact summary, evidence refs, notifications, result, follow-up owner/status | Required after event; blocks next ordinary release if incomplete |

### Evidence reference rules

- Store stable opaque references, document system name/type, evidence owner role, reviewed date, and optional public URL only when the target itself is approved for disclosure. [RECOMMENDATION]
- Never store access tokens, signed URLs, email bodies, signatures, personal addresses, credentials, webhook secrets, or sensitive legal documents in the register. [RECOMMENDATION]
- Treat broken/inaccessible evidence references as approval blockers during human review; automated validation can prove reference shape, not external authority or access. [RECOMMENDATION]
- Make invalidation append-only in meaning: record invalidation date/reason and create a new approval revision rather than silently rewriting history. Git history helps, but the active record must still state its current revision and superseded record. [RECOMMENDATION]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Runtime schema parsing | Scattered `if` chains | Existing Zod 4 schemas/refinements | Central errors, closed enums, URLs/dates, testable parsing. [CITED: https://zod.dev/api] |
| Preview authentication | Local password/session system | Vercel Deployment Protection | Covers the deployment boundary and avoids new auth/session scope. [CITED: https://vercel.com/docs/deployment-protection] |
| Secret storage | Encrypted-looking values or signed links in Git | Vercel protected environment variables plus approved evidence/secret system | Repository history is not a secret vault; `NEXT_PUBLIC_*` is browser-visible. [CITED: https://nextjs.org/docs/pages/guides/environment-variables] |
| Durable lead queue/CRM | Custom in-memory retry or fire-and-forget serverless work | Approved provider that satisfies the recorded acceptance contract | Persistence, idempotency, replay, retention, and reconciliation are provider capabilities to verify in Phase 2. |
| Approval workflow platform | New CMS/workflow application | Typed register + external evidence references + protected report | Meets current low-volume/versioning need without recurring platform scope. |
| Deployment rollback | Custom artifact copying/domain scripts | Vercel promote/rollback plus the repository runbook | Platform already owns deployment aliasing; configuration reconciliation remains explicit. [CITED: https://vercel.com/docs/instant-rollback] |

**Key insight:** This phase should hand-roll only project-specific policy—the exact relationship among approved decisions, eligibility, and environment target. Authentication, schema primitives, hosting isolation, promotion, rollback, and future lead durability should stay with established platform/library boundaries.

## Common Pitfalls

### Pitfall 1: Compile-Time Type Safety Mistaken for Runtime Approval

**What goes wrong:** A TypeScript object has the right shape but contains pending, expired, or inconsistent values.

**Why it happens:** `satisfies` and interfaces disappear at runtime.

**How to avoid:** Parse all registry collections with Zod and run temporal/cross-record refinements during build.

**Warning signs:** Raw content imports, `as const` without runtime parse, or builds that succeed with `status: "pending"` on required production records.

### Pitfall 2: Silent Production Fallbacks

**What goes wrong:** A typo produces localhost canonicals, disabled routing, or optimistic lead success.

**Why it happens:** Development-friendly fallbacks are reused in production.

**How to avoid:** Branch on explicit deployment target; development may degrade safely, production must throw before deployment.

**Warning signs:** `catch { return LOCAL_ORIGIN; }`, random references, or a production route that works with missing routing configuration. [VERIFIED: codebase grep]

### Pitfall 3: Preview Contaminates Production

**What goes wrong:** Preview leads reach live operations, preview tags pollute analytics, or preview URLs are indexed.

**Why it happens:** Variables are scoped to multiple environments or code checks only for presence.

**How to avoid:** Require target-specific non-secret integration profile IDs, reject production profiles in preview, always block preview crawl, and verify protection/account scoping.

**Warning signs:** Identical destination/analytics profile IDs across preview and production, `crawl=allow` outside production, or an unprotected review route.

### Pitfall 4: One Record Blocks Too Much—or Too Little

**What goes wrong:** Missing hours hides a verified phone/address, or approval of one branch field unintentionally approves all claims.

**Why it happens:** Approval granularity does not match publication granularity.

**How to avoid:** One canonical branch record with independently approved field groups; one claim ID per publishable assertion.

**Warning signs:** A single global `approved` boolean or repeated branch values in components/schema.

### Pitfall 5: Review Report Becomes a Data Leak

**What goes wrong:** Evidence bodies, personal names, webhook URLs, or credentials appear in HTML/build output.

**Why it happens:** Report rendering serializes raw governance/config objects.

**How to avoid:** Create a redacted DTO with an allow-list, hard-disable the route in production, and protect preview at the platform boundary.

**Warning signs:** `{...record}` rendering, `JSON.stringify(process.env)`, signed evidence URLs, or secrets in React props.

### Pitfall 6: Provider Selection by Familiarity

**What goes wrong:** A webhook/email/spreadsheet is selected even though it cannot prove durable acknowledgement, stable IDs, recovery, or privacy obligations.

**Why it happens:** Transport success is confused with business acceptance.

**How to avoid:** Use the D-09–D-12 scorecard and require primary documentation plus a sandbox proof before approval.

**Warning signs:** Candidate comparison omits idempotency, reconciliation, retention/deletion, outage behavior, or processor/subprocessor terms.

### Pitfall 7: Rollback Without Configuration Restoration

**What goes wrong:** Old code runs against newer incompatible environment values.

**Why it happens:** Deployment rollback is treated as full system rollback.

**How to avoid:** Fingerprint non-secret configuration/decision revision per release, record environment changes separately, and reconcile after rollback. Vercel explicitly warns that rollback can restore an older build without updating environment variables. [CITED: https://vercel.com/docs/instant-rollback]

### Pitfall 8: Legal Fields Treated as Legal Conclusions

**What goes wrong:** Engineering chooses controller identity, lawful criterion, consent wording, retention, or incident rules.

**Why it happens:** A schema's required fields are mistaken for approved values.

**How to avoid:** Provide typed pending fields and a privacy/legal checkpoint. NPC sources define the topics and principles, not the project's answers. [CITED: https://privacy.gov.ph/data-privacy-act/] [CITED: https://privacy.gov.ph/wp-content/uploads/2023/11/NPC-Circular-No.-2023-04_Guidelines-on-Consent_07Nov2023.pdf]

## Code Examples

Verified library/platform patterns adapted to this project follow. Values are illustrative schemas only, not approved business facts.

### Approval Envelope and Deterministic Eligibility

```typescript
import { z } from "zod";

export const approvalSchema = z.object({
  status: z.enum(["pending", "approved", "invalidated", "expired"]),
  ownerRole: z.string().min(1),
  approverRole: z.string().min(1),
  approvedAt: z.iso.datetime().optional(),
  reviewAt: z.iso.datetime(),
  expiresAt: z.iso.datetime().optional(),
  evidenceRefs: z.array(z.string().min(1)).min(1),
  invalidatedAt: z.iso.datetime().optional(),
});

type Approval = z.infer<typeof approvalSchema>;

export function isCurrentlyApproved(approval: Approval, now: Date) {
  if (approval.status !== "approved" || approval.invalidatedAt) return false;
  if (!approval.approvedAt || approval.evidenceRefs.length === 0) return false;
  if (new Date(approval.reviewAt) <= now) return false;
  return !approval.expiresAt || new Date(approval.expiresAt) > now;
}
```

Source: Zod object/enum/ISO datetime APIs, adapted for D-03/D-04. [CITED: https://zod.dev/api]

### Fail-Closed Target-Aware Configuration

```typescript
import { z } from "zod";

const rawConfigSchema = z.object({
  DEPLOYMENT_ENV: z.enum(["development", "preview", "production"]),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().trim().optional(),
  INTEGRATION_PROFILE: z.string().min(1),
  CRAWL_POLICY: z.enum(["block", "allow"]),
});

export function parseRuntimeConfig(
  raw: Record<string, string | undefined>,
  approvedProductionOrigin: string | undefined,
) {
  const config = rawConfigSchema.parse(raw);

  if (config.VERCEL_ENV && config.VERCEL_ENV !== config.DEPLOYMENT_ENV) {
    throw new Error("Declared deployment environment does not match Vercel.");
  }

  if (config.DEPLOYMENT_ENV === "production") {
    const origin = new URL(config.NEXT_PUBLIC_SITE_URL ?? "");
    if (origin.protocol !== "https:" || origin.origin !== origin.href.replace(/\/$/, "")) {
      throw new Error("Production site URL must be an HTTPS origin.");
    }
    if (!approvedProductionOrigin || origin.origin !== approvedProductionOrigin) {
      throw new Error("Production origin is not the approved decision.");
    }
  } else if (config.CRAWL_POLICY !== "block") {
    throw new Error("Non-production deployments must block crawling.");
  }

  return config;
}
```

Source: Zod parsing and WHATWG URL validation adapted to Vercel's documented environment names. Keep error messages value-free so secrets never enter build logs. [CITED: https://zod.dev/api] [CITED: https://vercel.com/docs/environment-variables/system-environment-variables]

### Preview-Only Report Boundary

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReviewReport } from "@/lib/governance/report";
import { runtimeConfig } from "@/lib/runtime-config";

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
};

export default function ApprovalReviewPage() {
  if (runtimeConfig.deploymentEnv === "production") notFound();
  const report = getReviewReport();
  return <main>{/* render only the redacted report DTO */}</main>;
}
```

Source: project App Router patterns plus Vercel Deployment Protection. The route guard is defense in depth; Vercel Authentication is the actual preview access boundary. [VERIFIED: codebase grep] [CITED: https://vercel.com/docs/deployment-protection]

## State of the Art

| Old/Current MVP Approach | Required Current Approach | When/Why | Impact |
|--------------------------|---------------------------|----------|--------|
| `NEXT_PUBLIC_SITE_URL` missing/invalid → localhost | Target-aware parse; exact approved HTTPS production origin or build failure | Phase 1 contract | Eliminates localhost/public-origin leakage. [VERIFIED: codebase grep] |
| `NODE_ENV`-style build distinction | Explicit deployment target cross-checked with `VERCEL_ENV` | Vercel exposes development/preview/production identity | Prevents preview/production ambiguity. [CITED: https://vercel.com/docs/environment-variables/system-environment-variables] |
| Public environment values treated as runtime knobs | Validate at build because `NEXT_PUBLIC_*` is bundled/frozen | Current Next.js environment behavior | Promotion must rebuild/check production values. [CITED: https://nextjs.org/docs/pages/guides/environment-variables] |
| Preview URL hidden/noindexed | Platform-protected preview plus noindex | Deployment Protection controls access to preview requests | Review diagnostics become genuinely non-public. [CITED: https://vercel.com/docs/deployment-protection] |
| Automatic branch-to-production serving | Staged/manual promotion by authorized owner | Locked D-13 and supported Vercel workflow | Human approvals become a release gate. [CITED: https://vercel.com/docs/deployments/promoting-a-deployment] |
| Rollback assumed to restore everything | Deployment rollback plus explicit environment/config reconciliation | Vercel rollback may retain changed environment configuration | Closeout must record both code and config state. [CITED: https://vercel.com/docs/instant-rollback] |
| ASVS 4-era references | ASVS 5.0.0 stable identifiers (`v5.0.0-...`) | Stable 5.0.0 released May 2025 | Pin validation evidence to a stable standard version. [CITED: https://github.com/OWASP/ASVS] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|

All technical claims used for planning were verified from the codebase, registry, or official primary documentation. No unresolved business, provider, threshold, owner, credential, domain, or legal value is treated as an assumption; each is an open approval dependency.

## Open Questions (RESOLVED)

The six questions below are resolved as planning dispositions, not as invented business answers. Unknown production values remain blocking inputs to the typed approval register and the final human checkpoints. No provider, person, threshold, legal conclusion, external evidence system, domain, or account is selected by this research.

1. **What are the approved production estate identifiers and authorities?**
   - What we know: The register must identify domain, commercial Vercel account/project, DNS owner, deployment owner, rollback owner, and backup roles.
   - What's unclear: Actual domain, account/project, plan approval, named people/roles, DNS control, and Git/Vercel permissions.
   - Resolved disposition: Represent every value as a pending production-estate record, require non-secret IDs/references, and keep production blocked until the authorized stakeholder checkpoint approves them.

2. **Which branch fields and local claims are approved?**
   - What we know: The existing source register supports the display name, address, and phone; hours, direct GBP URL, local model availability, service/parts/fleet/financing wording, asset rights, and response expectations remain unapproved. [VERIFIED: SOURCE_REGISTER.md/BUSINESS_INPUTS_REQUIRED.md]
   - What's unclear: Final locally applicable public wording and field-level approval evidence.
   - Resolved disposition: Seed independently publishable field groups and claims as `pending`; migrate every public and discovery consumer to fail-closed selectors; do not infer approval from current copy.

3. **What is the approved privacy operating contract?**
   - What we know: Required topics include controller/contact, purposes, recipients/processors, retention/deletion, rights, incidents, and marketing-consent policy. NPC law/rules establish transparency, purpose, proportionality, retention, safeguards, rights, and accountability principles. [CITED: https://privacy.gov.ph/data-privacy-act/] [CITED: https://privacy.gov.ph/implementing-rules-regulations-data-privacy-act-2012/]
   - What's unclear: Every project-specific legal/business answer.
   - Resolved disposition: Engineering supplies the complete typed pending contract and fail-closed public behavior; Privacy/legal approval remains a blocking register/checkpoint input.

4. **Which provider satisfies durable acceptance?**
   - What we know: The current webhook/development adapter does not prove D-09 durability or recovery. [VERIFIED: codebase grep]
   - What's unclear: Approved candidate set, provider documentation, auth, data location, retention, cost, routing, replay, and secondary intake.
   - Resolved disposition: Provide a provider-neutral scorecard and require primary evidence plus sandbox proof at the blocking checkpoint; production remains blocked and Phase 1 selects no provider by inference.

5. **What numeric review, response, escalation, and rollback thresholds are approved?**
   - What we know: D-04/D-11/D-15 require review dates, response windows, escalation, and predefined rollback triggers.
   - What's unclear: Exact durations/thresholds and named approvers.
   - Resolved disposition: Store proposed values separately from approved policy and make selectors/configuration reject proposal values; authorized owners must approve exact values at the blocking checkpoint.

6. **Where will sensitive evidence and closeout documents live?**
   - What we know: Sensitive material cannot live in Git; the repository needs stable references.
   - What's unclear: Approved external system, retention/access policy, and reference format.
   - Resolved disposition: Keep only opaque references in Git and require stakeholders to identify an approved existing external system, access policy, retention rule, and reference format at the blocking checkpoint; add no platform in Phase 1.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | build, native tests, configuration checks | ✓ | 24.14.0 | Project minimum remains 20.9.0 |
| npm | locked install and scripts | ✓ | 8.17.0 | — |
| Git | versioned decision/register evidence | ✓ | 2.55.0.windows.4 | — |
| Vercel CLI | live environment inspection/promotion rehearsal | ✗ | — | Dashboard/manual evidence in later live-account work; installation requires approved account/workflow |
| Commercial Vercel project/account | preview protection and production promotion | Unverified | — | No production fallback; stakeholder approval required |
| External evidence store | sensitive approval documents | Unverified | — | No sensitive evidence in Git; stakeholder must select an approved system |
| Durable lead provider | PROD-05 approval contract | Unselected | — | Production forms remain blocked; development adapter only |

**Missing dependencies with no fallback:** approved commercial Vercel estate, external evidence location/access policy, approved durable lead provider, production domain/DNS authority, and named operational/legal authorities.

**Missing dependencies with fallback:** Vercel CLI is not installed locally; design and repository tests can proceed, but live account/protection/promotion evidence must use an authorized dashboard or later approved CLI installation.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in `node:test` / `node:assert/strict` (existing) |
| Config file | none — existing `package.json` glob |
| Quick run command | `node --test tests/governance.test.mjs tests/configuration.test.mjs` |
| Full suite command | `npm run check` |

The current suite verifies file/source contracts but does not exercise approval expiry, cross-record eligibility, environment matrices, or production build failure. [VERIFIED: tests/foundation.test.mjs]

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PROD-01 | Required estate/authority decision IDs exist; missing/pending required decisions block production | unit/schema | `node --test tests/governance.test.mjs --test-name-pattern="production estate"` | ❌ Wave 0 |
| PROD-02 | One branch selector supplies all approved branch fields and omits pending/expired fields | unit | `node --test tests/governance.test.mjs --test-name-pattern="branch"` | ❌ Wave 0 |
| PROD-03 | Unapproved/expired/invalidated claims and ineligible routes cannot reach public selectors/sitemap | unit + source integration | `node --test tests/governance.test.mjs --test-name-pattern="eligibility|route"` | ❌ Wave 0 |
| PROD-04 | Privacy contract requires every decision topic and approved evidence before production readiness | schema | `node --test tests/governance.test.mjs --test-name-pattern="privacy"` | ❌ Wave 0 |
| PROD-05 | Every lead type has one complete approved operating contract; optimistic/no-provider profiles fail production | schema/contract | `node --test tests/governance.test.mjs --test-name-pattern="lead contract"` | ❌ Wave 0 |
| PROD-06 | Missing/malformed/mismatched production values throw before build; errors do not echo values | unit + build smoke | `node --test tests/configuration.test.mjs --test-name-pattern="production"` | ❌ Wave 0 |
| PROD-07 | Preview rejects production profiles/origin/crawl; production rejects preview/test profiles; review route is absent in production | matrix + source integration | `node --test tests/configuration.test.mjs --test-name-pattern="isolation|review"` | ❌ Wave 0 |

### Required Test Matrices

**Approval matrix:** pending; approved/current; approved with no evidence; review due exactly now; expired; invalidated; wrong approval lane; national source without Cebu applicability; superseded revision; broken evidence reference shape.

**Environment matrix:** development/preview/production × missing origin × HTTP/HTTPS × localhost × approved/wrong origin × crawl block/allow × disabled/sandbox/production lead profile × disabled/test/production analytics profile × matching/mismatching `VERCEL_ENV`.

**Surface coherence:** a withheld claim/route must be absent from page selector, navigation, internal-link registry, metadata/JSON-LD, sitemap, and public review route. Reduced-form publication must pass the minimum viable truth predicate.

**Security assertions:** no secret-like keys in governance exports/report DTO; no raw `process.env` serialization; production review route returns 404; error snapshots contain variable names/codes but never values.

### Sampling Rate

- **Per task commit:** `node --test tests/governance.test.mjs tests/configuration.test.mjs`
- **Per wave merge:** `npm run check`
- **Phase gate:** Full suite green, protected preview reviewed, every production-blocking decision approved, and a deliberate negative production-config build proven to fail before `$gsd-verify-work`.

### Wave 0 Gaps

- [ ] `tests/governance.test.mjs` — synthetic approval, branch, privacy, lead-contract, eligibility, and route tests.
- [ ] `tests/configuration.test.mjs` — pure environment parser and target isolation matrix.
- [ ] `tests/fixtures/governance/` — synthetic records with no real secrets, personal data, or unapproved business facts.
- [ ] A testable pure parser export from `src/lib/runtime-config.ts`; avoid module-load-only parsing in unit tests.
- [ ] A build-time invocation path proving production failure before `next build` completes.
- [ ] A redaction/source-contract assertion for the protected review route and report DTO.
- [ ] No framework install required; reuse native Node tests and existing Zod.

## Security Domain

Security enforcement is enabled at ASVS Level 1. Use stable ASVS 5.0.0 identifiers in validation evidence; the OWASP project identifies 5.0.0 as the latest stable production version and recommends version-qualified requirement IDs. [CITED: https://github.com/OWASP/ASVS]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Encoding and Sanitization | yes | Safe URL protocols/context handling for evidence/directions/origin values; React/Next output encoding; no raw HTML evidence. `v5.0.0-V1.2.1`–`V1.2.3`. [CITED: https://github.com/OWASP/ASVS/tree/v5.0.0_release] |
| V2 Validation and Business Logic | yes | Document expected structures and enforce them at the trusted server/build layer with Zod, not client state. `v5.0.0-V2.1.1`, `v5.0.0-V2.2.2`. [CITED: https://github.com/OWASP/ASVS/tree/v5.0.0_release] |
| V6 Authentication | no application auth in this phase | Use Vercel Authentication for preview protection; do not add app sessions. Authentication requirements become applicable if that boundary changes. |
| V7 Session Management | no | No application session is introduced by the proposed report architecture. |
| V8 Authorization | yes | Document report access rules and enforce preview access at a trusted platform boundary; production route is unavailable. `v5.0.0-V8.1.1`, `v5.0.0-V8.3.1`. [CITED: https://github.com/OWASP/ASVS/tree/v5.0.0_release] |
| V12 Secure Communication | yes | HTTPS-only production origin and provider endpoints; no insecure fallback. `v5.0.0-V12.1.1`, `v5.0.0-V12.2.1`, `v5.0.0-V12.2.2`. [CITED: https://github.com/OWASP/ASVS/tree/v5.0.0_release] |
| V14 Data Protection | yes | Never put API keys/tokens in URLs, public variables, report props, evidence URLs, or Git. `v5.0.0-V14.2.1`. [CITED: https://github.com/OWASP/ASVS/tree/v5.0.0_release] |
| V16 Security Logging/Error Handling | project control beyond L1 | Keep configuration errors generic/value-free and closeout records PII-free. ASVS 5.0.0 places the detailed V16 requirements above L1, but AGENTS.md requires secret/PII-safe logging. [VERIFIED: official ASVS 5.0.0 JSON/codebase instructions] |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unapproved actor changes approval state | Spoofing/Elevation | Git review plus fixed approver lanes, protected branch/release process, external evidence reference, two-tier release confirmation |
| Register value altered without evidence/history | Tampering | Stable IDs/revisions, Zod validation, evidence refs, Git history, supersession/invalidation records |
| Preview report publicly accessible | Information Disclosure | Vercel Authentication, preview-only route, production 404, noindex/noarchive, redacted DTO |
| Secret embedded in public variable/evidence link | Information Disclosure | Unprefixed server-only secrets, shape-only references, secret-key deny-list tests, no signed URLs |
| Preview sends leads/tags to production | Tampering/Information Disclosure | Target-specific profile IDs, `VERCEL_ENV` cross-check, production-profile rejection outside production, blocked crawl |
| Malicious URL in evidence/directions/provider config | Tampering/SSRF | HTTPS/protocol and hostname allow-list validation; never server-fetch arbitrary evidence URLs |
| Optimistic lead acknowledgement | Repudiation/Denial of Service | D-09 durable receipt and stable reference; fail closed until approved provider proves recovery/reconciliation |
| Rollback leaves incompatible config | Tampering/Availability | Deployment/config fingerprints, separate restoration checklist, closeout and drift reconciliation |
| Error output leaks environment values | Information Disclosure | Error codes and variable names only; never interpolate values or dump environment objects |

## Sources

### Primary (HIGH confidence)

- Project source and planning artifacts — `AGENTS.md`, `package.json`, `package-lock.json`, `src/content/site.ts`, `src/lib/site-url.ts`, `src/lib/leads/{types,router}.ts`, `src/app/actions/leads.ts`, `src/app/{robots,sitemap}.ts`, `tests/foundation.test.mjs`, `SOURCE_REGISTER.md`, and `BUSINESS_INPUTS_REQUIRED.md`.
- https://zod.dev/api — Zod 4 schema, enum, string/URL, ISO date/time, parsing, and refinement primitives.
- https://nextjs.org/docs/pages/guides/environment-variables — server/public environment behavior and build-time freezing of `NEXT_PUBLIC_*` values.
- https://nextjs.org/docs/app/guides/data-security — server-only/public environment security boundary.
- https://vercel.com/docs/environment-variables — target scopes, branch-specific preview variables, and new-deployment application behavior.
- https://vercel.com/docs/environment-variables/system-environment-variables — `VERCEL_ENV`, `VERCEL_TARGET_ENV`, and deployment URL semantics.
- https://vercel.com/docs/deployment-protection — preview authentication/protection methods and scopes.
- https://vercel.com/docs/deployments/promote-preview-to-production — inspection, protected preview testing, promotion rebuild, and production verification.
- https://vercel.com/docs/deployments/promoting-a-deployment — staged production/manual domain assignment workflow.
- https://vercel.com/docs/instant-rollback — rollback behavior and stale environment configuration caveat.
- https://privacy.gov.ph/data-privacy-act/ — Philippine controller/accountability, processing, notice, rights, retention, safeguards, and processor duties.
- https://privacy.gov.ph/implementing-rules-regulations-data-privacy-act-2012/ — transparency, purpose, proportionality, retention/disposal, rights, and organizational policy requirements.
- https://privacy.gov.ph/wp-content/uploads/2023/11/NPC-Circular-No.-2023-04_Guidelines-on-Consent_07Nov2023.pdf — consent governance when consent is the selected lawful criterion.
- https://github.com/OWASP/ASVS/tree/v5.0.0_release — stable ASVS 5.0.0 requirements and identifiers.

### Secondary (MEDIUM confidence)

- None used for technical or legal requirements.

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — no new packages; versions and APIs verified against lockfile, registry, and official docs.
- Architecture: HIGH — derived from locked decisions, existing code seams, and official Next.js/Vercel behavior.
- Governance schemas: HIGH for required fields and fail-closed pattern; MEDIUM for final record granularity until editors/operators review it.
- Privacy contract: HIGH for topics that require decisions; LOW/UNSET for project-specific legal answers, which remain approval checkpoints.
- Lead provider: HIGH for the acceptance criteria; UNSET for provider selection because no approved candidates/evidence were supplied.
- Release operations: HIGH for workflow shape and Vercel behavior; MEDIUM for account-specific capabilities/permissions until the commercial project is inspected.
- Pitfalls: HIGH — corroborated by current source behavior and official platform/security documentation.

**Research date:** 2026-08-18
**Valid until:** 2026-09-17 for stable code/policy patterns; re-check Vercel/Next.js operational docs and ASVS stable release before implementation if delayed.
