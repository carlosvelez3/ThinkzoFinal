# reCAPTCHA Domain Configuration Guide

This guide explains how to fix the "Invalid domain for site key" error and properly configure reCAPTCHA for your application.

## Understanding the Error

The error "Invalid domain for site key" appears when:
- Your reCAPTCHA site key is not configured to allow the domain you're accessing the app from
- The domain in your browser's address bar doesn't match any authorized domains in the Google reCAPTCHA Console

## Quick Fix

### Step 1: Identify Your Current Domain

Open your browser's developer console and look for this log message:
```
📍 Current domain: your-domain-here
```

Common domains you might see:
- `localhost` - Local development
- `127.0.0.1` - Alternative localhost
- `preview-123.netlify.app` - Netlify preview deployment
- `your-app.vercel.app` - Vercel deployment
- `thinkzo.ai` - Production domain

### Step 2: Add Domain to Google reCAPTCHA Console

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with the Google account that created your site key
3. Find your site key (starts with `6Ldpmuwr...`)
4. Click the settings icon or the site key name to edit
5. Scroll to the "Domains" section
6. Add your current domain (e.g., `localhost`, `your-app.netlify.app`)
7. Click "Save"

**Important Notes:**
- Do NOT include `http://` or `https://` - just the domain name
- Do NOT include ports (like `:5173`) - just the domain
- For localhost, you only need to add `localhost` (not `localhost:5173`)

### Step 3: Wait and Refresh

- Changes may take a few minutes to propagate
- Clear your browser cache
- Refresh your application
- The reCAPTCHA popup should now work without errors

## Environment-Specific Configuration

This project now supports separate reCAPTCHA configurations for different environments.

### Development Environment

For local development, create a `.env.development` file:

```bash
# Copy from the example
cp .env.development.example .env.development

# Edit and add your development site key
VITE_RECAPTCHA_SITE_KEY=your_dev_site_key_here
```

Your development site key should be configured with:
- `localhost`
- `127.0.0.1`
- Any other local development domains you use

### Production Environment

For production deployment, create a `.env.production` file:

```bash
# Copy from the example
cp .env.production.example .env.production

# Edit and add your production site key
VITE_RECAPTCHA_SITE_KEY=your_prod_site_key_here
```

Your production site key should be configured with:
- Your production domain (e.g., `thinkzo.ai`)
- Any staging/preview domains (e.g., `staging.thinkzo.ai`)

## Creating Multiple Site Keys (Recommended)

For better security and management, create separate reCAPTCHA site keys for different environments:

### Development Key
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "+" to create a new site
3. Label: "Your App - Development"
4. reCAPTCHA type: "reCAPTCHA v3"
5. Domains: Add `localhost` and `127.0.0.1`
6. Click "Submit"
7. Copy the site key and add it to `.env.development`

### Production Key
1. Create another new site
2. Label: "Your App - Production"
3. reCAPTCHA type: "reCAPTCHA v3"
4. Domains: Add your production domain(s)
5. Click "Submit"
6. Copy the site key and add it to `.env.production`

## Netlify Deployment

When deploying to Netlify:

1. Add your Netlify preview domains to your reCAPTCHA site key:
   - `your-site-name.netlify.app` (main deployment)
   - `deploy-preview-*.netlify.app` (for all preview deploys - use wildcard)

2. Set environment variables in Netlify:
   - Go to Site Settings → Environment Variables
   - Add `VITE_RECAPTCHA_SITE_KEY` with your production site key

3. For preview deployments, you may want to create a separate "Preview" site key that allows all Netlify preview domains

## Vercel Deployment

When deploying to Vercel:

1. Add your Vercel domains to your reCAPTCHA site key:
   - `your-app.vercel.app` (production)
   - `your-app-*.vercel.app` (preview deployments)

2. Set environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `VITE_RECAPTCHA_SITE_KEY`
   - Set different values for Production, Preview, and Development environments

## Troubleshooting

### Error: "reCAPTCHA configuration missing"
**Cause:** The `VITE_RECAPTCHA_SITE_KEY` environment variable is not set.

**Solution:**
1. Copy `.env.example` to `.env`
2. Fill in your site key
3. Restart your development server

### Error: "Domain not authorized"
**Cause:** Your current domain is not in the allowed domains list.

**Solution:**
1. Check the browser console for your current domain
2. Add it to the Google reCAPTCHA Console
3. Wait a few minutes and refresh

### Error: "Failed to load reCAPTCHA script"
**Possible Causes:**
- Ad blocker or privacy extension blocking the script
- Network connectivity issues
- Domain not authorized

**Solution:**
1. Disable ad blockers and privacy extensions
2. Check your internet connection
3. Verify domain authorization in reCAPTCHA Console
4. Check browser console for detailed error messages

### reCAPTCHA works on localhost but not on deployed site
**Cause:** Your deployment domain is not added to the site key.

**Solution:**
1. Get your deployment URL (e.g., `your-app.netlify.app`)
2. Add it to Google reCAPTCHA Console
3. Redeploy if using environment variables

### Different site keys for different environments not working
**Cause:** Using the same `.env` file for all environments.

**Solution:**
1. Create `.env.development` and `.env.production` files
2. Add appropriate site keys to each
3. Vite will automatically use the correct file based on the build mode

## Best Practices

1. **Never commit `.env` files** - They're in `.gitignore` for security
2. **Use separate keys** - Different keys for development and production
3. **Whitelist specific domains** - Don't use wildcards unless necessary
4. **Monitor reCAPTCHA console** - Check for suspicious activity
5. **Set appropriate score thresholds** - Balance security vs user experience
6. **Test on all environments** - Verify reCAPTCHA works everywhere before launch

## Additional Resources

- [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Project-specific reCAPTCHA setup](./RECAPTCHA_ENTERPRISE_SETUP.md)

## Getting Help

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure your domain is added to the reCAPTCHA Console
4. Clear browser cache and cookies
5. Try a different browser or incognito mode

For more technical details about the implementation, see:
- `src/components/RecaptchaPopup.tsx` - Frontend verification component
- `index.html` - Dynamic script loading
- `vite.config.ts` - Environment variable injection
- `supabase/functions/verify-recaptcha/index.ts` - Backend verification
