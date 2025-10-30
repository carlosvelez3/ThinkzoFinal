# Netlify External DNS Deployment Checklist

Use this checklist to deploy thinkzo.ai to Netlify using external DNS through Spaceship.

---

## Pre-Deployment Checklist

- [ ] Production build created (`npm run build` completed)
- [ ] `dist` folder exists with compiled files
- [ ] Netlify account created or accessible
- [ ] Spaceship account accessible
- [ ] Domain thinkzo.ai owned and managed in Spaceship

---

## Phase 1: Deploy to Netlify

### Initial Deployment

- [ ] Go to https://app.netlify.com
- [ ] Click "Add new site" → "Deploy manually"
- [ ] Drag entire `dist` folder to upload area
- [ ] Wait for deployment to complete
- [ ] Note temporary URL (e.g., `brave-curie-12345.netlify.app`)
- [ ] Write down exact Netlify subdomain: __________________________

### Test Temporary Site

- [ ] Visit temporary Netlify URL
- [ ] Site loads without errors
- [ ] 3D animations render correctly
- [ ] Navigation works
- [ ] Responsive design displays on mobile
- [ ] Note: Contact form won't work yet (environment variables not configured)

---

## Phase 2: Configure Environment Variables

### Add Variables in Netlify

- [ ] Navigate to Site settings → Environment variables
- [ ] Click "Add a variable"

**Variable 1:**
- [ ] Key: `VITE_SUPABASE_URL`
- [ ] Value: `https://kikqxigqyzqrtzmnelog.supabase.co`
- [ ] Click Save

