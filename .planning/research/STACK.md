# Stack Research

**Domain:** Production-ready local commercial-dealership lead-generation website (brownfield Next.js application)
**Researched:** 2026-08-18
**Confidence:** HIGH for framework/runtime/testing/hosting recommendations; MEDIUM for the final lead-delivery provider because the dealership has not approved a destination

## Recommendation in One Sentence

Keep the existing Next.js 16 / React 19 / TypeScript / Zod architecture, move the runtime baseline to Node.js 24 LTS, deploy on one-seat Vercel Pro, and add only the controls that close demonstrated launch risks: executable configuration validation, browser and unit tests, CI, free bot verification, consent-gated tags, structured PII-safe logging, and an operationally proven durable lead destination.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Incremental recurring cost | Confidence |
|------------|---------|---------|-----------------|----------------------------|------------|
| Next.js App Router | 16.3.1 (retain current) | Routing, server rendering, static generation, metadata, Server Actions, image optimization | The existing architecture uses these capabilities correctly. The npm registry identifies 16.3.1 as current on the research date; rewriting would add risk without addressing a production gap. | None beyond hosting | HIGH |
| React / React DOM | 19.2.8 (retain current) | Server and client UI | Already aligned with the installed Next.js release and current on the research date. Preserve small client islands. | None | HIGH |
| TypeScript | 6.0.2 (retain current) | Compile-time contracts | Existing strict typing is a sound foundation for configuration, content, and lead contracts. | None | HIGH |
| Zod | 4.4.3 (reuse existing) | Runtime validation for environment, content publication, and every inbound lead field | One dependency can validate the existing lead boundary, fail production builds on unsafe configuration, and enforce publishable-content evidence. Zod 4 supports HTTPS protocol checks, enums, strict objects, and environment-friendly string booleans. | None | HIGH |
| Node.js | **24.x LTS** | Build and Vercel Function runtime | Node 20 reached EOL on 2026-03-24 and no longer receives security fixes. Node 24 is LTS and Vercel's default supported LTS; declare `engines.node: "24.x"` and select 24.x in Vercel. | None | HIGH |
| Vercel Pro | Current Pro, one deploying seat | Commercial hosting, CDN, previews, Functions, TLS, firewall baseline, logs and observability | Vercel states Hobby is for personal/non-commercial use and Pro is for businesses. Pro is $20/month, includes one deploying seat, $20 usage credit, 1 TB transfer and 10M edge requests; configure spend alerts. | **$20/month base**, plus controlled overage | HIGH |
| Repository-managed TypeScript/JSON/Markdown | Existing | Approved site content | Keeps content typed, reviewable and near-zero cost. Add Zod-backed approval/source/review/expiry gates; do not introduce a CMS until editorial volume proves the need. | None | HIGH |

### Supporting Libraries and Services

