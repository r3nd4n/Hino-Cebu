import type { ShellContactAction, ShellNavigationItem } from "@/components/layout/Header";
import { TrackedLink } from "@/components/marketing/TrackedLink";

type StickyMobileActionsProps = Readonly<{
  navigation: readonly ShellNavigationItem[];
  contactActions: readonly ShellContactAction[];
}>;

export function StickyMobileActions({ navigation, contactActions }: StickyMobileActionsProps) {
  return <nav className="mobile-actions" aria-label="Quick actions">
    {navigation.map((item) => <TrackedLink href={item.href} key={item.navigationId}>{item.label}</TrackedLink>)}
    {contactActions.map((action) => <TrackedLink href={action.href} event={action.kind === "phone" ? "phone_click" : "directions_click"} eventProperties={{ location: "mobile_bar" }} key={action.actionId}>{action.label}</TrackedLink>)}
  </nav>;
}
