import React from 'react';
import { SmartForm } from './FormValidation/SmartForm';
import toast from 'react-hot-toast';

interface ContactFormProps {
  onCloseModal: () => void;
}

// Project types for the contact form
const PROJECT_TYPES = [
  { id: 'landing-page', name: 'Landing Page', icon: '🎯', timeline: '1-2 weeks', budget: '$495' },
  { id: 'business-website', name: 'Business Website', icon: '🏢', timeline: '2-4 weeks', budget: '$800-$1,500' },
  { id: 'ecommerce', name: 'E-commerce Store', icon: '🛒', timeline: '4-8 weeks', budget: '$1,500-$3,500' },
  { id: 'web-app', name: 'Web Application', icon: '⚡', timeline: '6-12 weeks', budget: '$3,500+' },
  { id: 'ai-integration', name: 'AI Integration', icon: '🤖', timeline: '4-10 weeks', budget: '$2,000+' },
  { id: 'other', name: 'Other/Custom', icon: '💡', timeline: 'Varies', budget: 'Custom Quote' }
];

export function ContactForm({ onCloseModal }: ContactFormProps) {
  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      // Get Supabase URL from environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/submit-contact-form`;

      // Submit to edge function
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      // Show success message
      toast.success('Thank you! Your inquiry has been submitted successfully.');

      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
      throw error;
    }
  };

  // Handle successful submission
  const handleSuccess = (data: any) => {
    // Close modal after a brief delay to show success state
    setTimeout(() => {
      onCloseModal();
    }, 2000);
  };

  return (
    <SmartForm
      title="Start Your AI Project"
      description="Let's bring your vision to life. Just a few quick questions to get started."
      submitButtonText="Send Project Request"
      projectTypes={PROJECT_TYPES}
      showProgressSteps={true}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
    />
  );
}