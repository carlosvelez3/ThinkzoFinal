import React from 'react';
import { SmartForm } from './FormValidation/SmartForm';
import { contactFormService } from '../services/api';
import type { ContactFormSubmission } from '../types/database.types';

interface ContactFormProps {
  onCloseModal: () => void;
}

export function ContactForm({ onCloseModal }: ContactFormProps) {
  const handleSubmit = async (formData: any) => {
    const submissionData: ContactFormSubmission = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      projectType: formData.projectType,
      projectDetails: formData.projectDetails
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const result = await contactFormService.submitContactForm(submissionData, {
        timeout: 15000,
        signal: controller.signal,
        retries: 2
      });

      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
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