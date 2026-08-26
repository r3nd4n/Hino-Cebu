import { Phone } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/content/site";

import { Icon } from "../ui/Icon";

export function MobileActionBar() {
  return (
    <nav aria-label="Quick actions" className="mobile-action-bar">
      <a href={siteConfig.contact.phone.href}><Icon icon={Phone} size={18} />Call</a>
      <Link href="/#request-a-quote">Request a Quote</Link>
    </nav>
  );
}
