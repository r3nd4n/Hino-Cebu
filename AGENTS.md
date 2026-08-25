# Hino Cebu Website — Agent Guidance

Read `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and `.planning/STATE.md` before making implementation decisions.

- Preserve the conversion-first local Hino Cebu focus and exclude all visible promotions unless scope changes explicitly.
- Never fabricate vehicle specifications, dealer legal/contact details, product availability, or brand authorization.
- Keep business and product facts configurable and clearly mark unresolved launch inputs.
- Keep credentials server-only; validate, sanitize, rate-limit, and safely report lead submissions.
- Protect Google Sheets writes from formula injection.
- Verify responsive layouts at 390px, 768px, 1024px, and 1440px; run tests, lint, and build before declaring implementation complete.
