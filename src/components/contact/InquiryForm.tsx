"use client";

import { type FormEvent, useRef, useState } from "react";

import { inquiryTopics, type InquiryTopic } from "@/content/inquiry";
import { siteConfig } from "@/content/site";
import {
  type InquiryDraft,
  type InquiryField,
  validateInquiryDraft,
} from "@/lib/inquiry-demo";

type InquiryStatus = "idle" | "loading" | "success" | "failure";
type InquiryErrors = Partial<Record<InquiryField, string>>;

const confirmationHeading = "Thank you for your interest in Hino Cebu.";
const immediateAssistance = "For immediate assistance, call (032) 346 3322.";
const safeFailureMessage =
  "We couldn't send your inquiry right now. Please try again or call Hino Cebu at (032) 346 3322.";

export function InquiryForm({ initialTopic }: { initialTopic: InquiryTopic }) {
  const [draft, setDraft] = useState<InquiryDraft>({
    originTopic: initialTopic,
    inquiryTopic: initialTopic,
    name: "",
    mobile: "",
    email: "",
    company: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<InquiryStatus>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  const isLoading = status === "loading";

  function updateDraft<K extends InquiryField>(field: K, value: InquiryDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const validation = validateInquiryDraft(draft);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      const firstInvalid = Object.keys(validation.errors)[0];
      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
          ?.focus();
      });
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      // Phase 4 replaces this local transition with secure server validation and delivery.
      window.setTimeout(() => {
        setStatus("success");
        window.requestAnimationFrame(() => confirmationRef.current?.focus());
      }, 300);
    } catch {
      setStatus("failure");
    }
  }

  if (status === "success") {
    return (
      <div aria-live="polite" className="inquiry-confirmation">
        <h2 ref={confirmationRef} tabIndex={-1}>{confirmationHeading}</h2>
        <p>{immediateAssistance}</p>
        <a className="button button--primary" href={siteConfig.contact.phone.href}>Call Hino Cebu</a>
      </div>
    );
  }

  return (
    <>
      {status === "failure" && (
        <p aria-live="assertive" className="form-message form-message--error">{safeFailureMessage}</p>
      )}
      <form noValidate onSubmit={submitInquiry} ref={formRef}>
        <InquirySelect
          error={errors.inquiryTopic}
          id="inquiry-topic"
          label="Inquiry about"
          name="inquiryTopic"
          onChange={(value) => updateDraft("inquiryTopic", value as InquiryTopic)}
          value={draft.inquiryTopic}
        >
          {Object.entries(inquiryTopics).map(([topic, label]) => (
            <option key={topic} value={topic}>{label}</option>
          ))}
        </InquirySelect>
        <InquiryTextField autoComplete="name" error={errors.name} id="inquiry-name" label="Full name" name="name" onChange={(value) => updateDraft("name", value)} value={draft.name} />
        <InquiryTextField autoComplete="tel" error={errors.mobile} id="inquiry-mobile" inputMode="tel" label="Mobile number" name="mobile" onChange={(value) => updateDraft("mobile", value)} type="tel" value={draft.mobile} />
        <InquiryTextField autoComplete="email" error={errors.email} id="inquiry-email" inputMode="email" label="Email address (optional)" name="email" onChange={(value) => updateDraft("email", value)} type="email" value={draft.email} />
        <InquiryTextField autoComplete="organization" error={errors.company} id="inquiry-company" label="Company or business (optional)" name="company" onChange={(value) => updateDraft("company", value)} value={draft.company} />
        <div className="quote-field">
          <label htmlFor="inquiry-message">Message or details (optional)</label>
          <textarea id="inquiry-message" name="message" onChange={(event) => updateDraft("message", event.target.value)} rows={5} value={draft.message} />
        </div>
        <div className="quote-field quote-field--consent">
          <input aria-describedby={errors.consent ? "inquiry-consent-error" : undefined} aria-invalid={Boolean(errors.consent)} checked={draft.consent} id="inquiry-consent" name="consent" onChange={(event) => updateDraft("consent", event.target.checked)} type="checkbox" />
          <label htmlFor="inquiry-consent">I agree to be contacted by Hino Cebu about my inquiry.</label>
          {errors.consent && <p className="field-error" id="inquiry-consent-error">{errors.consent}</p>}
        </div>
        <button className="button button--primary" disabled={isLoading} type="submit">
          {isLoading ? "Preparing your next step…" : "Request Information"}
        </button>
        <p aria-live="polite" className="form-message">{isLoading ? "Checking your details…" : ""}</p>
      </form>
    </>
  );
}

type TextFieldProps = {
  autoComplete?: string;
  error?: string;
  id: string;
  inputMode?: "email" | "tel" | "text";
  label: string;
  name: InquiryField;
  onChange: (value: string) => void;
  type?: "email" | "tel" | "text";
  value: string;
};

function InquiryTextField({ autoComplete, error, id, inputMode, label, name, onChange, type = "text", value }: TextFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="quote-field">
      <label htmlFor={id}>{label}</label>
      <input aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} autoComplete={autoComplete} id={id} inputMode={inputMode} name={name} onChange={(event) => onChange(event.target.value)} type={type} value={value} />
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  );
}

type SelectProps = {
  children: React.ReactNode;
  error?: string;
  id: string;
  label: string;
  name: InquiryField;
  onChange: (value: string) => void;
  value: string;
};

function InquirySelect({ children, error, id, label, name, onChange, value }: SelectProps) {
  const errorId = `${id}-error`;
  return (
    <div className="quote-field">
      <label htmlFor={id}>{label}</label>
      <select aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} id={id} name={name} onChange={(event) => onChange(event.target.value)} value={value}>{children}</select>
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  );
}
