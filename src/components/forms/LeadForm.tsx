"use client";

import { useActionState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { initialLeadState, submitLead } from "@/app/actions/leads";
import { leadFields } from "@/lib/leads/fields";
import type { LeadType } from "@/lib/leads/types";
import { readAttribution } from "@/lib/attribution";
import { track, type AnalyticsEvent } from "@/lib/analytics";

const events: Record<LeadType, { start?: AnalyticsEvent; submitted: AnalyticsEvent }> = {
  sales: { start: "truck_quote_started", submitted: "truck_quote_submitted" },
  parts: { start: "parts_inquiry_started", submitted: "parts_inquiry_submitted" },
  service: { start: "service_request_started", submitted: "service_request_submitted" },
  fleet: { submitted: "fleet_inquiry_submitted" }, financing: { submitted: "financing_inquiry_submitted" },
};

export function LeadForm({ type, title, submitLabel, sourceCta, compact = false, defaults = {} }: { type: LeadType; title: string; submitLabel: string; sourceCta?: string; compact?: boolean; defaults?: Record<string, string> }) {
  const [state, action, pending] = useActionState(submitLead, initialLeadState);
  const started = useRef(false);
  const attributionRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  useEffect(() => { if (state.status === "success") { track(events[type].submitted, { lead_type: type, page: pathname }); if (sourceCta?.startsWith("campaign:")) track("campaign_lead_submitted", { lead_type: type, campaign: sourceCta.slice(9) }); } }, [state.status, type, pathname, sourceCta]);
  const fields = compact ? leadFields[type].filter((field) => ["name", "mobile", "email", "modelInterest", "businessUse", "notes"].includes(field.name)) : leadFields[type];
  return <div className={`form-shell ${compact ? "compact" : ""}`}>
    <h2>{title}</h2><p className="form-intro">Fields marked * are required. Submission is a request for follow-up, not a confirmed quotation, appointment, stock status, or financing approval.</p>
    <form action={action} noValidate onSubmit={() => { if (attributionRef.current) attributionRef.current.value = JSON.stringify(readAttribution()); }} onFocus={() => { if (attributionRef.current) attributionRef.current.value = JSON.stringify(readAttribution()); if (!started.current) { started.current = true; if (events[type].start) track(events[type].start!, { page: pathname }); } }}>
      <input type="hidden" name="leadType" value={type} /><input type="hidden" name="sourcePage" value={pathname} /><input type="hidden" name="sourceCta" value={sourceCta || "form"} /><input ref={attributionRef} type="hidden" name="attribution" defaultValue="{}" />
      <div className="honeypot" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="form-grid">{fields.map((field) => {
        const id = `${type}-${field.name}`; const error = state.errors?.[field.name];
        return <div className={field.type === "textarea" ? "field field-wide" : "field"} key={field.name}>
          <label htmlFor={id}>{field.label}{field.required && <span aria-hidden> *</span>}</label>
          {field.type === "select" ? <select id={id} name={field.name} defaultValue={defaults[field.name] || ""} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}><option value="">Select an option</option>{field.options?.map((o) => <option value={o.value} key={o.value}>{o.label}</option>)}</select> : field.type === "textarea" ? <textarea id={id} name={field.name} defaultValue={defaults[field.name]} rows={4} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} /> : <input id={id} name={field.name} type={field.type || "text"} defaultValue={defaults[field.name]} autoComplete={field.autocomplete} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />}
          {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
        </div>;
      })}</div>
      <div className="upload-note"><strong>Photo attachments are currently unavailable.</strong> Secure storage and privacy handling must be approved before uploads are enabled.</div>
      <label className="consent"><input type="checkbox" name="consent" aria-invalid={!!state.errors?.consent} /> <span>I consent to Hino Cebu using these details to respond to this inquiry. *</span></label>
      {state.errors?.consent && <span className="field-error">{state.errors.consent}</span>}
      {state.message && <div className={`form-status ${state.status}`} role="status">{state.message}</div>}
      <button className="button" disabled={pending}>{pending ? "Sending…" : submitLabel}</button>
    </form>
  </div>;
}
