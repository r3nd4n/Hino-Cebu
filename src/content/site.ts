export const siteConfig = {
  name: "Hino Cebu",
  legalName: "Hino Cebu",
  tagline: "Trucks, Parts, Service & Support for Cebu Business",
  description:
    "Explore Hino trucks, request parts or service support, and connect with Hino Cebu for business and fleet needs.",
  address: "377 P. Almendras Extension, Cebu City, Central Visayas",
  phoneDisplay: "+63 32 346 3322",
  phoneHref: "tel:+63323463322",
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=377%20P.%20Almendras%20Extension%2C%20Cebu%20City%2C%20Central%20Visayas",
  email: "",
  hours: [] as string[],
  socials: [
    { label: "Hino Motors Philippines on Facebook", href: "https://www.facebook.com/HinoMotorsPH/" },
    { label: "Hino Motors Philippines on Instagram", href: "https://www.instagram.com/hinomotors_philippines/" },
    { label: "Hino Motors Philippines on YouTube", href: "https://www.youtube.com/@hinomotorsphilippinescorpo1650/videos/" },
  ] as { label: string; href: string }[],
  nav: [
    { label: "Trucks", href: "/trucks" },
    { label: "Find Your Truck", href: "/find-your-truck" },
    { label: "Parts", href: "/parts" },
    { label: "Service", href: "/service" },
    { label: "Fleet", href: "/fleet" },
    { label: "Financing", href: "/financing" },
    { label: "Promotions", href: "/promotions" },
    { label: "Hino Cebu", href: "/hino-cebu" },
  ],
} as const;

export const directionsHref = siteConfig.directionsUrl || "/contact#location";

export const contentSources = {
  nationalSite: "https://www.hino.com.ph/",
  privacy: "https://www.hino.com.ph/privacy-policy",
  products: "https://www.hino.com.ph/products",
  service: "https://www.hino.com.ph/services",
  parts: "https://www.hino.com.ph/Parts.aspx",
  financing: "https://www.hino.com.ph/hino-financial-service",
  reviewedAt: "2026-08-18",
} as const;
