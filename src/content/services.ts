export interface ServiceOffering {
  name: string;
  description: string;
  href: string;
}

export const serviceOfferings: readonly ServiceOffering[] = [
  {
    name: "Parts inquiries",
    description: "Ask the Cebu team about genuine parts support for your vehicle.",
    href: "/parts-service#parts-inquiry",
  },
  {
    name: "Service inquiries",
    description: "Talk with the local team about service support and next steps.",
    href: "/parts-service#service-inquiry",
  },
  {
    name: "Fleet support",
    description: "Discuss practical support needs for one truck or a fleet.",
    href: "/parts-service#fleet-support",
  },
  {
    name: "Maintenance guidance",
    description: "Ask about maintenance planning with the Cebu team.",
    href: "/parts-service#maintenance-guidance",
  },
] as const;
