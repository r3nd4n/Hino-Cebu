# Feature Research

**Domain:** Production-ready local commercial-dealership lead-generation and content-authority website  
**Project:** Hino Cebu Digital Growth Website  
**Researched:** 2026-08-18  
**Confidence:** HIGH for launch requirements; MEDIUM for post-launch prioritization pending stakeholder and customer data

## Research Frame

This is a subsequent milestone, not a greenfield feature build. The existing Next.js MVP already has the public route set, model pages, typed content, sales/service/parts/fleet/financing forms, a truck finder, campaign pages, attribution capture, analytics hooks, metadata, sitemap, robots, structured-data utilities, and mobile conversion actions. Those capabilities appear below only when they need hardening before commercial launch.

The feature boundary is:

- **Launch-critical table stakes:** make the existing acquisition journey truthful, deliverable, compliant, observable, accessible, and safe to publish.
- **Post-launch differentiators:** use verified Cebu expertise, customer proof, and closed-loop commercial data to become more useful than a national catalog or generic dealer page.
- **Anti-features:** avoid operational promises or infrastructure whose truth, privacy, maintenance cost, or business value is not yet supported.

## Feature Landscape

### Table Stakes (Safe Commercial Launch)

Missing these does not merely reduce polish; it creates lost leads, misleading promises, legal/privacy exposure, or an untrustworthy local listing.

