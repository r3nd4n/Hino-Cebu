# Production decision operations

This guide turns approval decisions into reviewable operator actions. The authoritative typed governance records remain under `src/content/governance/`; this document never supplies an approval value. Every approval update must preserve its stable record ID and pass `npm run check` before it can enter a protected preview.

The principal operating records are `GOV-PRODUCTION-ESTATE`, `GOV-PRIVACY-CONTRACT`, the `GOV-LEAD-*` registry, and `GOV-RELEASE-AUTHORITY`. Operators must read their current typed revisions rather than copying values into this guide.

## Safety boundary

The responsible role writes only allow-listed status fields and opaque references. Do not record PII, people, credentials, signed URLs, provider endpoints, evidence bodies, or confidential source material in Git. Do not convert a pending or proposal value into an approved value without primary evidence and both approvals required by the schema. Do not invent a numeric policy, provider, owner, contact route, or deadline.

## D-01 — Two-tier approval

- **Responsible role:** the fixed department lane prepares its decision; the technical release owner supplies the independent release confirmation.
- **Stable record reference:** the affected `GOV-*` record and its current revision.
- Locate the typed record, verify its `responsibleLane`, and confirm the department decision is made by that lane.
- Record only an opaque `EVID-*` reference, the role, decision time, review time, and schema-supported invalidation fields.
- Treat the record as ineligible until both approval tiers are approved and current. Run `node --test tests/governance.test.mjs` after editing.

## D-02 — Fixed responsibility lanes

- **Responsible role:** the lane already named by `responsibleLane`; the technical release owner checks lane correctness.
- **Stable record reference:** the affected approval envelope inside its `GOV-*` record.
- Read the lane from the typed record rather than this guide. Reject reassignment through prose, an evidence note, or a release comment.
- If the required lane is unknown or contested, leave the decision pending and route the question outside Git for stakeholder resolution.

## D-03 — Approval evidence envelope

- **Responsible role:** the responsible lane records the decision metadata; the technical release owner validates its completeness.
- **Stable record reference:** the current `GOV-*` record revision and its opaque `EVID-*` reference.
- Verify the schema-required approval metadata is present and internally consistent.
- Confirm the evidence reference resolves in the approved external evidence system without copying its body into the repository.
- Reject personal names, signatures, contact details, credentials, signed URLs, endpoints, and evidence bodies from commits and review output.

## D-04 — Review and invalidation

- **Responsible role:** the responsible lane invalidates changed facts; the technical release owner enforces removal from eligibility.
- **Stable record reference:** the current `GOV-*` revision plus the replacement revision when one exists.
- Evaluate approvals at the release time. A due review, invalidation, or superseding revision makes the existing value ineligible immediately.
- Record only the schema-supported invalidation code and opaque evidence reference. Open the D-08 alert workflow in `release-runbook.md`.
- Require a new reviewed revision before restoring eligibility.

## D-05 — Fail-closed public behavior

- **Responsible role:** the content-owning lane maintains the claim; the technical release owner verifies selector output.
- **Stable record reference:** the claim `GOV-*` approval envelope and its stable claim or route ID.
- Run the eligibility tests and inspect the protected preview. Confirm pending, expired, invalidated, wrong-lane, or superseded values do not render.
- Preserve only an already-approved contact or request action when the minimum truth contract permits it. Never substitute provisional wording.

## D-06 — Protected review report

- **Responsible role:** the technical release owner controls protected review access; each listed lane resolves its blockers.
- **Stable record reference:** the blocked `GOV-*` record IDs and opaque `EVID-*` references shown by the report.
- Confirm protected preview uses the same public omission selectors as production.
- Use the protected report to reconcile IDs, lanes, revisions, and blockers. Do not paste withheld wording, evidence bodies, owner identities, or contact endpoints into tickets or release notes.

## D-07 — Minimum viable route truth

- **Responsible role:** the owning content lane approves route claims; the technical release owner validates route eligibility.
- **Stable record reference:** the route ID and the claim IDs named by the authoritative typed route registry.
- Check identity, purpose, request semantics, and contact action through the selector output.
- If any required category is ineligible, remove the route from public navigation, internal links, sitemap eligibility, and indexing. Reduced publication is permitted only when every required category remains eligible.
- Run `node --test tests/governance.test.mjs tests/configuration.test.mjs` and retain the command result in the external release evidence record.

## Decision update checkpoint

Before requesting promotion, the technical release owner confirms that the diff changes only the intended typed records, stable references remain unchanged unless a new revision requires them, and `npm run check` passes. Any unresolved business value remains pending.
