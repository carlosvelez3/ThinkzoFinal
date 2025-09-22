# Backend API Setup Guide

This guide walks you through setting up the complete backend API for form submissions with automated email responses.

## 🚀 Quick Start

### Prerequisites
- Supabase project created
- Resend account for email service (or alternative email provider)
- Supabase CLI installed (optional, for local development)

### 1. Database Setup

Run the migration to create the form submissions table:

```sql
-- Execute this in your Supabase SQL Editor
-- File: supabase/migrations/create_form_submissions_table.sql
```

This creates:
- `form_submissions` table with proper constraints
- Row Level Security (RLS) policies
- Performance indexes
- Data validation constraints

### 2. Email Service Setup

#### Option A: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain (for production)

#### Option B: Alternative Providers
- **SendGrid**: Get API key from SendGrid dashboard
- **Mailgun**: Get API key and domain from Mailgun
- **AWS SES**: Configure AWS credentials and region

### 3. Environment Variables

Set these in your Supabase project settings:

```bash
# Required
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com

# Optional (with defaults)
COMPANY_NAME=Thinkzo.ai
```

### 4. Deploy Edge Function

#### Using Supabase CLI:
```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy submit-form
```

#### Using Supabase Dashboard:
1. Go to Edge Functions in your Supabase dashboard
2. Create new function named `submit-form`
3. Copy the code from `supabase/functions/submit-form/index.ts`
4. Deploy the function

### 5. Frontend Integration

The frontend service is already integrated. Update your Supabase configuration:

```typescript
// In your environment variables or config
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'
```

## 📋 API Documentation

### Endpoint
```
POST https://your-project.supabase.co/functions/v1/submit-form
```

### Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_ANON_KEY (optional)
```

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "company": "Acme Corp",
  "projectType": "website",
  "message": "I need a new website..."
}
```

### Response
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": "uuid-here",
  "emailSent": true
}
```

## 🔧 Configuration Options

### Email Template Customization

Edit the `generateEmailTemplate` function in `index.ts`:

```typescript
function generateEmailTemplate(name: string, submissionId: string): string {
  // Customize your email template here
  // Add your branding, colors, and content
}
```

### Validation Rules

Modify validation in the `validateFormData` function:

```typescript
// Add custom validation rules
if (data.company && data.company.includes('spam')) {
  errors.push('Invalid company name')
}
```

### Email Provider Switch

To use a different email provider, replace the `sendConfirmationEmail` function:

```typescript
// Example for SendGrid
async function sendConfirmationEmail(email: string, name: string, submissionId: string) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: FROM_EMAIL },
      subject: 'Thank you for your inquiry',
      content: [{ type: 'text/html', value: generateEmailTemplate(name, submissionId) }]
    })
  })
}
```

## 🛡️ Security Features

### Input Validation
- Email format validation
- Phone number format validation
- String length limits
- Required field checks
- HTML tag removal

### Database Security
- Row Level Security (RLS) enabled
- Service role access only
- SQL injection prevention
- Constraint-based validation

### Rate Limiting (Optional)

Add rate limiting to prevent abuse:

```typescript
// Example rate limiting implementation
const rateLimitKey = `rate_limit:${clientIP}`
const requests = await redis.incr(rateLimitKey)
if (requests === 1) {
  await redis.expire(rateLimitKey, 60) // 1 minute window
}
if (requests > 10) {
  return new Response('Rate limit exceeded', { status: 429 })
}
```

## 📊 Monitoring & Analytics

### Database Queries

Monitor form submissions:

```sql
-- Recent submissions
SELECT * FROM form_submissions 
ORDER BY submitted_at DESC 
LIMIT 10;

-- Email delivery stats
SELECT 
  email_sent_status,
  COUNT(*) as count
FROM form_submissions 
GROUP BY email_sent_status;

-- Daily submission counts
SELECT 
  DATE(submitted_at) as date,
  COUNT(*) as submissions
FROM form_submissions 
GROUP BY DATE(submitted_at)
ORDER BY date DESC;
```

### Error Monitoring

Check Supabase Edge Function logs for:
- Validation errors
- Email delivery failures
- Database connection issues
- Unexpected errors

## 🧪 Testing

### Manual Testing

```bash
# Test the API endpoint
curl -X POST https://your-project.supabase.co/functions/v1/submit-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message for the form submission API."
  }'
```

### Automated Testing

Create test cases for:
- Valid form submissions
- Invalid data validation
- Email delivery confirmation
- Database storage verification
- Error handling scenarios

## 🚨 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check RESEND_API_KEY is set correctly
   - Verify FROM_EMAIL domain is verified
   - Check Supabase function logs for errors

2. **Database errors**
   - Ensure migration was run successfully
   - Check RLS policies are configured
   - Verify service role permissions

3. **CORS errors**
   - Ensure corsHeaders are included in responses
   - Check frontend is using correct endpoint URL

4. **Validation failures**
   - Review validation rules in validateFormData
   - Check input data format matches requirements

### Debug Mode

Enable detailed logging:

```typescript
// Add to the beginning of your function
const DEBUG = Deno.env.get('DEBUG') === 'true'

if (DEBUG) {
  console.log('Request data:', requestData)
  console.log('Validation result:', validation)
}
```

## 📈 Scaling Considerations

### High Volume Handling
- Consider database connection pooling
- Implement proper error retry logic
- Add request queuing for email sending
- Monitor database performance

### Performance Optimization
- Add database indexes for common queries
- Implement caching for repeated operations
- Optimize email template generation
- Use batch processing for high volumes

## 🔄 Maintenance

### Regular Tasks
- Monitor email delivery rates
- Review error logs weekly
- Update email templates as needed
- Check database storage usage
- Update dependencies regularly

### Backup Strategy
- Supabase handles database backups automatically
- Export form submissions periodically
- Keep email template backups
- Document configuration changes

This backend API provides a robust, scalable foundation for handling form submissions with automated email responses. The system is designed to be maintainable, secure, and easily extensible for future requirements.