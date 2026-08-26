"use client";

import { type FormEvent, type Ref, type RefObject, type ReactNode, useRef, useState } from "react";

import { homepageContent } from "@/content/homepage";
import { siteConfig } from "@/content/site";
import { businessUses } from "@/content/trucks";
import { type QuoteDraft, type QuoteField, validateQuoteDraft } from "@/lib/quote-demo";

const initialDraft: QuoteDraft = {
  name: "",
  mobile: "",
  email: "",
  company: "",
  vehicleInterest: "",
  businessUse: "",
  estimatedUnits: "",
  consent: false,
};

type QuoteStatus = "idle" | "loading" | "success" | "failure";
type QuoteErrors = Partial<Record<QuoteField, string>>;

const confirmationHeading = "Thank you for your interest in Hino Cebu.";
const immediateAssistance = "For immediate assistance, call (032) 346 3322.";
const safeFailureMessage =
  "We couldn't send your inquiry right now. Please try again or call Hino Cebu at (032) 346 3322.";

export function HomepageQuoteExperience() {
  const [draft, setDraft] = useState<QuoteDraft>(initialDraft);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<QuoteStatus>("idle");
  const [businessUseAnnouncement, setBusinessUseAnnouncement] = useState("");
  const businessUseSelectRef = useRef<HTMLSelectElement>(null);

  function updateDraft<K extends QuoteField>(field: K, value: QuoteDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
  }

  function chooseBusinessUse(businessUse: string) {
    setDraft((current) => ({ ...current, businessUse: businessUse }));
    setErrors((current) => ({ ...current, businessUse: undefined }));
    setBusinessUseAnnouncement(`Business use set to ${businessUse}.`);
    setStatus("idle");

    document.getElementById("request-a-quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.requestAnimationFrame(() => businessUseSelectRef.current?.focus());
  }

  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const validation = validateQuoteDraft(draft);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      // Phase 2 intentionally performs no lead delivery. Phase 4 replaces this local state with the secure endpoint.
      window.setTimeout(() => setStatus("success"), 300);
    } catch {
      setStatus("failure");
    }
  }

  return (
    <>
      <section aria-labelledby="homepage-title" className="homepage-hero" id="homepage-hero">
        <div className="container homepage-hero__content">
          <div className="homepage-hero__story">
            <p className="eyebrow">{homepageContent.hero.eyebrow}</p>
            <h1 id="homepage-title">
              Built for business. <span>Ready for Cebu.</span>
            </h1>
            <p>{homepageContent.hero.description}</p>
            <div className="homepage-hero__actions">
              <a className="button button--primary" href="#request-a-quote">
                {homepageContent.hero.primaryAction}
              </a>
              <a className="button button--secondary" href="#trucks">
                {homepageContent.hero.secondaryAction}
              </a>
            </div>
          </div>
          <QuoteForm
            businessUseSelectRef={businessUseSelectRef}
            draft={draft}
            errors={errors}
            onSubmit={submitQuote}
            onUpdate={updateDraft}
            status={status}
          />
        </div>
        <ul aria-label="Hino Cebu support highlights" className="homepage-hero__trust">
          {homepageContent.hero.trustPoints.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>

      <section aria-labelledby="business-needs-title" className="homepage-business-needs">
        <div className="container">
          <p className="eyebrow">{homepageContent.businessNeeds.eyebrow}</p>
          <h2 id="business-needs-title">{homepageContent.businessNeeds.title}</h2>
          <div className="homepage-business-needs__grid">
            {homepageContent.businessNeeds.options.map((businessUse) => (
              <button className="homepage-business-needs__card" key={businessUse} onClick={() => chooseBusinessUse(businessUse)} type="button">
                <span>{businessUse}</span>
                <strong>Find my Hino <span aria-hidden="true">→</span></strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      <p aria-live="polite" className="sr-only">{businessUseAnnouncement}</p>
    </>
  );
}

type QuoteFormProps = {
  businessUseSelectRef: RefObject<HTMLSelectElement | null>;
  draft: QuoteDraft;
  errors: QuoteErrors;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: <K extends QuoteField>(field: K, value: QuoteDraft[K]) => void;
  status: QuoteStatus;
};

function QuoteForm({ businessUseSelectRef, draft, errors, onSubmit, onUpdate, status }: QuoteFormProps) {
  const isLoading = status === "loading";

  if (status === "success") {
    return (
      <section aria-live="polite" className="homepage-quote homepage-quote--confirmation" id="request-a-quote" tabIndex={-1}>
        <h2>{confirmationHeading}</h2>
        <p>{immediateAssistance}</p>
        <a className="button button--primary" href={siteConfig.contact.phone.href}>Call Hino Cebu</a>
      </section>
    );
  }

  return (
    <section className="homepage-quote" id="request-a-quote">
      <div className="homepage-quote__heading">
        <p className="eyebrow">Request a quote</p>
        <h2>Start with your business needs</h2>
      </div>
      {status === "failure" && <p aria-live="assertive" className="form-message form-message--error">{safeFailureMessage}</p>}
      <form noValidate onSubmit={onSubmit}>
        <QuoteTextField autoComplete="name" error={errors.name} id="quote-name" label="Full name" onChange={(value) => onUpdate("name", value)} value={draft.name} />
        <QuoteTextField autoComplete="tel" error={errors.mobile} id="quote-mobile" inputMode="tel" label="Mobile number" onChange={(value) => onUpdate("mobile", value)} type="tel" value={draft.mobile} />
        <QuoteTextField autoComplete="email" error={errors.email} id="quote-email" label="Email address" onChange={(value) => onUpdate("email", value)} type="email" value={draft.email} />
        <QuoteTextField autoComplete="organization" error={errors.company} id="quote-company" label="Company or business" onChange={(value) => onUpdate("company", value)} value={draft.company} />
        <QuoteSelect error={errors.vehicleInterest} id="quote-vehicle-interest" label="Vehicle interest" onChange={(value) => onUpdate("vehicleInterest", value)} value={draft.vehicleInterest}>
          <option value="">Select a vehicle interest</option>
          <option value="Not sure — recommend a Hino for me">Not sure — recommend a Hino for me</option>
          <option value="200 Series">200 Series</option>
          <option value="300 Series">300 Series</option>
          <option value="500 Series">500 Series</option>
          <option value="Bus & PUV">Bus & PUV</option>
        </QuoteSelect>
        <QuoteSelect error={errors.businessUse} id="quote-business-use" label="Business use" onChange={(value) => onUpdate("businessUse", value)} ref={businessUseSelectRef} value={draft.businessUse}>
          <option value="">Select your business use</option>
          {businessUses.map((businessUse) => <option key={businessUse} value={businessUse}>{businessUse}</option>)}
        </QuoteSelect>
        <QuoteSelect error={errors.estimatedUnits} id="quote-estimated-units" label="Estimated units" onChange={(value) => onUpdate("estimatedUnits", value)} value={draft.estimatedUnits}>
          <option value="">Select estimated units</option>
          <option value="1">1</option>
          <option value="2–5">2–5</option>
          <option value="6+">6+</option>
        </QuoteSelect>
        <div className="quote-field quote-field--consent">
          <input aria-describedby={errors.consent ? "quote-consent-error" : undefined} checked={draft.consent} id="quote-consent" onChange={(event) => onUpdate("consent", event.target.checked)} type="checkbox" />
          <label htmlFor="quote-consent">I agree to be contacted by Hino Cebu about my inquiry.</label>
          {errors.consent && <p className="field-error" id="quote-consent-error">{errors.consent}</p>}
        </div>
        <button className="button button--primary" disabled={isLoading} type="submit">
          {isLoading ? "Preparing your next step…" : siteConfig.primaryCta}
        </button>
        <p aria-live="polite" className="form-message">{isLoading ? "Checking your details…" : ""}</p>
      </form>
    </section>
  );
}

type QuoteTextFieldProps = {
  autoComplete?: string;
  error?: string;
  id: string;
  inputMode?: "email" | "tel" | "text";
  label: string;
  onChange: (value: string) => void;
  type?: "email" | "tel" | "text";
  value: string;
};

function QuoteTextField({ autoComplete, error, id, inputMode, label, onChange, type = "text", value }: QuoteTextFieldProps) {
  const errorId = `${id}-error`;
  return <div className="quote-field"><label htmlFor={id}>{label}</label><input aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} autoComplete={autoComplete} id={id} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} type={type} value={value} />{error && <p className="field-error" id={errorId}>{error}</p>}</div>;
}

type QuoteSelectProps = {
  children: ReactNode;
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
};

function QuoteSelect({ children, error, id, label, onChange, value, ref }: QuoteSelectProps & { ref?: Ref<HTMLSelectElement> }) {
  const errorId = `${id}-error`;
  return <div className="quote-field"><label htmlFor={id}>{label}</label><select aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} id={id} onChange={(event) => onChange(event.target.value)} ref={ref} value={value}>{children}</select>{error && <p className="field-error" id={errorId}>{error}</p>}</div>;
}
