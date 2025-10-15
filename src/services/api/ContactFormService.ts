import { BaseApiService, RequestConfig } from './BaseApiService';
import type {
  ContactFormSubmission,
  EdgeFunctionResponse,
  ApiResponse
} from '../../types/database.types';

export class ContactFormService extends BaseApiService {
  async submitContactForm(
    formData: ContactFormSubmission,
    config?: RequestConfig
  ): Promise<EdgeFunctionResponse> {
    try {
      const response = await this.callEdgeFunction<ContactFormSubmission, EdgeFunctionResponse>(
        'submit-contact-form',
        formData,
        config
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to submit contact form');
      }

      return response;
    } catch (error) {
      const appError = this.handleSupabaseError(error, {
        action: 'submit_contact_form',
        email: formData.email,
        projectType: formData.projectType
      });

      throw appError;
    }
  }

  async verifyRecaptcha(
    token: string,
    action: string = 'submit_form',
    config?: RequestConfig
  ): Promise<{ success: boolean; score?: number; error?: string }> {
    try {
      const response = await this.callEdgeFunction<
        { token: string; action: string },
        { success: boolean; score?: number; error?: string }
      >(
        'verify-recaptcha',
        { token, action },
        config
      );

      return response;
    } catch (error) {
      const appError = this.handleSupabaseError(error, {
        action: 'verify_recaptcha'
      });

      return {
        success: false,
        error: appError.userMessage
      };
    }
  }

  async submitWithRecaptcha(
    formData: ContactFormSubmission,
    recaptchaToken: string,
    config?: RequestConfig
  ): Promise<EdgeFunctionResponse> {
    const verificationResult = await this.verifyRecaptcha(
      recaptchaToken,
      'submit_form',
      config
    );

    if (!verificationResult.success) {
      throw new Error(verificationResult.error || 'reCAPTCHA verification failed');
    }

    if (verificationResult.score !== undefined && verificationResult.score < 0.5) {
      throw new Error('Security verification failed. Please try again.');
    }

    return this.submitContactForm(formData, config);
  }
}

export const contactFormService = new ContactFormService();
