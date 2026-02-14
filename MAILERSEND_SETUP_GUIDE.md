# MailerSend Email Integration Guide

## Overview
This guide will help you set up MailerSend for sending verification emails and password reset codes. MailerSend offers a **free tier with 3,000 emails per month**, perfect for getting started!

## Why MailerSend?
- ✅ **Free Tier**: 3,000 emails/month forever
- ✅ **No Credit Card Required**: Start immediately
- ✅ **Professional Templates**: Beautiful HTML emails
- ✅ **High Deliverability**: Industry-leading inbox placement
- ✅ **Easy Setup**: Simple SMTP configuration
- ✅ **Analytics**: Track opens, clicks, and bounces

---

## Step 1: Create MailerSend Account

1. **Go to MailerSend**
   - Visit: https://www.mailersend.com/
   - Click "Sign Up Free"

2. **Create Your Account**
   - Enter your email address
   - Create a strong password
   - Verify your email address

3. **Complete Onboarding**
   - Follow the welcome wizard
   - Skip any paid plan prompts (free tier is sufficient)

---

## Step 2: Add and Verify Your Domain

### Option A: Use Your Own Domain (Recommended for Production)

1. **Add Domain**
   - Go to **Settings** → **Domains**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `yourdomain.com`)

2. **Verify Domain**
   - MailerSend will provide DNS records
   - Add these records to your domain's DNS settings:
     - **SPF Record** (TXT)
     - **DKIM Record** (TXT)
     - **CNAME Record** (for tracking)
   
3. **Wait for Verification**
   - DNS propagation can take 24-48 hours
   - MailerSend will automatically verify once records are detected
   - You'll receive an email when verification is complete

### Option B: Use Sandbox Domain (For Testing)

1. **Use Provided Sandbox**
   - MailerSend provides a sandbox domain automatically
   - Format: `trial-xxxxx.mlsender.net`
   - **Limitation**: Can only send to verified email addresses

2. **Add Verified Recipients**
   - Go to **Settings** → **Domains** → Your sandbox domain
   - Click **"Add Recipient"**
   - Enter email addresses you want to test with
   - Verify each email address via the confirmation link

---

## Step 3: Generate SMTP Credentials

1. **Navigate to SMTP Settings**
   - Go to **Settings** → **SMTP**
   - Click **"Generate New User"**

2. **Create SMTP User**
   - **Name**: `forex-signals-app` (or any name you prefer)
   - **Domain**: Select your verified domain
   - Click **"Generate"**

3. **Save Credentials**
   - **SMTP Username**: Copy this (e.g., `MS_xxxxx@trial-xxxxx.mlsender.net`)
   - **SMTP Password**: Copy this (shown only once!)
   - **SMTP Host**: `smtp.mailersend.net`
   - **SMTP Port**: `587` (TLS) or `465` (SSL)

---

## Step 4: Configure Your Application

1. **Open `.env` File**
   ```bash
   cd c:\Users\Tech\Desktop\ffsignal\backend
   notepad .env
   ```

2. **Update Email Configuration**
   ```env
   # MailerSend Email Configuration
   MAILERSEND_SMTP_HOST=smtp.mailersend.net
   MAILERSEND_SMTP_PORT=587
   MAILERSEND_SMTP_USER=MS_xxxxx@trial-xxxxx.mlsender.net
   MAILERSEND_SMTP_PASS=your_generated_password_here
   MAILERSEND_FROM_EMAIL=noreply@yourdomain.com
   ```

3. **Important Notes**
   - Replace `MS_xxxxx@trial-xxxxx.mlsender.net` with your actual SMTP username
   - Replace `your_generated_password_here` with your actual SMTP password
   - Replace `noreply@yourdomain.com` with your verified domain email
   - If using sandbox, use `noreply@trial-xxxxx.mlsender.net`

4. **Save and Close**

---

## Step 5: Test Email Configuration

1. **Restart Backend Server**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Test Password Reset**
   - Go to: `http://localhost:5173/forgot-password`
   - Enter a registered email address
   - Click "Send Reset Code"
   - Check your email inbox (and spam folder)

3. **Check Backend Logs**
   ```
   ✅ Password reset email sent to user@example.com
   ```

---

## Step 6: Verify Email Delivery

1. **Check Your Inbox**
   - Look for email from your domain
   - Subject: "🔑 Password Reset Code - Forex Signals"
   - Check spam/junk folder if not in inbox

2. **Check MailerSend Dashboard**
   - Go to **Analytics** → **Activity**
   - View sent emails, delivery status, and opens
   - Debug any delivery issues

