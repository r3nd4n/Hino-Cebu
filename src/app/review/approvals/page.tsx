import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReviewReport } from "@/lib/governance/report";
import { getDeploymentTarget } from "@/lib/runtime-config";

export const metadata: Metadata = {
  title: "Production approval review",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

type ReviewReport = ReturnType<typeof getReviewReport>;
type ApprovalRecord = ReviewReport["approvalGroups"][number]["records"][number];
type RouteRecord = ReviewReport["routes"][number];
type EnvironmentRecord = ReviewReport["environments"][number];
type BlockerRecord = ReviewReport["blockers"][number];

const approvalStatusLabels = {
  approved: "Approved / current",
  pending: "Pending approval",
  expired: "Expired",
  invalidated: "Invalidated",
} as const;

const routeStatusLabels = {
  eligible: "Eligible",
  "eligible-reduced": "Eligible in reduced form",
  withheld: "Withheld",
} as const;

const evidenceStatusLabels: Record<string, string> = {
  Present: "Present",
  Missing: "Evidence missing",
  "Broken shape": "Broken shape",
  "Review required": "Review required",
};

function displayDate(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function StatusLabel({ status, tone = "neutral" }: { status: string; tone?: string }) {
  return <span className={`status-label status-${tone}`}><span aria-hidden="true" className="status-dot" />{status}</span>;
}

function Definition({ term, children }: { term: string; children: React.ReactNode }) {
  return <><dt>{term}</dt><dd>{children}</dd></>;
}

function ApprovalCard({ record, lane }: { record: ApprovalRecord; lane: string }) {
  const status = approvalStatusLabels[record.status];
  return <dl className="report-mobile-card">
    <Definition term="Record"><span className="report-record-id">{record.recordId}</span> · {record.label}</Definition>
    <Definition term="Status"><StatusLabel status={status} tone={record.status} /></Definition>
    <Definition term="Owner lane">{lane}</Definition>
    <Definition term="Approver role">{record.approverRole ?? "Not recorded"}</Definition>
    <Definition term="Approved"><time dateTime={record.approvedAt ?? undefined}>{displayDate(record.approvedAt)}</time></Definition>
    <Definition term="Next review / expiry"><time dateTime={record.reviewAt ?? undefined}>{displayDate(record.reviewAt)}</time></Definition>
    <Definition term="Evidence">{evidenceStatusLabels[record.evidenceStatus] ?? record.evidenceStatus}{record.evidenceReference ? <> · <span className="report-record-id">{record.evidenceReference}</span></> : null}</Definition>
    <Definition term="Affected surfaces">{record.affectedSurfaces.join(", ") || "None registered"}</Definition>
    <Definition term="Next action">{record.nextAction}</Definition>
  </dl>;
}

function failingRouteChecks(route: RouteRecord) {
  const checks = [
    ["identity", route.checks.identity],
    ["purpose", route.checks.purpose],
    ["request semantics", route.checks.requestSemantics],
    ["contact action", route.checks.contactAction],
  ] as const;
  const missing = checks.filter(([, passes]) => !passes).map(([label]) => label);
  return missing.length > 0 ? `Resolve missing ${missing.join(", ")}.` : "All minimum-viable-truth checks pass.";
}

function RouteChecks({ route }: { route: RouteRecord }) {
  return <ul className="report-check-list">
    <li>Identity: {route.checks.identity ? "Pass" : "Fail"}</li>
    <li>Purpose: {route.checks.purpose ? "Pass" : "Fail"}</li>
    <li>Request semantics: {route.checks.requestSemantics ? "Pass" : "Fail"}</li>
    <li>Contact action: {route.checks.contactAction ? "Pass" : "Fail"}</li>
  </ul>;
}

function RouteCard({ route }: { route: RouteRecord }) {
  return <dl className="report-mobile-card">
    <Definition term="Route"><span className="report-record-id">{route.routeId}</span> · {route.path}</Definition>
    <Definition term="Status"><StatusLabel status={routeStatusLabels[route.status]} tone={route.status} /></Definition>
    <Definition term="Truth checks"><RouteChecks route={route} /></Definition>
    <Definition term="Retained categories">{route.retainedCategories.join(", ") || "None"}</Definition>
    <Definition term="Withheld categories">{route.withheldCategories.join(", ") || "None"}</Definition>
    <Definition term="Reason / next action">{failingRouteChecks(route)}{route.serveUnavailablePage ? " A truthful unavailable page may remain." : ""}</Definition>
  </dl>;
}

function isolationLabel(result: EnvironmentRecord["result"]) {
  if (result === "pass") return "Isolation passed";
  if (result === "block") return "Isolation blocked";
  return "Not evaluated";
}

function EnvironmentCard({ environment }: { environment: EnvironmentRecord }) {
  return <dl className="report-mobile-card">
    <Definition term="Deployment target">{environment.label}</Definition>
    <Definition term="Result"><StatusLabel status={isolationLabel(environment.result)} tone={environment.result} /></Definition>
    <Definition term="Origin class">{environment.originClass}</Definition>
    <Definition term="Lead profile class">{environment.leadProfileClass}</Definition>
    <Definition term="Analytics profile class">{environment.analyticsProfileClass}</Definition>
    <Definition term="Crawl policy">{environment.crawlPolicy}</Definition>
    <Definition term="Review report">{environment.reviewReportAvailability}</Definition>
  </dl>;
}

export default function ApprovalReviewPage() {
  if (getDeploymentTarget() === "production") notFound();
  const report = getReviewReport();
  const blockerGroups = report.blockers.reduce((groups, blocker) => {
    const group = groups.get(blocker.blockerCode);
    if (group) group.push(blocker);
    else groups.set(blocker.blockerCode, [blocker]);
    return groups;
  }, new Map<string, BlockerRecord[]>());
  const blocked = report.summary.overall === "Production blocked";
  const summaryCopy = blocked
    ? "Production blocked — resolve every listed blocker and record the required approval evidence before promotion."
    : "Ready for release-owner review — automated contract checks passed; final human approval is still required.";

  return <main id="main-content" className="approval-report">
    <header className="report-header">
      <div className="container">
        <span className="report-eyebrow">Protected preview</span>
        <h1>Production approval review</h1>
        {report.generationError ? <div className="report-generation-error"><h2>Approval report unavailable</h2><p>Approval report unavailable. Do not promote this deployment. Re-run the governance and configuration checks, then ask the technical release owner to review the failure.</p><p>Policy code: <span className="report-record-id">{report.generationError.code}</span>{report.generationError.key ? <> · Safe variable: <span className="report-record-id">{report.generationError.key}</span></> : null}</p></div> : null}
        <p className="report-intro">Review redacted approval, evidence, route eligibility, and environment-isolation status before this deployment can be considered for production promotion.</p>
        <dl className="report-header-meta">
          <Definition term="Generated"><time dateTime={report.header.generatedAt}>{displayDate(report.header.generatedAt)}</time></Definition>
          <Definition term="Deployment target">{report.header.deploymentTarget}</Definition>
          {report.header.configurationReference ? <Definition term="Configuration reference"><span className="report-record-id">{report.header.configurationReference}</span></Definition> : null}
        </dl>
        <nav aria-label="Report sections" className="report-section-nav">
          <a className="report-section-link" href="#readiness-summary">Review readiness summary</a>
          <a className="report-section-link report-section-link-primary" href="#production-blockers">Review production blockers</a>
          <a className="report-section-link" href="#approvals-evidence">Review approvals and evidence</a>
          <a className="report-section-link" href="#route-eligibility">Review route eligibility</a>
          <a className="report-section-link" href="#environment-isolation">Review environment isolation</a>
          <a className="report-section-link" href="#report-limitations">Review report limitations</a>
        </nav>
      </div>
    </header>

    <div className="container report-content">
      <section id="readiness-summary" className="report-section">
        <h2>Readiness summary</h2>
        <p className={blocked ? "report-blocked-summary" : "report-summary-copy"}>{summaryCopy}</p>
        <div className="review-summary">
          <article><span>Overall status</span><strong>{report.summary.overall}</strong><p>Final promotion always requires release-owner review.</p></article>
          <article><span>Production blockers</span><strong>{report.summary.blockerCount}</strong><p>Every blocker must be resolved before promotion.</p></article>
          <article><span>Missing approvals</span><strong>{report.summary.missingApprovalCount}</strong><p>Pending approval records without current evidence.</p></article>
          <article><span>Review due / expired</span><strong>{report.summary.dueExpiredCount}</strong><p>Review due, Expired, or Invalidated records.</p></article>
          <article><span>Ineligible routes</span><strong>{report.summary.ineligibleRouteCount}</strong><p>Governed routes currently marked Withheld.</p></article>
          <article><span>Environment isolation</span><strong>{report.summary.environmentIsolation === "Pass" ? "Isolation passed" : "Isolation blocked"}</strong><p>Classification-only environment safety result.</p></article>
        </div>
      </section>

      <section id="production-blockers" className="report-section">
        <h2>Production blockers</h2>
        {report.blockers.length === 0 ? <div className="report-empty"><h3>No production blockers found</h3><p>Automated checks found no unresolved blockers in this report. The release owner must still verify external evidence and complete the promotion checklist.</p></div> : [...blockerGroups].map(([code, blockers]) => <div className="report-blocker-group" key={code}><h3>{code}</h3><ul className="report-blocker-list">{blockers.map((blocker) => <li key={`${blocker.blockerCode}:${blocker.recordId}`}><strong>{blocker.label}</strong><dl><Definition term="Affected surface">{blocker.affectedSurface}</Definition><Definition term="Responsible lane">{blocker.responsibleLane}</Definition><Definition term="Evidence">{evidenceStatusLabels[blocker.evidenceStatus] ?? blocker.evidenceStatus}</Definition><Definition term="Next required action">{blocker.nextAction}</Definition></dl></li>)}</ul></div>)}
      </section>

      <section id="approvals-evidence" className="report-section">
        <h2>Approvals and evidence</h2>
        {report.approvalGroups.map((group) => <section className="report-approval-group" key={group.lane}><h3>{group.label} <span>({group.records.length})</span></h3>{group.records.length === 0 ? <p>No governed records are registered for this approval lane. Confirm that this is intentional before release review.</p> : <><div className="report-table-wrap"><table><caption>{group.label} approval records</caption><thead><tr><th scope="col">Record</th><th scope="col">Status</th><th scope="col">Approver role</th><th scope="col">Dates</th><th scope="col">Evidence</th><th scope="col">Affected surfaces and next action</th></tr></thead><tbody>{group.records.map((record) => <tr key={record.recordId}><th scope="row"><span className="report-record-id">{record.recordId}</span><span>{record.label}</span></th><td><StatusLabel status={approvalStatusLabels[record.status]} tone={record.status} /></td><td>{record.approverRole ?? "Not recorded"}</td><td>Approved: <time dateTime={record.approvedAt ?? undefined}>{displayDate(record.approvedAt)}</time><br />Next review / expiry: <time dateTime={record.reviewAt ?? undefined}>{displayDate(record.reviewAt)}</time></td><td>{evidenceStatusLabels[record.evidenceStatus] ?? record.evidenceStatus}{record.evidenceReference ? <><br /><span className="report-record-id">{record.evidenceReference}</span></> : null}</td><td>{record.affectedSurfaces.join(", ") || "None registered"}<br />{record.nextAction}</td></tr>)}</tbody></table></div><div className="report-mobile-cards">{group.records.map((record) => <ApprovalCard key={record.recordId} record={record} lane={group.label} />)}</div></>}</section>)}
        <div className="report-owner-alerts"><h3>Owner alerts</h3>{report.ownerAlerts.length === 0 ? <p>No expiry or invalidation owner alerts are active.</p> : <ul>{report.ownerAlerts.map((alert) => <li key={alert.alertId}><strong><span className="report-record-id">{alert.governedRecordId}</span> · {alert.triggerCode}</strong><dl><Definition term="Owner lane">{alert.responsibleLane}</Definition><Definition term="Opaque owner reference"><span className="report-record-id">{alert.responsibleOwnerRef}</span></Definition><Definition term="Alert status">{alert.status}</Definition><Definition term="Acknowledgement">{alert.acknowledgementStatus}</Definition><Definition term="Acknowledgement evidence">{alert.acknowledgementEvidenceStatus}{alert.acknowledgementEvidenceReference ? <> · <span className="report-record-id">{alert.acknowledgementEvidenceReference}</span></> : null}</Definition><Definition term="Attempt state">{alert.attemptState}</Definition><Definition term="Retry / escalation disposition">{alert.retryEscalationDisposition}</Definition></dl></li>)}</ul>}</div>
      </section>

      <section id="route-eligibility" className="report-section">
        <h2>Route eligibility</h2>
        <div className="report-table-wrap"><table><caption>Governed route eligibility and minimum-viable-truth checks</caption><thead><tr><th scope="col">Route</th><th scope="col">Status</th><th scope="col">Truth checks</th><th scope="col">Retained / withheld</th><th scope="col">Reason / next action</th></tr></thead><tbody>{report.routes.map((route) => <tr key={route.routeId}><th scope="row"><span className="report-record-id">{route.routeId}</span><span>{route.path}</span></th><td><StatusLabel status={routeStatusLabels[route.status]} tone={route.status} /></td><td><RouteChecks route={route} /></td><td>Retained: {route.retainedCategories.join(", ") || "None"}<br />Withheld: {route.withheldCategories.join(", ") || "None"}</td><td>{failingRouteChecks(route)}{route.serveUnavailablePage ? " A truthful unavailable page may remain." : ""}</td></tr>)}</tbody></table></div>
        <div className="report-mobile-cards">{report.routes.map((route) => <RouteCard key={route.routeId} route={route} />)}</div>
      </section>

      <section id="environment-isolation" className="report-section">
        <h2>Environment isolation</h2>
        <div className="report-table-wrap"><table><caption>Deployment-target isolation classifications</caption><thead><tr><th scope="col">Target</th><th scope="col">Origin class</th><th scope="col">Lead profile</th><th scope="col">Analytics profile</th><th scope="col">Crawl policy</th><th scope="col">Review report</th><th scope="col">Result</th></tr></thead><tbody>{report.environments.map((environment) => <tr key={environment.target}><th scope="row">{environment.label}</th><td>{environment.originClass}</td><td>{environment.leadProfileClass}</td><td>{environment.analyticsProfileClass}</td><td>{environment.crawlPolicy}</td><td>{environment.reviewReportAvailability}</td><td><StatusLabel status={isolationLabel(environment.result)} tone={environment.result} /></td></tr>)}</tbody></table></div>
        <div className="report-mobile-cards">{report.environments.map((environment) => <EnvironmentCard key={environment.target} environment={environment} />)}</div>
      </section>

      <section id="report-limitations" className="report-section">
        <h2>Report limitations</h2>
        <p>{report.limitations}</p>
        <p>Automated checks do not establish evidence authority, grant document access, or replace final stakeholder and release-owner approval.</p>
      </section>
    </div>
  </main>;
}
