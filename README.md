# Hino Cebu Website

A conversion-focused Hino Cebu website for local truck sales, parts, service, and support conversations. It is built with Next.js App Router, TypeScript, CSS custom properties, and Vercel-compatible deployment conventions.

## Local setup

1. Install Node.js 20.9 or later.
2. Copy `.env.example` to `.env.local` and add only the values available to your environment.
3. Run `npm install`.
4. Run `npm run dev` and open `http://localhost:3000`.

Quality checks:

```bash
npm test
npm run lint
npm run build
```

## Responsive shell verification

Run `npm run dev`, then inspect the public shell at 390px, 768px, 1024px, and 1440px wide. Confirm that the desktop header shows Trucks, Parts & Service, About, Contact, and the Cebu phone action without any Promotions surface. At mobile widths, open the menu, use Escape to close it, and confirm the fixed Call and Request a Quote controls remain reachable without obscuring primary content.

## Environment boundary

Only variables prefixed with `NEXT_PUBLIC_` may be read by client code. All credentials and provider configuration must stay server-only; use `src/lib/env.ts` only from server code, route handlers, or server actions. Never commit `.env.local` or provider credentials.

| Variable | Purpose | Visibility |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical deployed site URL | Public |
| `NEXT_PUBLIC_GA_ID` | Analytics measurement ID when approved | Public |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile browser site key | Public |
| `RESEND_API_KEY` | Resend API authentication | Server-only |
| `RESEND_FROM_EMAIL` | Verified Resend sender | Server-only |
| `LEAD_NOTIFICATION_EMAIL` | Internal lead recipient | Server-only |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Lead worksheet spreadsheet ID | Server-only |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Google service account email | Server-only |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Google service account private key | Server-only |
| `GOOGLE_SHEETS_WORKSHEET_NAME` | Lead tab name; defaults to `Website Leads` | Server-only |
| `TURNSTILE_SECRET_KEY` | Turnstile server verification secret | Server-only |

## Lead integrations

Google Sheets: create a dedicated service account, enable the Google Sheets API, create a private key, then share the target spreadsheet with the service-account email as an editor. Keep the client email and private key in Vercel environment variables.

Resend: verify the sending domain, configure `RESEND_FROM_EMAIL` with an approved sender, and set the internal notification recipient before enabling live lead delivery.

Lead handling is implemented in a later phase. Until all required server-only values are set, providers must fail safely without exposing provider errors or credentials to visitors.

## Deployment

Deploy the repository through Vercel using the standard Next.js build command (`npm run build`). Add environment variables separately for Preview and Production; do not use real production credentials in local files or example files.

## Content and asset updates

Public business facts live in `src/content/`. Update the typed configuration rather than copying contact, vehicle, or service claims into components. Replace truck imagery only with authorized Hino assets and preserve image dimensions/aspect ratios to avoid layout shift.

## Launch inputs still required

- Registered Cebu dealership legal entity and approved legal copy.
- Brand authorization for Hino marks, product photography, and brochures.
- Confirmed branch email, notification recipients, verified map URL, and current local availability.
- Approved privacy/DPO channel, analytics consent approach, Resend sending domain, and Google Sheets service-account access.

The website must not claim dealer authorization, availability, specifications, or contact details that have not been verified for launch.
