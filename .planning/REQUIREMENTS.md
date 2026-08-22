# Requirements: Hino Cebu Digital Growth Website

**Defined:** 2026-08-18
**Core Value:** Qualified Cebu prospects can confidently find the right Hino product or support service and complete a reliable, attributable inquiry that reaches the appropriate Hino Cebu team.

## v1 Requirements

Requirements for the production-readiness milestone and its first measured post-launch growth phase. Existing MVP routes and components are the validated baseline and are not duplicated here.

### Production Contracts and Configuration

- [x] **PROD-01**: A release operator can identify the approved production domain, Vercel account, DNS owner, deployment approvers, and rollback owner from a versioned decision register.
- [x] **PROD-02**: A content editor can use one approved branch record for the business name, address, phone, operating hours, directions target, and department contact actions shown across pages and structured data.
- [x] **PROD-03**: A visitor sees only stakeholder-approved descriptions of locally applicable trucks, service, parts, fleet support, financing participation, request outcomes, and response expectations.
- [x] **PROD-04**: A privacy or business owner can identify the approved controller identity, privacy contact, processing purposes, recipients/processors, retention and deletion rules, rights process, incident process, and marketing-consent policy.
- [x] **PROD-05**: An operations owner can identify the approved destination, authentication method, department routing, durable-acceptance rule, retry/replay policy, retention rule, and escalation owner for every lead type.
- [x] **PROD-06**: A release fails before deployment when a production-critical environment value is missing, malformed, unsafe for the target environment, or inconsistent with the approved decision register.
- [x] **PROD-07**: Development, preview, and production deployments use isolated origins, secrets, lead destinations, analytics identifiers, and crawl policies so test activity cannot contaminate live operations.

### Lead Correctness and Delivery

- [ ] **LEAD-01**: A visitor can submit every full and compact sales, service, parts, fleet, financing, and campaign form using fields that match the server's required validation contract.
- [ ] **LEAD-02**: A visitor receives accessible, field-specific correction guidance when submitted data is missing, malformed, out of bounds, or tampered with.
- [ ] **LEAD-03**: The server derives trusted lead type, form variant, source page, and source CTA values from allow-listed application context rather than accepting arbitrary client values.
- [ ] **LEAD-04**: Each accepted submission receives a stable identifier that prevents duplicate durable acceptance and duplicate downstream delivery when the visitor or system retries.
- [ ] **LEAD-05**: A visitor sees success only after the approved lead system has durably and recoverably accepted the inquiry.
- [ ] **LEAD-06**: A visitor whose inquiry cannot be accepted within the bounded timeout receives an honest failure state with retry and verified phone/contact alternatives and no false confirmation.
- [ ] **LEAD-07**: The operations team can distinguish validation rejection, abuse rejection, temporary unavailability, durable acceptance, delivery progress, terminal failure, and successful downstream delivery without exposing lead PII in logs or alerts.
- [ ] **LEAD-08**: An authorized operator can reconcile accepted inquiries against departmental delivery, replay recoverable failures safely, and investigate dead-lettered submissions using the stable identifier.
- [ ] **LEAD-09**: Public forms apply layered abuse controls including honeypot, server-side validation, bounded inputs, rate controls, and an approved bot challenge without making client-side checks authoritative.
- [ ] **LEAD-10**: Lead attribution stores only approved UTM and click identifiers within explicit size and format limits and remains associated with the durable lead reference.

### Publishing, Privacy, Measurement, and Security

- [ ] **GOV-01**: A content editor can publish a business, product, promotion, delivery, guide, or campaign record only when its schema contains the required source, owner, approval, local-applicability, review, expiry, and release evidence for that content type.
- [ ] **GOV-02**: A build fails when a record marked publishable is expired, stale beyond policy, unsupported by required evidence, unreleased, or not approved for Hino Cebu applicability.
- [ ] **GOV-03**: Public pages, navigation, internal links, metadata, structured data, and the sitemap consume the same eligible-content selectors so withheld records cannot leak through a secondary surface.
- [ ] **GOV-04**: A visitor can read an approved privacy notice explaining the controller, data collected, purposes, recipients/processors, retention, rights, contact process, and optional marketing technologies before submitting personal data.
- [ ] **GOV-05**: A visitor can make, revisit, and withdraw granular optional analytics or advertising consent without blocking the essential processing needed to submit an inquiry.
- [ ] **GOV-06**: Analytics and advertising tags remain absent when identifiers or required consent are missing and load through one approved tag-control path when enabled.
- [ ] **GOV-07**: Conversion and engagement events contain allow-listed operational context but never names, phone numbers, email addresses, free-text messages, or other lead payload data.
- [ ] **GOV-08**: Security headers, including a tuned Content Security Policy, protect production pages while allowing only approved first- and third-party origins needed by the site's verified features.
- [x] **GOV-09**: Production images and fonts use authorized, optimized, responsive assets with useful alternative text, fixed dimensions, and no unapproved customer or trademark use.
- [x] **GOV-10**: Performance budgets and consent-aware third-party loading protect critical mobile journeys from excessive JavaScript, network cost, layout shift, and slow interaction.