| Feature | Why Expected | Current State | Complexity | Release | Dependencies / Stakeholder Inputs |
|---------|--------------|---------------|------------|---------|-----------------------------------|
| Durable, team-specific lead delivery | A buyer expects a submitted quote, parts, service, fleet, or finance request to reach the right Cebu team exactly once and receive an honest outcome. | **Hardening:** forms and adapter exist; production destination is optional and the fallback discards leads. | HIGH | **Launch-critical** | Approved destination per lead type; delivery owner; authentication; timeout; idempotency; durable acceptance/queue or recoverable store; retry/dead-letter policy; PII-safe delivery metrics; retention policy. |
| Correct form contracts and recovery UX | Every visible form must be submittable; validation must match rendered fields, errors must be actionable, and a failed handoff must offer retry/call without claiming success. | **Hardening:** compact campaign form cannot satisfy its server schema; browser behavior is not tested. | MEDIUM | **Launch-critical** | Named form variants; operationally approved fields; full submission tests for every lead type/variant; verified phone fallback; response-time wording approval. |
| Strict validation and abuse resistance | Public lead forms attract bots and malformed operational data; spam can bury genuine commercial inquiries or overload the destination. | **Hardening:** Zod, length caps, consent, and honeypot exist; rate limiting and strict provenance/select/date/phone validation do not. | MEDIUM | **Launch-critical** | Stakeholder-approved rate-limit/CAPTCHA policy; normalized Philippine phone rules; server-derived/capped source data; destination circuit breaker; abuse monitoring. |
| Approved privacy notice and consent behavior | Philippine data subjects must be told what data is processed, why, by whom, for how long, who receives it, and how to exercise rights. | **Hardening/content:** draft privacy and terms pages exist; controller identity, privacy contact, retention, rights process, processors, and marketing consent remain unapproved. | MEDIUM | **Launch-critical** | Business/legal approval; controller and privacy contact; retention/deletion schedule; rights and incident process; processor/destination inventory; cookie/tag decision. |
| Verified branch identity and contact actions | Local buyers expect the website, Maps profile, call action, directions, and operating hours to agree and reach the actual branch. | **Hardening/content:** name, address, and phone have usable sources but need final approval; hours and direct GBP target are missing. | LOW | **Launch-critical** | Final brand/trademark approval; verified phone/address/hours; direct GBP URL; domain ownership; named owner for website/GBP consistency and holiday-hour updates. |
| Locally accurate product and support applicability | Commercial buyers must know what Hino Cebu can actually offer; national lineup data is not proof of local availability or a local service promise. | **Hardening/content:** national series/spec sources exist; Cebu models/configurations, service, parts, fleet, and financing participation remain unconfirmed. | MEDIUM | **Launch-critical** | Sales/aftersales sign-off on locally offered lineup and wording; parts/service request process; fleet scope; financing participation; source and review date for each claim. Omit unavailable facts rather than infer them. |
| Build-time publication safety | Expired promotions, unreleased customer stories, stale specifications, or national-only products must not accidentally appear as local facts. | **Missing hardening:** empty promotion/delivery collections are safe today, but approval, source age, local applicability, expiry, and release evidence are not enforced. | MEDIUM | **Launch-critical** | Typed schema for status, source, owner, approval, local applicability, reviewed date, expiry, and release reference; build failures for invalid publishable records; content owner/review cadence. |
| Production origin, crawl, and structured-data correctness | Search and sharing surfaces must resolve to the final HTTPS domain, index only intended pages, and repeat the same verified branch facts users see. | **Hardening:** metadata foundation exists; malformed configured origin can still allow crawling with localhost-derived URLs. | MEDIUM | **Launch-critical** | Approved domain/DNS; centralized environment schema; production/previews policy; route/canonical/sitemap/robots/schema tests; Search Console ownership; redirect inventory if replacing a site. |
| Consent-aware, reconcilable measurement | The business needs source, campaign, page, lead type, and high-intent click data without leaking PII or loading unapproved tags. | **Hardening:** UTM/click-ID capture, PII-free events, and optional tags exist; consent, live IDs, diagnostics, and operational reconciliation do not. | MEDIUM | **Launch-critical before paid-media scale** | Consent decision; GTM/GA4/Ads/Meta IDs; event naming/ownership; test traffic plan; lead reference retained with attribution; dashboard/reconciliation procedure. Keep tags off until approved. |
| Mobile, accessibility, and form journey verification | Buyers may contact the branch from a phone in the field; keyboard, focus, errors, touch targets, responsive navigation, and clear status are baseline usability. | **Hardening:** responsive design and accessibility basics exist; no browser-level journey or WCAG 2.2 AA verification. | MEDIUM | **Launch-critical** | Device/browser matrix; keyboard/screen-reader checks; accessible error/status behavior; reduced-motion and contrast review; automated and manual regression checks. |
| Fast, stable production media and pages | Slow truck imagery or third-party tags weaken mobile conversion and organic acquisition. | **Hardening:** server-first rendering and image component use exist; source assets are oversized and no enforced performance budget exists. | MEDIUM | **Launch-critical** | Approved optimized logo/imagery; responsive derivatives; page/route performance budgets; consent- and route-aware tag loading; real-production Core Web Vitals monitoring. |
| Security, observability, and release gate | The team must detect broken forms, destination outages, bad configuration, crawl mistakes, and regressions before customers or ad spend expose them. | **Missing hardening:** basic headers and local checks exist; no CSP/HSTS plan, CI workflow, uptime/error monitoring, lead delivery alerting, or production smoke gate. | HIGH | **Launch-critical** | Production owner and escalation path; commercial Vercel plan; secrets/config schema; CI checks; synthetic non-PII lead test; uptime/error/lead-delivery alerts; CSP/tag compatibility decision; rollback runbook. |
| Honest request semantics | Service, parts, financing, and quote CTAs must state what happens next and never imply stock, price, approval, or appointment confirmation without a connected operational system. | **Hardening/content:** request-oriented forms exist, but final processes and response wording are unconfirmed. | LOW | **Launch-critical** | Department workflow and SLA wording; escalation phone; approved disclaimers; explicit distinction between “request received” and “booking/availability/approval confirmed.” |

### Differentiators (Post-Launch Competitive Advantage)

These should follow launch stabilization. The strongest moat is not another product catalog; it is a growing body of verified local evidence that helps Cebu operators make and maintain a commercial-vehicle decision.

