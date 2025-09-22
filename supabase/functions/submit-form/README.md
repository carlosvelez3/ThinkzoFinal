# Form Submission API

This Supabase Edge Function handles form submissions with automated email responses.

## Features

- ✅ Form data validation and sanitization
- ✅ Database storage with unique IDs and timestamps
- ✅ Automated confirmation emails
- ✅ Comprehensive error handling and logging
- ✅ CORS support for cross-origin requests
- ✅ Rate limiting ready (can be added)

## API Endpoint

**URL:** `https://your-project.supabase.co/functions/v1/submit-form`
**Method:** `POST`
**Content-Type:** `application/json`

## Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "company": "Acme Corp",
  "projectType": "website",
  "message": "I need a new website for my business..."
}
```

### Required Fields
- `name` (string, 2-100 characters)
- `email` (string, valid email format)
- `message` (string, 10-2000 characters)

### Optional Fields
- `phone` (string, valid phone format)
- `company` (string, max 100 characters)
- `projectType` (string, max 50 characters)

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": "uuid-here",
  "emailSent": true
}
```

### Error Response (400/500)
```json
{
  "error": "Validation failed",
  "details": [
    "Name is required and must be at least 2 characters",
    "Valid email address is required"
  ]
}
```

## Environment Variables

Set these in your Supabase Edge Function environment:

```bash
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

## Database Schema

The function uses the `form_submissions` table with the following structure:

```sql
CREATE TABLE form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  project_type text,
  message text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  email_sent_status text DEFAULT 'pending',
  email_error_log text
);
```

## Email Service Integration

This function uses [Resend](https://resend.com) for email delivery. You can easily swap it for other providers like:

- SendGrid
- Mailgun
- AWS SES
- Postmark

## Security Features

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Email format validation
- Length limits on all fields
- Row Level Security (RLS) enabled

## Error Handling

The function handles various error scenarios:

- Invalid input data (400 Bad Request)
- Database connection issues (500 Internal Server Error)
- Email delivery failures (logged but doesn't fail the request)
- Missing environment variables
- Network timeouts

## Monitoring

All errors and important events are logged to Supabase Edge Function logs. Monitor:

- Form submission rates
- Email delivery success rates
- Validation error patterns
- Database performance

## Rate Limiting (Optional)

To add rate limiting, you can implement it using:

1. Supabase database-based rate limiting
2. External services like Upstash Redis
3. IP-based request counting

## Testing

Test the endpoint using curl:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/submit-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message for the form submission."
  }'
```

## Deployment

1. Create the database table using the migration file
2. Deploy the Edge Function to Supabase
3. Set up environment variables
4. Configure your email service (Resend)
5. Update your frontend to use the new endpoint