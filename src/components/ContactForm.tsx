import React from 'react';
import { SmartForm } from './FormValidation/SmartForm';
import toast from 'react-hot-toast';

interface ContactFormProps {
  onCloseModal: () => void;
}


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
        throw new Error('Application configuration error. Please contact support.');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/submit-contact-form`;

      console.log('Submitting form to:', apiUrl);
      console.log('Form data:', { ...formData, email: '***' });

      // Submit to edge function with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

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
        throw new Error(errorMessage);
      }

      // Show success message
      toast.success('Thank you! Your inquiry has been submitted successfully.');

      return result;
    } catch (error) {
      console.error('Form submission error:', error);
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
      showProgressSteps={true}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
    />
  );
}