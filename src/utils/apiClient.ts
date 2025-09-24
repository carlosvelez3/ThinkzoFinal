import { ErrorHandler, ErrorType, ErrorSeverity } from './errorHandler';

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = '', timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleHttpError(response);
      }

      const data = await response.json();
      return {
        data,
        success: true,
        message: data.message,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw ErrorHandler.createAPIError(
            'Request timeout',
            408,
            { endpoint, timeout: this.timeout }
          );
        }

        if (error.message.includes('fetch')) {
          throw ErrorHandler.createNetworkError(
            'Network connection failed',
            { endpoint, originalError: error.message }
          );
        }
      }

      throw error;
    }
  }

  private async handleHttpError(response: Response): Promise<never> {
    let errorData: any = {};
    
    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON, use status text
      errorData = { message: response.statusText };
    }

    const context = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData
    };

    switch (response.status) {
      case 400:
        throw ErrorHandler.createValidationError(
          errorData.message || 'Bad request',
          'Please check your input and try again.',
          context
        );
      
      case 401:
        throw ErrorHandler.createAPIError(
          errorData.message || 'Unauthorized',
          401,
          context
        );
      
      case 403:
        throw ErrorHandler.createAPIError(
          errorData.message || 'Forbidden',
          403,
          context
        );
      
      case 404:
        throw ErrorHandler.createAPIError(
          errorData.message || 'Not found',
          404,
          context
        );
      
      case 429:
        throw ErrorHandler.createAPIError(
          'Too many requests. Please try again later.',
          429,
          context
        );
      
      case 500:
      case 502:
      case 503:
      case 504:
        throw ErrorHandler.createAPIError(
          'Server error. Please try again later.',
          response.status,
          context
        );
      
      default:
        throw ErrorHandler.createAPIError(
          errorData.message || 'An error occurred',
          response.status,
          context
        );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}

// Create default instance
export const apiClient = new ApiClient(import.meta.env.VITE_SUPABASE_URL || '');

// Utility function for handling API calls with automatic error handling
export async function withApiErrorHandling<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  context?: Record<string, any>
): Promise<T | null> {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    ErrorHandler.handle(error, context);
    return null;
  }
}