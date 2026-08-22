---
created: 2026-08-22T11:51:17+08:00
title: Align website infrastructure with current decisions
area: general
files:
  - src/content/governance/leads.ts
  - src/content/governance/privacy.ts
  - src/content/governance/decisions.ts
  - src/lib/leads/router.ts
  - tests/governance.test.mjs
---

## Problem

The immediate business priority is to polish and launch the website before beginning paid marketing, advertising, or broader growth work. The current approved branch shell already records Hino Cebu, the supplied Cebu City address and phone number, Monday-Saturday 8:00 AM-5:00 PM hours, Sunday closure, a temporary Vercel Hobby deployment proposal, and Resend as a proposed notification transport. However, the lead architecture still proposes Neon Postgres, while the latest stakeholder direction selects Google Sheets as the lead destination.

Vercel Hobby may be used only for non-commercial preview or demonstration work; the public commercial website must not launch there. Official Hino Philippines logos, product images, brochures, and policy material remain source references rather than automatic usage permission. Cebu-specific privacy and terms content still requires approved controller, processor, retention, rights, contact, and legal wording.

## Solution

Revise the pending lead-provider and privacy records to replace Neon with an approved Google Sheets integration and retain Resend for operational notifications. Implement Sheets behind the existing `LeadRouter` boundary. Treat a successful, identifiable row append as the acceptance boundary; use stable submission IDs and bounded retry/idempotency controls, return honest failure states when persistence is not confirmed, and never depend on email delivery for lead acceptance. Keep credentials and spreadsheet identifiers in protected environment configuration, define least-privilege service-account access, and approve retention, deletion, reconciliation, and operator ownership before production.

Keep the Hobby deployment explicitly preview/demo-only and require a commercial-use Vercel plan before public launch. Use Hino Philippines branding and assets only after usage authorization and provenance are recorded, optimizing approved copies locally. Adapt—not copy—the mother-site privacy and terms material for Hino Cebu and obtain business/privacy/legal approval before publishing it.