| Library / service | Version | Purpose | When to Use | Incremental recurring cost | Confidence |
|-------------------|---------|---------|-------------|----------------------------|------------|
| Vitest | 4.1.10 | Execute TypeScript unit/integration tests for lead validation, routing, origin handling, publication rules, attribution, and truck-finder rules | Add now. Keep the existing source-contract tests temporarily, then migrate assertions toward behavior. Use Node environment; no DOM emulator is needed for pure domain code. | None | HIGH |
| `@vitest/coverage-v8` | 4.1.10 | Coverage reporting and focused thresholds | Add after critical behavior tests exist. Apply thresholds to revenue/security modules rather than chasing an arbitrary global percentage. | None | HIGH |
| Playwright Test | 1.62.1 | Production-build browser tests | Add now for all lead-form variants, mobile navigation, canonical/robots behavior under real configuration, analytics consent behavior, and high-intent journeys. Start with Chromium in PR CI; run Chromium + WebKit before release. | None; consumes CI minutes | HIGH |
| `@axe-core/playwright` | 4.13.0 | Automated accessibility checks inside real journeys | Run on representative pages and all form states. Axe is a regression net, not a replacement for keyboard and screen-reader UAT. | None | HIGH |
| Lighthouse CI | 0.15.1 | Repeatable performance, SEO and accessibility budgets | Run against a production build on release candidates or nightly, not every small PR if CI time becomes material. Fail stable asset/SEO budgets; warn first on noisy performance scores. | None; consumes CI minutes | HIGH |
| Cloudflare Turnstile | Free plan; hosted API | Bot proof for public lead forms | Add now alongside the honeypot and server validation. Validate every token server-side, use separate preview/production widgets, and fail closed in production. It works without moving DNS to Cloudflare. | $0; Free plan is explicitly suitable for SMB production use | HIGH |
| GitHub Actions | Hosted service | Independent release gate | If this repository is on GitHub, run `npm ci`, lint, typecheck, unit tests, build, Playwright and selected Lighthouse checks before production promotion. GitHub Free includes 2,000 private-repository minutes/month; public standard runners are free. Otherwise implement the same gate in the chosen Git host. | Usually $0 at this project's volume | HIGH |
| Dependabot alerts + weekly version updates | Hosted GitHub feature | Dependency hygiene | Enable alerts/security updates; group routine npm patch/minor updates weekly and require the full CI gate before merge. Do not auto-merge framework upgrades without tests. | $0 on GitHub | HIGH |
| Vercel Observability and Runtime Logs | Included platform capability | Deployment, traffic, function and webhook failure investigation | Use at launch before buying an error-tracking platform. Emit structured event objects with correlation/lead IDs, status, duration and error class; never log names, contact details, free text, VIN/plate, consent payloads, or raw attribution. Pro runtime-log retention is short, so route actionable failures to an owned alert channel. | Included baseline; do not buy Observability Plus initially | HIGH |
| GA4 + Google Tag Manager + Google Ads hooks | Existing optional integration | Marketing and conversion measurement | Use one tag-control path (prefer GTM), activate only approved tags, and keep lead PII out of events. Implement **basic consent mode** so tags do not load before the user's choice unless counsel approves another model. | Already-owned/free Google stack | HIGH |

### Configuration and Operational Controls (No New Package)

