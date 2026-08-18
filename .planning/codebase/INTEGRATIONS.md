# External Integrations

**Analysis Date:** 2026-08-18

## APIs & External Services

**Lead Delivery:**
- Configurable vendor-neutral webhook - Receives validated sales, parts, service, fleet, and financing leads from the server-side adapter in `src/lib/leads/router.ts`.
  - SDK/Client: Native server-side `fetch`; no vendor SDK is installed.
  - Auth: No dedicated auth header is implemented; the complete endpoint is supplied through `LEAD_ROUTING_WEBHOOK_URL`.
  - Protocol: `POST` with `content-type: application/json`, `cache: "no-store"`, and the `LeadSubmission` shape from `src/lib/leads/types.ts`.
  - Response contract: Any 2xx-style `Response.ok` succeeds; optional `x-lead-reference` supplies the reference, otherwise `crypto.randomUUID()` is used.
  - Fallback: When `LEAD_ROUTING_WEBHOOK_URL` is absent, `src/lib/leads/router.ts` returns a generated reference without sending, storing, emailing, or logging the lead.

**Analytics & Advertising:**
- Google Tag Manager - Optionally injects the GTM browser script from `www.googletagmanager.com` in `src/components/marketing/MarketingTags.tsx`.
  - SDK/Client: `next/script` plus the browser `dataLayer`; no npm analytics SDK is installed.
  - Auth: Public container identifier in `NEXT_PUBLIC_GTM_ID`.
- Google Analytics 4 - Optionally loads `gtag.js` directly only when GTM is absent, preventing duplicate direct page-view initialization in `src/components/marketing/MarketingTags.tsx`.
  - SDK/Client: Hosted `gtag.js` and `window.gtag`, called by `src/lib/analytics.ts`.
  - Auth: Public measurement identifier in `NEXT_PUBLIC_GA4_ID`.
- Meta Pixel - Optionally loads `connect.facebook.net/en_US/fbevents.js`, initializes a page view, and receives custom events from `src/lib/analytics.ts`.
  - SDK/Client: Hosted pixel script and `window.fbq`; no npm SDK is installed.
  - Auth: Public pixel identifier in `NEXT_PUBLIC_META_PIXEL_ID`.
- Google Ads - No direct script or SDK exists. `README.md` specifies GTM as the tag-control layer when Google Ads conversion tags are configured.
- Typed event dispatch - `src/lib/analytics.ts` sends only allow-listed event names and caller-supplied non-undefined properties to `dataLayer`, GA4, and Meta; form contact fields and free-text payloads are not passed by `src/components/forms/LeadForm.tsx`.

**Maps, Telephone & Social Destinations:**
- Google Maps address search - `src/content/site.ts` builds an outbound directions link to `www.google.com/maps/search`; it is a regular hyperlink rather than an embedded Maps API and uses no API key.
- Telephone - `tel:` links in `src/content/site.ts`, `src/app/contact/page.tsx`, and layout components invoke the user's device dialer; there is no telephony API.
- Facebook, Instagram, and YouTube - National Hino social profiles are outbound links declared in `src/content/site.ts`; there is no social SDK, login, feed, or posting integration.

**Official Content Sources:**
- Hino Motors Philippines - Product, parts, service, financing, privacy, brochure, and national-site links are repository-managed outbound references in `src/content/site.ts`, `src/content/trucks.ts`, and `SOURCE_REGISTER.md`.
  - SDK/Client: Standard browser links only; runtime content is not fetched from Hino APIs.
  - Auth: None.
- Schema.org - JSON-LD vocabulary URLs appear in `src/app/layout.tsx`, `src/app/contact/page.tsx`, `src/app/trucks/[slug]/page.tsx`, and `src/lib/seo.ts`; this is static structured data, not an API call.

## Data Storage

**Databases:**
- Not detected. `package.json` contains no ORM or database client, and the lead router in `src/lib/leads/router.ts` deliberately performs no local persistence.
  - Connection: Not applicable.
  - Client: Not applicable.

**File Storage:**
- Repository-local static assets only - Images and SVGs are served from `public/`; source attribution is maintained in `SOURCE_REGISTER.md`.
- Upload storage is not implemented. `src/components/forms/LeadForm.tsx` presents uploads as unavailable, and `README.md` states that secure storage and file controls are prerequisites.

