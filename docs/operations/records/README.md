# Operational record handling

Operational evidence lives in an approved external system. Git stores only typed governance state, stable IDs, opaque references, and these procedures. The authoritative schemas are in `src/lib/governance/schemas.ts`; do not create a parallel Markdown source of truth.

## Allowed repository references

- Current `GOV-*` record ID and revision.
- Existing claim, route, `OWNER-*`, `ALERT-*`, and `EVID-*` identifiers accepted by the authoritative schema.
- Non-secret configuration fingerprint and immutable release reference.
- Status values and dispositions already constrained by the typed record.

## Forbidden content

Do not record PII, customer submissions, personal names, contact details, credentials, tokens, signed URLs, provider endpoints, notification destinations, message payloads, evidence bodies, secrets, or confidential attachments. Do not name or select a provider, fill an unknown owner, or create a retry count, deadline, rollback trigger, threshold, retention period, or other numeric policy.

## Operator procedure

1. **Responsible role:** the lane named by the typed record prepares the update; the technical release owner reviews release-impacting changes.
2. Locate the stable record ID and current revision in `src/content/governance/`.
3. Store source material, sandbox output, acknowledgement proof, and approvals externally. Obtain an opaque reference that matches the typed schema.
4. Update only the authoritative typed record. Pending or proposal values stay non-operative until the required approvals and evidence exist.
5. Run `node --test tests/operations.test.mjs`, the relevant governance/configuration tests, and `npm run check`.
6. Review the diff for forbidden content, confirm the responsible lane and revision, and attach the commit and command result to the external record.

## Stable record lifecycle

- Never reuse an ID for a different subject.
- Increment the typed revision when an approved record changes; preserve links to the affected prior revision through schema-supported fields.
- Invalidate immediately when its source or operating condition changes, then execute D-08 in `../release-runbook.md`.
- Close alerts, emergency changes, and rollbacks only with opaque acknowledgement or closeout evidence.
- Reconcile configuration drift before the next ordinary release.
