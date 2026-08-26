# Phase 2: Conversion-Led Homepage - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the polished conversion-led Hino Cebu homepage: its truck-dominant hero, presentational quote flow, truck range, credibility, business-need selector, parts/service, location, and final CTA. It must match the approved dealership character, remain responsive, and contain no promotions. Secure lead delivery is deferred to Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Official Visual Assets
- **D-01:** Hino Cebu is authorized to use Hino Philippines assets. Download approved files into the project, optimize them locally, and never hotlink them.
- **D-02:** Lead the hero with an authorized 300 or 500 Series box truck in a commercial setting, shown from a three-quarter front angle.
- **D-03:** Use isolated authorized truck images on consistent light backgrounds for the four truck-range cards.
- **D-04:** Use an authorized Hino workshop/service image in the Parts & Service section.
- **D-05:** Keep official images as the live baseline. Record internal-only asset source and replacement metadata so each eligible visual can later be swapped for Cebu photography; never display that marker to visitors.

### Mobile Quote Journey
- **D-06:** On mobile, Request a Quote scrolls to the full inline quote form directly below the hero.
- **D-07:** Show the sticky Call / Quote bar only after visitors pass the hero.
- **D-08:** In this presentation phase, locally validate the form and show the final polished success state. Keep its demo status internal; Phase 4 will replace it with secure server-side lead routing.
- **D-09:** Use a single vertical mobile form with clear labels and generous tap spacing.

### Business-Need Interaction
- **D-10:** Make the complete business-need card clickable with a visible “Find my Hino” cue.
- **D-11:** Selecting a card pre-fills only the editable Business Use field and scrolls to the quote form. It must not suggest or auto-select a truck series.

### Reference Composition & Content Flow
- **D-12:** Closely follow the supplied desktop composition: white header, darkened full-bleed truck visual, left headline/CTAs, right charcoal quote card, and three-point trust strip.
- **D-13:** Keep the homepage flow: Trucks, Why Hino Cebu, Business Need, Parts & Service, Visit Hino Cebu, Final CTA, Footer. Do not introduce Promotions.
- **D-14:** Embed a Google Maps search using the supplied branch address; retain the directions URL as configurable for replacement with a verified listing.
- **D-15:** Finish with a near-black CTA panel and a focused red quote button.

### the agent's Discretion
- Choose the exact responsive breakpoints, semantic component boundaries, subtle motion, and asset optimization strategy within the approved visual direction.
- Choose the internal asset-manifest shape and the precise demo-success copy, provided it does not imply a lead was actually delivered.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product, visual, and asset direction
- `HINO_CEBU_WEBSITE_SPEC.md` — authoritative homepage sections, quote-field order, no-promotions rule, asset requirements, and acceptance criteria.

### Project planning
- `.planning/PROJECT.md` — product intent, constraints, and commercial boundaries.
- `.planning/REQUIREMENTS.md` — Phase 2 requirements HOME-01 through HOME-05.
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria.
- `.planning/phases/01-foundation-content-contracts-visual-system/01-CONTEXT.md` — locked global shell, visual-system, no-promotions, and configurable-content decisions.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Button.tsx` and `src/components/ui/Container.tsx` — shared button and layout primitives for homepage sections.
- `src/content/site.ts`, `src/content/trucks.ts`, and `src/content/services.ts` — typed authoritative source for branch facts, vehicle ranges, business uses, and service copy.
- `src/components/layout/{Header,Footer,MobileActionBar,MobileMenu}.tsx` — established responsive public shell to retain and extend.

### Established Patterns
- `src/app/globals.css` centralizes Hino-inspired tokens and responsive shell styling.
- The application uses App Router, TypeScript, and Server Components by default; only interactive form/scroll behavior should become client components.

### Integration Points
- Replace the placeholder `src/app/page.tsx` with composable homepage sections while retaining `#main-content` and the shared root layout.
- Quote controls should share the `#request-a-quote` destination with header and mobile actions.

</code_context>

<specifics>
## Specific Ideas

The supplied reference is the target visual character: a premium commercial vehicle homepage with a dominant truck, large condensed headline, integrated dark quote card, disciplined Hino red, structured vehicle cards, charcoal credibility band, practical Cebu visit block, and dense footer. The Phase 2 build must preserve this character while replacing every visible Promotions surface with the business-need selector.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 2 scope.

</deferred>

---

*Phase: 02-Conversion-Led Homepage*
*Context gathered: 2026-08-26*