| Feature | Value Proposition | Current State | Complexity | Release | Dependencies / Stakeholder Inputs |
|---------|-------------------|---------------|------------|---------|-----------------------------------|
| Cebu customer-delivery stories with releases | Shows real local applications, body configurations, and business outcomes; turns branch activity into proof, internal links, and long-lived search assets. | **Foundation exists:** delivery model/index route and empty-state behavior exist; no approved stories. | MEDIUM | **Post-launch P2** | Customer consent/release; delivery facts; local photography rights; editorial template; model/application links; review process. Start with substantive stories, not thin handover posts. |
| Application-led Cebu Truck Guide | Answers “what truck fits this operation?” for logistics, construction, food distribution, retail/wholesale, agriculture, and other verified Cebu use cases. | **Foundation exists:** guide index/previews exist; depth and article templates/content require expansion. | MEDIUM | **Post-launch P2** | Search Console demand; salesperson/service expert interviews; technical review; original writing/photos; article schema and deliberate links to models/support/consultation. |
| Reviewed truck-fit decision support v2 | A transparent shortlist based on payload, body, route/environment, cargo, fleet size, and timeline is more useful than browsing series names. | **Hardening plus expansion:** finder exists, but some required answers do not affect results and tie behavior is weak. | HIGH | **Post-launch P2 after correctness fix** | Reviewed rule table and caveats; local applicability data; body-builder/engineering input where authorized; test cases; analytics for completion and assisted leads. Output 1–3 options with reasons, never a definitive suitability guarantee. |
| Model/application comparison workspace | Lets research-stage buyers compare verified payload/GVW, body suitability, operating context, and support paths without translating brochure tables themselves. | **Missing.** | MEDIUM | **Post-launch P2** | Approved comparable fields; local model availability; source dates; consultation caveats; canonical model records. Do not compare price unless locally approved and maintainable. |
| Aftersales authority hub | Cebu-specific service-request preparation, PMS education, parts-identification guidance, and downtime-reduction content supports existing owners and repeat business. | **Missing beyond overview/inquiry pages.** | MEDIUM | **Post-launch P2/P3** | Service/parts process approval; Hino-approved technical sources; branch expert reviewer; revision dates; clear emergency/roadside boundaries; no diagnostic promises. |
| Fleet proof and procurement resources | Fleet case studies, replacement-planning worksheets, service-support explanations, and procurement checklists address multi-vehicle buyers with higher lead value. | **Missing beyond fleet inquiry page.** | MEDIUM | **Post-launch P2/P3** | Approved fleet offer and account process; permissioned customer evidence; downloadable-resource privacy decision; subject-matter review; qualified-lead criteria. |
| Local visual proof system | Real branch, staff, service bay, delivery, and Cebu-operation imagery creates trust competitors cannot reproduce and improves GBP/site consistency. | **Missing:** national imagery is available; local photography is pending. | MEDIUM | **Post-launch P2; obtain early** | Shot list; brand approval; staff/customer releases; accessible alt-text facts; derivative/optimization workflow; asset owner. |
| Closed-loop lead quality and offline outcome measurement | Connects campaigns and content to qualified leads, appointments, quotations, and sales, allowing spend and editorial work to follow revenue rather than raw submissions. | **Missing:** attribution reaches submissions but no durable CRM/status loop exists. | HIGH | **Post-launch P2/P3** | Durable lead ID/store; CRM or governed sheet; stage definitions and owners; deduplication; consent/legal review; Google Ads Data Manager/enhanced-conversion design when volume justifies it. |
| Department-aware response experience | Route-specific confirmations, expected next step, fallback contact, and later status instrumentation reduce uncertainty for sales, parts, service, fleet, and finance leads. | **Partial:** lead types exist; final routing and processes do not. | MEDIUM | **P1 hardening, then P2 optimization** | Department owners, response windows, coverage schedule, lead status taxonomy, template approval, delivery telemetry. Avoid promising real-time response. |
| Demand-led campaign and content iteration | Use Search Console queries, GA4 funnel events, call/directions intent, and qualified-lead outcomes to decide the next landing page or guide. | **Foundation exists:** campaign template and event abstraction exist; production data loop does not. | MEDIUM | **Post-launch continuous** | Verified analytics; sufficient sample size; editorial owner; campaign approval; index/noindex and canonical rules; monthly review cadence. |
| Google Business Profile/site operating workflow | Consistent hours, contact details, photos, updates, landing targets, and review-response ownership improve local trust beyond a one-time map link. | **Mostly operational, not a new site feature.** | LOW | **Launch setup + ongoing P2** | Verified GBP ownership; owner/manager roles; update cadence; direct branch landing page; review-response policy; special-hours process. |