**Caching:**
- No external cache is detected.
- Next.js build/runtime caching supplies framework behavior, while the lead webhook explicitly uses `cache: "no-store"` in `src/lib/leads/router.ts`.
- Campaign attribution is browser-session state, not server caching: `src/lib/attribution.ts` stores supported UTM values, `gclid`, and `fbclid` in `sessionStorage` under `hino_cebu_attribution`.

## Authentication & Identity

**Auth Provider:**
- None. There are no login routes, sessions, identity SDKs, user records, or protected application areas in `src/` or `package.json`.
  - Implementation: Public informational routes and public lead Server Actions; the only form consent is a required lead field validated in `src/app/actions/leads.ts`, not authentication.
- Webhook authentication is also not implemented separately in `src/lib/leads/router.ts`; if the destination requires a credential, the current adapter only supports embedding it in the secret endpoint URL.

## Monitoring & Observability

**Error Tracking:**
- None detected. `package.json` has no Sentry, OpenTelemetry, Datadog, or equivalent dependency, and there is no error-tracking initialization under `src/`.

**Logs:**
- No application logging integration is detected. `src/app/actions/leads.ts` converts lead-routing failures into a generic user-facing error, and `src/lib/leads/router.ts` does not log personal data.
- Hosting-platform request/build logs may exist operationally, but no provider-specific logging configuration is committed.

## CI/CD & Deployment

**Hosting:**
- Vercel is the documented deployment target in `README.md`; import-based deployment is expected and `.vercel` is excluded in `.gitignore`.
- No committed `vercel.json`, container definition, or alternate hosting configuration is present.

**CI Pipeline:**
- None detected. There is no committed `.github/workflows/` or other CI configuration.
- The repository-level verification gate is `npm run check` in `package.json`, which runs ESLint, TypeScript, native Node tests, and the production build sequentially.

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SITE_URL` - Required for the production HTTPS origin; controls canonical, sitemap, robots, Open Graph, and JSON-LD URLs via `src/lib/site-url.ts`.
- `LEAD_ROUTING_WEBHOOK_URL` - Required for production form forwarding through `src/lib/leads/router.ts`; without it submissions are acknowledged without persistence.
- `NEXT_PUBLIC_GTM_ID` - Optional GTM container identifier read by `src/components/marketing/MarketingTags.tsx`.
- `NEXT_PUBLIC_GA4_ID` - Optional direct GA4 measurement identifier read by `src/components/marketing/MarketingTags.tsx` and `src/lib/analytics.ts`.
- `NEXT_PUBLIC_META_PIXEL_ID` - Optional Meta Pixel identifier read by `src/components/marketing/MarketingTags.tsx` and `src/lib/analytics.ts`.
- `ENABLE_UPLOADS` - Reserved and documented in `README.md`; currently unused by source code and does not enable uploads.

**Secrets location:**
- `.env.example` exists as a configuration-name template; its contents are not included in this audit.
- Local values belong in `.env` or `.env.local`, both excluded by `.gitignore`.
- Preview and Production values belong in Vercel environment settings according to `README.md`; do not commit webhook endpoint secrets.
- Variables prefixed `NEXT_PUBLIC_` are browser-visible configuration, not secrets. `LEAD_ROUTING_WEBHOOK_URL` is server-only because it is referenced only in `src/lib/leads/router.ts`.

## Webhooks & Callbacks

**Incoming:**
- None. No `route.ts` API handlers, webhook endpoints, OAuth callbacks, or provider callbacks are present under `src/app/`.
- Lead forms enter through the internal Next.js Server Action `submitLead` in `src/app/actions/leads.ts`; this is an application form boundary rather than a third-party webhook.

**Outgoing:**
- Lead routing webhook - `src/lib/leads/router.ts` posts the validated and normalized `LeadSubmission` object to `LEAD_ROUTING_WEBHOOK_URL`.
- The webhook payload includes lead type, source page, optional source CTA, form payload, allow-listed attribution, and ISO submission time as defined in `src/lib/leads/types.ts` and assembled in `src/app/actions/leads.ts`.
- The current adapter has no retry, timeout, signature, authorization header, queue, dead-letter store, or provider-specific mapping; downstream endpoints must accept the exact JSON contract or the adapter must be extended.

---

*Integration audit: 2026-08-18*
