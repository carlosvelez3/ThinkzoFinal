# Contact Form Troubleshooting Guide

## Current Status

The contact form has been improved with better error handling and validation. Here's what was fixed:

### ✅ Improvements Made

1. **Enhanced Error Handling**
   - Added detailed error messages that specify what went wrong
   - Network errors, timeouts, and server errors now show different messages
   - Added 30-second timeout to prevent indefinite waiting
   - Console logging added throughout the submission process

2. **Environment Variable Validation**
   - Form now checks if Supabase URL and API key are configured before attempting submission
   - Shows clear error message if configuration is missing

3. **Better API Communication**
   - Added `Authorization` and `apikey` headers for proper Supabase authentication
   - Improved response parsing with error handling
   - Added timeout handling with AbortController

4. **Fixed Form Validation**
   - Improved projectDetails validation to check actual field values
   - Better error messages that specify which required field is missing
   - Console logging for debugging validation issues

5. **Request Headers**
   - Now includes proper Supabase authentication headers
   - Added Content-Type header for JSON payloads

## Testing the Form

### Step 1: Check Browser Console
When you submit the form, open your browser's Developer Tools (F12) and look at the Console tab. You should see:

```
Form submission started
Current form data: {...}
Form validation passed, submitting...
Submitting form to: https://...
Response status: ...
```

### Step 2: Check Network Tab
In Developer Tools, go to the Network tab and look for a request to `submit-contact-form`. Check:
- **Status Code**: Should be 200 if successful
- **Response**: Look for error messages if it fails
- **Headers**: Verify Authorization header is present

### Step 3: Common Errors and Solutions

#### Error: "Application configuration error"
**Cause**: Missing Supabase environment variables
**Solution**: Ensure `.env` file has valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

#### Error: "Network error"
**Cause**: Cannot reach the Supabase endpoint
**Solutions**:
- Check internet connection
- Verify Supabase URL is correct and accessible
- Check if Edge Function is deployed

#### Error: "Request timed out"
**Cause**: Request took longer than 30 seconds
**Solutions**:
- Check if Edge Function is running
- Verify database connection
- Check if Resend email service is responding

#### Error: "Server error: 404"
**Cause**: Edge Function not found
**Solution**: Deploy the Edge Function to Supabase

#### Error: "Server error: 500"
**Cause**: Server-side error in Edge Function
**Solutions**:
- Check Supabase Edge Function logs
- Verify environment variables are set in Supabase (RESEND_API_KEY, FROM_EMAIL, FROM_NAME)
- Verify database table exists and RLS policies allow insertions

#### Error: "Invalid response from server"
**Cause**: Edge Function returned non-JSON response
**Solution**: Check Edge Function code and logs for errors

## Next Steps for Full Functionality

### 1. Verify Supabase Project is Set Up
```bash
# Check if your Supabase URL is valid
# It should look like: https://[project-ref].supabase.co
```

Your current URL: `https://0ec90b57d6e95fcbda19832f.supabase.co`

### 2. Deploy Database Migrations
The migrations are located in:
- `supabase/migrations/20251001135810_create_contact_submissions_table.sql`
- `supabase/migrations/20251002000000_add_enhanced_project_details.sql`

These need to be applied to your Supabase database.

### 3. Deploy Edge Function
The Edge Function code is in:
- `supabase/functions/submit-contact-form/index.ts`

This needs to be deployed to Supabase.

### 4. Configure Environment Variables in Supabase
In your Supabase project dashboard, add these environment variables for the Edge Function:
- `RESEND_API_KEY` - Your Resend API key
- `FROM_EMAIL` - Sending email address (e.g., team@thinkzo.ai)
- `FROM_NAME` - Sender name (e.g., Thinkzo.ai)

### 5. Set Up Resend Email Service
1. Sign up at https://resend.com
2. Add and verify your domain (thinkzo.ai)
3. Generate an API key
4. Add the API key to Supabase Edge Function environment variables

## Debugging Tips

### Enable Verbose Logging
The form now logs detailed information to the console:
- Form data (with email masked for privacy)
- Validation results
- API request details
- Response status and data
- Any errors that occur

### Test Edge Function Directly
You can test the Edge Function directly using curl:

```bash
curl -X POST https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/submit-contact-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "projectType": "landing-page",
    "projectDetails": {
      "projectGoals": "Test goals that are longer than 20 characters",
      "selectedFeatures": ["Responsive Design"],
      "timeline": "1-2 weeks",
      "budgetRange": "$495-$800"
    }
  }'
```

### Check Supabase Logs
In your Supabase dashboard:
1. Go to Edge Functions section
2. Select `submit-contact-form`
3. View logs to see any errors

## Form Validation Requirements

For the form to submit successfully, all these fields must be filled:

1. **Email** - Valid email format
2. **Project Type** - Selected from dropdown
3. **Name** - At least 2 characters
4. **Project Details**:
   - **Project Goals** - Minimum 20 characters
   - **Selected Features** - At least 1 feature selected
   - **Timeline** - Selected
   - **Budget Range** - Selected

Optional fields:
- Phone
- Company
- Target Audience
- Additional Notes

## Contact for Help

If you continue to see errors after following this guide, check:
1. Browser console for detailed error messages
2. Network tab for failed requests
3. Supabase Edge Function logs
4. Database connection and table structure
