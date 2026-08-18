import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { campaigns } from "@/content/campaigns";
import { LeadForm } from "@/components/forms/LeadForm";
import { Container, PlaceholderVisual } from "@/components/ui/Shared";
import { createMetadata } from "@/lib/seo";
export function generateStaticParams() { return campaigns.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const campaign = campaigns.find((item) => item.slug === slug); if (!campaign) return {}; return createMetadata({ title: `${campaign.title} | Hino Cebu`, description: campaign.summary, path: `/lp/${slug}`, noIndex: !campaign.index }); }
export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const campaign = campaigns.find((item) => item.slug === slug); if (!campaign) notFound(); return <><section className="section dark"><Container className="split"><div><span className="eyebrow">{campaign.eyebrow}</span><h1>{campaign.title}</h1><p className="lead">{campaign.summary}</p><ul className="feature-list">{campaign.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></div><PlaceholderVisual label={campaign.eyebrow} tone="dark" /></Container></section><section className="section alt"><Container><LeadForm type={campaign.leadType} title="Request Hino Cebu follow-up" submitLabel="Send My Request" sourceCta={`campaign:${campaign.slug}`} compact defaults={{ modelInterest: campaign.modelInterest }} /></Container></section></>; }