| Control | Prescriptive configuration | Business need | Recurring cost | Confidence |
|---------|---------------------------|---------------|----------------|------------|
| Executable environment schema | Create one server-only Zod schema. In production require an HTTPS, non-local `NEXT_PUBLIC_SITE_URL`; an approved HTTPS lead destination; Turnstile secret/site key; and valid configured marketing-ID formats. Parse once and make robots, sitemap, metadata, tags, and router consume the same result. Fail build/start on an unsafe production configuration. | Prevent indexable localhost metadata, silent non-delivery and malformed tag injection. | None | HIGH |
| Environment separation | Separate Development, Preview and Production values. Mark webhook and Turnstile secrets as Vercel Sensitive variables. Use test destinations and test Turnstile keys in preview. Remember that changed Vercel variables only apply to new deployments. | Prevent test leads entering live operations and secrets leaking into client code. | None | HIGH |
| Runtime alignment | Add `"engines": { "node": "24.x" }`; use Node 24 locally, in CI and in Vercel Project Settings. Use `npm ci` from the committed lockfile in CI. | Reproducible, supported builds and security updates. | None | HIGH |
| Function region | Keep static pages on the global CDN. Run lead-processing compute in `sin1` **only if the approved lead destination/data processor is in or near Southeast Asia**; otherwise co-locate compute with that destination. Vercel defaults Functions to `iad1`, so this must be an explicit deployment decision. | Lower form latency and avoid needless cross-region PII transit. | Normally within Pro usage | MEDIUM pending processor location |
| Lead acceptance contract | Keep `LeadRouter`. Add a short abort timeout, stable submission ID/idempotency key, bounded retry classification and structured result states. Return success only after the approved downstream endpoint confirms durable persistence. The receiving system must expose an auditable record and failure/reconciliation workflow. | No accepted inquiry can silently disappear. | Prefer already-owned CRM/Google Workspace/approved endpoint; provider cost TBD | HIGH on pattern; MEDIUM on provider |
| Lead recovery | Maintain a daily reconciliation view/report of accepted, delivered, failed and duplicate IDs at the destination. Alert immediately on delivery failures. If the approved destination cannot durably acknowledge and reconcile leads, **block launch** or separately approve a durable store/queue. | Commercial recoverability and attribution reconciliation. | None if destination already supplies it | HIGH |
| Abuse defense | Honeypot + minimum-fill-time signal + strict Zod schema + payload-size caps + Turnstile Siteverify. Add application/provider rate limiting only if abuse persists or the approved destination offers it; do not assume Enterprise-only managed WAF rules. | Protect staff workflow and downstream quotas without a database solely for rate limits. | $0 initially | HIGH |
| Security headers | Add a restrictive, vendor-specific CSP in `Content-Security-Policy-Report-Only`, test preview and production journeys, then enforce it. Prefer a static policy compatible with static generation; Next.js nonce CSP forces dynamic rendering. Add HSTS only after the final HTTPS domain and subdomain policy are approved. | XSS/clickjacking defense without turning static marketing pages into per-request renders. | None | HIGH |
| Consent storage | Implement a small first-party consent component and Google basic consent mode; store only the preference/version and support withdrawal. Do not buy a CMP until legal requirements or multi-jurisdiction traffic justify it. | Privacy-safe paid-media readiness. | None initially | MEDIUM pending legal decision |
| Preview protection | Enable Vercel Standard Deployment Protection with Vercel Authentication. Avoid the $150/month Advanced Deployment Protection add-on unless private production URLs or password sharing become a documented requirement. | Keep drafts, unapproved claims and test forms out of public previews. | Included standard protection | HIGH |
| Cost guardrail | Set Vercel spend notifications at a low approved threshold and assign a billing owner. Prefer notification/webhook over automatic production pause for a revenue site; a hard pause deliberately returns 503. Review usage monthly. | Avoid surprise spend without taking the lead channel offline. | None | HIGH |
| Availability check | At minimum, schedule an external HTTP check for `/`, `/quote`, and a non-PII health/readiness path, with email alerts and an owner. Use an already-owned monitor; if none exists, a scheduled GitHub Action is acceptable temporarily, then evaluate a commercial monitor based on incident history. | Detect downtime and configuration failures outside Vercel's request path. | $0 initially if using existing CI allocation | MEDIUM |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Existing ESLint 9 + `eslint-config-next` 16.3.1 | Static correctness and Core Web Vitals rules | Keep. Next.js 16 does not lint during `next build`, so lint must remain an explicit CI step. |
| Existing `tsc --noEmit` | Strict type gate | Keep before tests/build in CI. |
| Vercel preview deployments | Stakeholder and browser verification | Use environment-specific non-production lead routes and noindex behavior; protect with Vercel Authentication. |
| Browser DevTools + manual keyboard/screen-reader matrix | Accessibility and mobile conversion UAT | Required before launch; automated axe checks cannot prove WCAG 2.2 AA. |
| Search Console + Google Business Profile | Search/indexing and local presence operations | These are business launch tools, not npm dependencies. Verify ownership, sitemap, production canonical and directions URL. |

## Installation

Do not reinstall or replace the core application stack. Add only the test tooling:

```bash
# Unit/integration behavior and focused coverage
npm install -D vitest@4.1.10 @vitest/coverage-v8@4.1.10

# Browser journeys and automated accessibility
npm install -D @playwright/test@1.62.1 @axe-core/playwright@4.13.0
npx playwright install chromium

# Release-candidate performance/SEO budgets
npm install -D @lhci/cli@0.15.1
```

Turnstile can be integrated with its hosted script and server-side `fetch` to Siteverify; an additional React wrapper is unnecessary. Environment parsing should reuse the installed Zod package. Structured server logs should use the platform's native `console` transport with a small redaction/serialization helper; `pino` is unnecessary at this scale.

## Required CI / Release Gate

Run the following as separate, diagnosable jobs, with production deployment gated on completion:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. Vitest unit/integration suite, including all lead types and form variants
5. `npm run build` with an explicit safe test/preview environment
6. Start the production build and run Playwright critical journeys
7. Run axe on representative pages and every form error/success state
8. Run Lighthouse CI budgets on homepage, truck detail, service, quote and one campaign page
9. Require human approval for business identity, legal copy, routing destination, indexability and published claims before production promotion

