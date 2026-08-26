export type OfficialAssetRole =
  | "hero-commercial-truck"
  | "truck-range-200"
  | "truck-range-300"
  | "truck-range-500"
  | "truck-range-bus-puv";

export interface OfficialAsset {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  sourceUrl: string;
  sourceSite: "Hino Philippines";
  authorizedUse: true;
  assetRole: OfficialAssetRole;
  replaceWithCebuPhoto: true;
  replacementNote: string;
}

export interface GeneratedPlaceholderAsset {
  id: "partsServiceWorkshop";
  src: string;
  alt: string;
  width: number;
  height: number;
  sourceType: "generated-placeholder";
  authorizedUse: false;
  replaceWithCebuPhoto: true;
  replacementNote: string;
}

export const officialAssets = {
  hero: {
    id: "hero",
    src: "/images/official/hino-300-series-hero.jpg",
    alt: "Hino commercial truck shown from the front in a working environment",
    width: 1856,
    height: 549,
    sourceUrl: "https://www.hino.com.ph/assets/images/PerProduct/300/Img/300SeriesFrontBanner.jpg",
    sourceSite: "Hino Philippines",
    authorizedUse: true,
    assetRole: "hero-commercial-truck",
    replaceWithCebuPhoto: true,
    replacementNote: "Replace with authorized Cebu commercial photography when available.",
  },
  truck200: {
    id: "truck200",
    src: "/images/official/hino-200-series-card.jpg",
    alt: "Hino commercial truck on a light background",
    width: 1897,
    height: 2699,
    sourceUrl: "https://www.hino.com.ph/assets/images/Range/200%20(with%20background.jpg",
    sourceSite: "Hino Philippines",
    authorizedUse: true,
    assetRole: "truck-range-200",
    replaceWithCebuPhoto: true,
    replacementNote: "Replace with authorized Cebu commercial photography when available.",
  },
  truck300: {
    id: "truck300",
    src: "/images/official/hino-300-series-card.jpg",
    alt: "Hino commercial truck on a light background",
    width: 1897,
    height: 2699,
    sourceUrl: "https://www.hino.com.ph/assets/images/Range/300withbackground.jpg",
    sourceSite: "Hino Philippines",
    authorizedUse: true,
    assetRole: "truck-range-300",
    replaceWithCebuPhoto: true,
    replacementNote: "Replace with authorized Cebu commercial photography when available.",
  },
  truck500: {
    id: "truck500",
    src: "/images/official/hino-500-series-card.jpg",
    alt: "Hino commercial truck on a light background",
    width: 1897,
    height: 2699,
    sourceUrl: "https://www.hino.com.ph/assets/images/Range/500withbackground.jpg",
    sourceSite: "Hino Philippines",
    authorizedUse: true,
    assetRole: "truck-range-500",
    replaceWithCebuPhoto: true,
    replacementNote: "Replace with authorized Cebu commercial photography when available.",
  },
  truckBusPuv: {
    id: "truckBusPuv",
    src: "/images/official/hino-bus-puv-card.jpg",
    alt: "Hino passenger vehicle on a light background",
    width: 1897,
    height: 2699,
    sourceUrl: "https://www.hino.com.ph/assets/images/Range/BUS%20(with%20background)1.jpg",
    sourceSite: "Hino Philippines",
    authorizedUse: true,
    assetRole: "truck-range-bus-puv",
    replaceWithCebuPhoto: true,
    replacementNote: "Replace with authorized Cebu commercial photography when available.",
  },
} as const satisfies Record<string, OfficialAsset>;

export const partsServiceWorkshop = {
  id: "partsServiceWorkshop",
  src: "/images/generated/hino-parts-service-workshop.png",
  alt: "Technicians working in a commercial vehicle service workshop",
  width: 1672,
  height: 941,
  sourceType: "generated-placeholder",
  authorizedUse: false,
  replaceWithCebuPhoto: true,
  replacementNote: "Internal-only placeholder; replace with authorized Cebu workshop photography before launch.",
} as const satisfies GeneratedPlaceholderAsset;
