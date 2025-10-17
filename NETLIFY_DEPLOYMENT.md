# Netlify Deployment Guide for Thinkzo.ai

## Quick Start - Manual Deployment

Your site is ready to deploy! Follow these steps:

### Step 1: Deploy to Netlify (Drag & Drop)

1. **Sign up for Netlify** (if you haven't already)
   - Go to: https://app.netlify.com/signup
   - Sign up with email or GitHub

2. **Deploy Your Site**
   - In Netlify dashboard, click "Add new site" dropdown
   - Select "Deploy manually"
   - Drag and drop your entire `dist` folder into the upload area
   - Wait 30-60 seconds for deployment to complete
   - You'll get a temporary URL like: `random-name-123.netlify.app`

3. **Test Your Deployed Site**
   - Click the temporary URL Netlify provides
   - Test the contact form
   - Verify 3D animations work
   - Check mobile responsiveness

---

### Step 2: Configure Environment Variables

Your site needs these environment variables to work properly:

1. **In Netlify dashboard:**
   - Go to: Site settings → Environment variables
   - Click "Add a variable"

2. **Add these three variables:**

   ```
   VITE_SUPABASE_URL
   Value: https://uxqsmomzwekwljgihhbh.supabase.co
   ```

   ```
   VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4cXNtb216d2Vrd2xqZ2loaGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTUyNjgsImV4cCI6MjA3NjE5MTI2OH0.eqBlQungbwyO3lm-xAOX9nZ5NCVIYpydNHvvQyq5qyI
   ```

   ```
   VITE_RECAPTCHA_SITE_KEY
   Value: 6LdpmuwrAAAAAAC48MOUqHwxMQaQB8pof-1LybIa
   ```

3. **Trigger a redeploy:**
   - Go to: Deploys → Trigger deploy → Deploy site
   - Wait for the new deployment to finish

---

### Step 3: Add Your Custom Domain

1. **In Netlify dashboard:**
   - Go to: Domain management
   - Click "Add custom domain"
   - Enter: `thinkzo.ai`
   - Also add: `www.thinkzo.ai` as a domain alias

2. **Netlify will provide DNS instructions**
   - Keep this page open - you'll need these details for Spaceship

---

### Step 4: Configure DNS in Spaceship

Now you'll point your Spaceship domain to Netlify:

1. **Log into Spaceship:**
   - Go to: https://www.spaceship.com
   - Navigate to your domains
   - Click on `thinkzo.ai`

2. **Go to DNS Settings:**
   - Find "DNS Management" or "Manage DNS"
   - You'll see your current DNS records

3. **Remove Conflicting Records:**
   - Delete any existing A records for `@`
   - Delete any existing CNAME records for `www`
   - Keep MX records (email) and other records

4. **Add New A Record (for root domain):**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   TTL: 3600 (or leave default)
   ```

5. **Add New CNAME Record (for www subdomain):**
   ```
   Type: CNAME
   Name: www
   Value: [your-site-name].netlify.app
   ```
   (Replace with your actual Netlify subdomain)

6. **Save all changes**

---

### Step 5: Wait for DNS Propagation

- **Typical time:** 15 minutes to 4 hours
- **Maximum time:** 24-48 hours (rare)

**Check propagation status:**
- Go to: https://www.whatsmydns.net
- Enter: `thinkzo.ai`
- Look for green checkmarks showing `75.2.60.5`

---

### Step 6: Enable SSL/HTTPS

Once DNS propagates:

1. **Netlify automatically provisions SSL** (Let's Encrypt)
   - This happens automatically when DNS is verified
   - Usually takes 1-5 minutes
   - You'll get an email confirmation

2. **Enable Force HTTPS:**
   - In Netlify: Domain settings → HTTPS
   - Turn on "Force HTTPS" or "Automatic HTTPS redirect"
   - All HTTP traffic redirects to HTTPS

---

### Step 7: Final Testing

Visit your live site and test:

- ✅ `https://thinkzo.ai` loads correctly
- ✅ `https://www.thinkzo.ai` works
- ✅ `http://thinkzo.ai` redirects to HTTPS
- ✅ Contact form submits to Supabase
- ✅ reCAPTCHA works
- ✅ 3D animations render
- ✅ Mobile responsive design works
- ✅ All sections display properly

---

## Build Files Included

Your `dist` folder contains:
- `index.html` - Main HTML file
- `assets/` - CSS and JavaScript bundles
- `_redirects` - Netlify routing configuration
- Images and other static assets

---

## Netlify Configuration

A `netlify.toml` file has been created in your project root with:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing configuration
- Node.js version specification

---

## Important Notes

### Environment Variables
- Never commit `.env` to Git
- Always configure environment variables in Netlify dashboard
- Environment variables are injected at build time for Vite apps

### DNS Configuration
- A records point to IP addresses (Netlify's load balancer)
- CNAME records point to domain names (your Netlify subdomain)
- Never use CNAME for root domain (`@`) - always use A record

### SSL Certificates
- Netlify provides free SSL via Let's Encrypt
- Certificates auto-renew every 90 days
- No manual configuration needed

---

## Troubleshooting

### Site not loading after DNS change?
- Wait longer (DNS can take 48 hours)
- Clear browser cache
- Try incognito/private browsing
- Check DNS propagation at whatsmydns.net

### Environment variables not working?
- Verify all three variables are set correctly
- Trigger a new deployment after adding variables
- Check for typos in variable names (must match exactly)

### Contact form not working?
- Check browser console for errors
- Verify Supabase URL and API key in Netlify
- Test reCAPTCHA is loading (check for ad blockers)
- Verify Supabase tables exist and RLS policies are correct

### SSL certificate not provisioning?
- DNS must be fully propagated first
- A and CNAME records must be correct
- Can take up to 24 hours after DNS propagation
- Contact Netlify support if still not working after 24 hours

---

## Next Steps After Deployment

1. **Set up custom 404 page** (optional)
2. **Enable Netlify Analytics** (optional, paid feature)
3. **Configure deployment notifications** (email/Slack)
4. **Set up branch deployments** (if using Git)
5. **Add sitemap.xml** for SEO
6. **Configure redirects** for old URLs (if migrating)

---

## Support Resources

- **Netlify Documentation:** https://docs.netlify.com
- **Netlify Community:** https://answers.netlify.com
- **DNS Propagation Checker:** https://www.whatsmydns.net
- **SSL Certificate Check:** https://www.ssllabs.com/ssltest/

---

## Your Site Details

- **Domain:** thinkzo.ai
- **Registrar:** Spaceship
- **Hosting:** Netlify
- **Database:** Supabase
- **SSL:** Let's Encrypt (via Netlify)
- **Framework:** React + Vite
- **Deployment Method:** Manual (drag & drop) or Git-based

---

**You're all set! Your site is ready to go live.** 🚀
