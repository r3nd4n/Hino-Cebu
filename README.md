# Hino Cebu Digital Growth Website

A production-oriented, local-first website foundation for Hino Cebu. The application routes Cebu business users to truck sales, parts, service, fleet, financing, and contact actions while keeping unverified facts out of the public experience.

## Stack

- Next.js App Router and React
- TypeScript with strict checking
- Plain CSS design tokens and responsive components
- Zod-backed server-side lead validation
- Repository-managed TypeScript content
- Native Next.js metadata, sitemap, robots, server actions, and static generation

There is no database, paid CMS, upload store, search service, chat tool, or experiment platform in the MVP.

## Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without `NEXT_PUBLIC_SITE_URL`, robots intentionally blocks indexing and canonical helpers use localhost. Never deploy production without setting the final HTTPS origin.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

## Architecture

- `src/app` — routes, metadata endpoints, shared layout, and the lead server action
- `src/content` — editable branch, product, guide, promotion, delivery, service, and campaign data
- `src/components/layout` — global navigation, footer, and mobile action bar
- `src/components/forms` — shared accessible lead-form renderer
- `src/components/trucks` — model cards and the rules-based truck finder
- `src/components/marketing` — attribution capture, optional provider tags, inquiry layout, and tracked actions
- `src/lib` — URL/SEO utilities, PII-free analytics, attribution, validation support, and vendor-neutral lead routing

Truck detail pages use one template at `src/app/trucks/[slug]/page.tsx`. Paid campaigns use one template at `src/app/lp/[slug]/page.tsx`, with index/noindex controlled by campaign content.

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Site origin for canonicals, sitemap, robots, Open Graph, and JSON-LD | Production |
| `NEXT_PUBLIC_GTM_ID` | Loads Google Tag Manager | Optional |
| `NEXT_PUBLIC_GA4_ID` | Loads direct GA4 only when GTM is absent | Optional |
| `NEXT_PUBLIC_META_PIXEL_ID` | Loads Meta Pixel | Optional |
| `LEAD_ROUTING_WEBHOOK_URL` | Approved server-side lead webhook | Production forms |
| `ENABLE_UPLOADS` | Reserved future upload flag; uploads remain disabled | No |

Google Ads conversion tags should be configured through the single GTM container to keep tags centralized and prevent duplicate tracking. IDs load only when configured. Consent requirements must be approved before marketing IDs are enabled.

## Lead handling

Forms submit through a server action that:

1. allow-lists the lead type and fields;
2. validates required values, email format, maximum lengths, consent, and a honeypot;
3. sanitizes attribution to supported keys;
4. calls the vendor-neutral lead router.

The development adapter validates and acknowledges leads without persistence. It does not email, save, or log personal data. Configure and test an approved production webhook before launch. Rate limiting or an approved anti-abuse provider remains a production requirement.

Photo uploads are intentionally unavailable. Do not enable them until secure storage, file validation, access controls, retention, and privacy handling are approved.

## Attribution and measurement

The app captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, and `fbclid` into session storage, then attaches those non-sensitive values to lead submissions. Analytics events never include submitted contact or free-text form data.

Typed hooks cover model views, form starts/submissions, truck-finder activity, campaign leads, phone clicks, and directions clicks. GTM is the recommended tag-control layer for GA4 and Google Ads. Direct GA4 loading is a fallback and is suppressed when GTM is configured to avoid duplicate page views.

## Content publishing workflow

1. Edit a typed entry under `src/content`.
2. Use only approved copy, facts, and assets.
3. For promotions, set verified dates and `isPublished: true`; inactive/expired entries do not render as current.
4. For campaigns, choose `index: false` when the page duplicates an organic page or exists only for paid traffic.
5. Run `npm run check` and review preview deployment on mobile, tablet, and desktop.
6. Obtain business approval before production promotion, technical specification, customer story, or image publishing.

This repository-first workflow avoids a CMS subscription. The presentation reads isolated typed data so a later CMS adapter can replace content sourcing without rebuilding page components.

## Vercel deployment

No `vercel.json` is required. Import the repository, set environment variables separately for Preview and Production, and use a Vercel plan approved for commercial production. Preview URLs work without hardcoded domains; preview deployments remain non-indexable when `NEXT_PUBLIC_SITE_URL` is not set.

Before connecting the final domain, set `NEXT_PUBLIC_SITE_URL` to its exact HTTPS origin, verify generated canonical/sitemap/robots URLs, configure DNS, and validate Search Console ownership.

## Production readiness

Review [BUSINESS_INPUTS_REQUIRED.md](BUSINESS_INPUTS_REQUIRED.md), [ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md), [SOURCE_REGISTER.md](SOURCE_REGISTER.md), and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). The checked-in privacy and terms pages are Cebu-specific drafts adapted from Hino Philippines material and still require final business/legal approval.

Operator procedures are in `docs/operations/production-decisions.md`, `docs/operations/lead-provider-scorecard.md`, `docs/operations/release-runbook.md`, and `docs/operations/records/README.md`. They explain how to execute approvals, provider evaluation, promotion, alerts, recovery, and closeout while the authoritative typed governance records under `src/content/governance` remain the only source of decision values.

Run `node --test tests/operations.test.mjs` for the operations documentation contracts, then `npm run check` before requesting promotion. The procedures intentionally keep unknown providers, owners, thresholds, destinations, and approvals pending.
