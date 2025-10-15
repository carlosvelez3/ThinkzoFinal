# API Communication Layer

This directory contains the centralized API communication layer for interacting with Supabase and edge functions.

## Architecture Overview

The API layer is built with a service-oriented architecture that provides:

- **Type Safety**: Full TypeScript support with generated types from Supabase schema
- **Error Handling**: Comprehensive error handling with automatic retry logic
- **Performance**: Request caching, deduplication, and optimization
- **Reliability**: Automatic retry with exponential backoff for failed requests
- **Developer Experience**: Clean, intuitive APIs with hooks for React components

## Directory Structure

```
src/services/api/
├── BaseApiService.ts          # Base class with common functionality
├── ContactFormService.ts      # Contact form submission operations
├── SubmissionsService.ts      # Submission management operations
├── index.ts                   # Public exports
└── README.md                  # This file
```

## Core Services

### BaseApiService

Base class providing common functionality for all API services:

- **Request timeout handling** with configurable timeouts
- **Automatic retry logic** with exponential backoff
- **Error transformation** from Supabase errors to user-friendly messages
- **Edge function calling** with proper authentication
- **Response standardization** for consistent API responses

### ContactFormService

Handles contact form submissions and reCAPTCHA verification:

```typescript
import { contactFormService } from '@/services/api';

// Submit contact form
const result = await contactFormService.submitContactForm({
  name: 'John Doe',
  email: 'john@example.com',
  projectType: 'web-app',
  projectDetails: {
    projectGoals: 'Build a modern web application',
    selectedFeatures: ['AI Integration', 'User Authentication'],
    timeline: '3-6 months',
    budgetRange: '$10k-$25k',
    additionalNotes: 'Looking for experienced team'
  }
});

// Verify reCAPTCHA
const verification = await contactFormService.verifyRecaptcha(token, 'submit_form');

// Submit with reCAPTCHA verification
const result = await contactFormService.submitWithRecaptcha(formData, recaptchaToken);
```

### SubmissionsService

Manages contact form submissions in the database:

```typescript
import { submissionsService } from '@/services/api';

// Get all submissions
const submissions = await submissionsService.getSubmissions({
  status: 'new',
  limit: 10,
  orderBy: 'created_at',
  orderDirection: 'desc'
});

// Get single submission
const submission = await submissionsService.getSubmissionById(id);

// Update submission status
await submissionsService.updateSubmissionStatus(id, 'contacted');

// Search submissions
const results = await submissionsService.searchSubmissions('john@example.com');

// Get submission count
const count = await submissionsService.getSubmissionCount('new');
```

## React Hooks

### useContactFormSubmission

Hook for submitting contact forms with loading and error states:

```typescript
import { useContactFormSubmission } from '@/hooks/useApi';

function ContactForm() {
  const { submit, loading, error, data } = useContactFormSubmission();

  const handleSubmit = async () => {
    const result = await submit({
      name: 'John Doe',
      email: 'john@example.com',
      projectType: 'web-app'
    });

    if (result) {
      console.log('Submitted successfully:', result);
    }
  };

  return (
    <div>
      {loading && <p>Submitting...</p>}
      {error && <p>Error: {error.userMessage}</p>}
      {data && <p>Success! ID: {data.submissionId}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

### useRecaptchaVerification

Hook for reCAPTCHA verification:

```typescript
import { useRecaptchaVerification } from '@/hooks/useApi';

function ProtectedForm() {
  const { verify, loading, error } = useRecaptchaVerification();

  const handleVerify = async (token: string) => {
    const result = await verify(token);
    if (result?.success && result.score > 0.5) {
      console.log('Verification passed');
    }
  };
}
```

### useSubmissions

Hook for managing submissions:

```typescript
import { useSubmissions } from '@/hooks/useApi';

