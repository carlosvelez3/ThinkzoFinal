import { useCallback } from 'react';
import { ErrorHandler, AppError, ErrorType, ErrorSeverity } from '../utils/errorHandler';

export interface UseErrorHandlerReturn {
  handleError: (error: unknown, context?: Record<string, any>) => AppError;
  handleAsyncError: <T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ) => Promise<T | null>;
  createNetworkError: (message: string, context?: Record<string, any>) => AppError;
  createValidationError: (message: string, userMessage?: string, context?: Record<string, any>) => AppError;
  createAPIError: (message: string, statusCode?: number, context?: Record<string, any>) => AppError;
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const handleError = useCallback((error: unknown, context?: Record<string, any>) => {
    return ErrorHandler.handle(error, context);
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError]);

  const createNetworkError = useCallback((message: string, context?: Record<string, any>) => {
    return ErrorHandler.createNetworkError(message, context);
  }, []);

  const createValidationError = useCallback((message: string, userMessage?: string, context?: Record<string, any>) => {
    return ErrorHandler.createValidationError(message, userMessage, context);
  }, []);

  const createAPIError = useCallback((message: string, statusCode?: number, context?: Record<string, any>) => {
    return ErrorHandler.createAPIError(message, statusCode, context);
  }, []);

  return {
    handleError,
    handleAsyncError,
    createNetworkError,
    createValidationError,
    createAPIError
  };
}