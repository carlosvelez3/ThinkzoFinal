# WebContainer reCAPTCHA Domain Authorization Solution

## The Problem

When using WebContainer environments (StackBlitz, Bolt.new, etc.), you'll encounter a domain authorization error:

```
Domain authorization error. The current domain "zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--cf284e50.local-credentialless.webcontainer-api.io" is not authorized for this reCAPTCHA site key.
```

### Why This Happens

1. **Dynamic Domains**: WebContainer environments generate random, temporary domain names that change with each session
2. **No Wildcards**: Google reCAPTCHA doesn't allow wildcard patterns like `*.webcontainer-api.io` for security reasons
3. **Unpredictable**: Each new session gets a different subdomain, making it impossible to pre-authorize
4. **Security by Design**: reCAPTCHA requires explicit domain authorization to prevent abuse

## The Solution

You have two options to fix this issue:

### Option 1: Develop Locally (Recommended)

**This is the best solution for development with reCAPTCHA.**

1. **Clone or download the project to your local machine**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure development environment:**
   - The `.env.development` file is already configured for localhost
   - It uses your existing Supabase credentials

4. **Create a development reCAPTCHA site key:**
   - Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Click "+" to create a new site
   - **Label:** "Your App - Development"
   - **reCAPTCHA type:** reCAPTCHA v3
   - **Domains:** Add `localhost` and `127.0.0.1`
   - Click "Submit"
   - Copy the site key

5. **Update `.env.development`:**
   - Replace `VITE_RECAPTCHA_SITE_KEY` with your new development site key

6. **Run the development server:**
   ```bash
   npm run dev
   ```

7. **Access the app at `http://localhost:5173`**
   - reCAPTCHA will now work because `localhost` is authorized

### Option 2: Deploy to a Production Environment

**Skip reCAPTCHA development in WebContainer and deploy directly:**

1. **Deploy to Netlify, Vercel, or your own server**

2. **Get your deployment domain** (e.g., `your-app.netlify.app`)

3. **Create a production reCAPTCHA site key:**
   - Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Click "+" to create a new site
   - **Label:** "Thinkzo.ai - Production"
   - **reCAPTCHA type:** reCAPTCHA v3
   - **Domains:** Add your deployment domain (e.g., `thinkzo.ai`, `your-app.netlify.app`)
   - Click "Submit"
   - Copy the site key

4. **Update `.env.production`:**
   - Replace `VITE_RECAPTCHA_SITE_KEY` with your production site key

5. **Set environment variables in your deployment platform:**
   - **Netlify:** Site Settings → Environment Variables
   - **Vercel:** Project Settings → Environment Variables
   - Add `VITE_RECAPTCHA_SITE_KEY` with your production site key value

6. **Deploy and test on your actual domain**

## Environment Files Structure

The project now includes three environment files:

### `.env` (Fallback)
- Used if no environment-specific file exists
- Should contain safe defaults or be used for shared configuration

### `.env.development` (Local Development)
- Used when running `npm run dev`
- Configured for `localhost` and `127.0.0.1`
- Uses a development reCAPTCHA site key

### `.env.production` (Production Builds)
- Used when running `npm run build`
- Configured for your actual production domain
- Uses a production reCAPTCHA site key

## How Vite Handles Environment Files

Vite automatically loads the correct environment file based on the mode:

- `npm run dev` → loads `.env.development`
- `npm run build` → loads `.env.production`
- Variables must start with `VITE_` to be exposed to the client

## Quick Setup Checklist

### For Local Development:

- [ ] Install Node.js and npm on your local machine
- [ ] Clone/download the project
- [ ] Run `npm install`
- [ ] Create a development reCAPTCHA site key with `localhost` authorized
- [ ] Update `VITE_RECAPTCHA_SITE_KEY` in `.env.development`
- [ ] Run `npm run dev`
- [ ] Access app at `http://localhost:5173`
- [ ] Test reCAPTCHA functionality

### For Production Deployment:

- [ ] Choose a deployment platform (Netlify, Vercel, etc.)
- [ ] Create a production reCAPTCHA site key with your domain authorized
- [ ] Update `VITE_RECAPTCHA_SITE_KEY` in `.env.production`
- [ ] Set environment variables in your deployment platform
- [ ] Deploy your application
- [ ] Test reCAPTCHA on your production domain

## Important Notes

1. **Never commit `.env.development` or `.env.production`** - They're in `.gitignore` for security
2. **Use separate keys** - Different reCAPTCHA keys for development and production
3. **WebContainer limitations** - reCAPTCHA cannot work reliably in WebContainer environments
4. **Domain authorization** - Always add your domain to the Google reCAPTCHA Console before testing
5. **Wait time** - reCAPTCHA domain changes can take a few minutes to propagate

## Troubleshooting

### Error: "Domain authorization error"
**Solution:** You're likely in a WebContainer environment. Follow Option 1 or Option 2 above.

### Error: "reCAPTCHA configuration missing"
**Solution:** Ensure `VITE_RECAPTCHA_SITE_KEY` is set in your environment file and restart the dev server.

### reCAPTCHA works locally but not on deployed site
**Solution:** Make sure your production domain is added to your production reCAPTCHA site key in the Google Console.

### Changes not taking effect
**Solution:** Clear your browser cache, restart the dev server, and wait a few minutes for reCAPTCHA changes to propagate.

## Additional Resources

- [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Project reCAPTCHA Setup Guide](./RECAPTCHA_DOMAIN_SETUP.md)
- [Netlify Deployment Guide](./NETLIFY_DEPLOYMENT.md)

## Summary

WebContainer environments are excellent for quick prototyping, but they're incompatible with services that require domain authorization like reCAPTCHA. The solution is to develop locally using `localhost` (which can be authorized) or deploy to a stable domain. This project is now configured to support both approaches seamlessly with environment-specific configuration files.
