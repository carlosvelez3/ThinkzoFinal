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
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Validate environment variables
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase configuration:', {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey
        });
        toast.error('Application configuration error. Please contact support.');
        throw new Error('Missing Supabase environment variables');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/submit-contact-form`;

      console.log('Submitting form to:', apiUrl);
      console.log('Form data:', { ...formData, email: '***' });

      // Submit to edge function with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Response status:', response.status);
      console.log('Response data:', result);

      if (!response.ok) {
        const errorMessage = result.error || `Server error: ${response.status}`;
        console.error('Submission failed:', errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Show success message
      toast.success('Thank you! Your inquiry has been submitted successfully.');

      return result;
    } catch (error) {
      console.error('Form submission error:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast.error('Request timed out. Please check your connection and try again.');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          toast.error('Network error. Please check your internet connection.');
        } else if (!error.message.includes('Server error')) {
          toast.error('Failed to submit form. Please try again.');
        }
      }

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