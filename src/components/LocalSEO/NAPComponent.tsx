import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface BusinessContact {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  phone: string;
  email?: string;
  website?: string;
}

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

interface NAPComponentProps {
  business: BusinessContact;
  hours?: BusinessHours[];
  showHours?: boolean;
  showEmail?: boolean;
  variant?: 'header' | 'footer' | 'contact' | 'inline';
  className?: string;
}

// Reusable NAP (Name, Address, Phone) Component
export function NAPComponent({
  business,
  hours,
  showHours = false,
  showEmail = false,
  variant = 'inline',
  className = ''
}: NAPComponentProps) {
  const formatAddress = (address: BusinessContact['address']) => {
    const parts = [
      address.street,
      `${address.city}, ${address.state} ${address.zipCode}`
    ];
    if (address.country && address.country !== 'US') {
      parts.push(address.country);
    }
    return parts;
  };

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const formatPhoneLink = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  // Header variant - compact horizontal layout
  if (variant === 'header') {
    return (
      <div className={`nap-header flex flex-wrap items-center gap-4 text-sm ${className}`}>
        <div className="flex items-center" itemScope itemType="https://schema.org/PostalAddress">
          <MapPin className="w-4 h-4 mr-1 text-gray-600" aria-hidden="true" />
          <span>
            <span itemProp="streetAddress">{business.address.street}</span>,{' '}
            <span itemProp="addressLocality">{business.address.city}</span>,{' '}
            <span itemProp="addressRegion">{business.address.state}</span>{' '}
            <span itemProp="postalCode">{business.address.zipCode}</span>
          </span>
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-1 text-gray-600" aria-hidden="true" />
          <a 
            href={`tel:${formatPhoneLink(business.phone)}`}
            className="hover:text-blue-600 transition-colors"
            itemProp="telephone"
          >
            {formatPhoneDisplay(business.phone)}
          </a>
        </div>
      </div>
    );
  }

  // Footer variant - vertical layout with icons
  if (variant === 'footer') {
    return (
      <div className={`nap-footer space-y-3 ${className}`} itemScope itemType="https://schema.org/LocalBusiness">
        <h3 className="font-semibold text-lg mb-4" itemProp="name">{business.name}</h3>
        
        <div className="flex items-start space-x-3" itemScope itemType="https://schema.org/PostalAddress">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm">
            <div itemProp="streetAddress">{business.address.street}</div>
            <div>
              <span itemProp="addressLocality">{business.address.city}</span>,{' '}
              <span itemProp="addressRegion">{business.address.state}</span>{' '}
              <span itemProp="postalCode">{business.address.zipCode}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <a 
            href={`tel:${formatPhoneLink(business.phone)}`}
            className="text-sm hover:text-blue-400 transition-colors"
            itemProp="telephone"
          >
            {formatPhoneDisplay(business.phone)}
          </a>
        </div>

        {showEmail && business.email && (
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" aria-hidden="true" />
            <a 
              href={`mailto:${business.email}`}
              className="text-sm hover:text-blue-400 transition-colors"
              itemProp="email"
            >
              {business.email}
            </a>
          </div>
        )}

        {showHours && hours && (
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm">
              <div className="font-medium mb-1">Hours:</div>
              {hours.slice(0, 3).map((day, index) => (
                <div key={index} className="text-xs text-gray-300">
                  {day.day}: {day.closed ? 'Closed' : `${day.open} - ${day.close}`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Contact page variant - detailed layout
  if (variant === 'contact') {
    return (
      <div className={`nap-contact bg-white p-6 rounded-lg shadow-lg ${className}`} itemScope itemType="https://schema.org/LocalBusiness">
        <h2 className="text-2xl font-bold mb-6" itemProp="name">{business.name}</h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4" itemScope itemType="https://schema.org/PostalAddress">
            <div className="bg-blue-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
              <div className="text-gray-600">
                <div itemProp="streetAddress">{business.address.street}</div>
                <div>
                  <span itemProp="addressLocality">{business.address.city}</span>,{' '}
                  <span itemProp="addressRegion">{business.address.state}</span>{' '}
                  <span itemProp="postalCode">{business.address.zipCode}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Phone className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <a 
                href={`tel:${formatPhoneLink(business.phone)}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
                itemProp="telephone"
              >
                {formatPhoneDisplay(business.phone)}
              </a>
            </div>
          </div>

          {showEmail && business.email && (
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a 
                  href={`mailto:${business.email}`}
                  className="text-blue-600 hover:text-blue-800"
                  itemProp="email"
                >
                  {business.email}
                </a>
              </div>
            </div>
          )}

          {showHours && hours && (
            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <div className="space-y-1">
                  {hours.map((day, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{day.day}:</span>
                      <span className="text-gray-600">
                        {day.closed ? 'Closed' : `${day.open} - ${day.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`nap-inline ${className}`} itemScope itemType="https://schema.org/LocalBusiness">
      <div className="space-y-2">
        <div itemProp="name" className="font-semibold">{business.name}</div>
        <div itemScope itemType="https://schema.org/PostalAddress">
          <div itemProp="streetAddress">{business.address.street}</div>
          <div>
            <span itemProp="addressLocality">{business.address.city}</span>,{' '}
            <span itemProp="addressRegion">{business.address.state}</span>{' '}
            <span itemProp="postalCode">{business.address.zipCode}</span>
          </div>
        </div>
        <div>
          <a 
            href={`tel:${formatPhoneLink(business.phone)}`}
            className="text-blue-600 hover:text-blue-800"
            itemProp="telephone"
          >
            {formatPhoneDisplay(business.phone)}
          </a>
        </div>
      </div>
    </div>
  );
}

// Multi-location NAP component
export function MultiLocationNAP({ 
  locations, 
  variant = 'inline' 
}: { 
  locations: BusinessContact[]; 
  variant?: 'header' | 'footer' | 'contact' | 'inline';
}) {
  return (
    <div className="multi-location-nap">
      <h3 className="text-lg font-semibold mb-4">Our Locations</h3>
      <div className={`space-y-6 ${variant === 'header' ? 'md:space-y-0 md:space-x-8 md:flex' : ''}`}>
        {locations.map((location, index) => (
          <NAPComponent
            key={index}
            business={location}
            variant={variant}
            className={variant === 'header' ? 'flex-1' : ''}
          />
        ))}
      </div>
    </div>
  );
}