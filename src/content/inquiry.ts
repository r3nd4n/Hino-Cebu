export const inquiryTopics = {
  general: "General inquiry",
  "200-series": "Hino 200 Series",
  "300-series": "Hino 300 Series",
  "500-series": "Hino 500 Series",
  "bus-puv": "Hino Bus & PUV",
  parts: "Parts",
  service: "Service",
} as const;

export type InquiryTopic = keyof typeof inquiryTopics;

export function normalizeInquiryTopic(value: unknown): InquiryTopic {
  return typeof value === "string" && Object.hasOwn(inquiryTopics, value)
    ? (value as InquiryTopic)
    : "general";
}

export function inquiryHref(topic: InquiryTopic): string {
  return `/contact?topic=${topic}#inquiry`;
}
