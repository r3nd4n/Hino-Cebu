export const supportServices = [
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-SERVICE-SALES"], title: "Sales", description: "Compare model families and discuss the application your operation needs.", href: "/trucks", cta: "Explore trucks" },
  { routeId: "ROUTE-SERVICE", claimIds: ["CLAIM-SERVICE-SERVICE"], title: "Service", description: "Send a service schedule request for review and confirmation by the branch team.", href: "/service", cta: "Request service" },
  { routeId: "ROUTE-PARTS", claimIds: ["CLAIM-SERVICE-PARTS"], title: "Genuine Parts", description: "Share model and part details so the parts team can review your inquiry.", href: "/parts", cta: "Request parts" },
  { routeId: "ROUTE-FLEET", claimIds: ["CLAIM-SERVICE-FLEET"], title: "Financing & Fleet", description: "Start a conversation about acquisition, financing intent, or fleet requirements.", href: "/fleet", cta: "Discuss fleet needs" },
] as const;