---

## Email Templates Included

### 1. Password Reset Email
- **Subject**: 🔑 Password Reset Code - Forex Signals
- **Features**:
  - Premium dark theme design
  - Large, easy-to-read 6-digit code
  - 10-minute expiration warning
  - Security notice
  - Mobile-responsive

### 2. Email Verification (Coming Soon)
- **Subject**: 🔐 Verify Your Forex Signals Account
- **Features**:
  - Welcome message
  - Verification code
  - Feature highlights
  - Security tips

---

## Troubleshooting

### Issue: "Authentication Failed"
**Cause**: Incorrect SMTP credentials
**Solution**:
1. Regenerate SMTP credentials in MailerSend
2. Update `.env` file with new credentials
3. Restart backend server

### Issue: "Domain Not Verified"
**Cause**: DNS records not properly configured
**Solution**:
1. Check DNS records in your domain registrar
2. Wait 24-48 hours for DNS propagation
3. Use sandbox domain for testing in the meantime

### Issue: Emails Going to Spam
**Cause**: Domain reputation or missing DNS records
**Solution**:
1. Ensure all DNS records (SPF, DKIM, DMARC) are added
2. Warm up your domain by sending gradually
3. Ask recipients to mark as "Not Spam"
4. Check MailerSend's deliverability tips

### Issue: "Sandbox Recipient Not Verified"
**Cause**: Testing with unverified email in sandbox mode
**Solution**:
1. Add recipient in MailerSend dashboard
2. Verify the email address via confirmation link
3. Or use your own verified domain

### Issue: Emails Not Sending
**Cause**: SMTP connection issues
**Solution**:
1. Check if port 587 is blocked by firewall
2. Try port 465 with SSL instead
3. Verify SMTP credentials are correct
4. Check backend logs for detailed errors

---

## Production Deployment Checklist

Before going live, ensure:

- [ ] Own domain is verified (not using sandbox)
- [ ] All DNS records (SPF, DKIM, DMARC) are configured
- [ ] SMTP credentials are stored securely
- [ ] `.env` file is not committed to Git
- [ ] Email templates are tested and look good
- [ ] Unsubscribe link is added (if sending marketing emails)
- [ ] Privacy policy and terms are linked in emails
- [ ] Monitoring is set up for email failures
- [ ] Rate limiting is configured to prevent abuse

---

## MailerSend Dashboard Features

### Analytics
- **Activity Feed**: Real-time email tracking
- **Delivery Reports**: Success/failure rates
- **Engagement Metrics**: Opens, clicks, bounces

### Monitoring
- **Webhooks**: Real-time event notifications
- **Suppressions**: Manage bounces and unsubscribes
- **Logs**: Detailed delivery logs

### Advanced Features
- **Templates**: Create reusable email templates
- **Inbound Routing**: Receive and process emails
- **Scheduled Sending**: Send emails at specific times
- **A/B Testing**: Test different email versions

---

## Cost Breakdown

### Free Tier (Forever)
- **3,000 emails/month**
- **Unlimited domains**
- **Email analytics**
- **SMTP & API access**
- **Email templates**

### Paid Plans (If You Grow)
- **Starter**: $25/month - 50,000 emails
- **Business**: $80/month - 200,000 emails
- **Enterprise**: Custom pricing

**Note**: The free tier is more than enough for most startups!

---

## Security Best Practices

1. **Never Commit Credentials**
   ```bash
   # Ensure .env is in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use Environment Variables**
   - Never hardcode SMTP credentials
   - Use `.env` file for local development
   - Use hosting platform's environment variables in production

3. **Rotate Credentials Regularly**
   - Generate new SMTP credentials every 3-6 months
   - Delete old credentials from MailerSend

4. **Monitor for Abuse**
   - Set up alerts for unusual sending patterns
   - Implement rate limiting on password reset endpoints

---

## Support Resources

- **MailerSend Docs**: https://developers.mailersend.com/
- **SMTP Setup Guide**: https://www.mailersend.com/help/smtp-setup
- **Community Forum**: https://community.mailersend.com/
- **Support Email**: support@mailersend.com

---

## Next Steps

1. ✅ Sign up for MailerSend
2. ✅ Verify your domain (or use sandbox)
3. ✅ Generate SMTP credentials
4. ✅ Update `.env` file
5. ✅ Test password reset flow
6. ✅ Test email verification (when implemented)
7. ✅ Monitor email delivery in dashboard

**You're all set!** Your application can now send professional emails for free! 🎉
