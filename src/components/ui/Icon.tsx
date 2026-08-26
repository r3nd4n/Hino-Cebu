import type { LucideIcon, LucideProps } from "lucide-react";

type IconProps = LucideProps & {
  icon: LucideIcon;
  label?: string;
};

/** Renders the project-wide Lucide outline icon treatment. */
export function Icon({ icon: IconComponent, label, ...props }: IconProps) {
  const accessibleProps = label
    ? { "aria-label": label, role: "img" as const }
    : { "aria-hidden": true };

  return <IconComponent strokeWidth={1.8} {...accessibleProps} {...props} />;
}
