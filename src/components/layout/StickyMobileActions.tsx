import type { CSSProperties } from "react";
import type { ShellContactAction, ShellNavigationItem } from "@/components/layout/Header";
import { TrackedLink } from "@/components/marketing/TrackedLink";

type StickyMobileActionsProps = Readonly<{
  navigation: readonly ShellNavigationItem[];
  contactActions: readonly ShellContactAction[];
}>;

export function StickyMobileActions({ navigation, contactActions }: StickyMobileActionsProps) {
  const phoneAction = contactActions.find(({ kind }) => kind === "phone");
  const quoteAction = navigation.find(({ navigationId }) => navigationId === "quote");
  const directionsAction = contactActions.find(({ kind }) => kind === "directions");
  const actions = [
    phoneAction ? { id: phoneAction.actionId, label: "Call Hino Cebu", href: phoneAction.href, event: "phone_click" as const } : null,
    quoteAction ? { id: quoteAction.navigationId, label: "Get a Quote", href: quoteAction.href } : null,
    directionsAction ? { id: directionsAction.actionId, label: "Get Directions", href: directionsAction.href, event: "directions_click" as const } : null,
  ].filter((action): action is NonNullable<typeof action> => action !== null).slice(0, 3);
  const style = { "--mobile-action-count": actions.length } as CSSProperties;

  if (actions.length === 0) return null;

  return <nav className="mobile-actions" aria-label="Quick actions" style={style}>
    {actions.map((action) => <TrackedLink className={action.id === quoteAction?.navigationId ? "mobile-action-primary" : undefined} href={action.href} event={action.event} eventProperties={{ location: "mobile_bar" }} key={action.id}>{action.label}</TrackedLink>)}
  </nav>;
}
