---
phase: 3
slug: truck-discovery-local-support-routes
status: draft
shadcn_initialized: false
preset: none
created: 2026-08-26
---

# Phase 3 — UI Design Contract

> Binding visual and interaction contract for Hino Cebu truck discovery and local-support routes. It extends the approved Phase 1 system and the stakeholder-approved Phase 2 homepage without adding a parallel design language.

---

## Design Intent

Extend the conversion-first homepage into a practical local-dealer journey. Every route must feel like the same Hino Cebu site: white utility chrome, strong condensed hierarchy, truck-led imagery, near-black credibility surfaces, restrained Hino red, and an obvious path to a local inquiry or verified phone call.

The visual story is **orient → understand → verify → inquire**. Application cues help Cebu businesses begin a conversation but never behave like a fitment tool, recommendation engine, or local-inventory claim. Product pages use curated, locally maintained information sourced internally from official Hino Motors Philippines pages; visitor-facing source or mother-site links are prohibited. Promotions remain excluded from navigation, cards, routes, sections, footer links, and CTAs.

## Design System

| Property | Value |
|---|---|
| Tool | Existing CSS custom properties and component-local styles; no component registry |
| Preset | Not applicable |
| Component library | None; use accessible semantic React/Next primitives and the existing `Button`, `Container`, and `Icon` components |
| Icon library | Lucide React with the established outline treatment |
| Display font | `Barlow Condensed` with `Arial Narrow`, sans-serif fallback |
| UI/body font | `Inter` with `Arial`, sans-serif fallback |

Retain the tokens in `src/app/globals.css`. Do not add Tailwind, shadcn, a second icon library, page-specific brand colors, pill-shaped controls, or a second card system. New route styles must compose the existing `.container`, `.eyebrow`, `.button`, `.card`, and dark-panel patterns.

## Spacing Scale

| Token | Value | Usage |
|---|---:|---|
| xs | 4px | Icon offsets, focus details, compact field feedback |
| sm | 8px | Inline metadata, icon/text gaps, compact list rhythm |
| md | 16px | Control gaps, card-grid gaps, default content separation |
| lg | 24px | Card padding and compact section gaps |
| xl | 32px | Mobile section padding, tablet grids, major component gaps |
| 2xl | 48px | Tablet/desktop section rhythm |
| 3xl | 64px | Standard desktop route-section spacing |

Exceptions: all interactive controls and clickable cards have a minimum 44px target; primary controls remain 48–54px high. Fluid hero/section padding may use `clamp()` bounded by scale values. Image aspect ratios, the existing 4px control radius, and 8px card radius are geometry rather than spacing tokens.

## Layout & Responsive Contract

### Shared route frame

- Preserve the existing skip link, `header`, navigation, single `main#main-content`, footer, mobile-menu behavior, and verified click-to-call configuration on every route.
- Use the implemented container and gutters: 20px at phone, 32px from 768px, and 48px from 1024px. Long text columns stop at 36–44rem even when the site container is wider.
- Subpage heroes are compact editorial bands, not homepage duplicates. Use a near-black or charcoal text surface with a red eyebrow and one H1; pair it with a light contained product image only where a truck is the subject.
- Alternate white and `#F4F4F2` section surfaces. Reserve dark full-width bands for route introductions, credibility, or the final conversion panel—not every section.
- Keep the standard section rhythm at 48px on mobile/tablet and 64px on desktop. Card grids use 16px gaps on phone and 16–24px at wider viewports.
- Use only restrained 150–200ms opacity, border, shadow, and up-to-3px transform transitions. Honor `prefers-reduced-motion`; content comprehension and form feedback must never depend on animation.

| Viewport | Required composition |
|---|---|
| **390px** | Compact 64px header; one-column heroes, card grids, application lists, support content, contact details, map, and form. Full-width CTAs stack. Product media appears before detail copy. The fixed Call / Inquire bar leaves bottom clearance and cannot cover form controls or anchor targets. |
| **768px** | Two-column truck-card grid; two-column application/highlight/support grids where both columns remain at least 280px. Contact stays a single deliberate reading sequence if a two-column form would compress labels or errors. Footer and shared navigation follow the existing tablet contract. |
| **1024px** | Listing may use four equal cards. Series hero/detail sections become balanced two-column compositions; Contact uses a 55/45 form-and-local-information split; Parts and Service appear as two equal primary paths. |
| **1440px** | Preserve generous negative space within the existing container. Keep readable text measures; do not stretch cards or copy across the full viewport. Series media may occupy 45–50% of the hero/detail width; form column remains 560–640px rather than expanding indefinitely. |