### Anti-Features (Deliberately Do Not Build Yet)

| Feature | Why Requested | Why Problematic Now | Alternative / Trigger to Reconsider |
|---------|---------------|---------------------|------------------------------------|
| Real-time inventory or “available now” badges | Creates urgency and answers immediate availability questions. | No verified inventory feed, freshness SLA, or branch authorization; stale status damages trust and can mislead buyers. | Use “ask about current availability” and route a model-specific inquiry. Reconsider only with an authoritative source, timestamp, owner, and outage/staleness behavior. |
| Public prices, monthly-payment calculators, or financing approval | Buyers want a quick affordability answer. | Body, configuration, taxes, promotions, lender terms, and eligibility vary; unapproved figures create regulatory and sales risk. | Offer financing consultation and publish only approved, dated terms with disclaimers. Add a calculator only when inputs and ownership are formally approved. |
| Online truck checkout/reservation | Appears modern and shortens the funnel. | Commercial-truck fit, body, documents, financing, and local availability require consultation; payment and cancellation introduce major operational scope. | Keep a qualified quote/recommendation funnel. Reconsider after the business has an authoritative inventory, pricing, payment, and fulfillment system. |
| “Confirmed” service booking calendar | Customers value a guaranteed slot. | The current workflow is only a request; a disconnected calendar can double-book or create false promises. | Say “Request a Service Schedule.” Integrate confirmation only with the actual workshop scheduling system and ownership/SLA. |
| Public parts/service photo uploads | Photos can clarify a part or fault. | Storage, malware scanning, access control, retention, sensitive metadata, and deletion are unresolved. | Collect part number/VIN/description, then request files through an approved staff channel. Reconsider after secure storage and privacy handling are approved. |
| Generic chatbot or AI truck adviser | Promises instant answers and lead capture. | Can hallucinate specifications, availability, pricing, finance, or safety guidance; adds privacy, moderation, and recurring-cost burdens before a governed knowledge base exists. | Use transparent rules-based guidance, strong FAQs, click-to-call, and human consultation. Reconsider only with approved retrieval sources, evaluation, escalation, and monitoring. |
| Scraped/embedded reviews or fabricated testimonials | Adds visible social proof quickly. | Consent, authenticity, platform terms, freshness, and schema-policy risks; fake or selectively copied proof is explicitly prohibited. | Link to the verified GBP and publish permissioned customer stories. Consider an official review integration only when governance and value are demonstrated. |
| Thin city/service-area doorway pages | Targets many local keyword combinations cheaply. | Duplicated low-value pages weaken trust and can conflict with the local-authority strategy. | Publish one strong Cebu/Metro Cebu entity page and only create area pages when service facts, proof, and content are genuinely distinct. |
| Heavy social-feed embeds, autoplay video, carousels, or animation framework | Makes the site feel active and visually rich. | Adds third-party tracking, JavaScript, instability, accessibility friction, and weak permanent content value. | Convert strong social activity into optimized owned stories and use static, purposeful media. |
| Paid CMS at launch | Lets non-developers edit immediately. | Current content volume is small; a CMS adds cost, roles, previews, security, and migration work before editorial cadence is proven. | Keep typed repository content with validation and a documented publishing owner. Add a CMS when update volume or staffing measurably blocks growth. |
| Full CRM, automated lead scoring, or marketing automation immediately | Promises sophisticated sales operations. | Routing destinations, status definitions, data ownership, consent, and lead volume are not settled; automation can scale bad data and missed handoffs. | First establish durable routing, a minimal governed status loop, and response ownership. Add CRM/scoring when volume and reconciliation justify it. |
| Paid A/B testing platform or broad retargeting at launch | Suggests rapid conversion gains. | Without trustworthy conversion data, consent, sufficient sample size, and qualified-lead outcomes, results are noisy and privacy/cost burdens arrive early. | Use analytics-informed copy/layout iterations and campaign-specific pages. Reconsider after stable baseline volume and legal approval. |
| Large technical maintenance library without named review | Could attract owners and build search traffic. | Stale or overly generic technical advice may harm vehicles, safety, or brand trust and creates a heavy review burden. | Start with a small reviewed aftersales hub. Expand only with a Hino/branch expert owner and review dates. |
| Native mobile app or customer portal | Appears sticky and premium. | Duplicates a responsive public site and introduces accounts, security, support, and data-lifecycle scope without a validated recurring user job. | Keep mobile-first web journeys. Reconsider only when authenticated service history/status or fleet workflows are backed by real systems and demand. |

