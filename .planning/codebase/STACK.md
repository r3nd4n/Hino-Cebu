# Technology Stack

**Analysis Date:** 2026-08-18

## Languages

**Primary:**
- TypeScript 6.0.x - Application routes, React components, content models, server actions, and utility modules under `src/`; strict type checking is configured in `tsconfig.json`.
- TSX (TypeScript with JSX) - React Server and Client Components in `src/app/` and `src/components/`.

**Secondary:**
- CSS - Global design tokens, layout, component, and responsive styling in `src/app/globals.css`; no CSS framework or preprocessor is present.
- JavaScript (ES modules) - Native Node.js tests in `tests/foundation.test.mjs` and tooling configuration in `eslint.config.mjs`.
- JSON - Package metadata and compiler configuration in `package.json`, `package-lock.json`, and `tsconfig.json`.

## Runtime

**Environment:**
- Node.js 20.9.0 or newer - Required by Next.js 16.3.1 and documented in `README.md`; the inspected development environment runs Node.js 24.14.0.
- Browser runtime - Client Components use React state, `sessionStorage`, URL search parameters, and optional marketing globals in `src/components/` and `src/lib/attribution.ts`.
- Next.js server runtime - Server Actions and server-rendered App Router routes execute through Next.js; the lead boundary is `src/app/actions/leads.ts`.

**Package Manager:**
- npm - Commands and setup are defined in `package.json` and `README.md`; the inspected npm version is 8.17.0.
- Lockfile: present at `package-lock.json` (lockfile version 2).

## Frameworks

**Core:**
- Next.js 16.3.1 - App Router, React Server Components, Server Actions, metadata, image optimization, sitemap, robots, static generation, and production server; configured in `next.config.ts`.
- React 19.2.8 - UI rendering and client state in `src/app/` and `src/components/`.
- React DOM 19.2.8 - Browser DOM renderer paired with React.
- Plain CSS - Repository-local styling in `src/app/globals.css`; there is no Tailwind, Sass, CSS-in-JS, or component-library dependency.

**Testing:**
- Node.js built-in test runner (`node:test`) - Foundation and source-contract tests in `tests/foundation.test.mjs`.
- Node.js strict assertions (`node:assert/strict`) - Assertions in `tests/foundation.test.mjs`.

**Build/Dev:**
- Next.js CLI 16.3.1 - `next dev`, `next build`, and `next start` scripts in `package.json`.
- TypeScript 6.0.x - Static checking via `tsc --noEmit`; project settings are in `tsconfig.json`.
- ESLint 9.39.x - Lint runner via `eslint .`; flat configuration is in `eslint.config.mjs`.
- `eslint-config-next` 16.3.1 - Next.js Core Web Vitals and TypeScript lint presets in `eslint.config.mjs`.
- SWC binaries supplied by Next.js - Platform-specific compilation dependencies are recorded in `package-lock.json`.

## Key Dependencies

**Critical:**
- `next` 16.3.1 - Owns routing, rendering, build output, metadata endpoints, scripts, links, and images across `src/app/` and `src/components/`.
- `react` 19.2.8 and `react-dom` 19.2.8 - Own component rendering and interactive form/truck-finder behavior.
- `zod` 4.4.3 - Builds and executes server-side lead schemas in `src/app/actions/leads.ts`.

**Infrastructure:**
- `@types/node` 26.2.0 - Node.js types used by the TypeScript toolchain.
- `@types/react` 19.2.18 and `@types/react-dom` 19.2.4 - React type declarations.
- No ORM, database driver, cloud SDK, CMS SDK, authentication SDK, email SDK, upload SDK, logging SDK, or test package is declared in `package.json`.

## Configuration

**Environment:**
- Environment variable names and their intended roles are documented in `README.md`; an `.env.example` file is present, but environment-file contents are not part of this audit.
- Set `NEXT_PUBLIC_SITE_URL` for production canonical URLs, Open Graph URLs, JSON-LD, sitemap, and robots behavior through `src/lib/site-url.ts`, `src/app/robots.ts`, and `src/app/sitemap.ts`.
- `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, and `NEXT_PUBLIC_META_PIXEL_ID` optionally enable browser marketing tags in `src/components/marketing/MarketingTags.tsx` and event dispatch in `src/lib/analytics.ts`.
- `LEAD_ROUTING_WEBHOOK_URL` enables server-side lead delivery in `src/lib/leads/router.ts`; without it the development adapter acknowledges but does not persist submissions.
- `ENABLE_UPLOADS` is documented as reserved in `README.md`; no source file consumes it and uploads remain disabled in `src/components/forms/LeadForm.tsx`.
- `.env` and `.env.local` are excluded by `.gitignore`; keep environment-specific values outside version control.

**Build:**
- `next.config.ts` enables React strict mode, disables the `X-Powered-By` header, and adds security-oriented response headers.
- `tsconfig.json` targets ES2017, uses bundler module resolution, enables strict/no-emit/incremental compilation, and maps `@/*` to `src/*`.
- `eslint.config.mjs` composes Next.js Core Web Vitals and TypeScript presets and ignores generated build outputs.
- `package.json` provides `dev`, `build`, `start`, `lint`, `typecheck`, `test`, and aggregate `check` commands.
- Generated Next.js and TypeScript artifacts live in `.next/`, `next-env.d.ts`, and `tsconfig.tsbuildinfo`; `.next/` and `*.tsbuildinfo` are ignored by `.gitignore`.

## Platform Requirements

**Development:**
- Use Node.js 20.9.0 or newer and npm as specified in `README.md`.
- Install from `package-lock.json` and run `npm run dev`; the default local origin is `http://localhost:3000` in `src/lib/site-url.ts`.
- Run `npm run check` to execute linting, strict type checking, native Node tests, and a production Next.js build as defined in `package.json`.
- Network access is required only when exercising configured external marketing scripts, official outbound links, or the lead webhook; normal repository content is stored under `src/content/` and `public/`.

**Production:**
- The documented deployment target is Vercel in `README.md`; no `vercel.json` is required or present.
- A production deployment requires an exact HTTPS `NEXT_PUBLIC_SITE_URL`; `src/app/robots.ts` disallows crawling when that variable is absent.
- Production form delivery requires an approved HTTPS endpoint in `LEAD_ROUTING_WEBHOOK_URL`; no leads are persisted locally by `src/lib/leads/router.ts`.
- Configure Preview and Production environment values separately in the hosting platform as directed by `README.md`.

---

*Stack analysis: 2026-08-18*
