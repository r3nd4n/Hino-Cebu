import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { Container, PlaceholderVisual } from "@/components/ui/Shared";
import {
  getEligibleCampaignRoute,
  getEligibleCampaignRoutes,
} from "@/content/campaigns";
import { getEligibleContactActions } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getEligibleCampaignRoutes().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getEligibleCampaignRoute(slug);
  if (!campaign) return {};
  return createMetadata({
    title: `${campaign.title} | Hino Cebu`,
    description: campaign.summary,
    path: `/lp/${campaign.slug}`,
    noIndex: !campaign.index,
  });
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = getEligibleCampaignRoute(slug);
  if (!campaign) notFound();
  const contactActions = getEligibleContactActions();

  return <><section className="section dark"><Container className="split"><div><span className="eyebrow">{campaign.eyebrow}</span><h1>{campaign.title}</h1><p className="lead">{campaign.summary}</p>{campaign.benefits.length > 0 ? <ul className="feature-list">{campaign.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul> : null}</div><PlaceholderVisual label={campaign.eyebrow} tone="dark" /></Container></section><section className="section alt"><Container><LeadForm type={campaign.leadType} title="Request information" submitLabel="Send request" contactActions={contactActions} sourceCta={`campaign:${campaign.slug}`} compact defaults={{ modelInterest: campaign.modelInterest }} /></Container></section></>;
}
