import React from 'react';

interface BusinessHours {
  dayOfWeek: string;
  opens: string;
  closes: string;
}

interface Address {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

interface Review {
  author: string;
  datePublished: string;
  reviewBody: string;
  reviewRating: number;
}

interface LocalBusinessProps {
  businessType?: 'LocalBusiness' | 'Restaurant' | 'MedicalBusiness' | 'Store' | 'AutoRepair';
  name: string;
  description: string;
  url: string;
  telephone: string;
  email?: string;
  address: Address;
  coordinates: GeoCoordinates;
  openingHours: BusinessHours[];
  priceRange?: string;
  servesCuisine?: string[]; // For restaurants
  acceptsReservations?: boolean; // For restaurants
  paymentAccepted?: string[];
  image: string;
  logo: string;
  sameAs?: string[]; // Social media profiles
  reviews?: Review[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  serviceArea?: string[]; // Cities/areas served
  services?: string[]; // Services offered
}

export function StructuredData({ 
  businessType = 'LocalBusiness',
  name,
  description,
  url,
  telephone,
  email,
  address,
  coordinates,
  openingHours,
  priceRange,
  servesCuisine,
  acceptsReservations,
  paymentAccepted,
  image,
  logo,
  sameAs,
  reviews,
  aggregateRating,
  serviceArea,
  services
}: LocalBusinessProps) {
  
  // Convert opening hours to schema format
  const formatOpeningHours = (hours: BusinessHours[]) => {
    return hours.map(hour => `${hour.dayOfWeek} ${hour.opens}-${hour.closes}`);
  };

  // Base schema structure
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": businessType,
    "name": name,
    "description": description,
    "url": url,
    "telephone": telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": coordinates.latitude,
      "longitude": coordinates.longitude
    },
    "openingHoursSpecification": openingHours.map(hour => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hour.dayOfWeek,
      "opens": hour.opens,
      "closes": hour.closes
    })),
    "image": image,
    "logo": logo,
    ...(email && { "email": email }),
    ...(priceRange && { "priceRange": priceRange }),
    ...(paymentAccepted && { "paymentAccepted": paymentAccepted }),
    ...(sameAs && { "sameAs": sameAs }),
    ...(serviceArea && { "areaServed": serviceArea })
  };

  // Add restaurant-specific properties
  if (businessType === 'Restaurant') {
    Object.assign(baseSchema, {
      ...(servesCuisine && { "servesCuisine": servesCuisine }),
      ...(acceptsReservations !== undefined && { "acceptsReservations": acceptsReservations })
    });
  }

  // Add services for service businesses
  if (services && services.length > 0) {
    Object.assign(baseSchema, {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services",
        "itemListElement": services.map((service, index) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service
          }
        }))
      }
    });
  }

  // Add aggregate rating if available
  if (aggregateRating) {
    Object.assign(baseSchema, {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue,
        "reviewCount": aggregateRating.reviewCount
      }
    });
  }

  // Add individual reviews if available
  if (reviews && reviews.length > 0) {
    Object.assign(baseSchema, {
      "review": reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "datePublished": review.datePublished,
        "reviewBody": review.reviewBody,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.reviewRating
        }
      }))
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(baseSchema, null, 2)
      }}
    />
  );
}

// Example usage components for different business types

export function RestaurantSchema(props: Omit<LocalBusinessProps, 'businessType'>) {
  return <StructuredData {...props} businessType="Restaurant" />;
}

export function MedicalBusinessSchema(props: Omit<LocalBusinessProps, 'businessType'>) {
  return <StructuredData {...props} businessType="MedicalBusiness" />;
}

export function StoreSchema(props: Omit<LocalBusinessProps, 'businessType'>) {
  return <StructuredData {...props} businessType="Store" />;
}

export function AutoRepairSchema(props: Omit<LocalBusinessProps, 'businessType'>) {
  return <StructuredData {...props} businessType="AutoRepair" />;
}