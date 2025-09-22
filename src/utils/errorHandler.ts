// Comprehensive Error Handling Utilities
import { toast } from 'react-hot-toast';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  OFFLINE = 'OFFLINE',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly userMessage: string;
  public readonly originalError?: Error;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;
  public readonly retryable: boolean;

  constructor({
    message,
    type = ErrorType.UNKNOWN,
    severity = ErrorSeverity.MEDIUM,
    userMessage,
    originalError,
    context,
    retryable = false
  }: {
    message: string;
    type?: ErrorType;
    severity?: ErrorSeverity;
    userMessage?: string;
    originalError?: Error;
    context?: Record<string, any>;
    retryable?: boolean;
  }) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.userMessage = userMessage || this.getDefaultUserMessage(type);
    this.originalError = originalError;
    this.context = context;
    this.timestamp = new Date();
    this.retryable = retryable;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  private getDefaultUserMessage(type: ErrorType): string {
    const messages = {
      [ErrorType.NETWORK]: 'Connection problem. Please check your internet and try again.',
      [ErrorType.API]: 'Service temporarily unavailable. Please try again in a moment.',
      [ErrorType.VALIDATION]: 'Please check your input and try again.',
      [ErrorType.AUTHENTICATION]: 'Please sign in to continue.',
      [ErrorType.PERMISSION]: 'You don\'t have permission to perform this action.',
      [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
      [ErrorType.SERVER]: 'Server error. Our team has been notified.',
      [ErrorType.CLIENT]: 'Something went wrong. Please refresh the page.',
      [ErrorType.OFFLINE]: 'You\'re offline. Some features may not be available.',
      [ErrorType.TIMEOUT]: 'Request timed out. Please try again.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.'
    };
    return messages[type];
  }
}

// Error logging service
class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: AppError[] = [];
  private maxLogs = 100;

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: AppError): void {
    // Add to local storage for persistence
    this.logs.unshift(error);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Store in localStorage for offline access
    try {
      localStorage.setItem('app_error_logs', JSON.stringify(this.logs.slice(0, 10)));
    } catch (e) {
      console.warn('Could not save error logs to localStorage');
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.severity} Error: ${error.type}`);
      console.error('Message:', error.message);
      console.error('User Message:', error.userMessage);
      console.error('Context:', error.context);
      console.error('Original Error:', error.originalError);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production' && error.severity !== ErrorSeverity.LOW) {
      this.sendToExternalService(error);
    }
  }

  private async sendToExternalService(error: AppError): Promise<void> {
    try {
      // Example: Send to your logging service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: error.message,
      //     type: error.type,
      //     severity: error.severity,
      //     userAgent: navigator.userAgent,
      //     url: window.location.href,
      //     timestamp: error.timestamp,
      //     context: error.context,
      //     stack: error.stack
      //   })
      // });
    } catch (loggingError) {
      console.warn('Failed to send error to logging service:', loggingError);
    }
  }

  getLogs(): AppError[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('app_error_logs');
  }
}

// Main error handler
export class ErrorHandler {
  private static logger = ErrorLogger.getInstance();

  static handle(error: unknown, context?: Record<string, any>): AppError {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = this.categorizeError(error, context);
    } else {
      appError = new AppError({
        message: String(error),
        type: ErrorType.UNKNOWN,
        context
      });
    }

    // Log the error
    this.logger.log(appError);

    // Show user notification
    this.showUserNotification(appError);

    return appError;
  }

  private static categorizeError(error: Error, context?: Record<string, any>): AppError {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
      return new AppError({
        message: error.message,
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        originalError: error,
        context,
        retryable: true
      });
    }

    // Timeout errors
    if (message.includes('timeout')) {
      return new AppError({
        message: error.message,
        type: ErrorType.TIMEOUT,
        severity: ErrorSeverity.MEDIUM,
        originalError: error,
        context,
        retryable: true
      });
    }

    // Validation errors
    if (message.includes('validation') || message.includes('invalid')) {
      return new AppError({
        message: error.message,
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.LOW,
        originalError: error,
        context
      });
    }

    // Authentication errors
    if (message.includes('unauthorized') || message.includes('authentication')) {
      return new AppError({
        message: error.message,
        type: ErrorType.AUTHENTICATION,
        severity: ErrorSeverity.HIGH,
        originalError: error,
        context
      });
    }

    // Default to unknown
    return new AppError({
      message: error.message,
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      originalError: error,
      context
    });
  }

  private static showUserNotification(error: AppError): void {
    const options = {
      duration: error.severity === ErrorSeverity.CRITICAL ? 8000 : 4000,
      position: 'top-right' as const,
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        toast.error(error.userMessage, { ...options, duration: 0 }); // Persistent
        break;
      case ErrorSeverity.HIGH:
        toast.error(error.userMessage, options);
        break;
      case ErrorSeverity.MEDIUM:
        toast.error(error.userMessage, { ...options, duration: 3000 });
        break;
      case ErrorSeverity.LOW:
        toast(error.userMessage, { ...options, duration: 2000 });
        break;
    }
  }

  static createNetworkError(message: string, context?: Record<string, any>): AppError {
    return new AppError({
      message,
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      context,
      retryable: true
    });
  }

  static createValidationError(message: string, userMessage?: string, context?: Record<string, any>): AppError {
    return new AppError({
      message,
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.LOW,
      userMessage,
      context
    });
  }

  static createAPIError(message: string, statusCode?: number, context?: Record<string, any>): AppError {
    const severity = statusCode && statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM;
    return new AppError({
      message,
      type: ErrorType.API,
      severity,
      context: { ...context, statusCode },
      retryable: statusCode ? statusCode >= 500 || statusCode === 429 : false
    });
  }
}

// Utility functions
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    ErrorHandler.handle(error, context);
    return null;
  }
};

export const withErrorBoundary = <T extends any[], R>(
  fn: (...args: T) => R,
  context?: Record<string, any>
) => {
  return (...args: T): R | null => {
    try {
      return fn(...args);
    } catch (error) {
      ErrorHandler.handle(error, context);
      return null;
    }
  };
};