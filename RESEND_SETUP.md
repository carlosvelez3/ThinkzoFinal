# Resend Email Setup Guide

## Overview
Your contact form is now configured to send emails via Resend. Follow these steps to complete the setup.

## Prerequisites
- A Resend account (sign up at https://resend.com)
- A verified domain (or use Resend's test domain for development)

## Step 1: Get Your Resend API Key

1. Log in to your Resend dashboard: https://resend.com/login
2. Navigate to **API Keys** section: https://resend.com/api-keys
3. Click **Create API Key**
4. Give it a name (e.g., "Production Contact Form")
5. Select permissions: **Sending access**
6. Copy the generated API key (starts with `re_`)

## Step 2: Configure Environment Variables

Open your `.env` file and replace the placeholder values:

```env
# Replace with your actual Resend API key
RESEND_API_KEY=re_abc123xyz...

# Replace with your verified domain email
RESEND_FROM_EMAIL=hello@yourdomain.com

# Replace with where you want to receive inquiries
RESEND_TO_EMAIL=team@yourdomain.com
```

### Email Address Requirements

**From Email (`RESEND_FROM_EMAIL`):**
- Must use a domain you've verified in Resend
- For testing, you can use: `onboarding@resend.dev`
- For production, use your own domain (e.g., `hello@yourdomain.com`)

**To Email (`RESEND_TO_EMAIL`):**
- Can be any valid email address
- This is where form submissions will be sent
- Can be multiple addresses (comma-separated)

## Step 3: Verify Domain (Production Only)

For production use, you must verify your domain in Resend:

1. Go to **Domains** in Resend dashboard: https://resend.com/domains
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the provided DNS records to your domain:
   - SPF record
   - DKIM records
   - DMARC record (optional but recommended)
5. Wait for verification (usually 5-10 minutes)

## Step 4: Test Email Delivery

After configuring environment variables:

1. Restart your development server
2. Submit a test form through your website
3. Check your inbox at `RESEND_TO_EMAIL`
4. Verify the email contains all form details
5. Check Resend dashboard for delivery logs

### Troubleshooting

If emails aren't sending:

1. **Check API Key**: Ensure it starts with `re_` and has no extra spaces
2. **Verify From Email**: Must be from a verified domain or use `onboarding@resend.dev` for testing
3. **Check Logs**: Look in browser console and Resend dashboard logs
4. **Database Check**: Query `form_submissions` table to see `email_sent_status`

```sql
SELECT id, name, email, email_sent_status, email_error_log
FROM form_submissions
ORDER BY submitted_at DESC
LIMIT 10;
```

## Step 5: Monitor Email Delivery

Check email status in your database:

- `pending`: Email waiting to be sent
- `sent`: Email successfully delivered
- `failed`: Email send failed (check `email_error_log` column)

### Resend Dashboard

Monitor emails in real-time:
- https://resend.com/emails - View all sent emails
- https://resend.com/logs - Detailed delivery logs
- https://resend.com/analytics - Email performance metrics

## Email Template

The email includes:
- Contact information (name, email, phone, company)
- Project type selection
- Detailed message from the user
- Professional HTML formatting
- Reply-to set to user's email for easy responses

## Rate Limits

Resend free tier includes:
- 100 emails per day
- 3,000 emails per month

For higher volumes, upgrade your Resend plan.

## Security Notes

- API keys are stored in `.env` and never exposed to clients
- Email function runs server-side via Supabase Edge Functions
- All form submissions are logged in database regardless of email status
- CORS headers properly configured for security

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: https://resend.com/support
- Check your database for failed email logs with error details

---

**Ready to Go Live?**

1. ✅ Add production Resend API key
2. ✅ Verify your domain in Resend
3. ✅ Update from/to email addresses
4. ✅ Test with real email addresses
5. ✅ Monitor first few submissions closely
