---
phase: 1
slug: foundation-content-contracts-visual-system
status: approved
shadcn_initialized: false
preset: none
created: 2026-08-26
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the Hino Cebu foundation. This contract realizes the Phase 1 context and is binding for later public-page work unless superseded deliberately.

---

## Design Intent

Create a premium commercial-vehicle dealership experience: white utility chrome above dark, truck-led visual storytelling. The interface should feel engineered and credible—not playful, glossy SaaS, or generic corporate. Use Hino red to direct attention, not to fill every surface. Promotions are excluded from every interface surface.

## Design System

| Property | Value |
|---|---|
| Tool | CSS custom properties and component-local styles; no external component registry is required |
| Preset | Not applicable |
| Component library | None; compose accessible semantic primitives |
| Icon library | Lucide React, consistent outline weight |
| Display font | `Barlow Condensed` (fallback `Arial Narrow`, sans-serif) |
| UI/body font | `Inter` (fallback `Arial`, sans-serif) |

## Spacing Scale

| Token | Value | Usage |
|---|---:|---|
| xs | 4px | Icon gaps and thin visual offsets |
| sm | 8px | Compact metadata and icon-button spacing |
| md | 16px | Default control and card internals |
| lg | 24px | Card padding and compact section gaps |
| xl | 32px | Layout gutters and component gaps |
| 2xl | 48px | Standard desktop section spacing |
| 3xl | 64px | Major page-section spacing |
| 4xl | 96px | Desktop hero and major editorial spacing |

Exceptions: hero typography and media may use fluid `clamp()` sizing while preserving these layout increments.

## Layout & Responsiveness

- **Container:** center content at `min(100% - 32px, 1200px)`; use 20px side gutters on 390px, 32px at tablet, and 48px at desktop.
- **Desktop header:** white 68–76px utility bar. Hino Cebu identity left; Trucks, Parts & Service, About, Contact centered/right; red phone action aligned right. No Promotions item.
- **Mobile header:** compact white header with logo and menu trigger. The menu opens as a near-full-screen dark panel with primary links plus Call and Request a Quote actions.
- **Mobile actions:** fixed bottom action bar with two equal, high-contrast controls: Call and Request a Quote; respect safe-area inset and never obscure form submit controls.
- **Hero foundation:** future homepage work uses full-bleed truck imagery with a dark left-to-right/low-edge overlay; text stays legible, quote panel is dark and elevated, and media is visually dominant rather than a floating cutout.
- **Breakpoints:** verify 390px, 768px, 1024px, and 1440px. Collapse multi-column content before it crowds; do not merely scale desktop down.

## Typography

| Role | Size | Weight | Line Height | Contract |
|---|---:|---:|---:|---|
| Body | 16px | 400 | 1.5 | Practical and highly legible; no long all-caps paragraphs |
| Small label | 12px | 700 | 1.2 | Uppercase with restrained tracking for utility labels |
| Navigation | 14px | 700 | 1.1 | Compact, uppercase or strong semibold |
| Heading | 32–48px | 700 | 0.98–1.05 | Barlow Condensed, high-impact section hierarchy |
| Display | `clamp(52px, 7vw, 96px)` | 700–800 | 0.86–0.94 | Barlow Condensed, uppercase; use red only to emphasize a phrase |

## Color

| Role | Value | Usage |
|---|---|---|
| Dominant light | `#FFFFFF` | Header, primary reading surfaces, forms, light card areas |
| Dominant dark | `#151719` | Hero overlay, footer, mobile nav, dark credibility bands |
| Secondary charcoal | `#24272A` | Quote cards, dark panels, secondary dark surfaces |
| Muted surface | `#F4F4F2` | Truck cards, alternate sections, subtle page backgrounds |
| Ink | `#111111` | Primary text on light backgrounds |
| Muted ink | `#5E6368` | Supporting text and secondary metadata |
| Accent red | `#E31B23` | Primary CTAs, phone action, focused underline, selected/high-priority highlights |
| Accent red dark | `#B9151C` | Hover/pressed state for red controls |
| Border | `#D9DCDD` | Cards, form fields, and restrained dividers |
| Destructive | `#B42318` | Form error only |
| Success | `#16794B` | Confirmed success state only |

Accent reserved for: Request a Quote controls, the desktop phone action, selected navigation/focus indicator, key display-word emphasis, and small section markers. It must not become the default background for cards, sections, or body copy.

## Components

### Buttons and links

- Primary action: red fill, white text, 48–54px minimum height, 4–6px radius, strong uppercase/semibold label, clear dark-red hover and visible focus ring.
- Secondary action: transparent or white surface, 1px current-color/dark border, same height and radius as primary; never pill-shaped.
- Text links: underline or red arrow indicator on hover; do not rely on color alone.

### Cards and controls

- Card radius: 6–10px. Use 1px subtle border and restrained shadow; elevation is reserved for quote panels and other conversion-critical surfaces.
- Form controls: 48–54px height, light surface, clear icon/label separation, visible invalid state, and a non-color error message.
- Quote panel: dark charcoal, 8px radius, high-contrast white heading/body, 20–28px internal padding; retain clear focus order and keyboard reachability.

### Images

- Prefer authorized truck imagery. Until it is available, retain final aspect ratio and use clearly identified neutral placeholders—not fabricated model specifications.
- Always set image dimensions or aspect ratios to prevent layout shift. Use `object-fit: cover` for hero imagery and `contain`/consistent media boxes for product imagery.

## Copywriting Contract

| Element | Copy contract |
|---|---|
| Primary CTA | `Request a Quote` |
| Secondary discovery CTA | `Explore Hino Trucks` / `View All Trucks` |
| Phone action | `(032) 346 3322` and a semantic `tel:` link |
| Empty/unavailable heading | `Ask Hino Cebu about current availability.` |
| Empty/unavailable body | `Vehicle availability can vary. Send an inquiry and our local team will help you find the right fit.` |
| Form error | `We couldn't send your inquiry right now. Please try again or call Hino Cebu at (032) 346 3322.` |
| Success direction | Confirm receipt plainly, then guide the visitor to the thank-you state or call action |

Tone: practical, credible, concise, business-oriented, knowledgeable, and local without being overly colloquial. Avoid unsupported superlatives, fake urgency, excessive exclamation marks, and generic AI-marketing phrases.

## Accessibility & Interaction

- Semantic landmarks: header, nav, main, footer; one H1 per page; visible skip-link and focus states.
- Meet WCAG AA contrast for text and interactive controls; dark overlays must be tested with actual hero images.
- Mobile menu closes with Escape, restores focus to its trigger, and prevents background scroll while open.
- Sticky mobile actions remain keyboard accessible and do not cover content at 200% zoom.
- Form state contract: idle, focus, invalid, loading, success, and safe server error.

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|---|---|---|
| None | None | Not required |

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS — conversion-oriented, plain, and safe error wording defined.
- [x] Dimension 2 Visuals: PASS — concrete commercial hierarchy, shell, cards, imagery, and responsive rules defined.
- [x] Dimension 3 Color: PASS — explicit palette and reserved accent usage defined.
- [x] Dimension 4 Typography: PASS — display/body font roles, scale, weights, and line heights defined.
- [x] Dimension 5 Spacing: PASS — 4px-based scale, layout gutters, and breakpoints defined.
- [x] Dimension 6 Registry Safety: PASS — no third-party block registry is used.

**Approval:** approved 2026-08-26
