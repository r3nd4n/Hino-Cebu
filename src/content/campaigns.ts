export type Campaign = {
  slug: string; eyebrow: string; title: string; summary: string; benefits: string[];
  modelInterest: string; leadType: "sales" | "service" | "parts" | "financing"; index: boolean;
};

export const campaigns: Campaign[] = [
  {
    slug: "hino-300-cebu",
    eyebrow: "Hino 300 in Cebu",
    title: "Start the Hino 300 conversation for your business",
    summary: "Tell Hino Cebu how you plan to use your truck. The team can help review the model family and configuration without assuming final technical suitability.",
    benefits: ["Application-focused consultation", "Parts and service inquiry pathways", "Financing-intent support"],
    modelInterest: "Hino 300",
    leadType: "sales",
    index: false,
  },
];
