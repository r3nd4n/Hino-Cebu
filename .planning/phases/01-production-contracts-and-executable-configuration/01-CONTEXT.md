# Phase 1: Production Contracts and Executable Configuration - Context

**Gathered:** 2026-08-18
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase establishes the approved business facts, legal and operational rules, account ownership, lead-acceptance contract, release authority, and environment configuration that the existing Hino Cebu application must enforce before production. It delivers decision records, approval evidence references, fail-closed content/configuration behavior, and explicit operational ownership; it does not implement the Phase 2 lead-delivery machinery, Phase 3 consent/publication controls, Phase 4 test suite, or Phase 5 live launch.

</domain>

<decisions>
## Implementation Decisions

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Phase Contract

- `.planning/PROJECT.md` — Core value, validated MVP baseline, production-readiness constraints, cost doctrine, and locked project decisions.
- `.planning/REQUIREMENTS.md` — Phase 1 requirements PROD-01 through PROD-07 and downstream traceability.
- `.planning/ROADMAP.md` — Fixed Phase 1 boundary, dependencies, goal, and observable success criteria.
- `.planning/STATE.md` — Current phase, unresolved external dependencies, and accumulated roadmap decisions.
- `.planning/research/SUMMARY.md` — Current production-readiness research, recommended dependency order, provider-neutral durability requirements, and known decision gaps.

### Product, Business, and Approval Inputs

- `HINO_CEBU_MASTER_WEBSITE_SPEC.md` — Master product, marketing, SEO, technical, content-truth, hosting, cost, and business-input rules.
- `BUSINESS_INPUTS_REQUIRED.md` — Concrete stakeholder facts, accounts, legal inputs, routing destinations, and approvals still required before launch.
- `SOURCE_REGISTER.md` — Existing source provenance and verification status for branch, product, brand, and asset facts.
- `ASSET_REQUIREMENTS.md` — Approved asset gaps, rights, local photography, and production media requirements.

### Existing Architecture and Operations

- `.planning/codebase/ARCHITECTURE.md` — Established server-first modular architecture, typed content layer, lead boundary, and configuration/SEO flows to preserve.
- `.planning/codebase/STACK.md` — Current Next.js, React, TypeScript, Zod, environment, runtime, and deployment baseline.
- `.planning/codebase/INTEGRATIONS.md` — Current lead webhook, analytics tags, maps/contact links, environment variables, and missing auth/durability/monitoring behavior.
- `.planning/codebase/CONCERNS.md` — Production blockers around lead routing, legal approval, observability, content governance, configuration, and testing.
- `README.md` — Current operational documentation, environment variables, lead behavior, content workflow, Vercel deployment, and readiness checklist.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/content/site.ts`: Existing centralized branch/contact configuration is the natural base for one approved branch record and verified contact actions.
- `src/lib/site-url.ts`: Existing site-origin helper can evolve into the fail-closed, environment-aware production configuration boundary.
- `src/lib/leads/types.ts`: Existing vendor-neutral lead contracts provide the seam for documenting stable identifiers, ownership, and durable acceptance without provider coupling.
- `src/lib/leads/router.ts`: Existing adapter boundary should be preserved; its current webhook-or-ephemeral behavior is the contract gap that Phase 1 must specify and Phase 2 must implement.
- `src/app/actions/leads.ts`: Existing server action is the public mutation boundary affected by approved request semantics and environment safety.
- `src/content/{trucks,promotions,deliveries,campaigns}.ts`: Typed content collections are reusable foundations for evidence, approval, local-applicability, review, and expiry metadata.
- `src/app/{robots,sitemap}.ts` and `src/lib/seo.ts`: Existing SEO utilities are integration points for minimum-viable-truth and environment eligibility decisions.

### Established Patterns

- Repository-managed typed content is the source of public facts; preserve this low-cost, reviewable approach rather than introducing a CMS.
- Server components and small client islands are the default; Phase 1 configuration and approval logic should remain server/build-time where practical.
- Zod already validates untrusted lead inputs and is the established choice for executable configuration and publication contracts.
- Integrations sit behind small adapter boundaries; provider selection must not leak into page or form components.
- Missing marketing identifiers disable optional tags, and a missing site origin blocks crawling; extend this fail-closed philosophy consistently.

### Integration Points

- The approval register and evidence references feed branch content, local product/support claims, legal copy, request semantics, environment validation, and the protected review report.
- Parsed environment state must be shared by metadata, robots, sitemap, structured data, lead routing, analytics configuration, preview isolation, and release checks.
- Lead destination, authentication, receipt semantics, ownership, escalation, and failover decisions must become explicit inputs to the existing `LeadRouter` boundary for Phase 2.
- Protected preview and manual promotion decisions connect repository checks to the future CI/release gate and Vercel deployment permissions.

</code_context>

<specifics>
## Specific Ideas

- “Approved” means a named role, date, review/expiry date, and authoritative evidence reference—not an undocumented verbal or email assumption.
- Preview pages should look like production for honest review; missing-information diagnostics belong in a separate protected report rather than inline public-looking placeholders.
- “Request received” is a durable business acknowledgement, not a successful network call, generated UUID, email send, or optimistic queue assumption.
- Emergency authority is narrow and auditable: contain risk first, notify owners, then reconcile configuration and complete retrospective review.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-production-contracts-and-executable-configuration*
*Context gathered: 2026-08-18*
