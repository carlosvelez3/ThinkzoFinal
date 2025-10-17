# Spaceship DNS Configuration Guide

## How to Point Your Spaceship Domain to Netlify

This guide walks you through connecting your `thinkzo.ai` domain from Spaceship to your Netlify-hosted site.

---

## Prerequisites

Before you start, make sure you have:
- ✅ Deployed your site to Netlify
- ✅ Your Netlify site URL (e.g., `your-site-name.netlify.app`)
- ✅ Access to your Spaceship account
- ✅ Environment variables configured in Netlify

---

## Step-by-Step DNS Configuration

### Step 1: Log Into Spaceship

1. Go to: **https://www.spaceship.com**
2. Click "Sign In" in the top right
3. Enter your email and password
4. Complete any two-factor authentication if enabled

---

### Step 2: Navigate to Your Domain

1. Once logged in, look for **"Domains"** or **"My Domains"** in the navigation
2. You should see a list of your domains
3. Find **thinkzo.ai** in the list
4. Click on the domain name to manage it

---

### Step 3: Access DNS Management

1. Look for one of these options:
   - **"DNS Settings"**
   - **"Manage DNS"**
   - **"DNS Management"**
   - **"DNS Records"**

2. Click to open the DNS management interface

3. You should see existing DNS records (if any)

---

### Step 4: Review Current DNS Records

Before making changes, note what's currently configured:

**Records you might see:**
- **A Records** - Point to IP addresses
- **CNAME Records** - Point to other domains
- **MX Records** - Email routing (keep these!)
- **TXT Records** - Verification/SPF records (keep these!)
- **NS Records** - Nameservers (keep these!)

**Important:** Do NOT delete MX, TXT, or NS records unless you're certain they're not needed.

---

### Step 5: Remove Conflicting Records

You need to remove any existing A or CNAME records that conflict with Netlify:

**Delete these if they exist:**
- A record with Name: `@` or blank (root domain)
- CNAME record with Name: `www`
- CNAME record with Name: `@` (if it exists - this is incorrect anyway)

**How to delete:**
1. Find the record in the list
2. Look for a "Delete", "Remove", or trash icon
3. Click to delete the record
4. Confirm the deletion

---

### Step 6: Add Netlify A Record

This connects your root domain (`thinkzo.ai`) to Netlify.

**Click "Add Record" or "New Record" and enter:**

```
Record Type: A
Host/Name: @
Value/Points to: 75.2.60.5
TTL: 3600
```

**Field explanations:**
- **Record Type:** Choose "A" from the dropdown
- **Host/Name:** Enter `@` (this represents your root domain)
- **Value:** This is Netlify's load balancer IP address
- **TTL:** Time To Live in seconds (3600 = 1 hour, or use default)

**Click "Save" or "Add Record"**

---

### Step 7: Add Netlify CNAME Record

This connects your www subdomain (`www.thinkzo.ai`) to Netlify.

**Click "Add Record" or "New Record" and enter:**

```
Record Type: CNAME
Host/Name: www
Value/Points to: [your-site-name].netlify.app
TTL: 3600
```

**Important:** Replace `[your-site-name]` with your actual Netlify subdomain!

**Example:**
- If your Netlify URL is `cool-site-123.netlify.app`
- Enter: `cool-site-123.netlify.app` in the Value field

**Field explanations:**
- **Record Type:** Choose "CNAME" from the dropdown
- **Host/Name:** Enter `www`
- **Value:** Your Netlify site URL (include `.netlify.app`)
- **TTL:** Time To Live (3600 = 1 hour, or use default)

**Click "Save" or "Add Record"**

---

### Step 8: Verify Your DNS Records

Double-check everything is correct:

**You should now see:**

| Type  | Name/Host | Value/Points To              | TTL  |
|-------|-----------|------------------------------|------|
| A     | @         | 75.2.60.5                    | 3600 |
| CNAME | www       | your-site-name.netlify.app   | 3600 |

**Also present (keep these):**
- MX records (for email)
- TXT records (for verification)
- NS records (nameservers)