### Behavioral Verification and Release Gate

- [ ] **QUAL-01**: Automated unit tests verify environment parsing, publication eligibility, promotion boundaries, site-origin behavior, attribution limits, and truck-recommendation rules with deterministic inputs.
- [ ] **QUAL-02**: Automated integration tests verify every lead type and form variant across successful acceptance, validation failure, bot rejection, timeout, transport failure, retry, idempotency, and replay-safe behavior.
- [ ] **QUAL-03**: Browser tests verify desktop and mobile navigation, every critical inquiry journey, the truck finder, campaign attribution, accessible errors/status, verified contact actions, and recovery paths.
- [ ] **QUAL-04**: Automated accessibility checks and documented keyboard, focus, screen-reader, contrast, reduced-motion, and touch-target review provide evidence against WCAG 2.2 AA practices.
- [ ] **QUAL-05**: Automated SEO tests verify canonical URLs, index/noindex rules, robots behavior, sitemap membership, redirects, Open Graph data, breadcrumbs, and structured-data identity against each deployment environment.
- [ ] **QUAL-06**: CI blocks promotion when linting, type checking, tests, production build, dependency/security checks, secret/configuration checks, accessibility checks, or agreed performance budgets fail.
- [ ] **QUAL-07**: A protected preview release demonstrates approved content, isolated integrations, critical browser journeys, and stakeholder sign-off before production promotion.
- [ ] **QUAL-08**: Release documentation identifies monitoring checks, synthetic-test handling, incident escalation, replay procedures, rollback steps, configuration restoration, and evidence required to approve launch.

### Production Launch and Operations

- [ ] **LAUN-01**: The approved commercial Vercel project uses the intended Node.js runtime, protected environment variables, deployment permissions, spend alerts, and production/preview separation.
- [ ] **LAUN-02**: The final HTTPS domain resolves correctly and drives canonical URLs, social URLs, sitemap URLs, structured-data URLs, redirects, and robots behavior without localhost or preview leakage.
- [ ] **LAUN-03**: Search Console ownership, submitted sitemap, crawl/indexing checks, and any existing-site redirect inventory are verified against the final domain.
- [ ] **LAUN-04**: The website's approved branch identity, hours, phone, directions destination, domain, and landing page agree with the verified Google Business Profile.
- [ ] **LAUN-05**: A synthetic non-PII inquiry proves durable acceptance, departmental delivery, reconciliation, alerts, and cleanup in the production integration without being mistaken for a customer lead.
- [ ] **LAUN-06**: Production consent and tag diagnostics prove that optional technologies remain off before consent, activate only as approved, preserve attribution, and emit PII-free events tied to the correct journey.
- [ ] **LAUN-07**: Named operators receive actionable uptime, application-error, lead-delivery, dead-letter, and configuration alerts and can execute the documented escalation and recovery procedures.
- [ ] **LAUN-08**: The launch team completes and records a rollback rehearsal, configuration audit, critical-journey smoke test, stakeholder acceptance, and operational handoff before acquisition spend is scaled.

### Evidence-Led Local Authority Growth

- [ ] **GROW-01**: A content owner can publish permissioned Cebu customer-delivery stories that link verified customer/application facts to the relevant truck, business use case, and inquiry path.
- [ ] **GROW-02**: A content owner can publish reviewed Cebu Truck Guide articles selected from Search Console demand, customer questions, and approved sales or aftersales expertise.
- [ ] **GROW-03**: A visitor using the truck finder receives one to three locally reviewed model-family recommendations whose reasons reflect every relevant answer and whose caveat requires final consultation.
- [ ] **GROW-04**: A visitor can access a small approved set of aftersales, parts, fleet, or application resources that reflects actual Hino Cebu processes and includes named ownership and review dates.
- [ ] **GROW-05**: The marketing and operations teams can reconcile source, campaign, landing page, model or service interest, durable lead identifier, and a minimal governed qualified-lead status without exposing PII to analytics.
- [ ] **GROW-06**: A named owner follows a recurring workflow to keep Google Business Profile and website hours, contacts, photos, landing targets, and branch updates consistent.
- [ ] **GROW-07**: The team uses qualified-lead outcomes, Search Console queries, journey events, call/directions intent, response capacity, and content approvals to select the next campaign or content slice before expanding spend or tooling.

## v2 Requirements

Deferred until the production system has trustworthy delivery, measurement, operating ownership, sufficient volume, and explicit business approval.

### Commercial Systems

- **COMM-01**: A visitor can view real-time branch inventory backed by an authoritative feed with freshness and outage behavior.
- **COMM-02**: A visitor can view approved prices, financing examples, or payment calculations backed by maintainable local inputs and required disclosures.
- **COMM-03**: A visitor can receive a confirmed service appointment through the branch's authoritative scheduling system.
- **COMM-04**: A visitor can upload parts or service media through approved malware-scanned storage with access, retention, and deletion controls.