**Variable 2:**
- [ ] Key: `VITE_SUPABASE_ANON_KEY`
- [ ] Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpa3F4aWdxeXpxcnR6bW5lbG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjYzMjgsImV4cCI6MjA3NDE0MjMyOH0.MnLbWP7xCno6Y_e2UL8ZHJI7IpUa6tVEr7Tb3uQwt7g`
- [ ] Click Save

**Variable 3:**
- [ ] Key: `VITE_RECAPTCHA_SITE_KEY`
- [ ] Value: `6LcTe_wrAAAAAG0VmiYNDtVzndqjg9EGw54TzhTA` (dev key, will update later)
- [ ] Click Save

### Redeploy with Variables

- [ ] Go to Deploys tab
- [ ] Click "Trigger deploy" → "Deploy site"
- [ ] Wait for deployment to complete
- [ ] Visit temporary URL again
- [ ] Test contact form - should work now
- [ ] Verify reCAPTCHA loads

---

## Phase 3: Add Custom Domain in Netlify

### Add Domain with External DNS

- [ ] In Netlify, go to Domain management
- [ ] Click "Add custom domain"
- [ ] Enter: `thinkzo.ai`
- [ ] Click "Verify" or "Add domain"
- [ ] Error appears: "already managed by Netlify DNS on another team"
- [ ] Look for and click: "Use external DNS" or "Skip Netlify DNS"
- [ ] Netlify shows "Awaiting External DNS" page
- [ ] Keep this page open for reference

### Add WWW Domain (Optional but Recommended)

- [ ] Click "Add domain alias" or "Add another domain"
- [ ] Enter: `www.thinkzo.ai`
- [ ] Click "Add"

---

## Phase 4: Configure DNS in Spaceship

### Access Spaceship DNS

- [ ] Go to https://www.spaceship.com
- [ ] Sign in
- [ ] Navigate to Domains → thinkzo.ai
- [ ] Open DNS Settings/Management

### Remove Conflicting Records

Delete these if they exist:
- [ ] A record for `@` (root domain)
- [ ] CNAME record for `www`

Keep these:
- [ ] MX records (email) - DO NOT DELETE
- [ ] TXT records - DO NOT DELETE
- [ ] NS records (nameservers) - DO NOT DELETE

### Add A Record

- [ ] Click "Add Record"
- [ ] Type: `A`
- [ ] Host: `@`
- [ ] Value: `75.2.60.5`
- [ ] TTL: `3600`
- [ ] Click Save

### Add CNAME Record

- [ ] Click "Add Record"
- [ ] Type: `CNAME`
- [ ] Host: `www`
- [ ] Value: Your Netlify subdomain from Phase 1: __________________________
- [ ] Include `.netlify.app` at end
- [ ] TTL: `3600`
- [ ] Click Save

### Verify DNS Configuration

- [ ] A record shows: @ → 75.2.60.5
- [ ] CNAME record shows: www → your-site.netlify.app
- [ ] No typos in Netlify subdomain
- [ ] Both records are active/enabled
- [ ] Screenshot taken of DNS configuration
- [ ] Click "Save Changes" if needed

---

## Phase 5: DNS Propagation

### Initial Wait

- [ ] Note time DNS changes saved: ______________
- [ ] Wait minimum 15-30 minutes

### Check Propagation

**Check A Record:**
- [ ] Go to https://www.whatsmydns.net
- [ ] Enter: `thinkzo.ai`
- [ ] Select: A
- [ ] See green checkmarks showing 75.2.60.5

**Check CNAME Record:**
- [ ] Enter: `www.thinkzo.ai`
- [ ] Select: CNAME
- [ ] See your Netlify subdomain

**Timeline Expectations:**
- [ ] After 30 minutes: Check propagation
- [ ] After 1 hour: Check again
- [ ] After 2 hours: Check again
- [ ] After 4 hours: Should be fully propagated
- [ ] If 24+ hours: Troubleshoot or contact support

---

## Phase 6: Netlify Verification

### Automatic Verification

- [ ] Wait for DNS to fully propagate
- [ ] Netlify automatically checks DNS every few minutes
- [ ] Domain status changes from "Awaiting External DNS" to "Verified"
- [ ] Usually happens 5-15 minutes after DNS propagates

### Manual Verification (If Needed)

- [ ] Go to Netlify Domain settings
- [ ] Click "Verify DNS configuration" or "Check DNS"
- [ ] Wait for verification to complete

### Verification Success

- [ ] Domain shows "Verified" or "Active" status
- [ ] Green checkmark appears
- [ ] No "Awaiting External DNS" message
- [ ] Ready for SSL provisioning

---

## Phase 7: SSL Certificate

### Automatic SSL Provisioning

- [ ] After verification, wait 1-5 minutes
- [ ] Netlify automatically provisions SSL (Let's Encrypt)
- [ ] Email confirmation received
- [ ] No manual steps required

### Check SSL Status

- [ ] Go to Domain settings → HTTPS
- [ ] See "Your site has HTTPS enabled"
- [ ] Certificate details displayed
- [ ] Expiration date shown (renews automatically)

### Enable Force HTTPS

- [ ] In HTTPS section, find "Force HTTPS" toggle
- [ ] Turn ON
- [ ] All HTTP traffic redirects to HTTPS

### SSL Troubleshooting (If Needed)

If SSL doesn't provision within 24 hours:
- [ ] Verify DNS fully propagated at whatsmydns.net
- [ ] Check A record is exactly 75.2.60.5
- [ ] Check CNAME points to correct Netlify subdomain
- [ ] Try toggling Force HTTPS off then on
- [ ] Contact Netlify support

---

## Phase 8: Production reCAPTCHA

### Create Production Site

- [ ] Go to https://www.google.com/recaptcha/admin
- [ ] Sign in with Google
- [ ] Click "+" to create new site
- [ ] Label: "Thinkzo.ai - Production"
- [ ] Type: "reCAPTCHA v3"

### Add Domains

- [ ] Add: `thinkzo.ai`
- [ ] Add: `www.thinkzo.ai`
- [ ] Add: Your Netlify subdomain (e.g., `brave-curie-12345.netlify.app`)
- [ ] Click Submit

### Copy Keys

- [ ] Copy Site Key: __________________________
- [ ] Copy Secret Key (if needed): __________________________
- [ ] Save keys securely

### Update Netlify

- [ ] Go to Netlify Site settings → Environment variables
- [ ] Find `VITE_RECAPTCHA_SITE_KEY`
- [ ] Click Edit
- [ ] Replace with production site key
- [ ] Click Save
- [ ] Go to Deploys → Trigger deploy
- [ ] Wait for deployment to complete

---

## Phase 9: Final Testing

### Test All Domain Variations

- [ ] `https://thinkzo.ai` - loads correctly
- [ ] `https://www.thinkzo.ai` - loads correctly
- [ ] `http://thinkzo.ai` - redirects to HTTPS
- [ ] `http://www.thinkzo.ai` - redirects to HTTPS

