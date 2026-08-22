import Image from "next/image";
import Link from "next/link";
import { Children, type ReactNode } from "react";

export type EligibleHeroMedia = Readonly<{
  src: string;
  alt: string;
  sizes?: string;
}>;

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) { return <div className={`container ${className}`}>{children}</div>; }

export function PageHero({ eyebrow, title, description, media, variant = "light", children }: { eyebrow: string; title: string; description: string; media?: EligibleHeroMedia; variant?: "dark" | "light"; children?: ReactNode }) {
  const actions = Children.toArray(children).slice(0, 2);
  return <section className={`page-hero page-hero-${variant}`}><Container className={media ? "page-hero-grid" : ""}><div className="page-hero-copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="lead">{description}</p>{actions.length > 0 ? <div className="hero-actions">{actions}</div> : null}</div>{media ? <div className="page-hero-media"><Image src={media.src} alt={media.alt} fill sizes={media.sizes ?? "(max-width: 719px) 100vw, 50vw"} /></div> : null}</Container></section>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="section-heading">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export function PlaceholderVisual({ label, tone = "light" }: { label: string; tone?: "light" | "dark" }) {
  return <div className={`placeholder-visual ${tone}`} role="img" aria-label={`${label} photography placeholder`}><span className="placeholder-road" /><span className="placeholder-truck"><i /><b /></span><strong>{label}</strong><small>Approved photography to be added</small></div>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((item, i) => <li key={item.label}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}{i < items.length - 1 && <span aria-hidden> / </span>}</li>)}</ol></nav>;
}

export function CtaBand({ title = "Ready to move your business forward?", description = "Tell Hino Cebu what your operation needs and start with a practical conversation.", href = "/quote", label = "Get a Quote" }) {
  return <section className="cta-band"><Container><div><h2>{title}</h2><p>{description}</p></div><Link className="button button-light" href={href}>{label}</Link></Container></section>;
}

export function JsonLd({ data }: { data: object }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />; }
