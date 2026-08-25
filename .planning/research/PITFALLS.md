# Pitfalls Research

**Domain:** Commercial dealership website and lead pipeline  
**Researched:** 2026-08-26  
**Confidence:** HIGH

## Critical Pitfalls

### Unverified commercial content

**What goes wrong:** Specifications, legal identity, availability, map data, and brand claims are published without approval.  
**Avoid:** Centralize configurable data, use explicit placeholders, and maintain a pre-launch verification checklist.  
**Warning signs:** Facts are duplicated in JSX or copied from unapproved sites.  
**Phase:** Foundation and launch readiness.

### Form that looks functional but loses leads

**What goes wrong:** Client-only validation, no provider fallback, missing attribution, or a success state before provider completion.  
**Avoid:** Validate on server, use stable lead IDs/idempotency, test provider adapters, and write failure-path tests.  
**Warning signs:** Only happy-path browser testing has been performed.  
**Phase:** Lead pipeline.

### Client-only bot protection

**What goes wrong:** Attackers bypass a visual Turnstile widget and post directly.  
**Avoid:** Require server-side Siteverify on every protected submission.  
**Warning signs:** The server accepts a missing token.  
**Phase:** Lead pipeline.

### Generic template appearance

**What goes wrong:** A small truck image, generic gradients, pill buttons, or weak local credibility undermine the dealership presentation.  
**Avoid:** Establish visual tokens and truck-dominant hero composition before adding secondary pages.  
**Warning signs:** Quote CTA is below the fold or mobile is merely a compressed desktop.  
**Phase:** Conversion experience.

### Spreadsheet formula injection

**What goes wrong:** User data beginning with formula prefixes executes when opened in a spreadsheet.  
**Avoid:** Prefix risky values before Sheets writes and test the transformer.  
**Phase:** Lead pipeline.

## Looks Done But Isn't

- [ ] Forms: success, invalid, loading, focus, and server-error states are all implemented and tested.
- [ ] SEO: titles, descriptions, canonical URL, sitemap, robots, and noindex thank-you page are verified.
- [ ] Performance: hero image has dimensions/prioritization and does not cause major layout shift.
- [ ] Commercial readiness: all legal, asset, contact, location, and product-authority placeholders are resolved before public launch.
