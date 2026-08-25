# Feature Research

**Domain:** Commercial dealership lead-generation website  
**Researched:** 2026-08-26  
**Confidence:** HIGH

## Feature Landscape

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---|---|---|---|
| Clear local contact paths | Buyers need a fast way to reach the branch | Low | Click-to-call, directions, location, and hours must be consistent. |
| Vehicle discovery | Buyers need a starting point for product conversations | Medium | Use configurable truck cards, series pages, and business-use prompts. |
| Responsive, accessible pages | Most discovery happens on varied devices | Medium | Design deliberately for phone, tablet, and desktop. |
| Quote and inquiry capture | The commercial objective is a qualified conversation | Medium | Validate, attribute, provide safe errors and confirmation. |
| SEO foundations | Local discovery depends on indexable, correctly described pages | Medium | Metadata, sitemap, robots, semantic headings, verified structured data. |

### Differentiators

| Feature | Value | Complexity | Notes |
|---|---|---|---|
| Integrated quote card in truck-led hero | Makes next action visible before scrolling | Medium | Primary homepage conversion surface. |
| Business-use selector | Helps a buyer self-identify without needing fabricated specs | Medium | Routes users to relevant truck/service conversations. |
| Local aftersales framing | Connects purchase confidence to Cebu parts and service support | Low | Emphasize uptime and local support. |

### Anti-Features

| Feature | Why Problematic | Alternative |
|---|---|---|
| Promotion carousel/route | Explicitly excluded and distracts from vehicle-to-conversation journey | Direct truck, support, and quote paths |
| Unverified technical catalogue | Risks inaccurate commercial claims | Configurable, approved vehicle content |
| Full CMS/admin panel | High operational cost before content workflow is proven | Typed content modules and documented updates |

## Dependencies

`Verified dealer data → structured data, location, contact, legal pages`  
`Lead schema + abuse controls → Sheets append + Resend notifications + thank-you state`  
`Design tokens + responsive shell → homepage and all public routes`

## MVP Definition

- Truck-led homepage, public navigation, truck discovery, parts/service, contact/about, and required legal pages.
- Production-capable quote/contact flows with attribution, validation, Sheets adapter, Resend adapter, and safe development behavior when credentials are absent.
- No promotions, invented content, or heavy administrative platform.
