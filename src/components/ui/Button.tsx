import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonLinkProps = SharedButtonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClassName(variant, className)} type={type} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ children, className, href, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClassName(variant, className)} href={href} {...props}>
      {children}
    </Link>
  );
}

function buttonClassName(variant: ButtonVariant, className?: string) {
  return ["button", `button--${variant}`, className].filter(Boolean).join(" ");
}
