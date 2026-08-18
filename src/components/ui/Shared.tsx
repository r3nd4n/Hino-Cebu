import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) { return <div className={`container ${className}`}>{children}</div>; }

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return <section className="page-hero"><Container><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="lead">{description}</p>{children && <div className="hero-actions">{children}</div>}</Container></section>;
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

export function CtaBand({ title = "Ready to move your business forward?", description = "Tell Hino Cebu what your operation needs and start with a practical conversation.", href = "/quote", label = "Request a Quote" }) {
  return <section className="cta-band"><Container><div><h2>{title}</h2><p>{description}</p></div><Link className="button button-light" href={href}>{label}</Link></Container></section>;
}

export function JsonLd({ data }: { data: object }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />; }