## Feature Dependencies

```text
Verified stakeholder inputs
    +--> Production configuration gate
    +--> Approved local content and request semantics
    +--> Privacy/consent implementation
    +--> Department routing ownership

Strict form-variant contract
    --> Durable lead acceptance
        --> Delivery telemetry and recovery
            --> Qualified-lead status loop
                --> Offline outcome attribution / lead-quality optimization

Approved content schema + publication gate
    --> Cebu application guides
    --> Customer-delivery stories + release evidence
    --> Aftersales authority content + expert review
    --> Model/application comparison
    --> Reviewed truck-finder rules

Validated production origin + domain
    --> Correct canonicals / sitemap / robots / schema
    --> Search Console verification
        --> Demand-led content roadmap

Consent decision
    --> Marketing-tag activation
        --> Reliable funnel baseline
            --> Campaign iteration / experiments

Authoritative inventory, pricing, scheduling, or CRM systems
    -X-> absent at launch; therefore no real-time availability, checkout,
         guaranteed appointment, payment calculator, or automation claims
```

### Dependency Notes

- **Lead delivery precedes acquisition scale:** campaign traffic should not increase until every form variant can create a recoverable lead and failures alert an owner.
- **Business truth precedes content depth:** Cebu applicability, service/parts processes, financing participation, and fleet wording must be signed off before model comparisons or advice can be authoritative.
- **Publication controls precede content volume:** customer releases, source/review dates, expiry, and local-applicability checks should be automated before promotions, deliveries, and guides multiply.
- **Consent precedes optional tags:** keep marketing providers disabled until the legal basis, consent behavior, withdrawal, and tag configuration are approved and tested.
- **A durable lead ID precedes offline attribution:** qualified-lead and closed-sale feedback cannot be reconciled reliably from ephemeral submissions.
- **Real operational systems precede real-time promises:** inventory, price, financing, booking, uploads, and status features must fail closed when their source is unavailable or stale.

## MVP Definition for This Milestone

### Launch With (Production v1)

