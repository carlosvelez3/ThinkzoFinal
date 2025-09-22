import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star, ExternalLink } from 'lucide-react';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

interface GoogleBusinessProfileProps {
  businessName: string;
  address: string;
  phone: string;
  website?: string;
  googleMapsEmbedUrl: string;
  placeId?: string;
  hours: BusinessHours[];
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

export function GoogleMapsEmbed({ 
  embedUrl, 
  businessName, 
  address 
}: { 
  embedUrl: string; 
  businessName: string; 
  address: string; 
}) {
  return (
    <div className="google-maps-container">
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${businessName} at ${address}`}
          aria-label={`Interactive map showing the location of ${businessName}`}
        />
      </div>
      
      {/* Map overlay with business info */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md border">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">{businessName}</h3>
            <p className="text-gray-600 text-sm">{address}</p>
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')}
              className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessHours({ hours }: { hours: BusinessHours[] }) {
  const [currentDay, setCurrentDay] = useState<string>('');

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setCurrentDay(today);
  }, []);

  const isOpen = (day: BusinessHours) => {
    if (day.closed) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = day.open.split(':').map(Number);
    const [closeHour, closeMin] = day.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const todaysHours = hours.find(h => h.day === currentDay);
  const isCurrentlyOpen = todaysHours ? isOpen(todaysHours) : false;

  return (
    <div className="business-hours bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-600" aria-hidden="true" />
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isCurrentlyOpen 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isCurrentlyOpen ? 'Open Now' : 'Closed'}
        </span>
      </div>
      
      <table 
        className="w-full border-collapse"
        role="table"
        aria-label="Business operating hours for each day of the week"
      >
        <caption className="text-lg font-semibold text-gray-900 mb-4 text-left">
          Business Hours
        </caption>
        
        <thead>
          <tr className="sr-only">
            <th scope="col" className="text-left font-medium text-gray-700">
              Day of Week
            </th>
            <th scope="col" className="text-right font-medium text-gray-700">
              Operating Hours
            </th>
          </tr>
        </thead>
        
        <tbody>
          {hours.map((day, index) => (
            <tr 
              key={index}
              className={`${
                day.day === currentDay 
                  ? 'bg-blue-50 border border-blue-200 rounded' 
                  : ''
              }`}
            >
              <th 
                scope="row"
                className={`py-2 px-3 text-left font-medium ${
                  day.day === currentDay ? 'text-blue-900' : 'text-gray-700'
                }`}
              >
                {day.day}
                {day.day === currentDay && (
                  <span className="sr-only"> (Today)</span>
                )}
              </th>
              <td 
                className={`py-2 px-3 text-right ${
                  day.day === currentDay ? 'text-blue-800' : 'text-gray-600'
                }`}
              >
                {day.closed ? (
                  <span aria-label="Closed all day">Closed</span>
                ) : (
                  <span aria-label={`Open from ${day.open} to ${day.close}`}>
                    {day.open} - {day.close}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ClickToCall({ phone, businessName }: { phone: string; businessName: string }) {
  const formatPhoneDisplay = (phone: string) => {
    // Format phone number for display (e.g., (555) 123-4567)
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const formatPhoneLink = (phone: string) => {
    // Format phone number for tel: link
    return phone.replace(/\D/g, '');
  };

  return (
    <div className="click-to-call">
      <a
        href={`tel:${formatPhoneLink(phone)}`}
        className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        aria-label={`Call ${businessName} at ${formatPhoneDisplay(phone)}`}
      >
        <Phone className="w-5 h-5 mr-2" />
        Call {formatPhoneDisplay(phone)}
      </a>
    </div>
  );
}

export function ReviewsWidget({ 
  reviews, 
  averageRating, 
  totalReviews,
  businessName 
}: { 
  reviews?: Review[]; 
  averageRating?: number; 
  totalReviews?: number;
  businessName: string;
}) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="reviews-widget bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
        <p className="text-gray-600">No reviews available yet.</p>
      </div>
    );
  }

  return (
    <div className="reviews-widget bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        {averageRating && totalReviews && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(Math.round(averageRating))}
              <span className="sr-only">
                Average rating: {averageRating.toFixed(1)} out of 5 stars
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {reviews.slice(0, 5).map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start space-x-3">
              {review.avatar ? (
                <img
                  src={review.avatar}
                  alt={`${review.author}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {review.author.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{review.author}</h4>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                
                      <span className="sr-only">{review.rating} out of 5 stars</span>
                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(businessName)}+reviews`, '_blank')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          View all reviews on Google
        </button>
      </div>
    </div>
  );
}

export function GoogleBusinessProfile(props: GoogleBusinessProfileProps) {
  return (
    <div className="google-business-profile space-y-6">
      {/* Google Maps Embed */}
      <GoogleMapsEmbed
        embedUrl={props.googleMapsEmbedUrl}
        businessName={props.businessName}
        address={props.address}
      />

      {/* Business Hours */}
      <BusinessHours hours={props.hours} />

      {/* Click to Call */}
      <ClickToCall phone={props.phone} businessName={props.businessName} />

      {/* Reviews Widget */}
      <ReviewsWidget
        reviews={props.reviews}
        averageRating={props.averageRating}
        totalReviews={props.totalReviews}
        businessName={props.businessName}
      />
    </div>
  );
}