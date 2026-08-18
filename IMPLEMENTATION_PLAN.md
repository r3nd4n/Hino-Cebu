# Hino Cebu Website Implementation Plan

## Repository audit

- Existing application: none; the repository contains only the master specification and implementation prompt.
- Framework, package manager, routing, styling, components, assets, environment, lint, tests, and type checking: not yet configured.
- Source of truth: `HINO_CEBU_MASTER_WEBSITE_SPEC.md`.
- Greenfield decision: use Next.js App Router with TypeScript, CSS design tokens, server-first pages, and client components only for navigation, forms, attribution, and the truck finder.

## What will be reused

- The provided business name, address reference, and phone reference.
- Product, UX, content, SEO, conversion, accessibility, and cost-control decisions in the master specification.
- No external copy, manufacturer layout, unlicensed imagery, or unverified production claims.

## Route map

- Core: `/`, `/trucks`, `/trucks/hino-200`, `/trucks/hino-300`, `/trucks/hino-500`
- Conversion: `/find-your-truck`, `/quote`, `/parts`, `/service`, `/fleet`, `/financing`, `/contact`
- Trust/content: `/promotions`, `/hino-cebu`, `/hino-cebu/customer-deliveries`, `/guides`, `/privacy`
- Campaign: `/lp/[slug]`, initially `/lp/hino-300-cebu`
- Platform: custom not-found, metadata, sitemap, and robots endpoints

## Content and data architecture

- `src/content`: branch/site configuration, trucks, services, business applications, promotions, guides, deliveries, and campaign definitions.
- Pages and components consume typed content rather than embedding product and branch facts throughout UI code.
- Verified values and optional integrations remain configurable. Empty data sets produce honest public empty states.

## Component plan

- Layout: header, accessible mobile navigation, footer, sticky mobile actions, skip link.
- UI/marketing: container, buttons, section headings, placeholder media, cards, breadcrumbs, FAQ, page hero, CTA bands, empty states.
- Trucks: shared overview cards and one reusable model-detail template.
- Forms: shared schema-driven lead form with server action, server validation, honeypot, accessible errors/status, attribution, and an adapter boundary.
- Interactive: rules-based truck finder and attribution capture.
- Marketing: optional configuration-driven tag loader and tracked actions.

## SEO plan

- Environment-derived site origin via `NEXT_PUBLIC_SITE_URL`; localhost fallback in development only.
- Shared metadata builder for canonical, Open Graph, descriptions, and social fallback.
- Unique route metadata, logical H1s, breadcrumbs, internal links, sitemap, robots, and not-found behavior.
- JSON-LD generated only from visible branch, product, service, and breadcrumb content; no price, inventory, ratings, or unverifiable claims.

## Form architecture

- Quote, parts, service, fleet, financing, and campaign variants use a shared accessible form engine.
- Server actions validate allow-listed fields and consent, reject a honeypot, and call a vendor-neutral lead-routing interface.
- Development adapter acknowledges validated submissions without persisting personal data. Production routing must be configured before launch.
- Upload UI remains disabled until secure storage, privacy, MIME, and size controls are approved.

## Analytics and attribution

- Typed, PII-free event utility with data-layer/browser-provider compatibility.
- Capture UTM fields, `gclid`, and `fbclid` into session storage and attach them to lead payloads.
- Optional GTM, GA4, and Meta Pixel loading only when configured; avoid duplicate automatic page views.

## Missing business inputs

- Tracked in `BUSINESS_INPUTS_REQUIRED.md`; photography requirements are tracked in `ASSET_REQUIREMENTS.md`.
- The most consequential launch blockers are approved brand assets, verified branch details/hours/directions, product specifications, lead destinations, privacy text, and measurement IDs.

## Implementation sequence

1. Initialize tooling and build tokens, global layout, and content/config types.
2. Build the homepage and required static route foundation.
3. Implement reusable model pages and all inquiry forms.
4. Implement the truck finder and campaign landing-page engine.
5. Add SEO, structured data, attribution, and provider-optional marketing tags.
6. Complete responsive/accessibility review, lint, type check, tests, production build, and documentation.

## Cost decisions

- No database, paid CMS, upload storage, search, chat, or experimentation platform.
- Static/repository content and native Next.js features cover MVP requirements.
- Server execution is limited to form submission; a future lead destination can be added behind the adapter.
