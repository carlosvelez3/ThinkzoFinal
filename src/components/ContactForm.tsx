import React from 'react';
import { SmartForm } from './FormValidation/SmartForm';
import { useRecaptchaV3 } from '../hooks/useRecaptchaV3';
import { submitContactForm, FormSubmissionData } from '../services/formSubmissionService';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

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
  const { executeRecaptcha, isReady: recaptchaReady, error: recaptchaError } = useRecaptchaV3();
  const { handleAsyncError, createValidationError } = useErrorHandler();
  const { isOnline, addToOfflineQueue } = useOfflineStatus();

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      // Prepare form data for submission
      const submissionData: FormSubmissionData = {
        name: formData.name || '',
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        projectType: formData.projectType,
        message: formData.message,
        recaptchaToken: formData.recaptchaToken
      };
      
      // Submit form to backend API
      const result = await submitContactForm(submissionData);
      
      if (!result.success) {
        throw new Error(result.errors?.join(', ') || 'Form submission failed');
      }
      
      console.log('Form submitted successfully:', {
        submissionId: result.response?.submissionId,
        emailSent: result.response?.emailSent,
        submittedAt: new Date().toISOString()
      });
      
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
      projectTypes={PROJECT_TYPES}
      showProgressSteps={true}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      executeRecaptcha={executeRecaptcha}
      recaptchaReady={recaptchaReady}
      recaptchaError={recaptchaError}
    />
  );
}