# Stack Research

**Domain:** Conversion-focused commercial vehicle dealership website  
**Researched:** 2026-08-26  
**Confidence:** HIGH

## Recommended Stack

| Technology | Version | Purpose | Why Recommended |
|---|---:|---|---|
| Next.js App Router | current stable | Web UI, metadata, route handlers | Fits the required TypeScript/Vercel deployment model and supplies first-party metadata, sitemap, and robots conventions. |
| TypeScript | current stable | Typed application code | Keeps configurable business, vehicle, and lead data safe to change. |
| Vercel | current platform | Hosting and environment management | Native deployment model for Next.js; no custom server is required. |
| Zod | current stable | Server-side lead schemas | Gives one explicit validation boundary for all untrusted form fields. |
| Google Sheets API | v4 | Operational lead log | Matches the requested shared operational workflow; append-only writes can be encapsulated in one server adapter. |
| Resend Node SDK | current stable | Internal and customer email | Supports transactional sends and idempotency keys. |
| Cloudflare Turnstile | current | Bot protection | Works on any host; token validation stays server-side. |

## Architecture Choices

- Use Server Components for content-first pages and Client Components only for interactive form, navigation, and finder behavior.
- Keep authoritative business, vehicle, application, and navigation data in typed `src/content/` or `src/data/` modules; do not embed facts repeatedly in components.
- Keep all provider calls in server-only `src/lib/leads/` adapters behind a single lead submission route/action.
- Generate `robots.ts` and `sitemap.ts` using Next.js metadata conventions; use page metadata for unique titles/descriptions.

## What Not to Use

| Avoid | Why | Use Instead |
|---|---|---|
| Browser-side provider credentials | Exposes secrets and permits bypassing validation | Server-only adapters and environment variables |
| A custom Express server | Adds deployment and maintenance surface without a requirement | Next.js route handlers/actions |
| Hard-coded dealer facts in components | Facts need approval and change frequently | Central typed configuration |
| Client-only Turnstile checks | A token must be verified on the server | Siteverify before processing a lead |

## Sources

- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — generated sitemap convention
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots — generated robots convention
- https://resend.com/docs/api-reference/emails/send-email — transactional email and idempotency support
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ — mandatory server validation
- https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append — Sheets append API
