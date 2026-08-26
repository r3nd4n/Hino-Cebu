# Phase 2: Conversion-Led Homepage - Research

**Researched:** 2026-08-26  
**Domain:** Next.js App Router conversion homepage, local authorized image assets, and accessible client-side quote interaction  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within Phase 2 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|---|---|---|
| HOME-01 | Truck-photography-dominant hero with Hino Cebu and quote/discovery actions | Server-rendered composed hero using a locally stored Next `Image`, exact media sizing, dark overlay, and responsive two-column/stacked form layout. |
| HOME-02 | Integrated quote fields and visible validation, loading, success, safe error states | One client quote controller owns the single form state; deterministic local validation and a non-delivery confirmation state. |
| HOME-03 | Configurable truck range and business-use selector | Typed homepage content and asset manifest drive truck cards; whole-card business-use buttons update the form through a shared callback. |
| HOME-04 | Credibility, parts/service, visit, phone, directions, and final quote CTA | Semantic sections backed by the existing typed site/service configuration, local image records, phone link, configurable map search/link, and anchor CTAs. |
| HOME-05 | No visible promotions | Preserve the approved navigation/footer; add a source-level and rendered-surface audit for prohibited promotion wording/routes/components. |
</phase_requirements>

## Summary

Phase 2 should remain within the established Next.js 16 App Router project and use Server Components for static homepage sections. Only the quote form, business-use prefill, and after-hero mobile action visibility require client code. This keeps the hero and approved assets in the initial HTML while isolating browser state to small interactive islands. [VERIFIED: local `package.json`, `src/app/page.tsx`, and Phase 2 UI-SPEC]

Use local authorized Hino Philippines source files under `public/images/official/`, then reference them through `next/image` with intrinsic dimensions (or a fixed aspect-ratio parent plus `fill`) and accurate `sizes`. The current Git index names historic official image paths, but the working-tree public asset directory is empty; do not assume those deleted files have correct source, role, or replacement metadata. Download fresh authorized files from documented official URLs and record their source in an internal typed manifest. [VERIFIED: local `git ls-files`, filesystem audit, and Hino product pages]

**Primary recommendation:** Build the homepage as static, typed sections plus one `HomepageQuoteExperience` client controller that renders/moves the single form and receives business-use selections; do not add a form, map, carousel, state, or image library in this phase.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Local authorized truck/workshop assets | CDN / Static | Frontend Server | Static files are stored and served locally; the server-rendered page selects typed manifest records. |
| Hero, range, credibility, service, visit, and CTA composition | Frontend Server (SSR) | CDN / Static | The content is stable, configuration-driven marketing UI with no request-time service dependency. |
| Quote validation, loading, confirmation, and error presentation | Browser / Client | — | Phase 2 explicitly uses local presentation behavior; no lead is sent until Phase 4. |
| Business-use card prefill and quote scroll/focus | Browser / Client | — | This coordinates user interaction, DOM scrolling, focus, and `aria-live` feedback. |
| Post-hero mobile Call / Quote visibility | Browser / Client | — | It observes hero visibility in the viewport and conditionally renders an existing global action bar. |
| Map search and directions fallback | Frontend Server (SSR) | Browser / Client | The URL is derived from configured address/directions data; the browser displays the iframe/link. |

## Project Constraints (from AGENTS.md)

- Preserve conversion-first local Hino Cebu focus and exclude all visible promotions.
- Do not fabricate vehicle specifications, dealer legal/contact details, product availability, or brand authorization.
- Keep business and product facts configurable and mark unresolved launch inputs.
- Keep credentials server-only; validate, sanitize, rate-limit, and safely report lead submissions.
- Protect future Google Sheets writes from formula injection.
- Verify 390px, 768px, 1024px, and 1440px; run tests, lint, and build before implementation is declared complete.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---|---:|---|---|
| `next` | 16.3.3 | App Router page composition and local image optimization | Already installed; the official Next image guide documents `next/image` support for local/static images, responsive sizing, and layout-stability controls. [CITED: https://nextjs.org/docs/app/getting-started/images] |
| `react` / `react-dom` | 19.1.0 | Client interaction islands for quote behavior and mobile action visibility | Already installed and required by the current Next App Router project. [VERIFIED: local `package.json`] |
| `lucide-react` | 1.34.0 | Consistent outline icons for trust/value/visit controls | Already installed and already wrapped by `src/components/ui/Icon.tsx`. [VERIFIED: local `package.json` and source audit] |
| Browser `IntersectionObserver` | browser platform | Determine when the hero is no longer visible | The platform API asynchronously observes a target entering/exiting the viewport, avoiding scroll-handler polling. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API] |