**Take a screenshot** of your DNS settings for your records.

---

### Step 9: Save Changes

1. Look for a **"Save Changes"** or **"Apply Changes"** button
2. Click it to commit your DNS updates
3. You may see a confirmation message
4. Some registrars save automatically after each record is added

---

### Step 10: Wait for DNS Propagation

DNS changes don't happen instantly. They need to propagate globally.

**Timeline:**
- **Minimum:** 15-30 minutes
- **Typical:** 2-4 hours
- **Maximum:** 24-48 hours (rare)

**What's happening:**
- DNS servers worldwide are updating their records
- Different locations update at different speeds
- Your ISP's DNS cache needs to refresh

**During this time:**
- Your site may be intermittently accessible
- Some people might see it, others might not
- This is completely normal

---

### Step 11: Check DNS Propagation Status

Use online tools to monitor DNS propagation:

**Method 1: WhatIsMyDNS**
1. Go to: **https://www.whatsmydns.net**
2. Enter: `thinkzo.ai`
3. Select: "A" from the dropdown
4. Click "Search"
5. Look for green checkmarks showing `75.2.60.5`
6. Repeat for "CNAME" with `www.thinkzo.ai`

**Method 2: DNSChecker**
1. Go to: **https://dnschecker.org**
2. Enter: `thinkzo.ai`
3. Select: "A"
4. View results from different global locations

**Green checkmarks = DNS has propagated to that location**
**Red X marks = Still propagating or incorrect configuration**

---

### Step 12: Verify in Netlify

Once DNS propagates, Netlify needs to verify it:

1. **Go back to Netlify dashboard**
2. Navigate to: **Domain settings**
3. You should see `thinkzo.ai` listed
4. Status should change from "Waiting for DNS" to "Netlify DNS"
5. Click **"Verify DNS configuration"** if available

---

### Step 13: SSL Certificate Provisioning

After DNS is verified, Netlify automatically provisions SSL:

1. **Netlify uses Let's Encrypt** (free SSL certificates)
2. This happens automatically - no action needed
3. Usually takes 1-5 minutes after DNS verification
4. You'll receive an email when SSL is active

**Check SSL status:**
- In Netlify: Domain settings → HTTPS
- Look for "Your site has HTTPS enabled"
- Certificate details will be displayed

---

### Step 14: Enable Force HTTPS

Force all visitors to use secure HTTPS:

1. **In Netlify dashboard:**
   - Go to: Domain settings → HTTPS
   - Find: "Force HTTPS" or "Automatic HTTPS redirect"
   - Toggle it ON

2. **What this does:**
   - All `http://` requests redirect to `https://`
   - Improves security and SEO
   - Ensures encrypted connections

---

### Step 15: Test Your Live Site

**Test all variations of your domain:**

✅ **https://thinkzo.ai** - Should load your site
✅ **https://www.thinkzo.ai** - Should load your site
✅ **http://thinkzo.ai** - Should redirect to HTTPS
✅ **http://www.thinkzo.ai** - Should redirect to HTTPS

**Test functionality:**
- Contact form submission
- reCAPTCHA verification
- 3D animations rendering
- Mobile responsiveness
- All navigation links
- Form validation

**Test from different devices:**
- Desktop browser
- Mobile phone
- Tablet
- Different browsers (Chrome, Safari, Firefox, Edge)

---

## Common Spaceship DNS Interface Variations

Spaceship's interface might look slightly different. Here are common variations:

### Interface Style 1: Modern Table View
- Records displayed in a table
- "Add Record" button at top
- Delete icon on each row
- Inline editing

### Interface Style 2: Form-Based Entry
- Separate form for each record type
- Dropdowns for record type selection
- Text fields for host and value
- "Add" button to submit

### Interface Style 3: Advanced DNS Editor
- Text-based DNS zone file editor
- For advanced users
- Shows raw DNS records
- More control but more complex

**Don't worry** - the core fields (Type, Host, Value, TTL) are the same across all interfaces.

