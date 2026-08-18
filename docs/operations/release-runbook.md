# Production release and recovery runbook

This runbook executes D-08 and D-13 through D-16 against the authoritative `GOV-RELEASE-AUTHORITY` and affected `GOV-*` records. Pending policy remains a blocker: never infer authority, timing, retry count, rollback threshold, or notification destination from this document.

## D-08 — Expiry and invalidation owner alert

- **Responsible role:** the technical release owner evaluates governance state; the lane in `responsibleLane` resolves the alert through the opaque `responsibleOwnerRef`.
- **Stable record reference:** affected `GOV-*` ID and revision, plus the deterministic `ALERT-*` record created by `createOwnerAlertForGovernanceChange`.
- Run the governance evaluation for the intended release time. When it returns `expired` or `invalidated`, immediately confirm the affected item is absent from active claims, listings, links, navigation, sitemap eligibility, and indexing.
- Create or reference the stable redacted alert record. Keep it provider-neutral: do not record PII, people, credentials, signed URLs, endpoints, evidence bodies, notification addresses, or alert payloads.
- Read `responsibleLane` and `responsibleOwnerRef` from the alert. An operator may use an operator-selected approved channel outside Git, but must not record that channel's address or payload.
- After an attempt, update only the schema-supported `attemptState`. On acknowledgement, record `acknowledgedAt` and an opaque `acknowledgementEvidenceReference`.
- If acknowledgement is not evidenced, retry the operator-selected approved channel or escalate according to the currently approved external policy, then record the explicit `retryEscalationDisposition`. Do not invent a retry count or timing threshold.
- Close only when the evidence reference proves acknowledgement and the disposition is `resolved`; content eligibility returns only through a new current approved revision. Retain redacted alert status for reconciliation.

## D-13 — Ordinary release authority

- **Responsible role:** the designated technical release owner performs manual promotion after responsible business lanes approve their records.
- **Stable record reference:** `GOV-RELEASE-AUTHORITY`, the approved `GOV-PRODUCTION-ESTATE`, and all affected `GOV-*` revisions.
- Follow **Ordinary protected-preview promotion** below. Do not promote when release authority or any required approval is pending, due, invalidated, or superseded.

## Ordinary protected-preview promotion

1. The technical release owner identifies the immutable candidate release and records its opaque reference outside Git.
2. Run `node --test tests/operations.test.mjs`, `node --test tests/governance.test.mjs tests/configuration.test.mjs`, and `npm run check` against that candidate.
3. Deploy only to the protected preview using preview-safe configuration. Confirm crawl remains blocked and production integrations are absent.
4. Reconcile the protected report against every affected typed record ID and current revision. Resolve all required blockers through their responsible lanes.
5. Confirm `GOV-RELEASE-AUTHORITY` and `GOV-PRODUCTION-ESTATE` are current and approved, then manually promote the exact reviewed candidate. Automation must not bypass this checkpoint.
6. Record the release reference, configuration fingerprint, approvals, command results, and promotion outcome as opaque external evidence.

## D-14 — Emergency authority

- **Responsible role:** only the technical release owner or technical release backup encoded by `GOV-RELEASE-AUTHORITY`; affected business owners are notification recipients through approved external channels.
- **Stable record reference:** `GOV-RELEASE-AUTHORITY`, affected `GOV-*` revisions, and the closeout record reference.
- Follow **Emergency change** only for a trigger allowed by the typed record and only to contain the immediate risk. If authority or trigger eligibility is unclear, stop and use ordinary promotion.

## Emergency change

1. The acting authorized role records the allowed trigger, affected release or configuration reference, and containment goal in the external closeout record.
2. Make the smallest reversible change that contains the risk; do not bundle product or content improvements.
3. Run every feasible gate before the change and the full `npm run check` immediately afterward.
4. Notify affected owners using approved external channels without placing addresses or message bodies in Git.
5. Open retrospective review and complete the D-16 closeout before the next ordinary release.

## D-15 — Immediate rollback authority

- **Responsible role:** the technical release owner or technical release backup encoded by `GOV-RELEASE-AUTHORITY`.
- **Stable record reference:** `GOV-RELEASE-AUTHORITY`, the affected deployment/configuration references, and the closeout record reference.
- Use only a trigger and threshold currently approved in the typed authority record. The checked-in thresholds are pending policy proposals and cannot authorize action.
- Choose **Deployment rollback**, **Configuration restoration**, or both according to the observed failure; record them as separate recovery actions.

## Deployment rollback

1. Freeze further promotion and identify the last release with passing gates and approved record revisions.
2. Roll back the deployed artifact through the approved hosting control under authorized operator access.
3. Verify availability, core journeys, indexing behavior, consent behavior, and lead durability without using real customer data.
4. Record the before/after release references, trigger evidence reference, result, and owner notifications in the external closeout record.

## Configuration restoration

1. Compare the active non-secret configuration fingerprint with the fingerprint recorded for the intended release.
2. Restore only the approved target-specific configuration through the controlled deployment environment; never copy secrets or values into Git or the closeout record.
3. Redeploy or restart only as required by the platform, then re-run configuration, crawl, lead-boundary, and full checks.
4. Record the restored fingerprint, affected configuration class, evidence reference, and result separately from deployment rollback.

## D-16 — Closeout and reconciliation

- **Responsible role:** the acting release owner or backup completes closeout; affected responsible lanes confirm impact and follow-up; the technical release owner owns the next-release gate.
- **Stable record reference:** `GOV-RELEASE-AUTHORITY`, all affected release/configuration references, `ALERT-*` records when applicable, and one opaque closeout evidence reference.
- Follow **Closeout** and **Next-release drift reconciliation gate** for every emergency change or rollback.

## Closeout

Record every field required by the authoritative typed `closeout.requiredFields`: trigger, authority, affected release/configuration, customer or lead impact, evidence, notifications, recovery result, follow-up owner, and configuration-drift reconciliation. Use opaque references and role identifiers only. Do not record PII, credentials, signed URLs, endpoints, evidence bodies, people, providers, or an invented numeric policy.

The acting role verifies recovery, assigns unresolved follow-up to an opaque owner reference, and obtains retrospective review. A restored service is not by itself a completed closeout.

## Next-release drift reconciliation gate

Before the next ordinary promotion, the technical release owner compares repository state, deployed artifact reference, non-secret configuration fingerprint, and current governance revisions. Every emergency-only code or configuration difference must be incorporated through review or removed. Mark `configuration-drift-reconciled` only with opaque evidence, rerun `npm run check`, and block promotion until the closeout record is complete.
