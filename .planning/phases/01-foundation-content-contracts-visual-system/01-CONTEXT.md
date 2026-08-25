# Phase 1: Foundation, Content Contracts & Visual System - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the fresh Next.js foundation for Hino Cebu: reusable responsive public shell, authoritative configurable content boundaries, visual design system, environment safety, and baseline quality checks. This phase establishes the standards that later homepage, route, and lead-pipeline phases use; it does not build those later capabilities in full.

</domain>

<decisions>
## Implementation Decisions

### Visual Foundation
- **D-01:** Use the supplied Hino Cebu reference as the visual direction: white utility header, truck-dominant dark imagery, oversized condensed headings, intentional Hino red, integrated charcoal panels, structured product cards, and a dense practical footer.
- **D-02:** Apply the reference's commercial dealership hierarchy and polish, not a generic SaaS/template aesthetic.
- **D-03:** Promotions are explicitly excluded despite their appearance in the reference: no navigation item, homepage section, route, footer link, carousel, or promotion CTA.

### Approved Content & Placeholders
- **D-04:** Treat all factual details supplied by `HINO_CEBU_WEBSITE_SPEC.md` and the supplied visual reference as approved implementation content.
- **D-05:** Keep genuinely unspecified values configurable and unresolved; do not fabricate missing legal-entity, credential, or other absent details.

### Global Shell
- **D-06:** Closely follow the reference header: Hino Cebu identity, Trucks / Parts & Service / About / Contact navigation, and red Cebu phone action; omit Promotions.
- **D-07:** Use a dense dark dealership footer with identity, short credibility copy, quick links, truck series, contact details, and legal links.
- **D-08:** Keep a desktop phone action plus sticky mobile Call and Request a Quote actions.
- **D-09:** Use a full-screen or near-full-screen mobile navigation panel containing primary links and clear Call / Request a Quote actions.

### Content Structure
- **D-10:** Preserve one authoritative site configuration and keep components free of duplicated business facts.

### the agent's Discretion
- Choose the maintainable typed-module breakdown for vehicle, service, navigation, and claim data, while preserving the authoritative site-config requirement.
- Choose the claims-governance approach that is clean and auditable.
- Choose the simplest maintainable v1 content-update workflow.
- Choose exact typefaces, token values, and component-level styling details that realize the visual direction.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product and visual direction
- `HINO_CEBU_WEBSITE_SPEC.md` — authoritative requirements, architecture, constraints, visual reference, no-promotions rule, acceptance criteria, and launch blockers.

### Project planning
- `.planning/PROJECT.md` — product core value, approved scope boundaries, and constraints.
- `.planning/REQUIREMENTS.md` — Phase 1 requirements FND-01 through FND-04 and cross-phase boundaries.
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria.
- `.planning/research/SUMMARY.md` — recommended stack, architecture, and delivery risks.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No implementation files are present: this is a clean restart and Phase 1 must establish the reusable foundation.

### Established Patterns
- No active codebase patterns exist; follow the specification's required Next.js App Router, TypeScript, Vercel, configuration, and quality patterns.

### Integration Points
- Future public routes, provider adapters, and pages must attach to the Phase 1 application shell, content contracts, environment conventions, and design tokens.

</code_context>

<specifics>
## Specific Ideas

The supplied reference demonstrates the intended composition: a white Hino Cebu header; a full-bleed truck hero with dark overlay and large headline; a dark elevated quote card; structured range cards; dark credibility bands; local contact/location blocks; and a dense footer. Recreate this character and information hierarchy while removing every Promotions surface.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within the Phase 1 boundary.

</deferred>

---

*Phase: 01-Foundation, Content Contracts & Visual System*  
*Context gathered: 2026-08-26*
