# Phase 3: Truck Discovery & Local Support Routes - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Extend the existing conversion system across a configurable truck listing, representative 300 and 500 Series detail pages, and dedicated Parts & Service, Contact, and About routes. These routes must provide practical local inquiry paths without fabricating specifications, availability, dealer facts, legal identity, or brand authorization. Production lead routing remains Phase 4 scope.

</domain>

<decisions>
## Implementation Decisions

### Truck Listing Structure
- **D-01:** Build `/trucks` around image-led, application-guided cards for the four configured ranges.
- **D-02:** Application guidance must stay broad and non-prescriptive; it must not imply an automatic recommendation or confirmed suitability.
- **D-03:** Keep the guidance static and pair the listing with a page-level inquiry CTA. Do not add filtering or automatic truck matching.
- **D-04:** The 200 Series and Bus & PUV entries must not become dead ends. The planner may choose lightweight availability pages or another clear in-scope destination.

### 300 and 500 Series Detail Pages
- **D-05:** Organize both representative detail pages around business applications first.
- **D-06:** Ground product content in the official Hino Motors Philippines 300 and 500 Series pages. Use only curated, verified highlights rather than copying complete specification tables.
- **D-07:** Store official source URLs and relevant provenance as internal typed content metadata. Do not show visitor-facing links to the mother site.
- **D-08:** Use one reusable detail-page structure while giving each series distinct applications, imagery, sourced highlights, and copy.
- **D-09:** Official national product information does not establish Cebu availability. Retain explicit availability safeguards and a local inquiry path.

### Inquiry Journey
- **D-10:** Route truck, parts, service, and general inquiry CTAs to one shared inquiry section on `/contact`.
- **D-11:** Carry the originating truck series or support topic into the form so it remains available for Phase 4 attribution.
- **D-12:** During Phase 3, reuse the established local validation and polished demo-success contract. Document the boundary clearly so Phase 4 can replace it with production delivery.
- **D-13:** Keep both the inquiry form and verified click-to-call path available across truck and support routes.

### Local Support Pages
- **D-14:** Give the routes distinct practical roles: `/parts-service` explains support paths, `/contact` owns location and inquiry actions, and `/about` provides concise local credibility.
- **D-15:** Lead `/parts-service` with separate Parts and Service paths. Treat fleet support and maintenance guidance as supporting topics.
- **D-16:** Lead `/about` with local customer commitment, add a short internally sourced Hino Motors Philippines background, and close with practical Cebu support/location details.
- **D-17:** Never turn national corporate statements into unsupported Cebu-dealer history, authorization, legal-entity, availability, or service claims.
- **D-18:** On `/contact`, show the verified phone, address, hours, inquiry form, and the established address-based map. Do not fabricate missing email or directions values or create inactive links.
- **D-19:** Explicitly mark the unresolved email and verified-directions inputs as awaiting confirmation.

### the agent's Discretion
- Decide the exact placement and repetition of suitability and availability notices, with claim safety as the controlling constraint.
- Choose the clearest non-dead-end treatment for 200 Series and Bus & PUV within Phase 3 scope.
- Choose how much model-level information appears on the 300 and 500 pages, subject to source provenance and Cebu availability safeguards.
- Choose whether carried inquiry context is visibly editable, fixed, or presented through another clear accessible treatment; it must remain available for attribution.
- Tune inquiry-versus-call hierarchy by page while preserving both paths.
- Choose exact responsive compositions and component boundaries within the established visual system.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product, scope, and prior decisions
- `HINO_CEBU_WEBSITE_SPEC.md` — authoritative product requirements, content constraints, route expectations, and no-promotions rule.
- `.planning/PROJECT.md` — conversion-first product intent, verified-only commercial boundaries, and configurable-facts requirement.
- `.planning/REQUIREMENTS.md` — Phase 3 requirements DISC-01 through DISC-04.
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria.
- `.planning/phases/01-foundation-content-contracts-visual-system/01-CONTEXT.md` — locked global shell, configurable content, and visual-system decisions.
- `.planning/phases/02-conversion-led-homepage/02-CONTEXT.md` — locked asset, CTA, mobile, map, and homepage interaction decisions that carry into public routes.

### Official internal content sources
- `https://hino.com.ph/300-series` — official Hino Motors Philippines source for curated 300 Series positioning and product highlights; retain internally as source metadata, not a visitor-facing link.
- `https://www.hino.com.ph/500-series` — official Hino Motors Philippines source for curated 500 Series positioning and product highlights; retain internally as source metadata, not a visitor-facing link.
- `https://www.hino.com.ph/corporate-information` — official source for the brief national-company background used on About; do not extrapolate its claims to Hino Cebu.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/content/trucks.ts` — typed four-range catalog, route slugs, approved descriptions, source URLs, and verification state to extend with internal provenance and page content.
- `src/content/services.ts` — existing Parts, Service, fleet-support, and maintenance-guidance offerings for `/parts-service`.
- `src/content/site.ts` — authoritative verified and unresolved branch facts for Contact and About.
- `src/content/navigation.ts` — existing public-route destinations and truck child links.
- `src/components/homepage/TruckRangeSection.tsx` — established image-led truck-card treatment that the listing can extend.
- `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx` — shared public shell for all new routes.

### Established Patterns
- Business and product facts live in typed content modules rather than page components.
- The application uses Next.js App Router, TypeScript, local optimized assets, Server Components by default, and narrowly scoped client interactions.
- Existing homepage cards, buttons, typography, spacing, and responsive tokens define the route-level visual language.
- The Phase 2 quote experience already defines local validation and demo-success behavior to reuse until Phase 4.

### Integration Points
- Add the `/trucks` listing and series routes behind the hrefs already present in `src/content/trucks.ts` and navigation.
- Add `/parts-service`, `/contact`, and `/about` behind existing global navigation links.
- Connect page CTAs to the shared `/contact` inquiry section with source context that Phase 4 can consume.
- Preserve the existing layout, mobile menu, footer, sticky mobile actions, `#main-content`, and verified click-to-call configuration.

</code_context>

<specifics>
## Specific Ideas

- The truck listing should help Cebu businesses orient themselves by application without behaving like a recommendation engine.
- The 300 and 500 pages should feel consistent as a family but clearly different in their series-specific stories.
- The public site should contain curated locally maintained information sourced from the Hino Philippines mother site, without sending visitors away through mother-site links.
- About should combine local commitment, a brief official national-company background, and a concise practical local profile.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 3 scope. Secure delivery, provider integrations, and final submission attribution remain in their planned Phase 4 boundary.

</deferred>

---

*Phase: 03-Truck Discovery & Local Support Routes*
*Context gathered: 2026-08-26*