### Growth Automation

- **AUTO-01**: The business can operate a full CRM workflow with governed stages, ownership, deduplication, offline conversion reporting, and approved automation.
- **AUTO-02**: The marketing team can run controlled experiments after baseline volume and qualified-outcome measurement support statistically useful decisions.
- **AUTO-03**: Non-technical editors can use a paid CMS when sustained multi-author publishing volume justifies its cost and governance overhead.
- **AUTO-04**: The business can operate broader retargeting or enhanced-conversion programs after consent, legal review, data quality, and measurable economics justify them.

## Out of Scope

Explicitly excluded from this milestone to protect truth, cost, performance, safety, and operational reliability.

| Feature | Reason |
|---------|--------|
| Fabricated, scraped, or unsourced inventory, pricing, reviews, testimonials, specifications, promotions, financing, warranties, or customer claims | Violates the project's trust and approval rules |
| Hino Philippines clone or copied national-site text | The product must be an original local commercial authority |
| Generic AI adviser or chatbot | Ungoverned answers can hallucinate specifications, availability, finance, pricing, or safety guidance |
| Online truck checkout or reservation | No authoritative inventory, pricing, payment, cancellation, or fulfillment system exists |
| Thin city or service-area doorway pages | Duplicated low-value pages conflict with the local-authority strategy and search quality guidance |
| Native mobile application or customer portal | No validated authenticated recurring job justifies the security and support scope |
| Heavy social feeds, autoplay video, carousels, or general animation framework | Adds tracking, JavaScript, instability, accessibility risk, and weak durable value |
| Paid database, search, chat, experimentation, asset storage, or analytics duplication at launch | Recurring cost is not justified before a measured need exists |
| Large technical maintenance library without a named qualified reviewer | Stale or generic vehicle advice creates safety and brand risk |

## Traceability

Every v1 requirement is assigned to exactly one roadmap phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PROD-01 | Phase 1 | Complete |
| PROD-02 | Phase 1 | Complete |
| PROD-03 | Phase 1 | Complete |
| PROD-04 | Phase 1 | Complete |
| PROD-05 | Phase 1 | Complete |
| PROD-06 | Phase 1 | Complete |
| PROD-07 | Phase 1 | Complete |
| LEAD-01 | Phase 2 | Pending |
| LEAD-02 | Phase 2 | Pending |
| LEAD-03 | Phase 2 | Pending |
| LEAD-04 | Phase 2 | Pending |
| LEAD-05 | Phase 2 | Pending |
| LEAD-06 | Phase 2 | Pending |
| LEAD-07 | Phase 2 | Pending |
| LEAD-08 | Phase 2 | Pending |
| LEAD-09 | Phase 2 | Pending |
| LEAD-10 | Phase 2 | Pending |
| GOV-01 | Phase 3 | Pending |
| GOV-02 | Phase 3 | Pending |
| GOV-03 | Phase 3 | Pending |
| GOV-04 | Phase 3 | Pending |
| GOV-05 | Phase 3 | Pending |
| GOV-06 | Phase 3 | Pending |
| GOV-07 | Phase 3 | Pending |
| GOV-08 | Phase 3 | Pending |
| GOV-09 | Phase 01.1 | Complete |
| GOV-10 | Phase 01.1 | Complete |
| QUAL-01 | Phase 4 | Pending |
| QUAL-02 | Phase 4 | Pending |
| QUAL-03 | Phase 4 | Pending |
| QUAL-04 | Phase 4 | Pending |
| QUAL-05 | Phase 4 | Pending |
| QUAL-06 | Phase 4 | Pending |
| QUAL-07 | Phase 4 | Pending |
| QUAL-08 | Phase 4 | Pending |
| LAUN-01 | Phase 5 | Pending |
| LAUN-02 | Phase 5 | Pending |
| LAUN-03 | Phase 5 | Pending |
| LAUN-04 | Phase 5 | Pending |
| LAUN-05 | Phase 5 | Pending |
| LAUN-06 | Phase 5 | Pending |
| LAUN-07 | Phase 5 | Pending |
| LAUN-08 | Phase 5 | Pending |
| GROW-01 | Phase 6 | Pending |
| GROW-02 | Phase 6 | Pending |
| GROW-03 | Phase 6 | Pending |
| GROW-04 | Phase 6 | Pending |
| GROW-05 | Phase 6 | Pending |
| GROW-06 | Phase 6 | Pending |
| GROW-07 | Phase 6 | Pending |

**Coverage:**

- v1 requirements: 50 total
- Mapped to phases: 50
- Unmapped: 0
- Duplicate mappings: 0

---
*Requirements defined: 2026-08-18*
*Last updated: 2026-08-18 after roadmap creation*
