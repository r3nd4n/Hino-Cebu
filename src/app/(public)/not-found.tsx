import Link from "next/link";
import { Container } from "@/components/ui/Shared";
import { getEligibleContactActions } from "@/content/site";
import { getEligibleRoutes } from "@/lib/governance/eligibility";

export default function PublicNotFound() {
  const recoveryRoutes = getEligibleRoutes().filter(({ status }) => status !== "withheld");
  const contactActions = getEligibleContactActions();

  return <section className="section"><Container><span className="eyebrow">404</span><h1>Page not found.</h1><p className="lead">Choose an available destination or contact option.</p><div className="hero-actions">{recoveryRoutes.map((route) => <Link className="button button-outline" href={route.path} key={route.routeId}>{route.routeId}</Link>)}{contactActions.map((action) => <a className="text-link" href={action.href} key={action.actionId}>{action.label}</a>)}</div></Container></section>;
}
