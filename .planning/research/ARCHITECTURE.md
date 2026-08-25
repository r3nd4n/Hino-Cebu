# Architecture Research

**Domain:** Next.js dealership lead-generation website  
**Researched:** 2026-08-26  
**Confidence:** HIGH

## System Overview

```text
Visitor
  → Next.js public routes and reusable layout/components
  → typed site, vehicle, and service content
  → quote/contact form (client validation and attribution capture)
  → server-side lead schema, rate limit, and Turnstile validation
  → Google Sheets append + Resend internal/customer notifications
  → thank-you route and conversion analytics
```

## Component Boundaries

| Boundary | Owns |
|---|---|
| `src/content/` | Approved/configurable business, vehicle, service, and page data |
| `src/components/` | Layout, marketing sections, cards, and form presentation |
| `src/app/` | Routes, metadata, sitemap, robots, and server endpoints/actions |
| `src/lib/leads/` | Validation, normalization, provider adapters, idempotency, and safe errors |
| `public/images/` | Authorized final assets or clearly marked dimension-preserving placeholders |

## Recommended Build Order

1. Foundation: application setup, design tokens, content contracts, env safety, shell, and quality gates.
2. Conversion experience: homepage and reusable visual components at all required breakpoints.
3. Discovery and local-support routes: trucks, detail pages, parts/service, about, contact, legal.
4. Lead pipeline: server validation, Turnstile, Sheets, Resend, confirmation and observability.
5. SEO, accessibility, performance, documentation, and launch verification.

## Integration Notes

- Escape spreadsheet values that begin with `=`, `+`, `-`, or `@` before append.
- Treat provider failure as an operational error: log safe diagnostics, show the approved visitor message, and never return raw provider messages.
- Turnstile tokens expire after five minutes and are single-use; validate the action/hostname where configured.
