# Local SEO Implementation Guide

## Overview
This guide provides comprehensive, production-ready code components for implementing local SEO on business websites. All components are modular, reusable, and follow current SEO best practices.

## Table of Contents
1. [Structured Data Implementation](#structured-data)
2. [Google Business Profile Integration](#google-business-profile)
3. [Location-Specific Content Framework](#location-pages)
4. [NAP Consistency Implementation](#nap-consistency)
5. [SEO Head Components](#seo-head)
6. [Implementation Instructions](#implementation)
7. [Customization Guide](#customization)

## Structured Data Implementation

### LocalBusiness Schema Markup
The `StructuredData.tsx` component provides comprehensive JSON-LD markup for local businesses.

#### Basic Usage:
```tsx
import { StructuredData } from './components/LocalSEO/StructuredData';

<StructuredData
  businessType="Restaurant"
  name="Mario's Italian Restaurant"
  description="Authentic Italian cuisine in downtown Springfield"
  url="https://mariosrestaurant.com"
  telephone="(555) 123-4567"
  address={{
    streetAddress: "123 Main Street",
    addressLocality: "Springfield",
    addressRegion: "IL",
    postalCode: "62701",
    addressCountry: "US"
  }}
  coordinates={{
    latitude: 39.7817,
    longitude: -89.6501
  }}
  openingHours={[
    { dayOfWeek: "Monday", opens: "11:00", closes: "22:00" },
    { dayOfWeek: "Tuesday", opens: "11:00", closes: "22:00" },
    // ... more days
  ]}
  priceRange="$$"
  servesCuisine={["Italian", "Mediterranean"]}
  acceptsReservations={true}
  image="https://example.com/restaurant-image.jpg"
  logo="https://example.com/logo.png"
/>
```

#### Business Type Variations:
- `LocalBusiness` (default)
- `Restaurant`
- `MedicalBusiness`
- `Store`
- `AutoRepair`

#### Key Features:
- ✅ Complete LocalBusiness schema
- ✅ Business hours specification
- ✅ Geographic coordinates
- ✅ Review aggregation support
- ✅ Service area specification
- ✅ Multiple business type support

## Google Business Profile Integration

### Components Included:
1. **GoogleMapsEmbed** - Responsive map embedding
2. **BusinessHours** - Dynamic hours display with "Open Now" status
3. **ClickToCall** - Mobile-optimized call buttons
4. **ReviewsWidget** - Customer review display

#### Implementation Example:
```tsx
import { GoogleBusinessProfile } from './components/LocalSEO/GoogleBusinessProfile';

<GoogleBusinessProfile
  businessName="Springfield Dental Care"
  address="456 Oak Avenue, Springfield, IL 62702"
  phone="(555) 987-6543"
  googleMapsEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12..."
  hours={[
    { day: "Monday", open: "08:00", close: "17:00" },
    { day: "Tuesday", open: "08:00", close: "17:00" },
    { day: "Wednesday", open: "08:00", close: "17:00" },
    { day: "Thursday", open: "08:00", close: "17:00" },
    { day: "Friday", open: "08:00", close: "16:00" },
    { day: "Saturday", closed: true },
    { day: "Sunday", closed: true }
  ]}
  reviews={[
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      text: "Excellent service and very professional staff!",
      date: "2024-01-15"
    }
  ]}
  averageRating={4.8}
  totalReviews={127}
/>
```

### Google Maps Embed Setup:
1. Go to [Google Maps](https://maps.google.com)
2. Search for your business
3. Click "Share" → "Embed a map"
4. Copy the iframe src URL
5. Use in the `googleMapsEmbedUrl` prop

## Location-Specific Content Framework

### Location Landing Pages
The `LocationPages.tsx` component creates SEO-optimized location-specific pages.

#### Key Features:
- ✅ Dynamic city/state content insertion
- ✅ Local keyword optimization
- ✅ Service area mapping
- ✅ Local testimonials integration
- ✅ Nearby landmarks context

#### Usage Example:
```tsx
import { LocationPageTemplate } from './components/LocalSEO/LocationPages';

<LocationPageTemplate
  businessName="TechFix Computer Repair"
  businessType="Computer Repair Service"
  mainService="Computer Repair"
  location={{
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    phone: "(312) 555-0123",
    address: "789 Michigan Avenue, Chicago, IL 60601",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    serviceAreas: ["Downtown Chicago", "Loop", "River North", "Gold Coast"],
    localKeywords: ["computer repair chicago", "laptop repair downtown", "IT support loop"],
    nearbyLandmarks: ["Millennium Park", "Navy Pier", "Willis Tower"]
  }}
  services={[
    {
      name: "Laptop Repair",
      description: "Professional laptop repair services",
      localizedDescription: "Expert laptop repair serving Chicago's business district"
    }
  ]}
  yearsInBusiness={15}
  certifications={["CompTIA A+", "Microsoft Certified"]}
/>
```

### Multi-Location Directory
For businesses with multiple locations:

```tsx
import { MultiLocationDirectory } from './components/LocalSEO/LocationPages';

<MultiLocationDirectory
  locations={[
    {
      city: "Chicago",
      state: "IL",
      // ... location data
    },
    {
      city: "Milwaukee",
      state: "WI",
      // ... location data
    }
  ]}
  businessName="TechFix Computer Repair"
  mainService="Computer Repair"
/>
```

## NAP Consistency Implementation

### NAP Component Variants
The `NAPComponent.tsx` provides consistent Name, Address, Phone display across your site.

#### Available Variants:
1. **Header** - Compact horizontal layout
2. **Footer** - Vertical layout with icons
3. **Contact** - Detailed contact page layout
4. **Inline** - Simple inline display

#### Implementation Examples:

**Header Usage:**
```tsx
import { NAPComponent } from './components/LocalSEO/NAPComponent';

<NAPComponent
  business={{
    name: "Springfield Auto Repair",
    address: {
      street: "123 Mechanic Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701"
    },
    phone: "(217) 555-0199"
  }}
  variant="header"
  className="text-white"
/>
```

**Footer Usage:**
```tsx
<NAPComponent
  business={businessData}
  variant="footer"
  showHours={true}
  showEmail={true}
  hours={businessHours}
  className="text-gray-300"
/>
```

**Contact Page Usage:**
```tsx
<NAPComponent
  business={businessData}
  variant="contact"
  showHours={true}
  showEmail={true}
  hours={businessHours}
/>
```

### Multi-Location NAP
For businesses with multiple locations:

```tsx
import { MultiLocationNAP } from './components/LocalSEO/NAPComponent';

<MultiLocationNAP
  locations={[
    {
      name: "Downtown Location",
      address: { /* address data */ },
      phone: "(555) 123-4567"
    },
    {
      name: "Suburban Location", 
      address: { /* address data */ },
      phone: "(555) 987-6543"
    }
  ]}
  variant="footer"
/>
```

## SEO Head Components

### Local SEO Meta Tags
The `LocalSEOHead.tsx` component provides comprehensive meta tags and structured data.

#### Implementation:
```tsx
import { LocalSEOHead } from './components/LocalSEO/LocalSEOHead';

<LocalSEOHead
  businessName="Green Thumb Landscaping"
  businessType="LandscapingBusiness"
  city="Austin"
  state="TX"
  mainService="Landscaping Services"
  description="Professional landscaping and lawn care services in Austin, Texas"
  address="456 Garden Lane, Austin, TX 78701"
  phone="(512) 555-0147"
  website="https://greenthumblandscaping.com"
  coordinates={{ lat: 30.2672, lng: -97.7431 }}
  socialProfiles={{
    facebook: "https://facebook.com/greenthumblandscaping",
    instagram: "https://instagram.com/greenthumbatx"
  }}
  images={{
    logo: "https://example.com/logo.png",
    featured: "https://example.com/featured-image.jpg"
  }}
  additionalKeywords={["lawn care austin", "garden design texas", "irrigation systems"]}
/>
```

### Multi-Location SEO Head
For location directory pages:

```tsx
import { MultiLocationSEOHead } from './components/LocalSEO/LocalSEOHead';

<MultiLocationSEOHead
  businessName="CleanPro Services"
  businessType="CleaningService"
  mainService="Commercial Cleaning"
  description="Professional cleaning services across Texas"
  website="https://cleanproservices.com"
  locations={locationData}
  socialProfiles={socialData}
  images={imageData}
/>
```

## Implementation Instructions

### Step 1: Install Dependencies
```bash
npm install lucide-react framer-motion
```

### Step 2: Add Components to Your Project
Copy the component files to your project:
- `src/components/LocalSEO/StructuredData.tsx`
- `src/components/LocalSEO/GoogleBusinessProfile.tsx`
- `src/components/LocalSEO/LocationPages.tsx`
- `src/components/LocalSEO/NAPComponent.tsx`
- `src/components/LocalSEO/LocalSEOHead.tsx`

### Step 3: Configure Your Business Data
Create a configuration file:

```tsx
// src/data/businessConfig.ts
export const businessConfig = {
  name: "Your Business Name",
  type: "LocalBusiness", // or Restaurant, MedicalBusiness, etc.
  description: "Your business description",
  website: "https://yourbusiness.com",
  mainService: "Your Main Service",
  
  locations: [
    {
      city: "Your City",
      state: "Your State",
      address: "Your Full Address",
      phone: "(555) 123-4567",
      coordinates: { lat: 0.0000, lng: 0.0000 },
      // ... more location data
    }
  ],
  
  hours: [
    { day: "Monday", open: "09:00", close: "17:00" },
    // ... more days
  ],
  
  socialProfiles: {
    facebook: "https://facebook.com/yourbusiness",
    // ... more profiles
  }
};
```

### Step 4: Implement in Your Pages
```tsx
// In your page component
import { LocalSEOHead } from './components/LocalSEO/LocalSEOHead';
import { StructuredData } from './components/LocalSEO/StructuredData';
import { businessConfig } from './data/businessConfig';

export default function LocationPage() {
  return (
    <>
      <LocalSEOHead {...businessConfig.locations[0]} />
      <StructuredData {...businessConfig} />
      
      {/* Your page content */}
    </>
  );
}
```

### Step 5: Add to Header/Footer
```tsx
// In your header component
import { NAPComponent } from './components/LocalSEO/NAPComponent';

<NAPComponent
  business={businessConfig.locations[0]}
  variant="header"
/>

// In your footer component
<NAPComponent
  business={businessConfig.locations[0]}
  variant="footer"
  showHours={true}
  showEmail={true}
  hours={businessConfig.hours}
/>
```

## Customization Guide

### Styling Customization
All components use Tailwind CSS classes. Customize by:

1. **Override default classes:**
```tsx
<NAPComponent
  business={businessData}
  className="custom-nap-styles"
/>
```

2. **Modify component styles:**
Edit the Tailwind classes directly in the component files.

### Business Type Customization
Add new business types to `StructuredData.tsx`:

```tsx
// Add to the businessType union type
businessType?: 'LocalBusiness' | 'Restaurant' | 'YourNewType';

// Add specific properties for your business type
if (businessType === 'YourNewType') {
  Object.assign(baseSchema, {
    // Your custom properties
  });
}
```

### Adding Custom Fields
Extend interfaces to add custom fields:

```tsx
interface CustomBusinessProps extends LocalBusinessProps {
  customField?: string;
  additionalServices?: string[];
}
```

## Best Practices

### 1. NAP Consistency
- Use the same format across all pages
- Ensure phone numbers match Google Business Profile
- Keep address format consistent

### 2. Schema Markup
- Include all relevant business information
- Keep opening hours updated
- Add reviews and ratings when available

### 3. Local Keywords
- Include city/state in page titles
- Use local landmarks in content
- Target "near me" searches

### 4. Mobile Optimization
- Ensure click-to-call functionality works
- Make maps easily accessible
- Optimize for local mobile searches

### 5. Performance
- Lazy load maps and heavy components
- Optimize images for local content
- Use proper caching strategies

## Testing and Validation

### Schema Markup Testing
1. Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. Validate with [Schema.org Validator](https://validator.schema.org/)
3. Check [Google Search Console](https://search.google.com/search-console) for errors

### Local SEO Checklist
- [ ] NAP consistency across all pages
- [ ] Google Business Profile claimed and optimized
- [ ] Local schema markup implemented
- [ ] Location-specific content created
- [ ] Mobile-friendly design
- [ ] Fast loading times
- [ ] Local keywords optimized
- [ ] Customer reviews displayed

## Troubleshooting

### Common Issues:

**Schema Markup Errors:**
- Ensure all required fields are provided
- Check date/time formats (use ISO 8601)
- Validate coordinates are correct

**NAP Inconsistencies:**
- Use the NAPComponent consistently
- Check for typos in addresses/phone numbers
- Ensure format matches Google Business Profile

**Mobile Issues:**
- Test click-to-call functionality
- Verify maps load properly on mobile
- Check responsive design

## Support and Updates

This implementation guide follows current Google guidelines and schema.org standards. Regular updates may be needed as search engine requirements evolve.

For the latest updates and additional features, refer to:
- [Google Business Profile Guidelines](https://support.google.com/business/)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)