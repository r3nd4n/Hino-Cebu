import type { InquiryTopic } from "@/content/inquiry";

export interface ServiceOffering {
  name: string;
  description: string;
  href: string;
  role: "primary" | "supporting";
  bullets: readonly string[];
  topic: InquiryTopic;
  ctaLabel: string;
  sectionId: string;
}

export const serviceOfferings: readonly ServiceOffering[] = [
  {
    name: "Parts inquiries",
    description: "Start a local conversation about the parts support your Hino vehicle may need.",
    href: "/parts-service#parts-inquiry",
    role: "primary",
    bullets: ["Share your vehicle details", "Describe the part or support needed", "Confirm the next step with the Cebu team"],
    topic: "parts",
    ctaLabel: "Ask About Parts",
    sectionId: "parts-inquiry",
  },
  {
    name: "Service inquiries",
    description: "Talk with the local team about your vehicle and the service support you are looking for.",
    href: "/parts-service#service-inquiry",
    role: "primary",
    bullets: ["Tell us about your vehicle", "Explain the support you need", "Arrange the appropriate follow-up"],
    topic: "service",
    ctaLabel: "Request Service Information",
    sectionId: "service-inquiry",
  },
  {
    name: "Fleet support",
    description: "Discuss practical support priorities for one vehicle or a wider operation.",
    href: "/parts-service#fleet-support",
    role: "supporting",
    bullets: ["Share your operating context", "Outline your support priorities"],
    topic: "general",
    ctaLabel: "Discuss Fleet Support",
    sectionId: "fleet-support",
  },
  {
    name: "Maintenance guidance",
    description: "Ask the Cebu team for general guidance based on your vehicle and operating context.",
    href: "/parts-service#maintenance-guidance",
    role: "supporting",
    bullets: ["Describe how the vehicle is used", "Ask about an appropriate conversation"],
    topic: "general",
    ctaLabel: "Ask for Guidance",
    sectionId: "maintenance-guidance",
  },
] as const;
