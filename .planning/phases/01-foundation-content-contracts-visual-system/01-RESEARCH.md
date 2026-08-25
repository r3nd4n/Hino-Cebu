# Phase 1 Research: Foundation, Content Contracts & Visual System

**Date:** 2026-08-26  
**Scope:** FND-01, FND-02, FND-03, FND-04

## Decisions

- Bootstrap a clean Next.js App Router project with TypeScript, ESLint, and a `src/` directory; deploy through the standard Vercel build path.
- Use CSS custom properties in `src/app/globals.css` for the UI-SPEC token contract. Avoid a third-party component registry or a heavyweight design system in this phase.
- Centralize branch identity, contact, hours, navigation, approved claims, trucks, services, and business uses in typed `src/content/` modules. Components may render the data but must not duplicate it.
- Use `next/font` to load the approved display/body typography where licensing and availability allow, with CSS fallbacks preserving the contract.
- Create a server-only environment loader that validates optional integration configuration without importing secret values into client components. `.env.example` names all required variables but contains no values.
- Use Node's built-in test runner for lightweight configuration and server-utility tests, keeping the initial dependency surface small.

## Risks & Prevention

| Risk | Prevention |
|---|---|
| Reintroducing Promotions from old code/reference | Do not create promotion routes/content; add a regression test for navigation and route inventory. |
| Unverified business data scattered in JSX | Expose one typed content API and test required placeholder/approved values. |
| Global CSS turns into one-off styling | Define tokens, utilities, and component patterns before public pages are built. |
| Secrets leak into browser bundle | Keep all runtime env validation in server-only modules; only `NEXT_PUBLIC_*` values cross the boundary. |

## Sources

- `.planning/phases/01-foundation-content-contracts-visual-system/01-CONTEXT.md`
- `.planning/phases/01-foundation-content-contracts-visual-system/01-UI-SPEC.md`
- `.planning/research/STACK.md`
- https://nextjs.org/docs/app/getting-started