### Supporting

| Library / feature | Version | Purpose | When to Use |
|---|---:|---|---|
| Native semantic HTML form controls | browser platform | Labels, native types/autocomplete, validation semantics | Quote fields, consent, accessible field errors, and local demo success state. |
| Native `scrollIntoView` + `focus` | browser platform | Quote anchor scrolling and business-use form handoff | After CTA/card activation, respecting `prefers-reduced-motion`. |
| Google Maps Embed/Search URL | external embed | Contextual map presentation from the supplied address | Until a verified `directionsUrl` exists; title the iframe and render a same-purpose fallback link. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| Native controlled form and a small pure validator | Form library plus schema package | Adds package/setup cost for one phase-local presentation form; shared server schema belongs in Phase 4, so no package is necessary now. |
| `IntersectionObserver` | Scroll event plus `getBoundingClientRect` | Higher-frequency main-thread work; the observer directly represents the after-hero state needed here. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API] |
| Local Hino files + `next/image` | Remote `hino.com.ph` image URLs | Violates D-01 and creates external availability/caching dependency. |

**Installation:** None. Use only the dependencies already committed to `package.json`.

## Package Legitimacy Audit

No package installation is recommended for this phase; the external-package legitimacy gate is not applicable.

## Asset Intake and Provenance

### Official source discovery

