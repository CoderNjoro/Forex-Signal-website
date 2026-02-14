# MailerSend Quick Start - 5 Minutes Setup

## 🚀 Quick Setup (Copy & Paste)

### Step 1: Sign Up (2 minutes)
1. Go to: https://www.mailersend.com/
2. Click "Sign Up Free"
3. Verify your email

### Step 2: Get SMTP Credentials (2 minutes)
1. Login to MailerSend dashboard
2. Go to **Settings** → **SMTP**
3. Click **"Generate New User"**
4. Copy the credentials shown

### Step 3: Update .env File (1 minute)
Open `backend\.env` and update these lines:

```env
MAILERSEND_SMTP_HOST=smtp.mailersend.net
MAILERSEND_SMTP_PORT=587
MAILERSEND_SMTP_USER=MS_xxxxx@trial-xxxxx.mlsender.net
MAILERSEND_SMTP_PASS=your_password_here
MAILERSEND_FROM_EMAIL=noreply@trial-xxxxx.mlsender.net
```

**Replace:**
- `MS_xxxxx@trial-xxxxx.mlsender.net` → Your SMTP username
- `your_password_here` → Your SMTP password
- `noreply@trial-xxxxx.mlsender.net` → Your from email

### Step 4: Test (30 seconds)
```bash
cd backend
node test-email.js your-email@example.com
```

---

## 📧 For Sandbox Testing

If using the free sandbox domain, you MUST verify recipient emails:

1. Go to MailerSend → **Settings** → **Domains**
2. Click your sandbox domain
3. Click **"Add Recipient"**
4. Enter your test email
5. Check email and click verification link
6. Now you can send to that email!

---

## ✅ Verification Checklist

- [ ] Signed up for MailerSend
- [ ] Generated SMTP credentials
- [ ] Updated `.env` file
- [ ] Added test recipient (if using sandbox)
- [ ] Ran `node test-email.js your-email@example.com`
- [ ] Received test email
- [ ] Tested password reset flow

---

## 🎯 What You Get

### Password Reset Emails
- Professional HTML design
- 6-digit security code
- 10-minute expiration
- Mobile responsive
- Spam-folder optimized

### Email Verification (Future)
- Welcome message
- Verification code
- Feature highlights
- Security tips

---

## 🔥 Common Issues & Fixes

### "Authentication Failed"
→ Double-check SMTP username and password in `.env`

### "Recipient Not Verified"
→ Add and verify recipient in MailerSend dashboard (sandbox only)

### "Connection Timeout"
→ Check if port 587 is blocked by firewall

### Email in Spam
→ Normal for sandbox domain. Use your own domain for production.

---

## 📊 Free Tier Limits

- **3,000 emails/month** (forever free!)
- Unlimited domains
- Full analytics
- SMTP & API access

**Perfect for getting started!**

---

## 🆘 Need Help?

1. **Full Guide**: See `MAILERSEND_SETUP_GUIDE.md`
2. **MailerSend Docs**: https://developers.mailersend.com/
3. **Support**: support@mailersend.com

---

## 🎉 You're Done!

Your app can now send:
- ✅ Password reset codes
- ✅ Email verifications (when implemented)
- ✅ Professional HTML emails
- ✅ All for FREE!

**Test it now:**
```
http://localhost:5173/forgot-password
```