- [ ] Every lead type and campaign variant passes real browser submission tests and reaches an approved, authenticated, recoverable destination.
- [ ] Timeouts, idempotency, abuse controls, delivery telemetry, alerts, and honest failure/retry states protect the inquiry funnel.
- [ ] Final branch identity, hours, direct directions target, local product/support applicability, legal copy, and request-handling wording are approved and centralized.
- [ ] Publication rules fail the build for unapproved, expired, stale, unreleased, or locally inapplicable content.
- [ ] Domain, indexing, canonicals, sitemap, structured data, redirects, security headers, and environment variables pass a production configuration gate.
- [ ] Consent-aware analytics and attribution are verified with test leads, or remain disabled without weakening lead delivery.
- [ ] Critical mobile, keyboard, focus, error, navigation, call, quote, and directions journeys pass accessibility and responsive verification.
- [ ] Optimized approved assets, a performance budget, CI, production smoke tests, monitoring, ownership, and rollback instructions are in place.

### Add After Validation (v1.x)

- [ ] First permissioned Cebu customer-delivery stories — after a release workflow and substantive template are approved.
- [ ] First application-led Cebu guides — prioritized from salesperson insight and Search Console demand, with technical review.
- [ ] Correct and expand truck finder — after local applicability and decision rules are signed off; measure assisted leads.
- [ ] Model/application comparison — after comparable local data has a source and review cadence.
- [ ] Aftersales and fleet authority content — after service, parts, and fleet owners approve processes and claims.
- [ ] Qualified-lead status loop — once sales teams can maintain a minimal stage taxonomy consistently.
- [ ] GBP/site operations cadence — publish verified local photos, special hours, and branch updates under named ownership.

### Future Consideration (v2+)

- [ ] CRM integration and enhanced/offline lead conversions — when durable IDs, consent, status quality, and lead volume justify automation.
- [ ] CMS/editorial workflow — when repository publishing measurably limits a sustained multi-author content cadence.
- [ ] Secure uploads — only after storage, malware scanning, access, retention, and deletion controls are approved.
- [ ] Live scheduling, inventory, or approved calculators — only with authoritative business-system integrations and staleness/failure handling.
- [ ] Experimentation platform — only after stable conversion baselines and sufficient qualified-lead sample size.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Rationale |
|---------|------------|---------------------|----------|-----------|
| Durable lead routing, recovery, and alerts | HIGH | HIGH | P1 | Directly protects revenue and the core value proposition. |
| Form contract fixes and strict validation | HIGH | MEDIUM | P1 | A currently visible campaign path is behaviorally broken. |
| Verified local operations and request semantics | HIGH | LOW–MEDIUM | P1 | Trust and conversion depend on accurate Cebu facts and expectations. |
| Privacy/consent approval and implementation | HIGH | MEDIUM | P1 | Required before production PII processing and optional marketing tags. |
| Publication safety gate | HIGH | MEDIUM | P1 | Prevents false local availability, expired offers, and unreleased stories. |
| Production SEO/configuration gate | HIGH | MEDIUM | P1 | Prevents wrong origins, crawl state, and inconsistent entity data. |
| Accessibility, performance, security, CI, monitoring | HIGH | HIGH | P1 | Required to operate a commercial acquisition channel safely. |
| Cebu delivery stories | HIGH | MEDIUM | P2 | Strongest authentic local proof once releases exist. |
| Application-led guides | HIGH | MEDIUM | P2 | Builds non-brand discovery and assists consultations. |
| Truck finder v2 | HIGH | HIGH | P2 | Valuable decision aid, but only after reviewed data/rules. |
| Model/application comparison | MEDIUM–HIGH | MEDIUM | P2 | Useful for research-stage buyers once local data is maintainable. |
| Qualified-lead outcome loop | HIGH | HIGH | P2 | Enables revenue-led content and campaign decisions. |
| Aftersales/fleet authority hubs | MEDIUM–HIGH | MEDIUM | P2/P3 | Builds retention and high-value authority with expert ownership. |
| CMS, uploads, live systems, AI/chat | LOW now | HIGH | P3 | Defer until real operational demand and governance exist. |

**Priority key:**

- **P1:** Must have for safe commercial launch.
- **P2:** Add after launch stability, operational ownership, and baseline measurement.
- **P3:** Reconsider only when a named trigger and business system justify it.

