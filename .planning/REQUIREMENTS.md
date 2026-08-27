# Requirements: Hino Cebu Website

**Defined:** 2026-08-26  
**Core Value:** Make it easy and credible for a Cebu business to identify the right Hino solution and start a local sales or service conversation.

## v1 Requirements

### Foundation

- [ ] **FND-01**: Visitors receive a responsive Next.js site with a reusable public layout, mobile menu, visible primary actions, and the correct Cebu phone link.
- [ ] **FND-02**: Maintainers can update site, branch, vehicle, service, navigation, and approved-claim data from authoritative typed configuration modules.
- [ ] **FND-03**: The application keeps secrets out of client bundles and provides an accurate `.env.example` plus safe behavior when optional provider credentials are unavailable.
- [ ] **FND-04**: The project enforces strict TypeScript where practical, linting, build checks, and focused unit tests for server utilities.

### Homepage & Conversion

- [x] **HOME-01**: Visitors see a truck-photography-dominant hero that identifies Hino Cebu and presents quote and truck-discovery actions without desktop scrolling.
- [x] **HOME-02**: Visitors can use an integrated quote form with all specified lead fields, consent, visible validation, loading, success, and safe server-error states.
- [x] **HOME-03**: Visitors can browse a configurable truck-range section and business-use selector from the homepage.
- [x] **HOME-04**: Visitors can understand Hino Cebu's local value, parts/service support, address, hours, call action, directions, and final quote CTA from the homepage.
- [x] **HOME-05**: The public journey contains no visible promotions navigation, route, carousel, homepage section, footer link, or promotion CTA.

### Discovery & Local Support

- [x] **DISC-01**: Visitors can view a truck listing with configurable cards and reach detail pages without fabricated technical claims.
- [x] **DISC-02**: Visitors can view representative 300 and 500 series pages with approved/configurable content and a clear inquiry action.
- [ ] **DISC-03**: Visitors can reach dedicated parts/service, contact, and about/local-dealer pages with clear next actions.
- [x] **DISC-04**: All primary public routes render correctly on mobile and desktop and maintain consistent navigation and footer information.

### Lead Operations

- [ ] **LEAD-01**: Visitors submitting a quote or inquiry have their input normalized, sanitized, and validated server-side against a shared schema.
- [ ] **LEAD-02**: Each accepted lead records a unique lead ID, source page, and UTM attribution when present.
- [ ] **LEAD-03**: Accepted leads append safely to the configured Google Sheets worksheet, including spreadsheet-formula escaping.
- [ ] **LEAD-04**: Accepted leads send an internal Resend notification and customer acknowledgement through server-only credentials.
- [ ] **LEAD-05**: The lead endpoint applies basic rate limiting and server-side Turnstile verification when configured.
- [ ] **LEAD-06**: Visitors reach a noindex thank-you state only after a successful submission; failed provider operations show the approved safe error message.

### Quality, SEO & Launch

- [ ] **QLT-01**: Major pages have unique metadata, semantic headings, accessible form labels, and no critical accessibility errors.
- [ ] **QLT-02**: The site exposes valid sitemap and robots output, uses verified LocalBusiness/AutoDealer structured data only, and prevents thank-you page indexing.
- [ ] **QLT-03**: Hero imagery is sized and optimized to avoid major layout shift and common breakpoints are visually checked at 390px, 768px, 1024px, and 1440px.
- [ ] **QLT-04**: README documents setup, environment variables, Google Sheets, Resend, Vercel deployment, asset replacement, and unresolved legal/launch inputs.
- [ ] **QLT-05**: A commercial launch checklist documents outstanding legal entity, brand authorization, asset, email, location, product availability, privacy, analytics, and sending-domain approvals.

## v2 Requirements

- **V2-01**: Maintainers can manage content through a dedicated CMS after the configuration workflow is proven insufficient.
- **V2-02**: Visitors can compare approved truck models or request financing with separately approved wording and data.
- **V2-03**: Authorized promotions can be reintroduced behind an explicit feature decision and content workflow.

## Out of Scope

| Feature | Reason |
|---|---|
| Visible promotions experience | Explicitly excluded by the specification for the current release |
| Fabricated commercial/product facts | Risks brand, legal, and sales accuracy |
| Custom operational back office | Not needed to validate local lead conversion |
| Native mobile application | Web-first local discovery and inquiry is the intended product |

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| FND-01–FND-04 | Phase 1 | Pending |
| HOME-01–HOME-05 | Phase 2 | Complete |
| DISC-01–DISC-04 | Phase 3 | Pending |
| LEAD-01–LEAD-06 | Phase 4 | Pending |
| QLT-01–QLT-05 | Phase 5 | Pending |

**Coverage:**

- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-08-26*  
*Last updated: 2026-08-26 after initial definition*
