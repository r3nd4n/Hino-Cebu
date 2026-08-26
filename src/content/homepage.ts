import { businessUses } from "./trucks";

export const homepageContent = {
  hero: {
    eyebrow: "Hino Cebu",
    title: "Built for business. Ready for Cebu.",
    description: "Tell us what your business needs and start a practical conversation with the Hino Cebu team.",
    primaryAction: "Request a Quote",
    secondaryAction: "Explore Hino Trucks",
    trustPoints: ["Local sales support", "Parts & service conversations", "Help finding the right fit"],
  },
  truckRange: {
    eyebrow: "Find your Hino",
    title: "A truck range for the work ahead",
    action: "View All Trucks",
  },
  businessNeeds: {
    eyebrow: "Start with your work",
    title: "What does your business need to move?",
    options: businessUses,
  },
  valuePoints: [
    "Practical guidance for Cebu business needs.",
    "Local conversations for sales, parts, and service.",
    "Support that continues beyond the initial vehicle discussion.",
    "A clear path to ask about current availability.",
  ],
  service: {
    eyebrow: "Parts & Service",
    title: "Keep your business moving",
    description: "Speak with Hino Cebu about parts and service support for your operation.",
    action: "Explore Parts & Service",
  },
  visit: {
    eyebrow: "Visit Hino Cebu",
    title: "Talk through the right next step",
    directionsAction: "Get Directions",
  },
  finalCta: {
    title: "Ready to start the conversation?",
    action: "Request a Quote",
  },
} as const;
