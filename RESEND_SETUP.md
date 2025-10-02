# Resend Email Configuration

This project uses **Resend API** for sending contact form emails. Follow these steps to configure email functionality.

## Prerequisites

1. A Resend account (sign up at https://resend.com)
2. A verified domain in Resend (or use Resend's test domain for development)

## Setup Steps

### 1. Get Your Resend API Key

1. Log in to your Resend account at https://resend.com/login
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Thinkzo Production")
5. Select permissions: **Sending access**
6. Copy the API key (starts with `re_`)

### 2. Verify Your Domain (Production)

For production use, you need to verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `thinkzo.ai`)
4. Add the provided DNS records to your domain registrar:
   - TXT record for domain verification
   - MX records for email delivery
   - DKIM records for email authentication
5. Wait for verification (usually takes a few minutes)

**Note:** For testing, you can use Resend's sandbox domain (`onboarding@resend.dev`) without domain verification.

### 3. Configure Environment Variables

You need to set the Resend API key as an environment variable in your Supabase project.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Settings**
3. Add the following environment variables:

```
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=team@thinkzo.ai
FROM_NAME=Thinkzo.ai
```

#### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Set the Resend API key
supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here

# Set the from email address (must be verified in Resend)
supabase secrets set FROM_EMAIL=team@thinkzo.ai

# Set the from name
supabase secrets set FROM_NAME=Thinkzo.ai
```

### 4. Deploy the Edge Function

Deploy the updated edge function to Supabase:

```bash
# If you have the deployment tool available
# The function will automatically use the new Resend configuration
```

## Email Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RESEND_API_KEY` | Yes | - | Your Resend API key (starts with `re_`) |
| `FROM_EMAIL` | No | `team@thinkzo.ai` | Email address to send from (must be verified in Resend) |
| `FROM_NAME` | No | `Thinkzo.ai` | Display name for outgoing emails |

### Email Types

The contact form sends two types of emails:

1. **Team Notification** → `team@thinkzo.ai`
   - Subject: "New Project Inquiry: [Project Type]"
   - Contains: Customer details, project info, submission metadata

2. **Customer Confirmation** → Customer's email address
   - Subject: "Thank You for Your Project Inquiry - Thinkzo.ai"
   - Contains: Submission confirmation, next steps, reference ID

## Testing

### Test in Development

For local testing, you can use Resend's test mode:

1. Use a test API key from Resend dashboard
2. Emails will be logged but not actually sent
3. Check Resend dashboard → **Emails** to see test emails

### Test in Production

1. Submit a contact form from your website
2. Check Resend dashboard → **Emails** to verify delivery
3. Check your inbox at `team@thinkzo.ai` for team notification
4. Check the customer's inbox for confirmation email

## Troubleshooting

### "Resend API key not configured"

- Verify the `RESEND_API_KEY` environment variable is set in Supabase
- Redeploy the edge function after setting environment variables

### "Email sending failed"

- Check Resend dashboard → **Logs** for detailed error messages
- Verify your domain is properly verified in Resend
- Ensure the FROM_EMAIL domain matches your verified domain

### "Domain not verified"

- Complete domain verification in Resend dashboard
- For testing, use `onboarding@resend.dev` as FROM_EMAIL

### Rate Limits

Resend has the following rate limits:
- **Free tier**: 100 emails/day, 3,000 emails/month
- **Pro tier**: 50,000 emails/month
- Monitor usage in Resend dashboard

## Migration Notes

This project was migrated from SMTP (SpaceMail) to Resend API for:
- ✅ Better deliverability and inbox placement
- ✅ Simpler configuration (no SMTP server management)
- ✅ Built-in analytics and email tracking
- ✅ More reliable API with better error handling
- ✅ No dependency on external SMTP libraries

### Removed Configuration

The following environment variables are no longer needed:
- ~~`SMTP_HOST`~~
- ~~`SMTP_PORT`~~
- ~~`SMTP_USER`~~
- ~~`SMTP_PASSWORD`~~
- ~~`SMTP_FROM_EMAIL`~~ → Use `FROM_EMAIL` instead
- ~~`SMTP_FROM_NAME`~~ → Use `FROM_NAME` instead

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference/emails/send-email)
- [Domain Verification Guide](https://resend.com/docs/dashboard/domains/introduction)
- [Resend Dashboard](https://resend.com/overview)

## Support

If you encounter issues:
1. Check the Supabase Edge Function logs
2. Review Resend dashboard logs
3. Verify all environment variables are set correctly
4. Ensure your domain is verified in Resend

---

**Last Updated:** October 2, 2025
