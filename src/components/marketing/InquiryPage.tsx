import Image from "next/image";
import type { LeadType } from "@/lib/leads/types";
import type { EligibleClaim } from "@/lib/governance/eligibility";
import { LeadForm } from "@/components/forms/LeadForm";
import { Breadcrumbs, Container, PageHero, SectionHeading } from "@/components/ui/Shared";

export type InquiryContactAction = {
  actionId: string;
  kind: "phone" | "directions";
  label: string;
  href: string;
};

type InquiryPageProps = {
  type: LeadType;
  claims?: readonly EligibleClaim[];
  contactActions?: readonly InquiryContactAction[];
  defaults?: Record<string, string>;
  eyebrow?: string;
  title?: string;
  description?: string;
  formTitle?: string;
  submitLabel?: string;
  points?: string[];
  note?: string;
  image?: string;
  officialSummary?: string;
  officialPoints?: string[];
  sourceUrl?: string;
};

export function InquiryPage({ type, claims = [], contactActions = [], defaults, eyebrow, title, description, formTitle, submitLabel, points = [], note, image, officialSummary, officialPoints = [], sourceUrl }: InquiryPageProps) {
  const claim = (category: EligibleClaim["category"]) => claims.find((item) => item.category === category)?.value;
  const identity = claim("identity");
  const purpose = claim("purpose");
  const requestSemantics = claim("request-semantics");
  if (claims.length > 0) {
    if (!identity || !purpose || !requestSemantics || contactActions.length === 0) return null;
    return <><Container><Breadcrumbs items={[{ label: identity }]} /></Container><PageHero eyebrow="Inquiry" title={identity} description={purpose} /><section className="section"><Container className="split"><div><SectionHeading eyebrow="Request" title={requestSemantics} /><div className="hero-actions">{contactActions.map((action) => <a className="text-link" href={action.href} key={action.actionId}>{action.label}</a>)}</div></div><LeadForm type={type} title={requestSemantics} submitLabel={requestSemantics} contactActions={contactActions} defaults={defaults} /></Container></section></>;
  }

  if (!title || !description || !formTitle || !submitLabel || !eyebrow || !note) return null;

  return <><Container><Breadcrumbs items={[{ label: title }]} /></Container><PageHero eyebrow={eyebrow} title={title} description={description} />{image && officialSummary ? <section className="section alt"><Container className="split"><div className="official-image official-image-large"><Image src={image} alt="Official product information" fill sizes="(max-width: 720px) 100vw, 50vw" /></div><div><SectionHeading eyebrow="Source information" title={title} description={officialSummary} />{officialPoints.length > 0 ? <ul className="feature-list">{officialPoints.map((point) => <li key={point}>{point}</li>)}</ul> : null}{sourceUrl ? <a className="text-link" href={sourceUrl} target="_blank" rel="noreferrer">View source</a> : null}</div></Container></section> : null}<section className="section"><Container className="split"><div><SectionHeading eyebrow="Request" title={formTitle} />{points.length > 0 ? <ul className="feature-list">{points.map((point) => <li key={point}>{point}</li>)}</ul> : null}<div className="list-panel"><strong>Important</strong><p>{note}</p></div></div><LeadForm type={type} title={formTitle} submitLabel={submitLabel} defaults={defaults} /></Container></section></>;
}
