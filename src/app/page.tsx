import { siteConfig } from "@/content/site";

export default function HomePage() {
  return (
    <main className="foundation-page" id="main-content" tabIndex={-1}>
      <div className="container foundation-page__content">
        <p className="eyebrow">{siteConfig.identity.displayName}</p>
        <h1>Built for business. Ready for Cebu.</h1>
        <p>
          The public website foundation is being prepared for local sales, parts, and service
          conversations.
        </p>
      </div>
    </main>
  );
}
