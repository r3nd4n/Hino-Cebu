import type { PublicContact } from "@/content/site";

type ContactEmailProps = {
  email: PublicContact["email"];
};

export function ContactEmail({ email }: ContactEmailProps) {
  if (email.status === "approved") {
    return <a href={email.href}>{email.display}</a>;
  }

  return <p>Email: awaiting confirmation</p>;
}
