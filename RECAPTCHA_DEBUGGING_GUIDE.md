# reCAPTCHA Debugging Guide

This guide helps diagnose and resolve "Failed to generate verification token" errors.

## Recent Improvements (2025-10-15)

### Frontend (RecaptchaPopup.tsx)

1. **Added Robust Script Loading Detection**
   - Implemented `waitForRecaptcha()` function with retry logic (10 attempts, 300ms intervals)
   - Provides detailed console logging for each loading attempt
   - Waits up to 3 seconds for reCAPTCHA to become available

2. **Enhanced Environment Variable Validation**
   - Checks if `VITE_RECAPTCHA_SITE_KEY` is defined and non-empty
   - Provides clear error messages when configuration is missing
   - Logs partial site key for verification (first 10 characters)

3. **Improved Token Generation Logging**
   - Logs each step of the reCAPTCHA execution flow
   - Validates that token is not empty before sending to backend
   - Logs token length for debugging purposes

4. **Better Error Messages**
   - Specific error messages for each failure scenario
   - Includes error details in console logs
   - User-friendly messages displayed in the UI

### Backend (verify-recaptcha Edge Function)

1. **Enhanced Request Validation**
   - Validates JSON parsing before accessing request data
   - Checks token type and ensures it's a non-empty string
   - Logs request details (IP, token length, user agent)

2. **Improved Google API Communication**
   - Comprehensive logging of Google API requests and responses
   - Better error handling for API failures
   - Logs verification results including score and error codes

3. **Detailed Error Responses**
   - Returns structured error objects with both `error` and `message` fields
   - Provides actionable error messages to frontend
   - Logs all errors to Edge Function logs for debugging

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=https://bxpcwhmllfvjzlqutklc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RECAPTCHA_SITE_KEY=6LdpmuwrAAAAAIpNHZnO2H8y365nCy2j8mfQ1YO5
```

### Backend (Supabase Secrets)
```
RECAPTCHA_SECRET_KEY=<your-recaptcha-secret-key>
```

**Important:** The backend secret key must be set in Supabase Edge Function secrets.

## HTML Configuration

File: `index.html`
```html
<script src="https://www.google.com/recaptcha/api.js?render=6LdpmuwrAAAAAIpNHZnO2H8y365nCy2j8mfQ1YO5" async defer></script>
```

**Important:** The site key in the script tag must match the environment variable.

## Common Issues and Solutions

### 1. "reCAPTCHA not loaded" Error

**Symptoms:**
- Error appears after 10 retry attempts (3 seconds)
- Console shows "Waiting for reCAPTCHA to load..." messages

**Possible Causes:**
- reCAPTCHA script blocked by ad blocker or privacy extension
- Network connectivity issues
- Incorrect site key in script tag
- Domain not registered with the site key

**Solutions:**
1. Check browser console for script loading errors
2. Disable ad blockers and privacy extensions
3. Verify the site key in `index.html` matches `.env`
4. Check Google reCAPTCHA admin console to verify domain is allowed
5. Try in incognito/private browsing mode

### 2. "reCAPTCHA configuration missing" Error

**Symptoms:**
- Error appears immediately when clicking verify
- Console shows "VITE_RECAPTCHA_SITE_KEY is not configured"

**Possible Causes:**
- Environment variable not set
- Typo in environment variable name
- .env file not loaded by Vite

**Solutions:**
1. Verify `.env` file exists in project root
2. Check that variable name is exactly `VITE_RECAPTCHA_SITE_KEY`
3. Restart dev server after changing .env
4. Confirm the value is not empty

### 3. "Failed to generate verification token" Error

**Symptoms:**
- Error appears after reCAPTCHA appears to load
- Console shows "reCAPTCHA ready, executing..."

**Possible Causes:**
- Site key mismatch between frontend and Google
- Domain not allowed in reCAPTCHA settings
- Token generation timeout
- Browser API call failed

**Solutions:**
1. Check console for detailed error message
2. Verify site key matches in all locations:
   - `.env` file
   - `index.html` script tag
   - Google reCAPTCHA admin console
3. Add current domain to allowed domains in Google reCAPTCHA settings
4. Try refreshing the page and attempting again

### 4. "Verification failed" Error from Backend

**Symptoms:**
- Token generates successfully but verification fails
- Error received after sending to Edge Function

**Possible Causes:**
- `RECAPTCHA_SECRET_KEY` not set in Supabase
- Secret key doesn't match site key
- Token expired (tokens expire after 2 minutes)
- Network issues contacting Google API

**Solutions:**
1. Check Supabase Edge Function logs for detailed error
2. Verify `RECAPTCHA_SECRET_KEY` is set in Supabase secrets
3. Ensure secret key matches the site key in Google console
4. Try verification again (generate new token)

### 5. Rate Limit Errors

**Symptoms:**
- "Too many attempts" error message
- Status 429 response from Edge Function

**Possible Causes:**
- More than 5 verification attempts in 15 minutes
- IP address is temporarily blocked

**Solutions:**
1. Wait for the cooldown period (shown in error message)
2. If persistent, check database `captcha_rate_limits` table
3. Admin can manually unblock IP in database if needed

## Debugging Steps

### Step 1: Check Browser Console

Open browser DevTools (F12) and look for:
```
Checking reCAPTCHA availability...
reCAPTCHA loaded successfully after X attempts
Executing reCAPTCHA with site key: 6LfuiusrAA...
reCAPTCHA ready, executing...
reCAPTCHA token generated successfully, length: XXX
```

Any errors or missing logs indicate where the process is failing.

### Step 2: Verify Network Requests

In DevTools Network tab:
1. Look for request to `https://www.google.com/recaptcha/api.js`
2. Verify it loads successfully (Status 200)
3. Check for POST request to `/functions/v1/verify-recaptcha`
4. Examine request/response body for errors

