# Quick Start: Resend Email Setup

## 🚀 5-Minute Setup Guide

### Step 1: Get Resend API Key (2 minutes)

1. Go to https://resend.com/signup
2. Sign up with your email
3. Verify your email address
4. Click **API Keys** in the sidebar
5. Click **Create API Key**
6. Name it "Thinkzo Production"
7. Select **Sending access**
8. Copy the API key (starts with `re_`)

### Step 2: Configure Supabase (1 minute)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Edge Functions** → **Settings** → **Secrets**
4. Add this environment variable:
   ```
   RESEND_API_KEY = [paste your API key here]
   ```
5. Click **Save**

### Step 3: Deploy Edge Function (1 minute)

The edge function has been updated automatically. If needed, redeploy:

```bash
# The function is already updated in your codebase
# Just deploy it to Supabase when ready
```

### Step 4: Test (1 minute)

1. Open your website
2. Click "Contact" button
3. Fill out and submit the contact form
4. Check:
   - ✅ Your Supabase logs for "Email sent successfully"
   - ✅ team@thinkzo.ai inbox for team notification
   - ✅ Customer inbox for confirmation email
   - ✅ Resend dashboard → Emails for delivery status

## ⚡ That's It!

Your contact form now uses Resend API instead of SMTP.

---

## 🔧 Optional: Verify Your Domain

For production use, verify your domain to send from `team@thinkzo.ai`:

1. Go to Resend dashboard → **Domains**
2. Click **Add Domain**
3. Enter `thinkzo.ai`
4. Copy the DNS records
5. Add to your domain registrar:
   - 1 TXT record (verification)
   - 2 MX records (email delivery)
   - 3 CNAME records (DKIM authentication)
6. Wait ~5-10 minutes for verification

**For Testing Only:**
Use `onboarding@resend.dev` (no verification needed)

---

## 📊 Monitor Email Delivery

View all sent emails in Resend dashboard:
- https://resend.com/emails

Track:
- ✅ Delivered emails
- ❌ Failed deliveries
- 📧 Email opens (if enabled)
- 🔗 Link clicks (if enabled)

---

## ❓ Need Help?

- **Setup Guide:** [RESEND_SETUP.md](./RESEND_SETUP.md)
- **Migration Details:** [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
- **Resend Docs:** https://resend.com/docs
- **Resend Support:** https://resend.com/support

---

**Status:** ✅ Ready to use
**Build:** ✅ Passing
**Frontend:** ✅ No changes needed