Use Chromium for each PR to control CI minutes. Add WebKit to the release gate because iPhone/Safari traffic is commercially important; add Firefox when usage data or defects justify the extra minutes.

## Cost-Control Position

| Item | Launch decision | Expected recurring cost | Rationale |
|------|-----------------|-------------------------|-----------|
| Vercel Pro | **Buy / required** | $20/month base for one deploying seat; usage above allocations/credit is metered | Hobby is explicitly personal/non-commercial. This is the one justified infrastructure subscription. |
| Approved durable lead destination | **Required, provider pending** | $0 if an already-owned CRM/Workspace endpoint meets the acceptance contract; otherwise obtain explicit approval | Lead durability is a business requirement, not optional infrastructure polish. |
| Cloudflare Turnstile Free | **Use** | $0 | Appropriate for SMB production and avoids a paid rate-limit datastore at expected traffic. |
| GitHub Actions + Dependabot | **Use if repository is hosted on GitHub** | Usually $0 within 2,000 private minutes/month | Provides an independent release gate and security update workflow. |
| Vercel Web Analytics | **Do not enable initially** | Pro events are metered; Plus is $10/month | GA4/GTM hooks already exist. Avoid duplicate measurement and another client script. |
| Vercel Speed Insights | **Defer** | $10/project/month on Pro plus metered data points | Use Lighthouse CI and GA4/Next.js web-vitals reporting first. Buy only if field-performance diagnosis becomes a recurring need. |
| Observability Plus / external log SaaS | **Defer** | Vercel add-on is $10/month; alternatives vary | Included Vercel observability plus structured alerts is proportionate at launch. Revisit if short retention prevents incident diagnosis. |
| Paid CMP | **Defer pending counsel** | Varies | A small basic-consent implementation is enough technically; legal requirements may change this decision. |
| Paid database / CMS / blob storage | **Do not add** | Avoided | No current content or upload workflow justifies them. A durable store is allowed only if no approved downstream system can meet the lead acceptance contract. |

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vitest for domain/integration tests | Continue only with `node:test` | Keep `node:test` for simple repository checks, but it is not the preferred primary runner once tests need TypeScript module imports, mocks and coverage. |
| Playwright | Cypress | Use Cypress only if the team already has deep operational expertise and CI assets for it. Next.js officially documents both; Playwright gives one dependency for Chromium/WebKit/Firefox and production-like journeys. |
| Turnstile Free | hCaptcha/reCAPTCHA or distributed application rate limiter | Change only for an approved privacy/vendor requirement, accessibility evidence, or measured abuse that Turnstile plus validation does not control. |
| Downstream durable acknowledgement | Application-owned Postgres/outbox | Add an owned database only when no approved CRM/Workspace endpoint can provide durable receipt, audit, retention and deletion. This is a separate privacy/operations decision, not a convenience dependency. |
| Included Vercel observability | Sentry or Better Stack telemetry | Add when real incidents prove that one-day Pro runtime logs and current alerting cannot support diagnosis, and after approving PII scrubbing/processor terms. |
| Static CSP after report-only tuning | Request nonce CSP | Use nonces only if the approved threat model requires them and the business accepts dynamic rendering and increased function cost for affected routes. |
| Repository content | Headless CMS | Introduce a CMS adapter when non-developers publish frequently enough that code review/deploy becomes the bottleneck, with roles and approvals defined first. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Node.js 20 in production | It reached EOL on 2026-03-24 and no longer receives fixes. | Node.js 24.x LTS across local, CI and Vercel. |
| A framework/UI/CSS rewrite | It does not address any launch blocker and risks regressions in a sound server-first application. | Retain Next.js/React/plain CSS and harden boundaries. |
| A paid CMS, search service, chat widget, experimentation suite or media store | No measured workflow or revenue need yet; each adds cost, JavaScript, privacy surface and operational ownership. | Repository content, focused landing pages and manual measurement-led iteration. |
| Vercel Queues as the sole lead record | Queues is Beta, has at-least-once delivery, maximum 24-hour retention and no built-in dead-letter queue. It is transport, not a recoverable system of record. | Durable acknowledgement in the approved destination; consider a queue later only as a buffer with idempotent consumers and a durable record. |
| Blind synchronous webhook `fetch()` | Destination latency/outage becomes user failure; without a timeout it can hang, and without durable acknowledgement it can lose accepted leads. | Timeout + explicit result classes + destination persistence contract + reconciliation. |
| Multiple analytics SDKs | Duplicate events, conflicting consent, more client JavaScript and unclear attribution truth. | One GTM/GA4 control path with typed, PII-free events. |
| Sentry, Pino, Datadog or a log drain on day one | They add processors, configuration or recurring cost before baseline operational evidence exists. | PII-safe structured native logs, Vercel Observability and owned alerts; escalate on demonstrated retention/diagnostic need. |
| Enterprise WAF/managed rules as a launch dependency | Availability and entitlement vary by plan and managed protection is disproportionate to current traffic. | Turnstile, strict schemas, payload caps, honeypot/time signal and destination controls. |
| Nonce-based CSP across all routes by default | Next.js documents that nonce CSP requires dynamic rendering, sacrificing static optimization and increasing compute. | Tune a static vendor allowlist in report-only mode, then enforce. |
| Automatic Vercel hard pause at a low spend threshold | It intentionally makes the commercial site return 503 and can discard lead opportunity during a traffic spike. | Alerts and an accountable billing owner; pause only as an explicit incident response. |
| Direct production package auto-updates | Framework/security fixes can still introduce regressions. | Weekly grouped Dependabot PRs plus full CI and deliberate merge. |

