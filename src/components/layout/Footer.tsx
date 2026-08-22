import Image from "next/image";
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

function SocialIcon({ platform }: Readonly<{ platform: PublicSocialProfile["platform"] }>) {
  if (platform === "facebook") {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M13.6 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.7 1.8-1.7h1.9V2.5c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.3H6.7V13h3.1v9h3.8Z" /></svg>;
  }
  if (platform === "youtube") {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" /></svg>;
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M7.3 2h9.4A5.3 5.3 0 0 1 22 7.3v9.4a5.3 5.3 0 0 1-5.3 5.3H7.3A5.3 5.3 0 0 1 2 16.7V7.3A5.3 5.3 0 0 1 7.3 2Zm-.2 2A3.1 3.1 0 0 0 4 7.1v9.8A3.1 3.1 0 0 0 7.1 20h9.8a3.1 3.1 0 0 0 3.1-3.1V7.1A3.1 3.1 0 0 0 16.9 4H7.1Zm10.2 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>;
}

export function Footer({ navigation, legalNavigation, socialProfiles, contactActions, branch }: FooterProps) {
  const customerPaths = navigation.filter(({ navigationId }) => ["trucks", "find-your-truck", "hino-cebu"].includes(navigationId));
  const supportPaths = navigation.filter(({ navigationId }) => ["parts", "service"].includes(navigationId));
  const quoteAction = navigation.find(({ navigationId }) => navigationId === "quote");
  const phoneAction = contactActions.find(({ kind }) => kind === "phone");
  const directionsAction = contactActions.find(({ kind }) => kind === "directions");
  const hasUnavailableSocials = socialProfiles.some(({ status }) => status !== "verified");

  return <footer className="site-footer">
    <div className="container footer-grid">
      <section className="footer-column footer-identity" aria-label="Hino Cebu branch details">
        <div className="footer-brand"><Image src="/images/official/hino-logo.png" alt="Hino" width={124} height={30} />{branch.identity ? <span>Cebu</span> : null}</div>
        {branch.address ? <address>{branch.address}</address> : null}
        {branch.hours ? <p>{branch.hours}</p> : null}
        {phoneAction ? <a href={phoneAction.href}>{branch.phone ?? phoneAction.label}</a> : null}
      </section>
      <section className="footer-column"><h2>Customer paths</h2>{customerPaths.map((item) => <Link href={item.href} key={item.navigationId}>{item.label}</Link>)}</section>
      <section className="footer-column"><h2>Support &amp; contact</h2>{supportPaths.map((item) => <Link href={item.href} key={item.navigationId}>{item.label}</Link>)}{phoneAction ? <a href={phoneAction.href}>{phoneAction.label}</a> : null}{directionsAction ? <a href={directionsAction.href}>Get Directions</a> : null}</section>
      <section className="footer-column footer-conversion">
        <h2>Connect</h2>
        {quoteAction ? <Link className="button footer-quote" href={quoteAction.href}>{quoteAction.label}</Link> : null}
        <div className="footer-socials" aria-label="Hino Cebu social profiles">
          {hasUnavailableSocials ? <><h3>Official Hino Cebu social profiles are being verified.</h3><p>Facebook, YouTube, and Instagram links will be added after their destinations are approved.</p></> : null}
          <div className="social-profile-list">{socialProfiles.map((profile) => profile.status === "verified"
            ? <a className="social-profile" href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile.label} (opens in a new tab)`} key={profile.platform}><SocialIcon platform={profile.platform} /><span className="sr-only">{profile.label}</span></a>
            : <span className="social-profile social-profile-unavailable" key={profile.platform}><SocialIcon platform={profile.platform} /><span className="sr-only">{profile.label} unavailable</span></span>)}</div>
        </div>
        {legalNavigation.length > 0 ? <nav className="footer-legal" aria-label="Legal">{legalNavigation.map((item) => <Link href={item.href} key={item.navigationId}>{item.label}</Link>)}</nav> : null}
      </section>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Hino Cebu. All rights reserved.</span></div>
  </footer>;
}
