import Script from "next/script";

export function MarketingTags() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  return <>
    {gtm && <><Script id="gtm-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});`}</Script><Script src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`} strategy="afterInteractive" /></>}
    {!gtm && ga4 && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`} strategy="afterInteractive" /><Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4}',{send_page_view:true});`}</Script></>}
    {meta && <Script id="meta-init" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta}');fbq('track','PageView');`}</Script>}
  </>;
}
