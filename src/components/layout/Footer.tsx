import Link from "next/link";
import type { PublicSocialProfile } from "@/content/site";
import type { PublicShellLegalItem } from "@/lib/governance/public-shell";
import type { ShellContactAction, ShellNavigationItem } from "@/components/layout/Header";

type FooterProps = Readonly<{
  navigation: readonly ShellNavigationItem[];
  legalNavigation: readonly PublicShellLegalItem[];
  socialProfiles: readonly PublicSocialProfile[];
  contactActions: readonly ShellContactAction[];
  branch: Readonly<{ identity?: string; address?: string; phone?: string; hours?: string }>;
}>;

export function Footer({ navigation, contactActions, branch }: FooterProps) {
  return <footer className="site-footer">
    <div className="container footer-grid">
      {(branch.identity || branch.address) ? <div><div className="footer-brand">HINO {branch.identity ? <span>{branch.identity}</span> : null}</div>{branch.address ? <address>{branch.address}</address> : null}</div> : null}
      {navigation.length > 0 ? <div><h2>Explore</h2>{navigation.map((item) => <Link href={item.href} key={item.navigationId}>{item.label}</Link>)}</div> : null}
      {contactActions.length > 0 ? <div><h2>Contact</h2>{contactActions.map((action) => <a href={action.href} key={action.actionId}>{action.label}</a>)}</div> : null}
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()}. All rights reserved.</span></div>
  </footer>;
}
