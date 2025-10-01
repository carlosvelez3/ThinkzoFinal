// Form submission service for frontend integration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export interface FormSubmissionData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  message: string;
  recaptchaToken?: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  submissionId: string;
  emailSent: boolean;
}

export interface FormSubmissionError {
  error: string;
  details?: string[];
}

class FormSubmissionService {
  private readonly endpoint = '/functions/v1/submit-form';

  /**
   * Submit form data directly to Supabase and send email
   */
  async submitForm(data: FormSubmissionData): Promise<FormSubmissionResponse> {
    try {
      // Insert form submission into database
      const { data: submission, error } = await supabase
        .from('form_submissions')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          project_type: data.projectType || null,
          message: data.message,
          email_sent_status: 'pending'
        })
        .select('id')
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to save submission');
      }

      if (!submission) {
        throw new Error('No submission data returned');
      }

      let emailSent = false;

      // Send email via edge function
      try {
        const emailResponse = await fetch(
          `${supabaseUrl}/functions/v1/resend-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              phone: data.phone,
              company: data.company,
              projectType: data.projectType,
              message: data.message,
              submissionId: submission.id
            })
          }
        );

        if (emailResponse.ok) {
          emailSent = true;
          // Update email status to sent
          await supabase
            .from('form_submissions')
            .update({ email_sent_status: 'sent' })
            .eq('id', submission.id);
        } else {
          const errorData = await emailResponse.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Email send failed:', errorData);
          // Update email status to failed with error log
          await supabase
            .from('form_submissions')
            .update({
              email_sent_status: 'failed',
              email_error_log: errorData.error || errorData.details || 'Email send failed'
            })
            .eq('id', submission.id);
        }
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Update email status to failed
        await supabase
          .from('form_submissions')
          .update({
            email_sent_status: 'failed',
            email_error_log: emailError instanceof Error ? emailError.message : 'Email send failed'
          })
          .eq('id', submission.id);
      }

      return {
        success: true,
        message: 'Form submitted successfully',
        submissionId: submission.id,
        emailSent
      };
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }

  /**
   * Submit form with automatic error handling
   */
  async submitFormWithErrorHandling(data: FormSubmissionData): Promise<FormSubmissionResponse | null> {
    try {
      return await this.submitForm(data);
    } catch (error) {
      console.error('Form submission failed:', error);
      return null;
    }
  }

  /**
   * Validate form data before submission
   */
  validateFormData(data: Partial<FormSubmissionData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required field validation
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email address is required');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('Message is required and must be at least 10 characters');
    }

    // Length validation
    if (data.name && data.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    if (data.message && data.message.length > 2000) {
      errors.push('Message must be less than 2000 characters');
    }

    if (data.company && data.company.length > 100) {
      errors.push('Company name must be less than 100 characters');
    }

    // Phone validation (if provided)
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Email format validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Phone format validation
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Sanitize input data
   */
  sanitizeFormData(data: FormSubmissionData): FormSubmissionData {
    return {
      name: this.sanitizeString(data.name),
      email: data.email.toLowerCase().trim(),
      phone: data.phone ? this.sanitizeString(data.phone) : undefined,
      company: data.company ? this.sanitizeString(data.company) : undefined,
      projectType: data.projectType ? this.sanitizeString(data.projectType) : undefined,
      message: this.sanitizeString(data.message)
    };
  }

  /**
   * Sanitize string input
   */
  private sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 2000); // Limit length
  }
}

// Export singleton instance
export const formSubmissionService = new FormSubmissionService();

// Utility function for easy form submission
export async function submitContactForm(data: FormSubmissionData): Promise<{
  success: boolean;
  response?: FormSubmissionResponse;
  errors?: string[];
}> {
  // Validate data first
  const validation = formSubmissionService.validateFormData(data);
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }

  // Sanitize data
  const sanitizedData = formSubmissionService.sanitizeFormData(data);

  // Submit form
  try {
    const response = await formSubmissionService.submitFormWithErrorHandling(sanitizedData);
    
    if (response) {
      return {
        success: true,
        response
      };
    } else {
      return {
        success: false,
        errors: ['Form submission failed. Please try again.']
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'An unexpected error occurred']
    };
  }
}