Manual visual verification is required for `/trucks`, all four series routes, `/parts-service`, `/contact`, and `/about` at all four widths. Check horizontal overflow, image cropping/CLS, heading wraps, equal card rhythm, focus visibility, sticky-bar clearance, map sizing, menu focus return, form feedback, and absence of Promotions.

## Typography

| Role | Size | Weight | Line Height | Contract |
|---|---:|---:|---:|---|
| Body | 16px | 400 | 1.5 | Explanations, application guidance, form help, local facts |
| Label/navigation | 14px | 700 | 1.2 | Controls, CTAs, compact metadata, and the inherited `.eyebrow` section marker; uppercase only for short labels |
| Section heading | `clamp(32px, 4vw, 48px)` | 700 | 0.98 | Condensed uppercase section hierarchy |
| Route display | `clamp(48px, 6vw, 72px)` | 700 | 0.92 | One H1 per route; shorter than the homepage display |

Use exactly weights 400 and 700. Consolidate the inherited `.eyebrow` section marker into the 14px label/navigation tier; do not create additional semantic type tiers. Headings remain condensed and uppercase; body, notices, errors, and status copy remain normal case. Never render whole paragraphs or technical highlights in red.

## Color

| Role | Value | Usage |
|---|---|---|
| Dominant (60%) | `#FFFFFF` / `#F4F4F2` | Reading surfaces, product media boxes, cards, form controls, alternate sections |
| Secondary (30%) | `#151719` / `#24272A` | Compact route heroes, credibility/support bands, conversion panel, footer |
| Accent (10%) | `#E31B23` | Primary inquiry buttons, verified call action, short eyebrow/rule markers, active/focus indicators, small directional cues |
| Accent hover | `#B9151C` | Hover/pressed state for red controls only |
| Destructive | `#B42318` | Invalid borders/icons and error copy only |
| Success | `#16794B` | Local form confirmation icon/status only |
| Border | `#D9DCDD` | Cards, fields, separators, map frame |
| Ink | `#111111` / `#5E6368` | Primary and supporting copy on light surfaces |

Accent is reserved for **Request Information / Ask About This Range controls, the call action, short section markers, keyboard focus/active cues, and small location or arrow accents**. Red must not become the default card background, availability-notice background, large page field, or decorative gradient. Maintain WCAG AA contrast on every light, dark, image, hover, focus, error, and success state.

## Route & Component Inventory

### Shared `PageHero`

- Use a compact dark editorial hero with eyebrow, one H1, 1–2 sentence support copy, and at most two actions.
- Truck series routes use a split composition: dark text panel beside a light, contained local product image. The image uses `object-fit: contain`, a fixed aspect-ratio wrapper, explicit responsive `sizes`, and useful approved alt text.
- Support/About/Contact heroes remain text-led; do not invent workshop, staff, dealer, or branch photography. Avoid decorative stock photos that imply local facilities.
- Primary hero action routes to `/contact?topic=<allowlisted-key>#inquiry`; the secondary action is the verified `tel:` call. About may make Call primary only if inquiry remains immediately adjacent.

### `/trucks` listing

- Hero: eyebrow `Hino truck ranges`, H1 `Explore Hino trucks`, concise application-orientation copy, and **Request Information** action.
- Place one visible page-level suitability/availability notice between the introduction and card grid: **`Examples are general guidance only. Confirm body, operating, specification, and current Cebu availability requirements with Hino Cebu.`**
- Render four equal-height image-led cards from typed configuration: 200 Series, 300 Series, 500 Series, and Bus & PUV. Reuse the homepage card visual treatment, but allow more room for one short `Explore this range for…` application line.
- Card order and content anatomy: contained image → category eyebrow → series name → approved description → 2–3 broad application cues → `Explore the range` cue. The full card is one link; do not nest buttons or links inside it.
- Application cues are plain orientation text, never badges with checkmarks or language such as `best`, `ideal`, `perfect`, `recommended`, or `fits`. No filtering, comparison, auto-selection, technical table, pricing, financing, or availability badge.
- After the grid, use a dark conversion panel: `Not sure where to begin?` plus **Tell Us What Your Business Needs** and the verified call alternative.

### Shared truck-series template

- Use one structure for all four slugs: hero → application conversation → curated highlights or honest lightweight state → availability notice → local inquiry panel.
- The application section appears before product highlights. Heading: **`Explore this range for`**. Render broad use cases as 2–4 text cards with an outline Lucide icon; each card includes the qualifier `Talk with Hino Cebu about your body and operating requirements.`
- Repeat the availability safeguard directly before the final inquiry panel. Do not rely only on the listing-page notice because visitors may land on a detail URL.
- Do not display model names, model-specific badges, numerical specifications, brochures, official source links, provenance, or national catalog-navigation links in Phase 3.

#### 300 and 500 Series