- Hino Motors Philippines' product index exposes Hino 200, 300, 500, Bus, and PUV categories. [CITED: https://www.hino.com.ph/products]
- Official page markup currently exposes isolated range images at `assets/images/Range/200%20(with%20background.jpg`, `assets/images/Range/300withbackground.jpg`, `assets/images/Range/500withbackground.jpg`, `assets/images/Range/BUS%20(with%20background)1.jpg`, and `assets/images/Range/PUV%20(with%20background).jpg`. These are candidate source URLs only; inspect dimensions/crop after download and select a Bus/PUV representation that fits a single equal card. [VERIFIED: live HTML audit of https://www.hino.com.ph/products]
- Official series pages expose `assets/images/PerProduct/300/Img/300SeriesFrontBanner.jpg` and `assets/images/PerProduct/500/Img/500SeriesFrontBanner.jpg` as candidate hero assets. They must be visually reviewed against the required three-quarter commercial-box-truck composition before selection. [VERIFIED: live HTML audits of https://hino.com.ph/300-series and https://www.hino.com.ph/500-series]
- The official Parts page exposes `assets/images/Parts-Service/Parts/PartsBanner.png`, a candidate Parts & Service asset. Prefer an actual workshop/service image if the official quality-service page yields one with an appropriate operational scene. [VERIFIED: live HTML audit of https://www.hino.com.ph/Parts.aspx]

### Required manifest

Create `src/content/assets.ts` (or an equivalently named typed content module) and make all homepage image selection flow through it. Each record must include the UI-SPEC-required fields plus intrinsic dimensions after download:

```ts
export type OfficialAsset = {
  id: string;
  src: `/${string}`;
  alt: string;
  width: number;
  height: number;
  sourceUrl: string;
  sourceSite: "Hino Philippines";
  authorizedUse: true;
  assetRole:
    | "hero-commercial-truck"
    | "truck-range-200"
    | "truck-range-300"
    | "truck-range-500"
    | "truck-range-bus-puv"
    | "parts-service-workshop";
  replaceWithCebuPhoto: true;
  replacementNote?: string;
};
```

Place originals/optimized files beneath `public/images/official/` with stable, purpose-based names. Do not expose `sourceUrl`, authorization, or replacement fields in component copy, captions, `alt`, JSON-LD, data attributes, or routes. Record only actual downloaded dimensions; no invented model/spec text. Use the asset source URL from the page/HTML that supplied the file, not an inferred generic page URL. [VERIFIED: Phase 2 CONTEXT D-01–D-05 and UI-SPEC]

### Image rendering pattern

```tsx
import Image from "next/image";

<div className="homepage-hero__media" aria-hidden="true">
  <Image
    alt=""
    fill
    priority
    sizes="100vw"
    src={officialAssets.hero.src}
    style={{ objectFit: "cover" }}
  />
</div>
```

Use a purposefully non-decorative `alt` if the rendered vehicle image is the only product communication in its context; card images should receive concise range-identifying alt text that does not invent a specific model. The image container needs a fixed responsive aspect ratio/minimum height before paint, and card media needs a stable fixed ratio with `object-fit: contain`. This implements Next's documented responsive local-image approach and prevents layout shift. [CITED: https://nextjs.org/docs/app/getting-started/images]

## Architecture Patterns

### System Architecture Diagram

```text
Typed content modules + official asset manifest
                  |
                  v
Server-rendered HomePage
  -> Hero + quote experience boundary
  -> Trucks -> credibility -> business needs
  -> Parts/Service -> Visit/Map -> final CTA
                  |
                  +------------------------------+
                                                 v
                                  Client quote controller
                       (local validation / scroll / focus / aria-live)
                                                 |
                              +------------------+-----------------+
                              v                                    v
                    local confirmation state             safe UI failure state
                    (no delivery claim)                  (no raw error)

Hero sentinel -> IntersectionObserver -> mobile action-bar visibility
Configured address/directions -> encoded map-search URL -> titled iframe + fallback link
```

### Recommended Project Structure

```text
public/images/official/                # authorized downloaded, locally served images
src/content/assets.ts                  # internal-only official asset/replacement manifest
src/content/homepage.ts                # typed homepage copy, value points, business needs
src/components/homepage/
  HomepageHero.tsx                     # server-composed hero frame and quote boundary
  QuoteExperience.tsx                  # "use client" single form, state, prefill contract
  TruckRangeSection.tsx                # server-rendered asset/content cards
  BusinessNeedSection.tsx              # client button handoff or receives callback
  CredibilitySection.tsx
  PartsServiceSection.tsx
  VisitSection.tsx
  FinalQuoteCta.tsx
  PostHeroMobileActions.tsx            # "use client" observer wrapper for existing action bar
src/lib/quote-demo.ts                  # pure local validation/result types; no fake network call
tests/homepage.test.mjs                # source/content and no-promotion regression checks
tests/quote-demo.test.mjs              # pure validation/state contract checks
```

Exact file names may vary, but component boundaries must preserve this separation: static sections remain Server Components; a single client parent owns the quote state and passes a narrow `setBusinessUse` capability to business-need controls. Do not make `page.tsx` one giant client component.

### Pattern 1: one responsive quote form, never two independent forms

Render the same form/state once. CSS places it in the desktop hero's right panel and naturally continues it below the mobile hero copy. Give the destination section `id="request-a-quote"`, `scroll-margin-block-start` for the sticky header, and extra lower padding for the post-hero action bar. This prevents divergent desktop/mobile field values and validation behavior. [VERIFIED: Phase 2 UI-SPEC]

### Pattern 2: controlled business-use prefill with focus handoff

The form client component keeps `businessUse` as state. Each whole-card `<button type="button">` calls a single handler: update only that state, call `scrollIntoView({ behavior })`, then focus the labelled Business Use `<select>` after the scroll; announce the completed update in a polite live region. This supports mouse, Enter, and Space without nested interactive controls. `aria-live="polite"` is the appropriate status-announcement mechanism for dynamically updated text. [CITED: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live]

```tsx
function chooseBusinessUse(value: BusinessUse) {
  setBusinessUse(value);
  requestQuoteRef.current?.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
  window.setTimeout(() => businessUseSelectRef.current?.focus(), 0);
  setLiveMessage(`Business use set to ${value}.`);
}
```

### Pattern 3: observer-gated mobile actions

Place a small sentinel at the hero's lower boundary. A client wrapper observes it with `IntersectionObserver` and renders/enables the existing `MobileActionBar` only when the sentinel is no longer intersecting. Disconnect the observer on unmount and respect reduced-motion for scrolling, not visibility. This represents the requested post-hero condition without continuous scroll measurement. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API]

### Pattern 4: presentational, truthful quote form state machine

Use an explicit discriminated state: `idle | invalid | loading | success | server-error`. Submit runs local field validation, sets `loading` briefly only for the presentational completion transition, then shows the approved confirmation that does **not** say that a lead was delivered. Do not call a mock endpoint, store user data, log PII, or emit analytics in Phase 2. A `submissionMode: "demo"`/`leadSubmissionEnabled: false` configuration flag may exist internally and must never render. Phase 4 owns schema sharing, sanitization, rate limiting, provider calls, formula escaping, and real server error handling. [VERIFIED: Phase 2 CONTEXT D-08, UI-SPEC, and PROJECT.md]

### Anti-Patterns to Avoid

- **Two forms hidden by breakpoints:** independent values, errors, and success state make business-use prefill unreliable. Use one stateful form.
- **Hero as a CSS background image without reserved geometry:** weak responsive image selection and layout-shift control. Use local `next/image` media with explicit geometry.
- **Remote or hotlinked official assets:** violates authorization workflow and leaves a third-party availability dependency.
- **Clickable card containing a link/button:** creates nested interactive controls. Make the card itself one semantic button.
- **Claiming a quote was sent in demo mode:** inaccurate prior to Phase 4. Use only the approved interest/call confirmation.
- **Always-visible mobile bar:** duplicates first-screen CTAs and can cover form controls. Gate it after the hero and add bottom clearance.
- **Unencoded address string in iframe URL:** use `encodeURIComponent(siteConfig.contact.address)` and offer an accessible link.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Responsive image resizing/serving | Custom image endpoint or CSS-only asset selection | `next/image` with local files, `sizes`, and reserved geometry | Next's built-in Image component provides the framework integration required by this app. [CITED: https://nextjs.org/docs/app/getting-started/images] |
| Visibility-based sticky bar | Scroll-position loop | `IntersectionObserver` | Browser manages observation asynchronously and avoids per-scroll manual measurements. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API] |
| Form control semantics | Div-based faux inputs/selects | Native `<input>`, `<select>`, `<label>`, `<fieldset>` | Native focus, keyboard, autocomplete, and accessibility behavior already fits the required form. |
| Mapping service | Custom map drawing or coordinates | Configured Google Maps search iframe plus normal link | Branch URL/coordinates are unresolved; address search is the authorized interim approach. |
| Lead delivery simulation | Fake API/provider calls | Local state transition only | Avoids implying real lead handling and keeps provider work correctly deferred to Phase 4. |

## Common Pitfalls

### Pitfall 1: asset provenance is captured incompletely
**What goes wrong:** a local file has an opaque name and no source/replacement record, making future Cebu photography replacement risky.  
**Avoid:** inspect and download each selected official image deliberately, capture the exact source URL, final dimensions, role, local path, and `replaceWithCebuPhoto: true` in the typed manifest before it appears in a component.  
**Warning signs:** a component contains a raw `"/images/..."` string, manifest `sourceUrl` is a generic page rather than an image source, or source fields appear in public markup.

### Pitfall 2: required desktop composition fails the first viewport
**What goes wrong:** quote panel, headline, and trust strip exceed the viewport or the truck reads as a small decoration.  
**Avoid:** test at 1024px and 1440px early with a 100vh-ish hero composition, 360–440px form width, image overlay, and a reserved trust strip. Avoid fixed text/media heights that break zoom or long copy.  
**Warning signs:** desktop requires scroll before the quote CTA, form overlaps controls, or the truck is visibly secondary to blank space.

### Pitfall 3: mobile persistent actions obscure the single form
**What goes wrong:** the bottom bar overlaps consent/submit or focus scroll lands behind the sticky header.  
**Avoid:** observer-gate after the hero, use safe-area-aware bottom padding, `scroll-margin-block-start`, and run 390px keyboard/touch checks.  
**Warning signs:** submit cannot be reached without zoom, focused input is hidden, or first-screen actions are duplicated.

### Pitfall 4: local success copy overstates lead delivery
**What goes wrong:** presentation form says it has sent/received/submitted an inquiry when no secure endpoint exists.  
**Avoid:** implement the exact approved confirmation and internal-only demo flag; reserve provider success for Phase 4.  
**Warning signs:** words such as “sent”, “received”, “we'll get back”, or provider names appear in Phase 2 success copy.

### Pitfall 5: map route uses unverified listing data
**What goes wrong:** implementation publishes fabricated coordinates or a branch listing URL.  
**Avoid:** derive a Google Maps search from the configured address and prefer `directionsUrl` only when its typed value is resolved. Keep the actual map/search target configurable.  
**Warning signs:** hard-coded place IDs/coordinates, or an unresolved directions URL is rendered.

### Pitfall 6: promotions leak back through reused source or copy
**What goes wrong:** a nav/footer item, component name, carousel, CTA, or route reintroduces an excluded promotion surface.  
**Avoid:** source-audit homepage, navigation, footer, routes, and tests for promotion strings; business need is the approved replacement section.  
**Warning signs:** “Promotions”, “Latest Offers”, promotion carousel, or a `/promotions` route appears in tracked Phase 2 source.

## Code Examples

### Accessible local quote validation boundary

```tsx
const [submissionState, setSubmissionState] = useState<
  "idle" | "invalid" | "loading" | "success" | "server-error"
>("idle");

function onSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const errors = validateQuoteDraft(draft);
  if (Object.keys(errors).length > 0) {
    setSubmissionState("invalid");
    setErrors(errors);
    return;
  }

  setSubmissionState("loading");
  window.setTimeout(() => setSubmissionState("success"), 180);
}
```

Every field must use a visible `<label htmlFor>`, `aria-invalid={Boolean(error)}`, and an error element referenced by `aria-describedby`; a separate polite live region announces loading/status changes. This follows the UI-SPEC form contract and the semantics documented by MDN's `aria-live` reference. [CITED: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live]

### Configurable map fallback

```ts
export function getDirectionsHref(address: string, verifiedUrl: string | null) {
  return verifiedUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
```

Render a titled iframe using that same configured search value and a visible text link with the same target. The iframe's `title` provides an accessible name. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe]

## State of the Art

| Old Approach | Current Approach | Impact |
|---|---|---|
| `<img>` or CSS background for responsive hero imagery | Local `next/image` with `sizes`, `priority` for the LCP hero, and reserved dimensions | Better framework-level responsive image handling and less layout shift. [CITED: https://nextjs.org/docs/app/getting-started/images] |
| Scroll listeners for visibility state | `IntersectionObserver` | The platform asynchronously reports threshold/visibility changes rather than requiring continuous manual measurement. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API] |
| Duplicate mobile/desktop forms | One stateful form rearranged by responsive CSS | Consistent field values, focus, validation, and business-use handoff. [VERIFIED: Phase 2 UI-SPEC] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | A candidate official 300/500 front-banner asset will satisfy the requested three-quarter commercial box-truck composition. It must be visually approved after download. | Asset Intake | Hero may need a different authorized official image. |
| A2 | A current official quality-service/workshop image can be located if `PartsBanner.png` is not a suitable service-scene image. | Asset Intake | Parts & Service must retain a clearly labelled temporary local asset slot until a suitable approved official file is chosen. |
| A3 | The address-only Google Maps search resolves to the intended branch; exact listing/coordinates remain unresolved. | Map pattern | Visitors may see a non-specific result; replace when verified URL is supplied. |

## Open Questions

1. **Which exact official image is the approved hero after visual review?**
   - What we know: official 300/500 series pages expose front-banner candidates; user authorized national assets.
   - What's unclear: whether either meets the composition and crop at 1024px/1440px.
   - Recommendation: inspect candidate downloads, then set only the selected file in `officialAssets.hero`.

2. **Which exact official workshop/service asset is suitable?**
   - What we know: official Parts page exposes a parts banner; the brief calls for workshop/service visual.
   - What's unclear: whether the Parts banner itself communicates service work.
   - Recommendation: inspect the official Quality Service page before finalizing; do not invent a “workshop” title for an unrelated image.

3. **Is the address search result the verified Hino Cebu listing?**
   - What we know: provided address is in `siteConfig`; `directionsUrl` remains unresolved.
   - What's unclear: official Google Business URL/place ID.
   - Recommendation: ship a configurable address search and replace it with the verified URL when supplied.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---:|---|---|
| Node.js | Next build/test | Yes | v24.14.0 | — |
| npm | Script execution | Yes | 8.17.0 | — |
| Next.js CLI | App build | Yes | 16.3.3 | `npm run build` |
| Hino Philippines public pages | Authorized asset source review/download | Yes | HTTP pages reached during research | Do not hotlink; retain a clearly marked local asset slot only if a selected asset cannot be downloaded. |
| Google Maps browser embed/search | Visit section | External, browser-hosted | — | Visible configured Directions link using the same search URL. |

**Missing dependencies with no fallback:** None.  
**Missing dependencies with fallback:** None. No new CLI or package is required.

## Validation Architecture

### Test Framework

| Property | Value |
|---|---|
| Framework | Node built-in `node:test` |
| Config file | none; glob is defined in `package.json` |
| Quick run command | `node --test tests/homepage.test.mjs tests/quote-demo.test.mjs` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| HOME-01 | Local hero asset/heading/CTAs and stable image contract are wired from content | Source/config unit regression + manual visual | `node --test tests/homepage.test.mjs` | No — Wave 0 |
| HOME-02 | Field contract, required errors, form state, and truthful success/error copy | Pure validation unit + source regression; manual browser interaction | `node --test tests/quote-demo.test.mjs tests/homepage.test.mjs` | No — Wave 0 |
| HOME-03 | Four configured ranges; business choice changes only Business Use | Source/content unit + manual browser interaction | `node --test tests/homepage.test.mjs tests/quote-demo.test.mjs` | No — Wave 0 |
| HOME-04 | Configured contact/hours/map/directions and homepage section order | Source/config unit regression + manual visual | `node --test tests/homepage.test.mjs` | No — Wave 0 |
| HOME-05 | No promotion surface in nav, footer, homepage, or Phase 2 components | Source-scan regression | `node --test tests/homepage.test.mjs` | No — Wave 0 |

### Sampling Rate

- **Per task commit:** targeted `node --test` command for files changed.
- **Per wave merge:** `npm test` and `npm run lint`.
- **Phase gate:** `npm test`, `npm run lint`, and `npm run build` green; manual browser validation at 390px, 768px, 1024px, and 1440px before `$gsd-verify-work`.

### Wave 0 Gaps

- [ ] `tests/homepage.test.mjs` — content/asset-manifest/section-order/no-promotion regression coverage for HOME-01, HOME-03, HOME-04, HOME-05.
- [ ] `tests/quote-demo.test.mjs` — pure quote local-validation/result-state coverage for HOME-02 and business-use restriction from HOME-03.
- [ ] No new test framework installation; use the project’s existing Node test runner.

Manual required checks: one H1/landmarks/labels/focus/keyboard operation; successful and invalid quote form states; business card scroll/focus/live feedback; mobile actions absent during hero and present afterward; layout/photo crop and non-obscured submit at 390/768/1024/1440px.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---|---|---|
| V2 Authentication | No | No authenticated feature in Phase 2. |
| V3 Session Management | No | No session/state persistence in Phase 2. |
| V4 Access Control | No | Public presentational homepage only. |
| V5 Input Validation | Yes | Local UI validation must be clear and non-authoritative; Phase 4 adds shared server-side validation/sanitization. |
| V6 Cryptography | No | No secret or provider integration in Phase 2. |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---|---|---|
| Client-only validation bypass | Tampering | Do not treat Phase 2 as delivery; Phase 4 validates/sanitizes on the server. |
| Raw provider/system error disclosure | Information disclosure | Show only the approved safe error text; do not make any provider call in Phase 2. |
| Accidental PII persistence | Information disclosure | Keep the form in React memory for a presentation-only transition; no local storage, analytics, logs, or mock API. |
| Unsafe map URL construction | Tampering | Use configured address and `encodeURIComponent`; only render a resolved verified directions URL. |

## Sources

### Primary (HIGH confidence)
- [Next.js Image guide](https://nextjs.org/docs/app/getting-started/images) — local image handling, sizing, priority, and responsive rendering.
- [Hino Philippines Products](https://www.hino.com.ph/products) — official vehicle range categories and source-page asset discovery.
- [Hino 300 Series](https://hino.com.ph/300-series) and [Hino 500 Series](https://www.hino.com.ph/500-series) — official series-page hero asset candidates.
- [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) — observer semantics and supported browser platform approach.
- [MDN aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live) — dynamic status announcement semantics.
- [MDN iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe) — iframe title/accessibility context.
- Local Phase 2 CONTEXT, UI-SPEC, AGENTS.md, source, tests, and package manifest — locked scope, existing architecture, dependencies, and test baseline.

### Secondary (MEDIUM confidence)
- None.

### Tertiary (LOW confidence)
- None. Candidate asset suitability is recorded as an assumption rather than a factual claim.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; based on installed project stack and official documentation.
- Architecture: HIGH — derived from locked Phase 2 decisions and existing App Router/component boundaries.
- Pitfalls: HIGH — directly tied to the required responsive, no-promotions, local-asset, and demo-form constraints.

**Research date:** 2026-08-26  
**Valid until:** 2026-09-25 (re-check live official asset URLs before implementation download)
