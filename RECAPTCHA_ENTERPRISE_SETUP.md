# reCAPTCHA Enterprise Setup Guide

This project uses **Google reCAPTCHA Enterprise** for advanced bot detection and security verification.

## Prerequisites

1. Google Cloud Platform (GCP) account
2. A GCP project with billing enabled
3. reCAPTCHA Enterprise API enabled

## Step 1: Create reCAPTCHA Enterprise Site Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **Security** → **reCAPTCHA Enterprise**
4. Click **Create Key**
5. Configure your key:
   - **Display name**: Choose a descriptive name (e.g., "Thinkzo Production")
   - **Platform type**: Select "Website"
   - **Domains**: Add your domain(s) (e.g., thinkzo.ai, localhost for testing)
   - **reCAPTCHA type**: Select "Score-based (v3)"
   - **Security preference**: Configure as needed
6. Click **Create**
7. Copy the **Site Key** - you'll need this for the frontend

## Step 2: Enable reCAPTCHA Enterprise API

1. In Google Cloud Console, navigate to **APIs & Services** → **Library**
2. Search for "reCAPTCHA Enterprise API"
3. Click **Enable**

## Step 3: Create API Credentials

### Option A: API Key (Simpler, recommended for getting started)

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key
4. Click **Restrict Key** (recommended)
5. Under "API restrictions", select "Restrict key"
6. Choose "reCAPTCHA Enterprise API"
7. Click **Save**

### Option B: Service Account (More secure for production)

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in service account details
4. Grant the role: "reCAPTCHA Enterprise Agent"
5. Create and download the JSON key file
6. Store the key file securely

## Step 4: Configure Environment Variables

### Frontend Environment Variables (.env)

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_enterprise_site_key
```

### Supabase Edge Function Secrets

You need to set these secrets in your Supabase project:

```bash
# Using Supabase CLI (if available locally)
supabase secrets set RECAPTCHA_ENTERPRISE_API_KEY=your_api_key
supabase secrets set RECAPTCHA_ENTERPRISE_PROJECT_ID=your_gcp_project_id
supabase secrets set RECAPTCHA_SITE_KEY=your_recaptcha_enterprise_site_key
```

Or set them via the Supabase Dashboard:
1. Go to your project settings
2. Navigate to Edge Functions → Secrets
3. Add the following secrets:
   - `RECAPTCHA_ENTERPRISE_API_KEY`: Your Google Cloud API key
   - `RECAPTCHA_ENTERPRISE_PROJECT_ID`: Your GCP project ID
   - `RECAPTCHA_SITE_KEY`: Your reCAPTCHA Enterprise site key

## Step 5: Deploy Edge Function

The `verify-recaptcha` Edge Function is already configured to use reCAPTCHA Enterprise. Deploy it using the MCP tool or Supabase dashboard.

## Configuration Details

### Score Threshold

The default minimum score is set to **0.5** in the Edge Function. You can adjust this in:

**File**: `supabase/functions/verify-recaptcha/index.ts`

```typescript
const minimumScore = 0.5; // Adjust this value (0.0 - 1.0)
```

Score interpretation:
- **0.0 - 0.3**: Very likely a bot
- **0.3 - 0.5**: Suspicious activity
- **0.5 - 0.7**: Neutral
- **0.7 - 1.0**: Very likely legitimate

### Rate Limiting

Rate limiting is enforced through the database function `check_captcha_rate_limit`. See the migration file for details.

## Testing

### Local Testing

1. Ensure all environment variables are set
2. Test with localhost domain added to your reCAPTCHA Enterprise key
3. Use browser developer tools to verify the Enterprise script loads correctly

### Verification Flow

1. User loads the page
2. reCAPTCHA Enterprise script loads automatically
3. After 1 second, the verification popup appears
4. User clicks "Verify Identity"
5. Frontend calls `grecaptcha.enterprise.execute()` to generate a token
6. Token is sent to the `verify-recaptcha` Edge Function
7. Edge Function creates an assessment with Google reCAPTCHA Enterprise API
8. Response includes risk score and token validity
9. Result is stored in the `captcha_verifications` database table

## Troubleshooting

### "reCAPTCHA Enterprise not loaded"
- Check that the script tag in `index.html` points to `enterprise.js`
- Verify the site key is correct
- Check browser console for script loading errors

### "RECAPTCHA_ENTERPRISE_API_KEY not configured"
- Ensure the secret is set in Supabase Edge Function secrets
- Redeploy the Edge Function after setting secrets

### "API error: 403"
- Verify the API key has the correct restrictions
- Ensure reCAPTCHA Enterprise API is enabled in GCP
- Check that billing is enabled on your GCP project

### Low scores in testing
- localhost/development domains may receive lower scores
- Use test keys provided by Google for development
- Ensure your domain is properly configured in the reCAPTCHA key settings

## Migration from Standard reCAPTCHA v3

This project has been migrated from standard reCAPTCHA v3 to Enterprise. Key changes:

1. **Script URL**: Changed from `/recaptcha/api.js` to `/recaptcha/enterprise.js`
2. **API Namespace**: Using `grecaptcha.enterprise` instead of `grecaptcha`
3. **Verification Endpoint**: Changed from siteverify to Enterprise Assessments API
4. **Response Format**: Enterprise provides more detailed risk analysis
5. **Authentication**: Uses API key or service account instead of secret key

## Resources

- [reCAPTCHA Enterprise Documentation](https://cloud.google.com/recaptcha-enterprise/docs)
- [reCAPTCHA Enterprise API Reference](https://cloud.google.com/recaptcha-enterprise/docs/reference/rest)
- [Best Practices](https://cloud.google.com/recaptcha-enterprise/docs/best-practices)

## Support

For issues related to:
- **Frontend**: Check `src/components/RecaptchaPopup.tsx`
- **Backend**: Check `supabase/functions/verify-recaptcha/index.ts`
- **Database**: Check `supabase/migrations/20251015000000_create_captcha_verification_tables.sql`
