# Password Reset System - Testing Guide

## Overview
The password reset system allows users to securely reset their passwords using a 6-digit verification code sent to their email.

## Features Implemented

### Backend (API)
1. **POST /api/auth/forgot-password**
   - Accepts: `{ email }`
   - Generates a 6-digit reset code
   - Stores hashed token in database with 10-minute expiration
   - Returns success message (and token in development mode)

2. **POST /api/auth/reset-password**
   - Accepts: `{ email, resetToken, newPassword }`
   - Validates token and expiration
   - Updates user password
   - Clears reset token from database

### Frontend (UI)
1. **Step 1: Request Reset Code**
   - User enters their email address
   - System sends reset code (displayed in toast for development)
   - Premium "Access Recovery" themed UI

2. **Step 2: Reset Password**
   - User enters 6-digit code
   - User enters new password
   - User confirms new password
   - System validates and updates password
   - Redirects to login page

## Testing the System

### Test Case 1: Complete Password Reset Flow

1. **Navigate to Login Page**
   - Go to `http://localhost:5173/login`
   - Click "Recover Access" link

2. **Request Reset Code**
   - Enter a registered email (e.g., `test@example.com`)
   - Click "Send Reset Code"
   - **Development Mode**: The 6-digit code will appear in a toast notification
   - **Production Mode**: Code would be sent via email

3. **Enter Reset Code and New Password**
   - Enter the 6-digit code from the toast
   - Enter your new password (minimum 6 characters)
   - Confirm your new password
   - Click "Reset Password"

4. **Login with New Password**
   - You'll be redirected to the login page
   - Login with your email and new password

### Test Case 2: Invalid Token

1. Request a reset code for your email
2. Enter an incorrect 6-digit code
3. Expected: Error message "Invalid or expired reset token"

### Test Case 3: Expired Token

1. Request a reset code
2. Wait 10+ minutes
3. Try to use the code
4. Expected: Error message "Invalid or expired reset token"

### Test Case 4: Password Mismatch

1. Request a reset code
2. Enter valid code
3. Enter different passwords in "New Password" and "Confirm Password"
4. Expected: Error message "Passwords do not match"

### Test Case 5: Short Password

1. Request a reset code
2. Enter valid code
3. Enter a password less than 6 characters
4. Expected: Error message "Password must be at least 6 characters"

## API Testing with Postman/cURL

### 1. Request Password Reset
```bash
curl -X POST http://localhost:5080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Response (Development):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent.",
  "resetToken": "123456"
}
```

### 2. Reset Password
```bash
curl -X POST http://localhost:5080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123"
  }'
```

**Response:**
```json
{
  "message": "Password reset successful. You can now log in with your new password.",
  "success": true
}
```

## Security Features

1. **Token Hashing**: Reset tokens are hashed using SHA-256 before storage
2. **Time Expiration**: Tokens expire after 10 minutes
3. **One-Time Use**: Tokens are deleted after successful password reset
4. **Email Obfuscation**: System doesn't reveal if email exists in database
5. **Password Validation**: Minimum 6 characters enforced
6. **Activity Logging**: All password reset attempts are logged

## Database Schema Updates

The User model now includes:
```javascript
{
  resetPasswordToken: String,      // Hashed token
  resetPasswordExpire: Date        // Expiration timestamp
}
```

## Production Deployment Notes

### Email Integration Required
In production, you need to integrate an email service to send reset codes:

1. **Recommended Services:**
   - SendGrid
   - AWS SES
   - Mailgun
   - Nodemailer with SMTP

2. **Update `authController.js`:**
   ```javascript
   // Replace console.log with actual email sending
   await sendEmail({
     to: user.email,
     subject: 'Password Reset Code',
     text: `Your password reset code is: ${resetToken}`
   });
   ```

3. **Remove Development Token from Response:**
   ```javascript
   // Remove this line in production:
   resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
   ```

## UI/UX Features

1. **Two-Step Process**: Clear separation between requesting code and resetting password
2. **Visual Feedback**: Loading states, success/error toasts
3. **Premium Design**: Consistent with elite trading platform aesthetic
4. **Responsive Layout**: Works on all screen sizes
5. **Accessibility**: Proper labels, focus states, and keyboard navigation

## Troubleshooting

### Issue: "Invalid or expired reset token"
- **Cause**: Token has expired (>10 minutes) or incorrect code entered
- **Solution**: Request a new reset code

### Issue: Reset code not appearing
- **Cause**: Backend not running or API connection issue
- **Solution**: Check browser console and backend logs

### Issue: Password not updating
- **Cause**: Database connection issue or validation error
- **Solution**: Check backend logs for detailed error messages

## Next Steps for Production

1. ✅ Integrate email service provider
2. ✅ Add rate limiting to prevent abuse
3. ✅ Implement CAPTCHA on forgot password form
4. ✅ Add email templates with branding
5. ✅ Set up monitoring for failed reset attempts
6. ✅ Add multi-factor authentication option

## Support

For issues or questions, check:
- Backend logs: `backend/` terminal
- Frontend console: Browser DevTools
- Network requests: Browser DevTools Network tab