## Stack Patterns by Variant

**If the approved CRM/Workspace endpoint durably persists and returns a stable record ID:**
- Keep the application stateless.
- Store only the destination record ID/correlation ID in PII-safe telemetry.
- Use a short timeout and idempotency key supported by the destination.
- This is the lowest-cost preferred launch pattern.

**If the approved endpoint is email-only, fire-and-forget, or cannot reconcile delivery:**
- Do not report the lead as safely accepted.
- Block production form launch until the business approves either a durable CRM endpoint or an application-owned encrypted store/outbox with retention and deletion rules.
- Do not disguise email delivery as durable persistence.

**If abuse remains low:**
- Use Turnstile + honeypot + timing signal + strict payload validation.
- Avoid a database/Redis dependency solely for rate limiting.

**If measured abuse becomes operationally material:**
- First apply a path-scoped Vercel Firewall rule if the subscribed plan exposes rate limiting and its cost is approved.
- Otherwise add a distributed limiter only after defining keys, thresholds, NAT/shared-IP behavior, privacy, fail-open/fail-closed behavior and cost ceiling.

**If repository content becomes an editorial bottleneck:**
- Preserve current content types and introduce a `ContentRepository` adapter.
- Select a CMS only after roles, approval workflow, preview, source evidence, expiry and audit needs are known.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.3.1 | React 19.2.8 / React DOM 19.2.8 | Existing installed/current combination; preserve together and upgrade through tested PRs. |
| Next.js 16.3.1 | Node.js >=20.9; **project target 24.x** | Framework minimum is not a security lifecycle recommendation. Node 20 is EOL; Node 24 is supported by Vercel and LTS. |
| TypeScript 6.0.2 | Next.js 16.3.1 | Next.js 16 requires TypeScript >=5.1; current project version satisfies it. |
| Vitest 4.1.10 | Node `^20 || ^22 || >=24`; project target 24.x | Current Vitest engine supports the recommended runtime. |
| `@vitest/coverage-v8` 4.1.10 | Vitest 4.1.10 | Keep exact versions aligned. |
| Playwright Test 1.62.1 | Node >=20; project target 24.x | Install browsers explicitly in CI; start with Chromium to control download/runtime. |
| `@axe-core/playwright` 4.13.0 | Playwright Core >=1 | Use inside Playwright tests; pin and update through CI. |
| Lighthouse CI 0.15.1 | Node/Chrome in CI | Run against a started production build; use stable assertions and budgets rather than brittle score perfection. |

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Preserve application framework and content architecture | HIGH | Repository inspection plus current Next.js documentation show the architecture already matches supported App Router production patterns. |
| Node 24 and Vercel Pro | HIGH | Node and Vercel primary sources explicitly establish lifecycle, support, commercial plan and price. |
| Vitest / Playwright / axe / Lighthouse CI | HIGH | Current npm versions and official framework/tool documentation were checked on the research date. |
| Turnstile | HIGH | Cloudflare documents the free plan for SMB production, independent hosting, and mandatory single-use server validation. |
| Lead-routing architecture | HIGH | The durability/timeout/idempotency pattern follows the observed failure mode; no provider should be selected without business approval. |
| Final lead provider and data location | MEDIUM | Destination, processor, retention, residency and operational owner remain unresolved stakeholder inputs. |
| Consent implementation | MEDIUM | Google documents technical consent mode, but the required legal behavior depends on approved counsel/privacy policy. |
| External uptime service | MEDIUM | An independent check is necessary; the organization’s already-owned monitoring tools are unknown. |

