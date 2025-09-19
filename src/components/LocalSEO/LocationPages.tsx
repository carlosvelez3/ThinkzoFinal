import React from 'react';
import { MapPin, Phone, Clock, Star, Users, Award } from 'lucide-react';

interface LocationData {
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  serviceAreas: string[];
  localKeywords: string[];
  nearbyLandmarks: string[];
  testimonials?: {
    name: string;
    text: string;
    rating: number;
  }[];
}

interface ServiceOffering {
  name: string;
  description: string;
  localizedDescription?: string;
}

interface LocationPageProps {
  businessName: string;
  businessType: string;
  location: LocationData;
  services: ServiceOffering[];
  mainService: string;
  yearsInBusiness?: number;
  certifications?: string[];
}

export function LocationPageTemplate({
  businessName,
  businessType,
  location,
  services,
  mainService,
  yearsInBusiness,
  certifications
}: LocationPageProps) {
  const pageTitle = `${mainService} in ${location.city}, ${location.state} | ${businessName}`;
  const metaDescription = `Professional ${mainService.toLowerCase()} services in ${location.city}, ${location.state}. Serving ${location.serviceAreas.join(', ')}. Call ${location.phone} for a free consultation.`;

  return (
    <div className="location-page">
      {/* SEO Head Elements */}
      <head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${mainService.toLowerCase()}, ${location.city}, ${location.state}, ${location.localKeywords.join(', ')}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta name="geo.region" content={`${location.state}`} />
        <meta name="geo.placename" content={location.city} />
        <meta name="geo.position" content={`${location.coordinates.lat};${location.coordinates.lng}`} />
        <meta name="ICBM" content={`${location.coordinates.lat}, ${location.coordinates.lng}`} />
        <link rel="canonical" href={`https://yourdomain.com/locations/${location.city.toLowerCase().replace(/\s+/g, '-')}-${location.state.toLowerCase()}`} />
      </head>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {mainService} in {location.city}, {location.state}
            </h1>
            <p className="text-xl mb-6">
              Professional {businessType.toLowerCase()} serving {location.city} and surrounding areas
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{location.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <a href={`tel:${location.phone}`} className="hover:underline">
                  {location.phone}
                </a>
              </div>
              {yearsInBusiness && (
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  <span>{yearsInBusiness}+ Years Experience</span>
                </div>
              )}
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Get Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="service-areas py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Serving {location.city} and Surrounding Areas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {location.serviceAreas.map((area, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
                  <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <span className="font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Local Services */}
      <section className="local-services py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our {mainService} Services in {location.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.localizedDescription || service.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Available throughout {location.city} and {location.serviceAreas.slice(0, 2).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Local Focus */}
      <section className="why-choose-us py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose {businessName} in {location.city}?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Users className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Local Expertise</h3>
                  <p className="text-gray-600">
                    We understand the unique needs of {location.city} residents and businesses. 
                    Our team knows the local area, regulations, and community preferences.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Quick Response Time</h3>
                  <p className="text-gray-600">
                    Being locally based in {location.city}, we can respond quickly to your needs 
                    and provide same-day service when possible.
                  </p>
                </div>
              </div>

              {yearsInBusiness && (
                <div className="flex items-start space-x-4">
                  <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Proven Track Record</h3>
                    <p className="text-gray-600">
                      With {yearsInBusiness}+ years serving {location.city} and surrounding areas, 
                      we have built a reputation for quality and reliability.
                    </p>
                  </div>
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div className="flex items-start space-x-4">
                  <Star className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Certified & Licensed</h3>
                    <p className="text-gray-600">
                      Fully licensed and certified: {certifications.join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Local Testimonials */}
      {location.testimonials && location.testimonials.length > 0 && (
        <section className="testimonials py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                What {location.city} Customers Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {location.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`w-5 h-5 ${
                            starIndex < testimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <p className="font-bold text-blue-800">
                      - {testimonial.name}, {location.city} Resident
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Local Landmarks & Context */}
      <section className="local-context py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Proudly Serving {location.city}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Located near {location.nearbyLandmarks.join(', ')}, we're easily accessible 
              to residents and businesses throughout {location.city} and the surrounding {location.state} area.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Contact Our {location.city} Office</h3>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  <a href={`tel:${location.phone}`} className="text-blue-600 hover:underline">
                    {location.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Multi-location component for businesses with multiple locations
export function MultiLocationDirectory({ 
  locations, 
  businessName, 
  mainService 
}: { 
  locations: LocationData[]; 
  businessName: string; 
  mainService: string; 
}) {
  return (
    <div className="multi-location-directory py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {businessName} Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-blue-800">
                  {location.city}, {location.state}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-gray-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{location.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-600" />
                    <a href={`tel:${location.phone}`} className="text-blue-600 hover:underline">
                      {location.phone}
                    </a>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Service Areas:</p>
                    <p className="text-sm">{location.serviceAreas.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  View {location.city} Location
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}