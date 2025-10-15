import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import type { Database, ApiResponse } from '../../types/database.types';
import { ErrorHandler, ErrorType, ErrorSeverity, AppError } from '../../utils/errorHandler';

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryableStatuses: number[];
}

export abstract class BaseApiService {
  protected client: SupabaseClient<Database>;
  protected defaultTimeout = 15000;
  protected retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    retryableStatuses: [408, 429, 500, 502, 503, 504]
  };

  constructor(client?: SupabaseClient<Database>) {
    this.client = client || supabase;
  }

  protected async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    if (signal) {
      signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const result = await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error('Request timeout'));
          });
        })
      ]);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  protected calculateBackoff(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.baseDelay * Math.pow(2, attempt),
      this.retryConfig.maxDelay
    );
    const jitter = Math.random() * 0.3 * delay;
    return delay + jitter;
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected isRetryableError(error: any, statusCode?: number): boolean {
    if (statusCode && this.retryConfig.retryableStatuses.includes(statusCode)) {
      return true;
    }

    const message = error?.message?.toLowerCase() || '';
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('fetch') ||
      message.includes('econnreset') ||
      message.includes('enotfound')
    );
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    config?: RequestConfig
  ): Promise<T> {
    const maxRetries = config?.retries ?? this.retryConfig.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (config?.signal?.aborted) {
          throw new Error('Request aborted');
        }

        const result = await this.withTimeout(
          operation(),
          config?.timeout || this.defaultTimeout,
          config?.signal
        );
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxRetries && this.isRetryableError(error)) {
          const delay = config?.retryDelay || this.calculateBackoff(attempt);
          await this.sleep(delay);
          continue;
        }

        break;
      }
    }

    throw lastError || new Error('Request failed');
  }

  protected handleSupabaseError(error: any, context?: Record<string, any>): AppError {
    const errorMessage = error?.message || 'Unknown Supabase error';
    const errorCode = error?.code;
    const errorDetails = error?.details;

    let errorType = ErrorType.API;
    let severity = ErrorSeverity.MEDIUM;
    let userMessage = 'An error occurred. Please try again.';
    let retryable = false;

    if (errorCode === 'PGRST301') {
      errorType = ErrorType.NOT_FOUND;
      userMessage = 'The requested resource was not found.';
    } else if (errorCode === '42501') {
      errorType = ErrorType.PERMISSION;
      severity = ErrorSeverity.HIGH;
      userMessage = 'You do not have permission to perform this action.';
    } else if (errorCode === '23505') {
      errorType = ErrorType.VALIDATION;
      userMessage = 'This record already exists.';
    } else if (errorMessage.includes('JWT') || errorMessage.includes('token')) {
      errorType = ErrorType.AUTHENTICATION;
      severity = ErrorSeverity.HIGH;
      userMessage = 'Authentication failed. Please sign in again.';
    } else if (errorMessage.includes('timeout')) {
      errorType = ErrorType.TIMEOUT;
      userMessage = 'Request timed out. Please try again.';
      retryable = true;
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      errorType = ErrorType.NETWORK;
      userMessage = 'Connection problem. Please check your internet and try again.';
      retryable = true;
    }

    return new AppError({
      message: errorMessage,
      type: errorType,
      severity,
      userMessage,
      context: {
        ...context,
        errorCode,
        errorDetails,
        supabaseError: true
      },
      retryable
    });
  }

  protected transformResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data
    };
  }

  protected transformError(error: unknown, context?: Record<string, any>): ApiResponse {
    const appError = error instanceof AppError
      ? error
      : ErrorHandler.handle(error, context);

    return {
      success: false,
      error: appError.userMessage,
      message: appError.message
    };
  }

  protected getEdgeFunctionUrl(functionName: string): string {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL is not defined');
    }
    return `${supabaseUrl}/functions/v1/${functionName}`;
  }

  protected getEdgeFunctionHeaders(): HeadersInit {
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!anonKey) {
      throw new Error('VITE_SUPABASE_ANON_KEY is not defined');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
      'apikey': anonKey,
      'X-Client-Info': 'thinkzo-web-app'
    };
  }

  protected async callEdgeFunction<TRequest = any, TResponse = any>(
    functionName: string,
    payload: TRequest,
    config?: RequestConfig
  ): Promise<TResponse> {
    const url = this.getEdgeFunctionUrl(functionName);
    const headers = this.getEdgeFunctionHeaders();

    return this.executeWithRetry(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: config?.signal
      });

      if (!response.ok) {
        let errorMessage = `Edge function error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = await response.text() || errorMessage;
        }

        throw new AppError({
          message: errorMessage,
          type: ErrorType.API,
          severity: response.status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
          context: {
            functionName,
            statusCode: response.status,
            url
          },
          retryable: response.status >= 500 || response.status === 429
        });
      }

      const data = await response.json();
      return data;
    }, config);
  }
}