### Test Site Functionality

- [ ] Fill out contact form with test data
- [ ] reCAPTCHA badge appears
- [ ] Form validation works
- [ ] Success message displays
- [ ] Submission saved to Supabase (check database)
- [ ] 3D animations render smoothly
- [ ] All navigation links work
- [ ] All sections display correctly

### Cross-Browser Testing

- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Edge (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile)

### Cross-Device Testing

- [ ] Desktop computer
- [ ] Laptop
- [ ] Tablet
- [ ] Mobile phone (portrait)
- [ ] Mobile phone (landscape)

### Performance Check

- [ ] Run Lighthouse audit in Chrome DevTools
- [ ] Page load speed acceptable
- [ ] No console errors
- [ ] No failed network requests
- [ ] Images load correctly
- [ ] JavaScript bundles load

---

## Phase 10: Documentation

### Document Configuration

- [ ] Netlify site name documented: __________________________
- [ ] Netlify URL documented: __________________________
- [ ] Production reCAPTCHA site key saved securely
- [ ] DNS configuration screenshot saved
- [ ] SSL certificate details documented

### Update Project Files

- [ ] Update README.md with deployment info (if needed)
- [ ] Ensure .env files not committed to Git
- [ ] Production environment variables documented securely

---

## Verification Summary

After completing all phases, verify:

**DNS Configuration:**
- ✅ A record: @ → 75.2.60.5
- ✅ CNAME record: www → your-site.netlify.app

**Netlify Configuration:**
- ✅ Custom domain added with external DNS
- ✅ Domain verified
- ✅ SSL certificate active
- ✅ Force HTTPS enabled
- ✅ Environment variables configured

**Site Status:**
- ✅ Live at https://thinkzo.ai
- ✅ WWW subdomain works
- ✅ HTTP redirects to HTTPS
- ✅ Contact form functional
- ✅ reCAPTCHA working
- ✅ All features operational

---

## Troubleshooting Reference

| Issue | Check | Solution |
|-------|-------|----------|
| Site not loading | DNS propagation | Wait 4+ hours, check whatsmydns.net |
| SSL not working | Domain verification | Verify DNS records correct |
| Form not working | Environment variables | Check all 3 variables in Netlify |
| reCAPTCHA error | Domain authorization | Add domain in Google reCAPTCHA console |
| 404 errors | Netlify redirects | Verify netlify.toml in dist folder |

---

## Post-Deployment Maintenance

### Weekly
- [ ] Monitor site uptime
- [ ] Check contact form submissions

### Monthly
- [ ] Review SSL certificate status (auto-renews)
- [ ] Check DNS records unchanged
- [ ] Review Supabase database

### As Needed
- [ ] Update content
- [ ] Deploy new builds
- [ ] Update environment variables

---

## Support Contacts

**Netlify Support:**
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com

**Spaceship Support:**
- Support: https://www.spaceship.com/support
- Live Chat: Available in dashboard

**Google reCAPTCHA:**
- Admin: https://www.google.com/recaptcha/admin
- Docs: https://developers.google.com/recaptcha

**DNS Tools:**
- Propagation: https://www.whatsmydns.net
- Checker: https://dnschecker.org
- SSL Test: https://www.ssllabs.com/ssltest/

---

## Deployment Complete! 🎉

Once all checkboxes are marked, your site is fully deployed and operational at:
- **https://thinkzo.ai**
- **https://www.thinkzo.ai**

You successfully bypassed the Netlify DNS conflict by using external DNS management through Spaceship.

**Deployment Date:** ______________
**Deployed By:** ______________
**Netlify Site:** ______________