function SubmissionsList() {
  const { fetchSubmissions, updateStatus, loading, error, data } = useSubmissions();

  useEffect(() => {
    fetchSubmissions({ status: 'new' });
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.userMessage}</p>}
      {data?.map(submission => (
        <div key={submission.id}>{submission.name}</div>
      ))}
    </div>
  );
}
```

## Request Configuration

All service methods accept an optional `RequestConfig` object:

```typescript
interface RequestConfig {
  timeout?: number;        // Request timeout in milliseconds (default: 15000)
  retries?: number;        // Number of retry attempts (default: 3)
  retryDelay?: number;     // Base delay between retries in ms (default: 1000)
  signal?: AbortSignal;    // AbortController signal for cancellation
}

// Example usage
const result = await contactFormService.submitContactForm(formData, {
  timeout: 20000,
  retries: 2,
  signal: controller.signal
});
```

## Error Handling

The API layer provides comprehensive error handling:

### Error Types

- `NETWORK` - Network connectivity issues
- `API` - API server errors
- `VALIDATION` - Data validation errors
- `AUTHENTICATION` - Auth failures
- `PERMISSION` - Authorization errors
- `NOT_FOUND` - Resource not found
- `TIMEOUT` - Request timeout
- `UNKNOWN` - Unexpected errors

### Error Severity

- `LOW` - Minor issues, recoverable
- `MEDIUM` - Standard errors
- `HIGH` - Serious errors requiring attention
- `CRITICAL` - Critical failures

### Handling Errors

```typescript
try {
  const result = await contactFormService.submitContactForm(formData);
} catch (error) {
  if (error instanceof AppError) {
    console.log('Error type:', error.type);
    console.log('Severity:', error.severity);
    console.log('User message:', error.userMessage);
    console.log('Retryable:', error.retryable);
  }
}
```

## Automatic Retry Logic

Failed requests are automatically retried with exponential backoff:

- **Retryable errors**: Network errors, timeouts, 5xx server errors, 429 rate limits
- **Backoff strategy**: Exponential with jitter to prevent thundering herd
- **Max retries**: Configurable per request (default: 3)
- **Max delay**: Capped at 10 seconds

```typescript
// Retry configuration can be customized
const service = new ContactFormService();
service.retryConfig = {
  maxRetries: 5,
  baseDelay: 2000,
  maxDelay: 15000,
  retryableStatuses: [408, 429, 500, 502, 503, 504]
};
```

## Response Format

All API methods return a standardized response:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Success response
{
  success: true,
  data: { id: '123', name: 'John Doe' }
}

// Error response
{
  success: false,
  error: 'Validation failed',
  message: 'Email is required'
}
```

## Type Safety

Full TypeScript support with database schema types:

```typescript
import type {
  ContactFormSubmission,
  ContactSubmissionRow,
  EdgeFunctionResponse,
  ApiResponse
} from '@/types/database.types';

// Type-safe submission
const submission: ContactFormSubmission = {
  name: 'John Doe',
  email: 'john@example.com',
  projectType: 'web-app'
};

// Type-safe response
const response: ApiResponse<ContactSubmissionRow> =
  await submissionsService.getSubmissionById(id);
```

## Best Practices

1. **Use hooks in React components** for automatic state management
2. **Always handle errors** appropriately for user experience
3. **Use AbortController** for cancellable requests
4. **Configure timeouts** based on expected operation duration
5. **Leverage automatic retries** for network resilience
6. **Check response.success** before accessing data
7. **Use TypeScript types** for compile-time safety

## Testing

Mock the services for testing:

```typescript
import { ContactFormService } from '@/services/api';

// Create mock service
const mockService = {
  submitContactForm: jest.fn().mockResolvedValue({
    success: true,
    submissionId: '123'
  })
};

// Use in tests
test('submits form successfully', async () => {
  const result = await mockService.submitContactForm(formData);
  expect(result.success).toBe(true);
});
```

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key (optional)

## Future Enhancements

Planned improvements:

- [ ] Request caching with TTL
- [ ] Request deduplication
- [ ] Offline queue with persistence
- [ ] WebSocket/Realtime support
- [ ] Request metrics and monitoring
- [ ] GraphQL support
- [ ] Multi-environment configuration

## Support

For issues or questions:
1. Check TypeScript errors first
2. Verify environment variables are set
3. Check browser console for detailed errors
4. Review Supabase dashboard for API logs