## Competitor and Ecosystem Feature Analysis

| Feature | Current Ecosystem Evidence | Implication for Hino Cebu |
|---------|----------------------------|---------------------------|
| Distinct local department contacts | Isuzu Philippines’ official dealer directory exposes Cebu branch address plus separate sales, service, customer-relations, parts, and warranty contacts. FUSO Philippines’ dealer directory likewise lists Cebu dealers with sales/service/parts numbers. | Department-aware contact and routing are table stakes. Hino Cebu should outperform with one consistent branch identity, clear request semantics, durable routing, and measurable handoff rather than merely publishing many addresses. |
| National model/specification catalog | Hino Motors Philippines publishes series, model specifications, brochures, and some national promo-unit pricing. | Do not reproduce the national catalog. Translate only approved, locally applicable facts into Cebu business decisions and link to official brochures where useful. Local availability and price need separate approval. |
| Aftersales and genuine-parts proposition | Hino Philippines describes service expertise and nationwide support; FUSO and Isuzu foreground parts/service access in their official navigation and directories. | Parts and service access are expected. Differentiation should come from accurate Cebu processes, request preparation, reviewed guidance, and proof of local support—not unsupported uptime claims. |
| Local profile accuracy | Google requires accurate real-world business name, address, customer-facing hours, and a phone/website representing the individual location; it prefers a local phone number where possible. Google also uses official website content as one source for Business Profile facts. | Website and GBP consistency is a launch requirement and an ongoing operating workflow, not a one-time SEO enhancement. |
| Lead-funnel measurement | GA4 recommends lead-generation events for businesses such as automotive sales where conversion often occurs offline. Google Ads’ current enhanced-conversions-for-leads flow depends on storing lead identifiers with a CRM/data source and later importing outcomes. | Submission analytics are launch table stakes, but qualified/closed outcome attribution is post-launch and depends on durable storage, consent, operational stages, and disciplined reconciliation. |

## What to Build First: Opinionated Sequence

1. **Close the lead-loss and form-correctness gap.** No content or campaign expansion is commercially defensible while a visible form cannot submit or accepted leads can disappear.
2. **Resolve truth, privacy, and operational inputs.** Encode approved branch facts, lead destinations, local applicability, legal/consent behavior, and request semantics into enforceable configuration/content rules.
3. **Create the production gate.** Verify crawl/origin/schema behavior, security headers, accessibility, mobile conversion, performance, analytics, alerts, and rollback under the real domain/environment.
4. **Establish a small local-proof publishing loop.** Publish a few excellent delivery stories and application guides with releases, sources, reviewers, and internal links.
5. **Improve decision support from evidence.** Fix the finder first, then add comparison and aftersales/fleet resources using approved local data and observed queries.
6. **Close the commercial feedback loop.** Add qualified-lead stages and offline outcome attribution only after the branch can maintain the data reliably.

## Evidence and Confidence

| Finding | Confidence | Basis |
|---------|------------|-------|
| Lead reliability, form correctness, privacy approval, production config, publication safety, accessibility, monitoring, and local-content approval are launch blockers. | HIGH | Direct repository/project evidence in `PROJECT.md`, codebase concerns, business-input checklist, and master specification. |
| Separate sales/service/parts contact paths are normal dealership expectations. | HIGH | Official Isuzu Philippines and FUSO Philippines dealer directories. |
| Website/GBP branch facts must be accurate and location-specific. | HIGH | Current official Google Business Profile guidelines. |
| Consent/privacy disclosure must identify processing purpose, controller, recipients, retention, and rights. | HIGH | Philippine National Privacy Commission guidance. Final implementation still requires business/legal review. |
| Cebu stories, application guides, reviewed decision support, and aftersales expertise are the best near-term differentiators. | MEDIUM | Strong alignment with project strategy and gaps in observed official competitor directory/catalog experiences; needs Search Console, sales-team, and customer evidence after launch. |
| Closed-loop lead outcomes should follow durable routing rather than launch with a full CRM. | HIGH | Repository has no durable lead store; current Google Ads guidance assumes retained lead identifiers and later outcome import. |

