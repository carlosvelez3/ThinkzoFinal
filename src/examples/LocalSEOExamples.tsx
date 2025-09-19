import React from 'react';
import { StructuredData, RestaurantSchema, MedicalBusinessSchema } from '../components/LocalSEO/StructuredData';
import { GoogleBusinessProfile } from '../components/LocalSEO/GoogleBusinessProfile';
import { LocationPageTemplate } from '../components/LocalSEO/LocationPages';
import { NAPComponent } from '../components/LocalSEO/NAPComponent';
import { LocalSEOHead } from '../components/LocalSEO/LocalSEOHead';

// Example 1: Restaurant Implementation
export function RestaurantExample() {
  const restaurantData = {
    name: "Mario's Italian Bistro",
    description: "Authentic Italian cuisine with fresh ingredients and traditional recipes",
    url: "https://mariositalian.com",
    telephone: "(555) 123-4567",
    email: "info@mariositalian.com",
    address: {
      streetAddress: "123 Main Street",
      addressLocality: "Springfield",
      addressRegion: "IL",
      postalCode: "62701",
      addressCountry: "US"
    },
    coordinates: {
      latitude: 39.7817,
      longitude: -89.6501
    },
    openingHours: [
      { dayOfWeek: "Monday", opens: "11:00", closes: "22:00" },
      { dayOfWeek: "Tuesday", opens: "11:00", closes: "22:00" },
      { dayOfWeek: "Wednesday", opens: "11:00", closes: "22:00" },
      { dayOfWeek: "Thursday", opens: "11:00", closes: "22:00" },
      { dayOfWeek: "Friday", opens: "11:00", closes: "23:00" },
      { dayOfWeek: "Saturday", opens: "16:00", closes: "23:00" },
      { dayOfWeek: "Sunday", opens: "16:00", closes: "21:00" }
    ],
    priceRange: "$$",
    servesCuisine: ["Italian", "Mediterranean"],
    acceptsReservations: true,
    paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
    image: "https://example.com/restaurant-interior.jpg",
    logo: "https://example.com/marios-logo.png",
    sameAs: [
      "https://www.facebook.com/mariositalian",
      "https://www.instagram.com/mariositalian",
      "https://www.yelp.com/biz/marios-italian-bistro"
    ],
    aggregateRating: {
      ratingValue: 4.5,
      reviewCount: 89
    },
    reviews: [
      {
        author: "Sarah Johnson",
        datePublished: "2024-01-15",
        reviewBody: "Amazing pasta and excellent service! The atmosphere is perfect for date night.",
        reviewRating: 5
      },
      {
        author: "Mike Chen",
        datePublished: "2024-01-10",
        reviewBody: "Best Italian food in Springfield. The tiramisu is to die for!",
        reviewRating: 5
      }
    ]
  };

  const businessHours = [
    { day: "Monday", open: "11:00", close: "22:00" },
    { day: "Tuesday", open: "11:00", close: "22:00" },
    { day: "Wednesday", open: "11:00", close: "22:00" },
    { day: "Thursday", open: "11:00", close: "22:00" },
    { day: "Friday", open: "11:00", close: "23:00" },
    { day: "Saturday", open: "16:00", close: "23:00" },
    { day: "Sunday", open: "16:00", close: "21:00" }
  ];

  return (
    <div className="restaurant-page">
      {/* SEO Head */}
      <LocalSEOHead
        businessName="Mario's Italian Bistro"
        businessType="Restaurant"
        city="Springfield"
        state="IL"
        mainService="Italian Restaurant"
        description="Authentic Italian cuisine with fresh ingredients and traditional recipes in Springfield, IL"
        address="123 Main Street, Springfield, IL 62701"
        phone="(555) 123-4567"
        website="https://mariositalian.com"
        coordinates={{ lat: 39.7817, lng: -89.6501 }}
        socialProfiles={{
          facebook: "https://www.facebook.com/mariositalian",
          instagram: "https://www.instagram.com/mariositalian"
        }}
        images={{
          logo: "https://example.com/marios-logo.png",
          featured: "https://example.com/restaurant-interior.jpg"
        }}
        additionalKeywords={["italian restaurant springfield", "pasta springfield il", "fine dining"]}
      />

      {/* Structured Data */}
      <RestaurantSchema {...restaurantData} />

      {/* Page Content */}
      <header className="bg-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Mario's Italian Bistro</h1>
          <p className="text-xl">Authentic Italian Cuisine in Springfield, IL</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Visit Our Restaurant</h2>
            <GoogleBusinessProfile
              businessName="Mario's Italian Bistro"
              address="123 Main Street, Springfield, IL 62701"
              phone="(555) 123-4567"
              website="https://mariositalian.com"
              googleMapsEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048...."
              hours={businessHours}
              reviews={restaurantData.reviews?.map((review, index) => ({
                id: index.toString(),
                author: review.author,
                rating: review.reviewRating,
                text: review.reviewBody,
                date: review.datePublished
              }))}
              averageRating={4.5}
              totalReviews={89}
            />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              For over 20 years, Mario's Italian Bistro has been serving authentic Italian cuisine 
              to the Springfield community. Our family recipes, passed down through generations, 
              combined with the freshest local ingredients, create an unforgettable dining experience.
            </p>
            <p className="text-gray-600">
              Whether you're celebrating a special occasion or enjoying a casual dinner with family, 
              our warm atmosphere and exceptional service make every visit memorable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 2: Medical Practice Implementation
export function MedicalPracticeExample() {
  const medicalData = {
    name: "Springfield Family Dental",
    description: "Comprehensive dental care for the whole family",
    url: "https://springfieldfamilydental.com",
    telephone: "(555) 987-6543",
    email: "appointments@springfieldfamilydental.com",
    address: {
      streetAddress: "456 Oak Avenue",
      addressLocality: "Springfield",
      addressRegion: "IL",
      postalCode: "62702",
      addressCountry: "US"
    },
    coordinates: {
      latitude: 39.7956,
      longitude: -89.6645
    },
    openingHours: [
      { dayOfWeek: "Monday", opens: "08:00", closes: "17:00" },
      { dayOfWeek: "Tuesday", opens: "08:00", closes: "17:00" },
      { dayOfWeek: "Wednesday", opens: "08:00", closes: "17:00" },
      { dayOfWeek: "Thursday", opens: "08:00", closes: "17:00" },
      { dayOfWeek: "Friday", opens: "08:00", closes: "16:00" }
    ],
    paymentAccepted: ["Cash", "Credit Card", "Insurance"],
    image: "https://example.com/dental-office.jpg",
    logo: "https://example.com/dental-logo.png",
    services: [
      "General Dentistry",
      "Cosmetic Dentistry", 
      "Orthodontics",
      "Oral Surgery",
      "Pediatric Dentistry"
    ],
    serviceArea: ["Springfield", "Chatham", "Sherman", "Rochester"]
  };

  const locationData = {
    city: "Springfield",
    state: "IL",
    zipCode: "62702",
    phone: "(555) 987-6543",
    address: "456 Oak Avenue, Springfield, IL 62702",
    coordinates: { lat: 39.7956, lng: -89.6645 },
    serviceAreas: ["Springfield", "Chatham", "Sherman", "Rochester", "Riverton"],
    localKeywords: ["dentist springfield il", "family dentist", "dental care springfield"],
    nearbyLandmarks: ["Memorial Medical Center", "Springfield Clinic", "HSHS St. John's Hospital"],
    testimonials: [
      {
        name: "Jennifer Smith",
        text: "Dr. Johnson and his team provide excellent care. My kids actually look forward to their dental visits!",
        rating: 5
      },
      {
        name: "Robert Davis",
        text: "Professional, friendly, and thorough. I've been a patient for 10 years and wouldn't go anywhere else.",
        rating: 5
      }
    ]
  };

  const services = [
    {
      name: "General Dentistry",
      description: "Comprehensive dental care including cleanings, fillings, and preventive treatments",
      localizedDescription: "Complete dental care for Springfield families, including routine cleanings and preventive treatments"
    },
    {
      name: "Cosmetic Dentistry",
      description: "Smile enhancement procedures including whitening, veneers, and bonding",
      localizedDescription: "Transform your smile with our cosmetic dentistry services, popular among Springfield professionals"
    },
    {
      name: "Pediatric Dentistry",
      description: "Specialized dental care for children and adolescents",
      localizedDescription: "Gentle, kid-friendly dental care that makes Springfield children comfortable and happy"
    }
  ];

  return (
    <div className="medical-page">
      {/* SEO Head */}
      <LocalSEOHead
        businessName="Springfield Family Dental"
        businessType="MedicalBusiness"
        city="Springfield"
        state="IL"
        mainService="Dental Services"
        description="Comprehensive dental care for the whole family in Springfield, IL"
        address="456 Oak Avenue, Springfield, IL 62702"
        phone="(555) 987-6543"
        website="https://springfieldfamilydental.com"
        coordinates={{ lat: 39.7956, lng: -89.6645 }}
        additionalKeywords={["family dentist", "pediatric dentistry", "cosmetic dentistry springfield"]}
      />

      {/* Structured Data */}
      <MedicalBusinessSchema {...medicalData} />

      {/* Location Page Template */}
      <LocationPageTemplate
        businessName="Springfield Family Dental"
        businessType="Dental Practice"
        location={locationData}
        services={services}
        mainService="Dental Services"
        yearsInBusiness={15}
        certifications={["American Dental Association", "Illinois State Dental Society"]}
      />
    </div>
  );
}

// Example 3: Service Business Implementation
export function ServiceBusinessExample() {
  const serviceData = {
    name: "ProClean Carpet Services",
    description: "Professional carpet cleaning and restoration services",
    url: "https://procleancarpet.com",
    telephone: "(555) 456-7890",
    address: {
      streetAddress: "789 Industrial Drive",
      addressLocality: "Springfield",
      addressRegion: "IL", 
      postalCode: "62703",
      addressCountry: "US"
    },
    coordinates: {
      latitude: 39.7684,
      longitude: -89.6540
    },
    openingHours: [
      { dayOfWeek: "Monday", opens: "07:00", closes: "19:00" },
      { dayOfWeek: "Tuesday", opens: "07:00", closes: "19:00" },
      { dayOfWeek: "Wednesday", opens: "07:00", closes: "19:00" },
      { dayOfWeek: "Thursday", opens: "07:00", closes: "19:00" },
      { dayOfWeek: "Friday", opens: "07:00", closes: "19:00" },
      { dayOfWeek: "Saturday", opens: "08:00", closes: "17:00" }
    ],
    services: [
      "Carpet Cleaning",
      "Upholstery Cleaning",
      "Tile & Grout Cleaning",
      "Water Damage Restoration",
      "Pet Odor Removal"
    ],
    serviceArea: [
      "Springfield", "Chatham", "Sherman", "Rochester", "Riverton", 
      "Auburn", "Pawnee", "Divernon", "Glenarm", "New Berlin"
    ],
    image: "https://example.com/carpet-cleaning.jpg",
    logo: "https://example.com/proclean-logo.png"
  };

  const businessContact = {
    name: "ProClean Carpet Services",
    address: {
      street: "789 Industrial Drive",
      city: "Springfield",
      state: "IL",
      zipCode: "62703"
    },
    phone: "(555) 456-7890",
    email: "info@procleancarpet.com",
    website: "https://procleancarpet.com"
  };

  const businessHours = [
    { day: "Monday", open: "07:00", close: "19:00" },
    { day: "Tuesday", open: "07:00", close: "19:00" },
    { day: "Wednesday", open: "07:00", close: "19:00" },
    { day: "Thursday", open: "07:00", close: "19:00" },
    { day: "Friday", open: "07:00", close: "19:00" },
    { day: "Saturday", open: "08:00", close: "17:00" },
    { day: "Sunday", closed: true }
  ];

  return (
    <div className="service-business-page">
      {/* SEO Head */}
      <LocalSEOHead
        businessName="ProClean Carpet Services"
        businessType="LocalBusiness"
        city="Springfield"
        state="IL"
        mainService="Carpet Cleaning"
        description="Professional carpet cleaning and restoration services in Springfield, IL and surrounding areas"
        address="789 Industrial Drive, Springfield, IL 62703"
        phone="(555) 456-7890"
        website="https://procleancarpet.com"
        coordinates={{ lat: 39.7684, lng: -89.6540 }}
        additionalKeywords={["carpet cleaning springfield", "upholstery cleaning", "water damage restoration"]}
      />

      {/* Structured Data */}
      <StructuredData {...serviceData} />

      {/* Header with NAP */}
      <header className="bg-blue-800 text-white py-4">
        <div className="container mx-auto px-4">
          <NAPComponent
            business={businessContact}
            variant="header"
            className="text-white"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Professional Carpet Cleaning in Springfield, IL
            </h1>
            <p className="text-xl text-gray-600">
              Serving Springfield and surrounding communities with expert carpet cleaning services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Services</h2>
              <div className="space-y-4">
                {serviceData.services.map((service, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg">{service}</h3>
                    <p className="text-gray-600">Professional {service.toLowerCase()} services for Springfield area homes and businesses.</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Contact & Hours</h2>
              <NAPComponent
                business={businessContact}
                hours={businessHours}
                variant="contact"
                showHours={true}
                showEmail={true}
              />
            </div>
          </div>

          {/* Service Areas */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8">Areas We Serve</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {serviceData.serviceArea.map((area, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded text-center">
                  <span className="font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer with NAP */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <NAPComponent
            business={businessContact}
            hours={businessHours}
            variant="footer"
            showHours={true}
            showEmail={true}
            className="text-gray-300"
          />
        </div>
      </footer>
    </div>
  );
}

// Example 4: Multi-Location Business
export function MultiLocationExample() {
  const locations = [
    {
      name: "TechFix Downtown",
      address: {
        street: "123 Main Street",
        city: "Chicago",
        state: "IL",
        zipCode: "60601"
      },
      phone: "(312) 555-0123",
      email: "downtown@techfix.com"
    },
    {
      name: "TechFix North Side",
      address: {
        street: "456 Lincoln Avenue",
        city: "Chicago", 
        state: "IL",
        zipCode: "60614"
      },
      phone: "(312) 555-0456",
      email: "northside@techfix.com"
    },
    {
      name: "TechFix Suburbs",
      address: {
        street: "789 Oak Street",
        city: "Schaumburg",
        state: "IL",
        zipCode: "60173"
      },
      phone: "(847) 555-0789",
      email: "suburbs@techfix.com"
    }
  ];

  return (
    <div className="multi-location-page">
      <header className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">TechFix Computer Repair</h1>
          <p className="text-xl">Multiple Locations Serving Chicagoland</p>
        </div>
      </header>

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Locations</h2>
            <p className="text-lg text-gray-600">
              Find the TechFix location nearest you for expert computer repair services
            </p>
          </div>

          {/* Multi-Location NAP Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <NAPComponent
                  business={location}
                  variant="contact"
                  showEmail={true}
                />
                <div className="mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                    Visit This Location
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Export all examples for easy import
export const LocalSEOExamples = {
  RestaurantExample,
  MedicalPracticeExample,
  ServiceBusinessExample,
  MultiLocationExample
};