## Sources

### Primary framework and runtime sources (HIGH confidence)

- [Next.js installation requirements](https://nextjs.org/docs/app/getting-started/installation) — Next.js 16 runtime/type/lint facts.
- [Next.js testing guide](https://nextjs.org/docs/app/guides/testing) — official use of Vitest and Playwright; E2E preference for async Server Components.
- [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy) — CSP guidance and nonce/dynamic-rendering tradeoff.
- [Next.js production recommendations](https://nextjs.org/docs/app/guides/production-checklist) — build/start, images, scripts, accessibility, CSP and Lighthouse guidance.
- [Next.js analytics guide](https://nextjs.org/docs/app/guides/analytics) — built-in Web Vitals reporting path.
- [Node.js release schedule](https://nodejs.org/en/about/previous-releases) and [Node.js EOL policy](https://nodejs.org/en/about/eol) — Node 24 LTS and Node 20 EOL.
- [Vercel supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) — Node 24 default/support and `engines` override.
- Context7 `/vercel/next.js`, `/vitest-dev/vitest`, `/microsoft/playwright`, `/colinhacks/zod` — CSP, environment loading, coverage, browser CI, axe and Zod 4 validation topics, fetched 2026-08-18.
- npm registry metadata queried 2026-08-18 — Next 16.3.1, React 19.2.8, Zod 4.4.3, Vitest 4.1.10, Playwright 1.62.1, axe Playwright 4.13.0 and Lighthouse CI 0.15.1.

### Primary platform and operations sources (HIGH confidence)

- [Vercel pricing](https://vercel.com/pricing) and [Pro plan](https://vercel.com/docs/plans/pro-plan) — Hobby non-commercial positioning, $20 Pro base, included seat/credit/usage.
- [Vercel Spend Management](https://vercel.com/docs/spend-management) — alerts, webhooks and production-pause behavior.
- [Vercel environment variables](https://vercel.com/docs/environment-variables) and [Sensitive variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables) — environment scoping, redeploy behavior and unreadable secrets.
- [Vercel function regions](https://vercel.com/docs/functions/configuring-functions/region) and [global regions](https://vercel.com/docs/regions) — `iad1` default, `sin1` availability and co-location guidance.
- [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection) — included Standard Protection and paid advanced features.
- [Vercel Observability](https://vercel.com/docs/observability) — baseline availability and optional paid Plus tier.
- [Vercel Web Analytics pricing](https://vercel.com/docs/analytics/limits-and-pricing) and [Speed Insights pricing](https://vercel.com/docs/speed-insights/limits-and-pricing) — metering and $10/month Pro Speed Insights base.
- [Vercel Queues](https://vercel.com/docs/queues) — Beta status, at-least-once behavior, 24-hour retention and absence of built-in DLQ.
- [Cloudflare Turnstile plans](https://developers.cloudflare.com/turnstile/plans/) and [server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) — free SMB production plan, mandatory validation, five-minute single-use tokens.
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) — included minutes and public runner policy.
- [GitHub Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts) and [options reference](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference) — vulnerability alerts and scheduled grouped update configuration.
- [Google Consent Mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode) — basic mode blocks Google tags until interaction/consent.
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing) — axe integration pattern.
- [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md) — assertions and resource/performance budgets.

---
*Stack research for: Hino Cebu production readiness and near-term growth*
*Researched: 2026-08-18*
