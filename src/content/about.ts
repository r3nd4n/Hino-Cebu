interface CorporateProvenance {
  publisher: "Hino Motors Philippines";
  sourceUrl: string;
  reviewedOn: string;
  supports: readonly string[];
}

interface SourcedAboutContent {
  localCommitment: {
    eyebrow: string;
    title: string;
    description: string;
    points: readonly string[];
  };
  nationalBackground: {
    title: "About Hino Motors Philippines";
    paragraphs: readonly string[];
  };
  practicalSupport: {
    eyebrow: string;
    title: string;
    description: string;
  };
  provenance: CorporateProvenance;
}

const sourcedAboutContent: SourcedAboutContent = {
  localCommitment: {
    eyebrow: "Hino Cebu",
    title: "A practical local point of contact",
    description:
      "Hino Cebu helps businesses begin clear conversations about truck requirements, parts questions, and service support.",
    points: [
      "Start with your route, cargo, body, or operating requirements.",
      "Ask about current vehicle availability before making a selection.",
      "Continue the conversation through local parts and service inquiry paths.",
    ],
  },
  nationalBackground: {
    title: "About Hino Motors Philippines",
    paragraphs: [
      "Hino Motors Philippines Corporation was established in March 1975.",
      "Its official corporate information describes the assembly and distribution of Hino trucks, buses, and spare parts, alongside parts and maintenance services.",
    ],
  },
  practicalSupport: {
    eyebrow: "Local information",
    title: "Practical Cebu information",
    description:
      "Confirmed local details appear below as available. You can start an inquiry while any detail awaits confirmation.",
  },
  provenance: {
    publisher: "Hino Motors Philippines",
    sourceUrl: "https://www.hino.com.ph/corporate-information",
    reviewedOn: "2026-08-26",
    supports: [
      "corporate establishment month and year",
      "assembly and distribution of trucks, buses, and spare parts",
      "parts and maintenance services",
    ],
  },
};

export interface PublicAboutContent {
  localCommitment: SourcedAboutContent["localCommitment"];
  nationalBackground: SourcedAboutContent["nationalBackground"];
  practicalSupport: SourcedAboutContent["practicalSupport"];
}

export function getPublicAboutContent(): PublicAboutContent {
  return {
    localCommitment: sourcedAboutContent.localCommitment,
    nationalBackground: sourcedAboutContent.nationalBackground,
    practicalSupport: sourcedAboutContent.practicalSupport,
  };
}

export const aboutContent = getPublicAboutContent();