- Both use the same composition and number of content blocks, with distinct approved imagery, applications, titles, and internally sourced copy.
- Show exactly three curated highlight cards. Use theme-level wording and retain `select models` / `varies by model` qualifications wherever official source material is not series-wide.
- 300 Series visual story: practical urban/commercial operation, driver-focused cab, and service-access themes. 500 Series visual story: demanding commercial conversations, durability-focused design, and driver-operation/safety themes. These are content distinctions, not separate color schemes.
- Product imagery stays in the contained light media treatment. For the 500 Series, use the existing authorized local card asset; do not scrape or hotlink a new wide hero.

#### 200 Series and Bus & PUV

- Use the shared template in its honest lightweight variant: configured name/category/description/image, a short application-orientation section, and an availability/information panel.
- Empty/lightweight heading: **`Ask Hino Cebu about this range.`** Body: **`Current Cebu availability and detailed specifications require confirmation. Tell us what your operation needs, or call Hino Cebu for guidance.`**
- Their cards and routes must remain actionable and visually complete, but must not imitate the richer 300/500 pages with invented feature cards, models, history, or specifications.

### Inquiry conversion panel

- Reuse one `LocalContactCta` component on listing, series, Parts & Service, and About routes. It uses a near-black surface, condensed heading, one sentence, a red inquiry action, and a bordered verified call action.
- Page-level CTAs carry a precise allowlisted topic (`200-series`, `300-series`, `500-series`, `bus-puv`, `parts`, `service`, or `general`). The global mobile action bar uses general `/contact#inquiry` outside the homepage; it must not infer arbitrary topics from the URL.
- Inquiry is primary on truck pages and Parts/Service. Keep Call equally discoverable but visually secondary. On Contact, Call is a prominent immediate alternative beside the form heading.

### `/parts-service`

- Hero identifies one aftersales destination and routes to the shared Contact form with a general support topic.
- First content band contains two equal primary path cards: **Parts** and **Service**. Each has an outline icon, approved concise description, 2–3 configured support bullets, and its own contextual **Ask About Parts** / **Request Service Information** CTA.
- On 390px, Parts appears first, then Service. At 1024px+, present them side by side with equal visual weight and aligned CTA baselines.
- Fleet support and maintenance guidance form a quieter supporting band beneath the two primary paths. Use two light informational cards without implying service plans, uptime guarantees, inventory, turnaround time, or capabilities not present in typed approved content.
- The generated workshop placeholder may remain only if already accepted for the working build and must retain internal replacement metadata. Do not label it as the Cebu facility or use it to imply local capability.

### `/contact`

- Own the shared `#inquiry` anchor and all local location/contact details. Route order: compact hero → form/local-information split → map → closing call cue.
- Desktop uses a 55/45 split: inquiry form on the left, verified phone/address/hours and unresolved statuses on the right. At 390px, place the form first after a compact call alternative; location details and map follow.
- The **Inquiry about** select is first, visible, and editable. Normalize the URL topic against the typed allowlist before display. Preserve the original normalized topic separately for later Phase 4 attribution; never reflect arbitrary query text.
- Form order: Inquiry about; full name; mobile number; email address; company/business; message/details; consent checkbox; submit. Labels are persistent. Mobile is required; email, company, and message requirements follow the shared validation schema rather than presentation assumptions.
- Controls are 48–54px high; message uses at least 120px height. Use native input/select/textarea/checkbox controls, correct `autocomplete`, `inputMode`, and types. The form remains one column at all widths for predictable scan and error flow.
- State sequence: idle → focus → locally invalid → loading → local confirmation. Inline text errors use `aria-describedby` and `aria-invalid`; loading prevents duplicate activation and announces status with `aria-live="polite"`.
- Confirmation heading: **`Thank you for your interest in Hino Cebu.`** Supporting copy: **`For immediate assistance, call (032) 346 3322.`** It must not say `sent`, `received`, promise follow-up, show a lead ID, or redirect to a thank-you route before Phase 4.
- Safe failure copy: **`We couldn't send your inquiry right now. Please try again or call Hino Cebu at (032) 346 3322.`** Never expose raw validation, provider, or configuration errors.
- Show verified phone as a live `tel:` link. Show configured address and hours as text. Render unresolved facts exactly as non-interactive status rows: **`Email: awaiting confirmation`** and **`Verified directions link: awaiting confirmation`**. Do not create disabled, empty, guessed, or fallback anchors.
- Keep the established address-search map in a bordered 16:10 frame with meaningful iframe title and an accessible address-search alternative. Never label the generated address-search link as the verified branch listing or verified directions URL.

### `/about`