---

## Troubleshooting

### "Domain already in use" error in Netlify
**Solution:** Remove the domain from any other Netlify site first

### DNS not propagating after 48 hours
**Possible causes:**
- Incorrect DNS records (double-check IP and values)
- TTL set too high (try lowering to 300 seconds)
- DNS caching at ISP level
- Contact Spaceship support

### SSL certificate won't provision
**Checklist:**
- [ ] DNS fully propagated (check whatsmydns.net)
- [ ] A record points to correct IP (75.2.60.5)
- [ ] CNAME record points to correct Netlify URL
- [ ] Domain verified in Netlify
- [ ] Wait 24 hours after DNS propagation
- [ ] Contact Netlify support if still failing

### Site loads but forms don't work
**Check:**
- Environment variables configured in Netlify
- Supabase URL and API key are correct
- reCAPTCHA site key is correct
- Browser console for JavaScript errors
- Network tab for failed API requests

### "www" works but root domain doesn't (or vice versa)
**Check:**
- Both A record and CNAME record are added
- Both records are saved and active
- DNS propagation for both records
- Clear browser cache and try incognito

---

## DNS Record Reference

### A Record (Address Record)
- **Purpose:** Points a domain to an IP address
- **Use case:** Root domain → Netlify IP
- **Example:** `thinkzo.ai` → `75.2.60.5`
- **Format:** Must be an IPv4 address (xxx.xxx.xxx.xxx)

### CNAME Record (Canonical Name)
- **Purpose:** Points a subdomain to another domain
- **Use case:** WWW subdomain → Netlify domain
- **Example:** `www.thinkzo.ai` → `your-site.netlify.app`
- **Format:** Must be a domain name (not an IP address)
- **Restriction:** Cannot be used for root domain

### TTL (Time To Live)
- **Purpose:** How long DNS servers cache the record
- **Measured in:** Seconds
- **Common values:**
  - 300 = 5 minutes (fast updates, good for testing)
  - 3600 = 1 hour (balanced)
  - 86400 = 24 hours (slower updates, better caching)
- **Recommendation:** Use 3600 for production

---

## Important Notes

### About Spaceship
- Spaceship is a modern domain registrar
- User-friendly interface
- Good customer support
- DNS changes typically propagate quickly

### DNS Best Practices
- Always wait for DNS propagation before troubleshooting
- Lower TTL before making changes (speeds up propagation)
- Keep MX records intact (for email)
- Document your DNS configuration
- Take screenshots before and after changes

### Security Recommendations
- Enable domain lock in Spaceship (prevents unauthorized transfers)
- Enable two-factor authentication on Spaceship account
- Enable WHOIS privacy (hides personal info)
- Set domain to auto-renew (prevents accidental expiration)

---

## What Happens Next?

After DNS is configured correctly:

1. **DNS propagates globally** (15 min - 48 hours)
2. **Netlify verifies DNS** (automatic)
3. **SSL certificate provisions** (automatic, 1-5 minutes)
4. **Your site goes live** at `https://thinkzo.ai`
5. **Traffic starts flowing** to your Netlify-hosted site

---

## Need Help?

### Spaceship Support
- **Website:** https://www.spaceship.com/support
- **Live Chat:** Available in dashboard
- **Email:** support@spaceship.com

### Netlify Support
- **Docs:** https://docs.netlify.com
- **Community:** https://answers.netlify.com
- **Support:** https://www.netlify.com/support

### DNS Tools
- **Propagation Check:** https://www.whatsmydns.net
- **DNS Checker:** https://dnschecker.org
- **SSL Test:** https://www.ssllabs.com/ssltest

---

## Quick Reference Card

**Your DNS Records:**

```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600

Type: CNAME
Name: www
Value: [your-site].netlify.app
TTL: 3600
```

**Your Domain:** thinkzo.ai
**Registrar:** Spaceship
**Hosting:** Netlify
**SSL:** Let's Encrypt (via Netlify)

---

**You're all set! Your domain will be live once DNS propagates.** 🌐