## Sources

### Project evidence

- `.planning/PROJECT.md` — validated MVP baseline, active launch requirements, scope limits, and milestone sequencing (reviewed 2026-08-18).
- `.planning/codebase/ARCHITECTURE.md` — current routes, typed content, form/routing boundary, analytics, and SEO architecture (refreshed 2026-08-18).
- `.planning/codebase/CONCERNS.md` — lead loss, compact-form bug, abuse/privacy/configuration risks, publication fragility, and test gaps (analyzed 2026-08-18).
- `HINO_CEBU_MASTER_WEBSITE_SPEC.md` — audience jobs, funnels, authority strategy, governance, and cost doctrine.
- `BUSINESS_INPUTS_REQUIRED.md` — unresolved production inputs and approvals (updated 2026-08-18).

### Current official ecosystem sources

- [Hino Motors Philippines dealer locator](https://www.hino.com.ph/find-a-dealer) — national dealer discovery baseline (HIGH confidence; official source, accessed 2026-08-18).
- [Hino Motors Philippines services](https://hino.com.ph/services) — official aftersales proposition and service claims that require local applicability review (HIGH confidence; official source, accessed 2026-08-18).
- [Hino Motors Philippines online product catalog](https://hino.com.ph/online-shop) — current national series/specification and promo-unit patterns; not evidence of Cebu availability (HIGH confidence; official source, accessed 2026-08-18).
- [Isuzu Philippines dealer locator](https://www.isuzuphil.com/dealers) — official Cebu branch and department-contact pattern (HIGH confidence; official source, accessed 2026-08-18).
- [FUSO Philippines dealer locator](https://fuso.com.ph/dealers/) — official Cebu sales/service/parts contact pattern (HIGH confidence; official source, accessed 2026-08-18).
- [Google Business Profile representation guidelines](https://support.google.com/business/answer/3038177?hl=en) — accurate real-world name, address, hours, and location-specific phone/website expectations (HIGH confidence; official documentation, accessed 2026-08-18).
- [Google Business Profile information sources](https://support.google.com/business/answer/2721884?hl=en) — official website content can inform local profile facts (HIGH confidence; official documentation, accessed 2026-08-18).
- [Philippine National Privacy Commission: Right to be Informed](https://privacy.gov.ph/the-right-to-be-informed/) — required privacy-notice information for personal-data processing (HIGH confidence; regulator guidance, accessed 2026-08-18).
- [GA4 recommended events](https://support.google.com/analytics/answer/9267735?hl=en) — lead-generation funnel measurement for automotive/offline conversion contexts (HIGH confidence; official documentation, accessed 2026-08-18).
- [Google Ads enhanced conversions for leads](https://support.google.com/google-ads/answer/15713840?hl=en) — current stored-lead and offline-outcome attribution model (HIGH confidence; official documentation, accessed 2026-08-18).

## Open Questions for Requirements Definition

- Which system is the approved durable destination for each lead type, and who owns failed-delivery recovery?
- What response wording and response-time expectation can each Cebu department honestly support?
- Which Hino models/configurations and national service/finance/fleet claims are locally applicable now?
- Who is the personal information controller, privacy contact, and content approver, and what are the retention/deletion rules?
- Does the branch own and control the GBP, domain, analytics accounts, and direct map target?
- Which first three Cebu applications have enough sales expertise, search demand, and original evidence to justify authoritative guides?
- Can the branch obtain customer releases and a repeatable photography/story intake process?
- What minimal lead-stage taxonomy can sales and aftersales teams maintain consistently before CRM automation?

---
*Feature research for: Hino Cebu production launch and local authority growth*  
*Researched: 2026-08-18*