- Keep the page concise: local customer commitment → national-company background → practical Cebu support/location → conversion panel.
- Lead with what the local experience helps visitors do, using approved configured service statements only. Do not add dealer history, staff counts, awards, territory, authorization, legal-entity, inventory, or customer-volume claims.
- The national section is explicitly titled **`About Hino Motors Philippines`** and visually separated from the local section. It may state only the approved internally sourced background; it must not imply the national company facts belong to Hino Cebu.
- Close with verified phone, address, hours, broad configured support areas, **Contact Hino Cebu**, and Call. Use no visitor-facing mother-site link or source footnote.

## Asset Provenance & Product-Claim Contract

- Use local versioned images and the existing internal asset manifest. Never hotlink Hino Philippines images.
- Product and corporate source URLs, publisher, review date, supported fields, authorization/replacement state, and provenance stay in typed maintainer-only metadata. Do not render them in links, captions, alt text, structured data, or Client Component props.
- Public components receive a projection containing public copy and image fields only. No `sourceUrl`, source label, retrieval note, or mother-site CTA may cross the render boundary.
- Use explicit image dimensions or an aspect-ratio parent with `fill`, accurate `sizes`, and a media box that reserves space before load. Use `contain` for truck product imagery and `cover` only for approved environmental/service imagery.
- Alt text describes visible content without inferring a precise model, configuration, Cebu location, or operational capability that the asset/content contract does not verify.
- All product/corporate copy remains configurable and subject to commercial approval. National catalog presence never establishes current Cebu availability.

## Copywriting Contract

| Element | Copy |
|---|---|
| Phase-wide primary CTA | `Request Information` |
| Listing orientation CTA | `Tell Us What Your Business Needs` |
| Series CTA | `Ask About This Range` |
| Parts CTA | `Ask About Parts` |
| Service CTA | `Request Service Information` |
| General CTA | `Contact Hino Cebu` |
| Phone action | `Call (032) 346 3322` |
| Listing disclaimer | `Examples are general guidance only. Confirm body, operating, specification, and current Cebu availability requirements with Hino Cebu.` |
| Empty/lightweight heading | `Ask Hino Cebu about this range.` |
| Empty/lightweight body | `Current Cebu availability and detailed specifications require confirmation. Tell us what your operation needs, or call Hino Cebu for guidance.` |
| Unresolved email | `Email: awaiting confirmation` |
| Unresolved directions | `Verified directions link: awaiting confirmation` |
| Form confirmation | `Thank you for your interest in Hino Cebu.` |
| Safe error state | `We couldn't send your inquiry right now. Please try again or call Hino Cebu at (032) 346 3322.` |
| Destructive confirmation | None — Phase 3 has no destructive visitor action |

Tone is practical, concise, credible, business-oriented, and locally useful. Use `explore`, `ask`, `confirm`, and `tell us` rather than `choose`, `guaranteed`, or `recommended`. Avoid unsupported superlatives, fake urgency, prices, financing language, payload/body guarantees, universal feature claims, delivery promises, and any visible promotion language.

## Accessibility & Interaction

- Preserve semantic `header`, `nav`, `main`, `section`, `article`, `form`, `address`, and `footer` landmarks; one H1 per route and a logical H2/H3 sequence.
- Cards that navigate are single links with an accessible name. Informational application/highlight cards are not made focusable. Never nest a button or link inside another interactive surface.
- Every action exposes a visible keyboard focus ring. Hover-only cues must also appear on focus. Touch targets are at least 44px and no essential meaning relies only on color or icons.
- The mobile menu keeps Escape-to-close, focus restoration, scroll lock, and proportional link sizing. The sticky mobile action bar remains usable at 200% zoom and leaves safe-area/content clearance.
- Anchor targets `#inquiry` and any route-section anchors use `scroll-margin-block-start` for the sticky header. Smooth scrolling is disabled when reduced motion is requested.
- The inquiry form uses persistent labels, textual errors, associated descriptions, `aria-invalid`, `aria-live` status, a disabled loading submit, and focus management to the error summary/first invalid field or confirmation heading as appropriate.
- The address map has a meaningful title. Unresolved fields are plain text, not disabled controls. External source metadata is never announced or exposed in the DOM.
- Verify keyboard-only navigation, visible focus, mobile-menu focus return, topic normalization/prefill, invalid/loading/confirmation form states, reduced-motion behavior, map alternative, and no-promotions surface on all primary routes.

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|---|---|---|
| None | None | Not required — project uses the established manual CSS system and no third-party registry |

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: Pending checker validation
- [ ] Dimension 2 Visuals: Pending checker validation
- [ ] Dimension 3 Color: Pending checker validation
- [ ] Dimension 4 Typography: Pending checker validation
- [ ] Dimension 5 Spacing: Pending checker validation
- [x] Dimension 6 Registry Safety: PASS — no registry is used

**Approval:** pending checker validation
