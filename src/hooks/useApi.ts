import { useState, useCallback } from 'react';
import { contactFormService, submissionsService } from '../services/api';
import type { ContactFormSubmission, EdgeFunctionResponse, ApiResponse } from '../types/database.types';
import { AppError } from '../utils/errorHandler';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

export interface UseApiResult<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useContactFormSubmission() {
  const [state, setState] = useState<UseApiState<EdgeFunctionResponse>>({
    data: null,
    loading: false,
    error: null
  });

  const submit = useCallback(async (
    formData: ContactFormSubmission
  ): Promise<EdgeFunctionResponse | null> => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await contactFormService.submitContactForm(formData, {
        timeout: 15000,
        retries: 2
      });

      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError({
        message: error instanceof Error ? error.message : 'Unknown error',
        userMessage: 'Failed to submit form. Please try again.'
      });

      setState({ data: null, loading: false, error: appError });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    submit,
    reset
  };
}

export function useRecaptchaVerification() {
  const [state, setState] = useState<UseApiState<{ success: boolean; score?: number }>>({
    data: null,
    loading: false,
    error: null
  });

  const verify = useCallback(async (
    token: string,
    action: string = 'submit_form'
  ): Promise<{ success: boolean; score?: number } | null> => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await contactFormService.verifyRecaptcha(token, action);

      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError({
        message: error instanceof Error ? error.message : 'Unknown error',
        userMessage: 'Verification failed. Please try again.'
      });

      setState({ data: null, loading: false, error: appError });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    verify,
    reset
  };
}

export function useSubmissions() {
  const [state, setState] = useState<UseApiState<any>>({
    data: null,
    loading: false,
    error: null
  });

  const fetchSubmissions = useCallback(async (query?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await submissionsService.getSubmissions(query);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch submissions');
      }

      setState({ data: result.data, loading: false, error: null });
      return result.data;
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError({
        message: error instanceof Error ? error.message : 'Unknown error',
        userMessage: 'Failed to load submissions. Please try again.'
      });

      setState(prev => ({ ...prev, loading: false, error: appError }));
      return null;
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: any) => {
    try {
      const result = await submissionsService.updateSubmissionStatus(id, status);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update status');
      }

      return result.data;
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError({
        message: error instanceof Error ? error.message : 'Unknown error',
        userMessage: 'Failed to update status. Please try again.'
      });

      setState(prev => ({ ...prev, error: appError }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    fetchSubmissions,
    updateStatus,
    reset
  };
}
