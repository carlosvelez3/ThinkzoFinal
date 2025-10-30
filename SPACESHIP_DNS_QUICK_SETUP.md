# Spaceship DNS Quick Setup for thinkzo.ai

This is a condensed, action-focused guide for configuring DNS in Spaceship to point to Netlify.

---

## Prerequisites

Before starting, you need:
- ✅ Your Netlify site deployed and URL noted (e.g., `brave-curie-12345.netlify.app`)
- ✅ Access to your Spaceship account
- ✅ Domain added in Netlify with "Use external DNS" selected

---

## DNS Records You Need

Add exactly these two DNS records in Spaceship:

### Record 1: A Record (Root Domain)

```
Type: A
Host: @
Value: 75.2.60.5
TTL: 3600
```

### Record 2: CNAME Record (WWW Subdomain)

```
Type: CNAME
Host: www
Value: [your-actual-netlify-subdomain].netlify.app
TTL: 3600
```

**Replace `[your-actual-netlify-subdomain]` with your real Netlify URL!**

---

## Step-by-Step Instructions

### Step 1: Log Into Spaceship

1. Go to: **https://www.spaceship.com**
2. Click **Sign In**
3. Enter your credentials
4. Navigate to **Domains** or **My Domains**
5. Click on **thinkzo.ai**

### Step 2: Open DNS Management

Look for and click:
- **DNS Settings**
- **Manage DNS**
- **DNS Management**
- **DNS Records**

### Step 3: Remove Conflicting Records

Delete these if they exist:
- ❌ A record for `@` or root domain
- ❌ CNAME record for `www`

**Keep these:**
- ✅ MX records (email)
- ✅ TXT records
- ✅ NS records (nameservers)

### Step 4: Add A Record

1. Click **Add Record** or **New DNS Record**
2. Select Type: **A**
3. Host/Name: **@**
4. Value: **75.2.60.5**
5. TTL: **3600**
6. Click **Save** or **Add**

### Step 5: Add CNAME Record

1. Click **Add Record** or **New DNS Record**
2. Select Type: **CNAME**
3. Host/Name: **www**
4. Value: **your-site-name.netlify.app** (your actual Netlify URL)
5. TTL: **3600**
6. Click **Save** or **Add**

### Step 6: Verify Configuration

Your DNS should now show:

| Type  | Host | Value                      | TTL  |
|-------|------|----------------------------|------|
| A     | @    | 75.2.60.5                  | 3600 |
| CNAME | www  | your-site.netlify.app      | 3600 |

Take a screenshot for your records.

### Step 7: Save Changes

- Click **Save Changes** or **Apply Changes** if prompted
- Some interfaces save automatically
- Look for confirmation message

---

## Verification

### Check DNS Propagation

1. Go to: **https://www.whatsmydns.net**
2. Enter: `thinkzo.ai`
3. Select: **A**
4. Should show: **75.2.60.5** globally (after propagation)

5. Enter: `www.thinkzo.ai`
6. Select: **CNAME**
7. Should show: **your-site-name.netlify.app**

### Timeline

- **DNS Propagation:** 15 minutes - 4 hours typically
- **Netlify Verification:** Automatic within 5-15 minutes after propagation
- **SSL Provisioning:** Automatic within 1-5 minutes after verification

---

## Common Spaceship Interface Variations

Spaceship's interface might look different. Here are common field names:

| What You Need | Possible Field Names |
|---------------|---------------------|
| Record Type | Type, Record Type |
| Host/Name | Host, Name, Hostname, Record Name, @ |
| Value | Value, Points to, Target, Destination, Data |
| TTL | TTL, Time to Live, Cache Time |

**Don't worry** - the values are the same regardless of field names.

---

## Troubleshooting

### Can't Find DNS Management
- Look for "Advanced Settings" or "DNS Zone Editor"
- Try searching for "DNS" in Spaceship dashboard
- Contact Spaceship support chat

### Don't See @ Symbol Option for Host
- Try leaving the Host field empty/blank
- Or try entering just the domain name: `thinkzo.ai`
- Both typically work as root domain

### CNAME Value Won't Accept .netlify.app
- Make sure you're entering the full subdomain: `your-site-name.netlify.app`
- Don't include `https://` or `http://`
- Don't include trailing `/`
- Just the subdomain name

### Changes Not Saving
- Check for validation errors in red text
- Verify TTL is a number (3600)
- Ensure IP address is exactly: 75.2.60.5
- Try refreshing the page and checking if records appear

---

## What Happens Next

1. **DNS propagates** (15 min - 4 hours)
2. **Netlify detects** DNS records pointing to their servers
3. **Domain verifies** automatically in Netlify
4. **SSL provisions** automatically via Let's Encrypt
5. **Site goes live** at https://thinkzo.ai

---

## Quick Validation Checklist

Before closing Spaceship, verify:
- ✅ A record: @ → 75.2.60.5
- ✅ CNAME record: www → your-site.netlify.app
- ✅ Both records saved/active
- ✅ No conflicting A or CNAME records exist
- ✅ MX/TXT/NS records remain intact
- ✅ Screenshot taken for records

---

## Support

**Spaceship Support:**
- Website: https://www.spaceship.com/support
- Live Chat: Available in dashboard
- Email: Check Spaceship website for current support email

**DNS Propagation Check:**
- https://www.whatsmydns.net
- https://dnschecker.org

---

## Visual Reference

**What Your DNS Configuration Should Look Like:**

```
DNS Records for thinkzo.ai
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type    Host    Value                       TTL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A       @       75.2.60.5                   3600
CNAME   www     your-site.netlify.app       3600
MX      @       mail.example.com            3600  ← Keep existing
TXT     @       v=spf1...                   3600  ← Keep existing
NS      @       ns1.spaceship.com           3600  ← Keep existing
NS      @       ns2.spaceship.com           3600  ← Keep existing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Only the A and CNAME records need to be added/modified. Everything else stays as-is.

---

**Done!** Your DNS is now configured to point to Netlify using external DNS management. 🎉

Once DNS propagates, Netlify will automatically verify your domain and provision SSL. Your site will be live at https://thinkzo.ai.
