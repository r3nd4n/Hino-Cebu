# Lead provider approval scorecard

This is a no-selection-until-approval worksheet for D-09 through D-12. It does not name candidates, choose a winner, or approve a production topology. The authoritative contract is the current revision of all five `GOV-LEAD-*` records in `src/content/governance/leads.ts`, including the stable `GOV-LEAD-SALES` record.

## Evidence rules

- **Responsible role:** central operations coordinates evaluation; the sales or aftersales lane owns its inquiry contract; the technical release owner verifies sandbox isolation and release evidence.
- Record a stable candidate code and opaque `EVID-*` references only. Do not record PII, credentials, signed URLs, provider endpoints, evidence bodies, people, or vendor secrets.
- Primary evidence must come from the candidate's authoritative contract or technical documentation. Marketing summaries do not pass a criterion.
- Sandbox proof must demonstrate the behavior with synthetic data in the protected non-production profile. A statement of capability is not proof.
- Each criterion is `pass`, `fail`, or `not-evaluated` in the external evidence record. No selection is allowed while any required criterion for any lead type lacks primary evidence and sandbox proof.

## D-09 — Durable acceptance

- **Responsible role:** central operations evaluates durability; each department lane confirms normalized inquiry completeness; the technical release owner validates the sandbox result.
- **Stable record reference:** each of the five `GOV-LEAD-*` records and its current revision.
- Prove complete normalized inquiry persistence before a success response, issuance of a stable reference, later reconciliation by that reference, and recovery after delivery failure.
- Capture the synthetic test case, outcome, and opaque primary-evidence and sandbox-proof references outside Git. A receipt that exists only in process memory, logs, or downstream delivery does not pass.

## D-10 — Ownership and reconciliation

- **Responsible role:** use `departmentOwnerLane` and `centralOperationsOwnerRef` from each authoritative record; the technical release owner confirms neither was replaced by prose.
- **Stable record reference:** all five `GOV-LEAD-*` records.
- Demonstrate department routing for every exact lead type and central operations visibility for routing, reconciliation, aging, and escalation.
- Leave opaque owner references pending until stakeholders approve them. Do not add names or contact details to this worksheet.

## D-11 — Failure and acknowledgement escalation

- **Responsible role:** the central operations owner handles routing failure; the typed department owner and backup handle an unacknowledged inquiry.
- **Stable record reference:** `escalationStages` and `responseWindow` in the applicable `GOV-LEAD-*` revision.
- Demonstrate immediate failure visibility, acknowledgement tracking, and escalation state changes with synthetic records.
- Evaluate timing only against the approved typed policy. A proposal value cannot pass and this worksheet must not create a numeric policy.

## D-12 — Equivalent secondary intake

- **Responsible role:** central operations evaluates recovery; the department lane approves operational use; the technical release owner verifies isolation and fail-closed behavior.
- **Stable record reference:** `secondaryIntake` in each current `GOV-LEAD-*` revision.
- Prove the secondary intake independently provides persistence, stable reference, reconciliation, recovery after delivery failure, retry/replay, and retention equivalent to the primary intake.
- Demonstrate that neither path emits optimistic success when durability cannot be confirmed, and that only approved retry and verified contact alternatives are presented.

## Candidate evaluation matrix

Complete this matrix in the approved external evidence system for every candidate and every lead type. Store only its opaque record reference in governance approvals.

| Required criterion | Primary evidence | Sandbox proof | Pass condition |
| --- | --- | --- | --- |
| Complete normalized inquiry persistence | Required | Required | Durable before acknowledgement |
| Stable reference | Required | Required | Returned and usable for lookup |
| Reconciliation | Required | Required | Accepted and delivered states reconcile |
| Recovery after delivery failure | Required | Required | Accepted inquiry remains recoverable |
| Retry/replay | Required | Required | Idempotent recovery is demonstrated |
| Retention | Required | Required | Matches an approved policy value |
| Routing and acknowledgement | Required | Required | Typed owners can observe required states |
| Secondary intake equivalence | Required | Required | Every durability capability is independently proven |

## Selection gate

Winner: pending

No selection may be recorded until all five GOV-LEAD-* records contain current two-tier approval, every required capability and policy is approved, the full matrix has primary evidence and sandbox proof, `node --test tests/governance.test.mjs tests/configuration.test.mjs` passes, and the protected-preview evidence is accepted by the technical release owner.
