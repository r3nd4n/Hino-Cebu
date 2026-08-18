# Phase 1: Production Contracts and Executable Configuration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-18
**Phase:** 1-production-contracts-and-executable-configuration
**Areas discussed:** Approval ownership, Missing information behavior, Lead operating contract, Release authority

---

## Approval Ownership

### Production approval model

| Option | Description | Selected |
|--------|-------------|----------|
| Two-tier ownership | Departments approve their facts; one release owner confirms completeness | ✓ |
| Single project owner | One person approves all business, legal, product, and operational items | |
| Joint sign-off | A standing group approves every change together | |

**User's choice:** Two-tier ownership

### Approval lanes

| Option | Description | Selected |
|--------|-------------|----------|
| Specialized lanes | Sales, aftersales, privacy/legal, brand/content, and technical release each own defined subjects | ✓ |
| Department heads | Department heads approve everything in their organizational area | |
| Release owner assigns reviewers | Reviewers are selected case by case | |

**User's choice:** Specialized lanes

### Approval evidence

| Option | Description | Selected |
|--------|-------------|----------|
| Repository register plus evidence links | Track status, roles, dates, and external authoritative references without sensitive material in Git | ✓ |
| Repository-only approval | A committed register change is the full approval | |
| External-only approval | Keep approval evidence entirely outside the repository | |

**User's choice:** Repository register plus evidence links

### Reapproval timing

| Option | Description | Selected |
|--------|-------------|----------|
| Review date plus change-triggered invalidation | Scheduled review and immediate invalidation on relevant changes | ✓ |
| Fixed annual review | Approval lasts until the annual audit | |
| Change-triggered only | Approval lasts indefinitely unless a change is reported | |

**User's choice:** Review date plus change-triggered invalidation

**Notes:** The user consistently selected the recommended fail-closed, role-based governance model.

---

## Missing Information Behavior

### Public production behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Omit and preserve the customer task | Hide unapproved facts and retain an honest contact/request action where useful | ✓ |
| Show Contact to confirm | Keep unresolved fields visible with confirmation language | |
| Show provisional information | Display a best-effort value with a disclaimer | |

**User's choice:** Omit and preserve the customer task

### Protected preview behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Production-like page plus review report | Preview mirrors production omission and provides separate protected diagnostics | ✓ |
| Inline reviewer labels | Preview inserts visible approval-status labels into pages | |
| Mirror production only | Preview offers no separate approval diagnostics | |

**User's choice:** Production-like page plus review report

### Incomplete route behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Gate by minimum viable truth | Publish reduced routes only when identity, purpose, request semantics, and contact are approved | ✓ |
| Always publish a basic shell | Keep every route live with generic content | |
| Hide any incomplete page | Withhold a route whenever any intended field is missing | |

**User's choice:** Gate by minimum viable truth

### Expired or invalid content

| Option | Description | Selected |
|--------|-------------|----------|
| Remove active eligibility and alert | Withdraw active surfaces immediately; retain a truthful expired URL only when useful | ✓ |
| Block the next deployment | Leave current production unchanged until review | |
| Alert for manual removal | Notify an owner but do not change eligibility automatically | |

**User's choice:** Automatically remove active eligibility and alert the owner

**Notes:** Developer placeholders and provisional production claims are explicitly rejected.

---

## Lead Operating Contract

### Meaning of request received

| Option | Description | Selected |
|--------|-------------|----------|
| Durable receipt issued | Persist normalized inquiry, return a stable reference, and support reconciliation/recovery | ✓ |
| Department destination accepted | Final department system receipt is enough | |
| Notification was sent | Successful email or webhook transmission is enough | |

**User's choice:** Durable receipt issued

### Operational ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Department owner plus central oversight | Sales/aftersales own response; central operations monitors delivery, aging, and escalation | ✓ |
| Central lead desk | One team receives and assigns every inquiry | |
| Departments only | Each department operates independently without cross-team monitoring | |

**User's choice:** Department owner plus central oversight

### Escalation model

| Option | Description | Selected |
|--------|-------------|----------|
| Two-stage escalation | Immediate technical failure alert, then owner/backup aging escalation | ✓ |
| Failure-only escalation | Alert only for technical delivery failure | |
| Fixed universal timer | Apply one deadline to every inquiry | |

**User's choice:** Two-stage escalation

### Intake outage behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Contract-equivalent failover, otherwise fail closed | Use approved durable secondary intake or present honest recovery | ✓ |
| Primary only | Fail immediately whenever primary intake is unavailable | |
| Accept optimistically | Confirm success before persistence and retry later | |

**User's choice:** Approved durable failover, otherwise fail closed

**Notes:** Provider selection remains open; any provider must satisfy the locked business contract.

---

## Release Authority

### Ordinary production promotion

| Option | Description | Selected |
|--------|-------------|----------|
| Manual promotion after two-lane approval | Protected preview passes technical and business/content gates before release-owner promotion | ✓ |
| Automatic on main | Merge to main deploys directly after CI | |
| Technical approval only | No separate business/content approval gate | |

**User's choice:** Manual promotion after two-lane approval

### Emergency authority

| Option | Description | Selected |
|--------|-------------|----------|
| Named release owner or backup only | Narrow containment authority with notification and retrospective review | ✓ |
| Any repository maintainer | Any maintainer can deploy an urgent fix | |
| Full joint approval | Emergency action waits for the ordinary gate | |

**User's choice:** Named release owner or backup only

### Rollback authority

| Option | Description | Selected |
|--------|-------------|----------|
| Immediate rollback on predefined triggers | Release owner acts on lead, privacy, indexing, security, journey, or availability thresholds | ✓ |
| Case-by-case approval | Every rollback waits for joint agreement | |
| Complete outages only | Rollback is limited to total site failure | |

**User's choice:** Immediate rollback on predefined triggers

### Emergency closeout

| Option | Description | Selected |
|--------|-------------|----------|
| Mandatory closeout | Record trigger, authority, release/configuration, impact, evidence, recovery, and follow-up; reconcile drift | ✓ |
| Short deployment note | Record only the change and actor | |
| No special process | Rely on Git and hosting history | |

**User's choice:** Mandatory closeout

**Notes:** Emergency authority is explicitly limited to risk containment and remains auditable.

---

## the agent's Discretion

- Exact schemas, file organization, review-report presentation, and implementation mechanics.
- Concrete thresholds and cadences may be proposed but require approval before becoming production policy.
- Provider candidates may be researched but not selected by assumption.

## Deferred Ideas

None — discussion stayed within Phase 1 scope.
