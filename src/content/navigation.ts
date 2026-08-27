export interface NavigationItem {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
}

export const primaryNavigation: readonly NavigationItem[] = [
  {
    label: "Trucks",
    href: "/trucks",
    children: [
      { label: "Hino 200 Series", href: "/trucks/200-series" },
      { label: "Hino 300 Series", href: "/trucks/300-series" },
      { label: "Hino 500 Series", href: "/trucks/500-series" },
      { label: "Bus & PUV", href: "/trucks/bus-puv" },
    ],
  },
  { label: "Parts & Service", href: "/parts-service" },
  { label: "About", href: "/about" },
] as const;

export const legalNavigation = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;
