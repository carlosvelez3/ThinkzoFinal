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
        throw new Error('Unable to submit form. Please refresh the page and try again.');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/submit-contact-form`;

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

      if (!response.ok) {
        let errorMessage = 'Failed to submit form. Please try again.';
        try {
          const result = await response.json();
          errorMessage = result.error || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
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