### Step 3: Check Edge Function Logs

In Supabase Dashboard:
1. Go to Edge Functions → verify-recaptcha → Logs
2. Look for recent log entries
3. Check for error messages from Google API
4. Verify token is being received

### Step 4: Validate Configuration

1. **Frontend:**
   ```bash
   cat .env | grep RECAPTCHA
   cat index.html | grep recaptcha
   ```

2. **Backend:**
   - Check Supabase Dashboard → Settings → Edge Functions → Secrets
   - Verify `RECAPTCHA_SECRET_KEY` is set

### Step 5: Test reCAPTCHA Directly

In browser console on your site:
```javascript
// Check if reCAPTCHA is loaded
console.log(window.grecaptcha);

// Try executing manually
window.grecaptcha.ready(() => {
  window.grecaptcha.execute('YOUR_SITE_KEY', {action: 'test'})
    .then(token => console.log('Token generated:', token.substring(0, 50)))
    .catch(err => console.error('Error:', err));
});
```

## Monitoring and Logging

### What Gets Logged

**Frontend (Browser Console):**
- Script loading attempts and results
- Configuration validation
- Token generation status
- API request/response details
- All errors with full details

**Backend (Edge Function Logs):**
- Incoming request details
- Token validation results
- Google API responses
- Verification outcomes
- Database operations

### Key Metrics to Monitor

1. **Token Generation Success Rate**
   - Track: `reCAPTCHA token generated successfully`
   - Alert if rate drops below 95%

2. **Verification Success Rate**
   - Track: `Verification successful!`
   - Alert if rate drops below 90%

3. **Error Rates**
   - Track specific error types
   - Alert on unusual spikes

4. **Rate Limit Hits**
   - Monitor for excessive rate limiting
   - May indicate bot activity or misconfiguration

## Testing Checklist

- [ ] reCAPTCHA script loads in browser console
- [ ] Site key in .env matches index.html
- [ ] Site key matches Google reCAPTCHA admin console
- [ ] Secret key set in Supabase Edge Function secrets
- [ ] Current domain listed in allowed domains
- [ ] Token generates successfully in browser
- [ ] Token validates successfully with backend
- [ ] Verification popup shows and functions correctly
- [ ] Error messages are clear and actionable
- [ ] Rate limiting works as expected

## Additional Resources

- [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- Migration guide: `RECAPTCHA_ENTERPRISE_SETUP.md`

## Support

If issues persist after following this guide:
1. Capture browser console logs (full output)
2. Capture Edge Function logs from Supabase
3. Note exact error message shown to user
4. Document steps taken to reproduce
5. Check if issue occurs in different browsers
