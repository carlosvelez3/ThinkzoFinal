import React from 'react';

interface LocalSEOHeadProps {
  businessName: string;
  businessType: string;
  city: string;
  state: string;
  mainService: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  socialProfiles?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  images?: {
    logo: string;
    featured: string;
    gallery?: string[];
  };
  additionalKeywords?: string[];
}

export function LocalSEOHead({
  businessName,
  businessType,
  city,
  state,
  mainService,
  description,
  address,
  phone,
  website,
  coordinates,
  socialProfiles,
  images,
  additionalKeywords = []
}: LocalSEOHeadProps) {
  
  const pageTitle = `${mainService} in ${city}, ${state} | ${businessName}`;
  const metaDescription = `${description} Located in ${city}, ${state}. Call ${phone} for professional ${mainService.toLowerCase()} services.`;
  
  const keywords = [
    mainService.toLowerCase(),
    `${mainService.toLowerCase()} ${city}`,
    `${mainService.toLowerCase()} ${state}`,
    `${businessType.toLowerCase()} ${city}`,
    `local ${businessType.toLowerCase()}`,
    `${city} ${businessType.toLowerCase()}`,
    ...additionalKeywords
  ].join(', ');

  const canonicalUrl = `${website}/locations/${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;

  return (
    <>
      {/* Basic SEO Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Geographic Meta Tags */}
      <meta name="geo.region" content={state} />
      <meta name="geo.placename" content={city} />
      <meta name="geo.position" content={`${coordinates.lat};${coordinates.lng}`} />
      <meta name="ICBM" content={`${coordinates.lat}, ${coordinates.lng}`} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={businessName} />
      <meta property="og:locale" content="en_US" />
      
      {images && (
        <>
          <meta property="og:image" content={images.featured} />
          <meta property="og:image:alt" content={`${businessName} - ${mainService} in ${city}, ${state}`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {images && <meta name="twitter:image" content={images.featured} />}
      {socialProfiles?.twitter && <meta name="twitter:site" content={socialProfiles.twitter} />}
      
      {/* Business-specific Meta Tags */}
      <meta name="business:contact_data:street_address" content={address} />
      <meta name="business:contact_data:locality" content={city} />
      <meta name="business:contact_data:region" content={state} />
      <meta name="business:contact_data:phone_number" content={phone} />
      <meta name="business:contact_data:website" content={website} />
      
      {/* Additional Meta Tags for Local SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Viewport and Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Favicon and Icons */}
      {images?.logo && (
        <>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href={images.logo} />
          <link rel="icon" type="image/png" sizes="32x32" href={images.logo} />
          <link rel="icon" type="image/png" sizes="16x16" href={images.logo} />
        </>
      )}
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://maps.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      
      {/* Alternate Language/Region Pages (if applicable) */}
      <link rel="alternate" hrefLang="en-US" href={canonicalUrl} />
      
      {/* Local Business Verification (if applicable) */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      {/* <meta name="msvalidate.01" content="your-bing-verification-code" /> */}
      
      {/* Additional Structured Data for Local Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageTitle,
            "description": metaDescription,
            "url": canonicalUrl,
            "mainEntity": {
              "@type": businessType,
              "name": businessName,
              "description": description,
              "url": website,
              "telephone": phone,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": address.split(',')[0],
                "addressLocality": city,
                "addressRegion": state,
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": coordinates.lat,
                "longitude": coordinates.lng
              },
              ...(images && {
                "image": images.featured,
                "logo": images.logo
              }),
              ...(socialProfiles && {
                "sameAs": Object.values(socialProfiles).filter(Boolean)
              })
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": website
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Locations",
                  "item": `${website}/locations`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": `${city}, ${state}`,
                  "item": canonicalUrl
                }
              ]
            }
          }, null, 2)
        }}
      />
    </>
  );
}

// Component for multi-location businesses
export function MultiLocationSEOHead({
  businessName,
  businessType,
  mainService,
  description,
  website,
  locations,
  socialProfiles,
  images
}: {
  businessName: string;
  businessType: string;
  mainService: string;
  description: string;
  website: string;
  locations: Array<{
    city: string;
    state: string;
    address: string;
    phone: string;
    coordinates: { lat: number; lng: number };
  }>;
  socialProfiles?: LocalSEOHeadProps['socialProfiles'];
  images?: LocalSEOHeadProps['images'];
}) {
  
  const pageTitle = `${businessName} - ${mainService} | Multiple Locations`;
  const metaDescription = `${description} Serving ${locations.map(l => `${l.city}, ${l.state}`).join(', ')}. Professional ${mainService.toLowerCase()} services.`;
  
  const allCities = locations.map(l => l.city).join(', ');
  const allStates = [...new Set(locations.map(l => l.state))].join(', ');
  
  const keywords = [
    mainService.toLowerCase(),
    `${businessType.toLowerCase()} ${allStates}`,
    `local ${businessType.toLowerCase()}`,
    ...locations.flatMap(l => [
      `${mainService.toLowerCase()} ${l.city}`,
      `${businessType.toLowerCase()} ${l.city}`
    ])
  ].join(', ');

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={`${website}/locations`} />
      
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${website}/locations`} />
      
      {images && (
        <>
          <meta property="og:image" content={images.featured} />
          <meta property="og:image:alt" content={`${businessName} - Multiple Locations`} />
        </>
      )}
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": businessName,
            "description": description,
            "url": website,
            ...(images && {
              "logo": images.logo,
              "image": images.featured
            }),
            ...(socialProfiles && {
              "sameAs": Object.values(socialProfiles).filter(Boolean)
            }),
            "location": locations.map(location => ({
              "@type": businessType,
              "name": `${businessName} - ${location.city}`,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": location.address.split(',')[0],
                "addressLocality": location.city,
                "addressRegion": location.state,
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": location.coordinates.lat,
                "longitude": location.coordinates.lng
              },
              "telephone": location.phone
            }))
          }, null, 2)
        }}
      />
    </>
  );
}