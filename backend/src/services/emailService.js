const nodemailer = require('nodemailer');

/**
 * Email Service using MailerSend SMTP
 * Free tier: 3,000 emails/month
 * 
 * Setup Instructions:
 * 1. Sign up at https://www.mailersend.com/
 * 2. Verify your domain or use their sandbox domain
 * 3. Go to Settings > SMTP > Generate SMTP credentials
 * 4. Add credentials to .env file
 */

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAILERSEND_SMTP_HOST || 'smtp.mailersend.net',
    port: process.env.MAILERSEND_SMTP_PORT || 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.MAILERSEND_SMTP_USER,
      pass: process.env.MAILERSEND_SMTP_PASS,
    },
  });
};

/**
 * Send verification code email for registration
 */
const sendVerificationEmail = async (email, verificationCode, username) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.MAILERSEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: email,
      subject: '🔐 Verify Your Forex Signals Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #0A0C10;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(135deg, #1a1d29 0%, #0f1117 100%);
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid rgba(99, 102, 241, 0.2);
            }
            .header {
              background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #a5b4fc;
            }
            .code-container {
              background: rgba(99, 102, 241, 0.1);
              border: 2px solid #6366f1;
              border-radius: 15px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 48px;
              font-weight: 900;
              letter-spacing: 10px;
              color: #6366f1;
              font-family: 'Courier New', monospace;
            }
            .code-label {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 3px;
              color: #818cf8;
              margin-bottom: 15px;
            }
            .expiry {
              color: #ef4444;
              font-size: 14px;
              margin-top: 15px;
              font-weight: bold;
            }
            .message {
              line-height: 1.8;
              color: #cbd5e1;
              margin: 20px 0;
            }
            .footer {
              background: rgba(15, 17, 23, 0.5);
              padding: 30px;
              text-align: center;
              border-top: 1px solid rgba(99, 102, 241, 0.1);
            }
            .footer p {
              margin: 5px 0;
              color: #64748b;
              font-size: 12px;
            }
            .warning {
              background: rgba(239, 68, 68, 0.1);
              border-left: 4px solid #ef4444;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Forex Signals</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello <strong>${username}</strong>,</p>
              <p class="message">
                Welcome to the elite trading community! To complete your registration and activate your account, 
                please use the verification code below:
              </p>
              
              <div class="code-container">
                <div class="code-label">Verification Code</div>
                <div class="code">${verificationCode}</div>
                <div class="expiry">⏱️ Expires in 10 minutes</div>
              </div>
              
              <p class="message">
                Enter this code on the registration page to verify your email address and gain access to:
              </p>
              <ul class="message">
                <li>📊 Real-time forex trading signals</li>
                <li>💬 Community discussions and insights</li>
                <li>📈 Market analysis and fundamentals</li>
                <li>🎯 Premium trading strategies</li>
              </ul>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this verification code, 
                please ignore this email. Never share your verification code with anyone.
              </div>
            </div>
            <div class="footer">
              <p><strong>Forex Signals Platform</strong></p>
              <p>Professional Trading Intelligence</p>
              <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${username},

Welcome to Forex Signals Platform!

Your verification code is: ${verificationCode}

This code will expire in 10 minutes.

Enter this code on the registration page to verify your email address.

If you didn't request this code, please ignore this email.

---
Forex Signals Platform
Professional Trading Intelligence
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw error;
  }
};

/**
 * Send password reset OTP email
 */
const sendPasswordResetEmail = async (email, resetCode) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.MAILERSEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: email,
      subject: '🔑 Password Reset Code - Forex Signals',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #0A0C10;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(135deg, #1a1d29 0%, #0f1117 100%);
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid rgba(239, 68, 68, 0.2);
            }
            .header {
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #fca5a5;
            }
            .code-container {
              background: rgba(239, 68, 68, 0.1);
              border: 2px solid #ef4444;
              border-radius: 15px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 48px;
              font-weight: 900;
              letter-spacing: 10px;
              color: #ef4444;
              font-family: 'Courier New', monospace;
            }
            .code-label {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 3px;
              color: #f87171;
              margin-bottom: 15px;
            }
            .expiry {
              color: #fbbf24;
              font-size: 14px;
              margin-top: 15px;
              font-weight: bold;
            }
            .message {
              line-height: 1.8;
              color: #cbd5e1;
              margin: 20px 0;
            }
            .footer {
              background: rgba(15, 17, 23, 0.5);
              padding: 30px;
              text-align: center;
              border-top: 1px solid rgba(239, 68, 68, 0.1);
            }
            .footer p {
              margin: 5px 0;
              color: #64748b;
              font-size: 12px;
            }
            .warning {
              background: rgba(251, 191, 36, 0.1);
              border-left: 4px solid #fbbf24;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <p class="greeting">Account Recovery Request</p>
              <p class="message">
                We received a request to reset your password for your Forex Signals account. 
                Use the code below to complete the password reset process:
              </p>
              
              <div class="code-container">
                <div class="code-label">Reset Code</div>
                <div class="code">${resetCode}</div>
                <div class="expiry">⏱️ Expires in 10 minutes</div>
              </div>
              
              <p class="message">
                Enter this code on the password reset page along with your new password.
              </p>
              
              <div class="warning">
                <strong>⚠️ Security Alert:</strong> If you didn't request a password reset, 
                please ignore this email and ensure your account is secure. Your password will not 
                be changed unless you complete the reset process with this code.
              </div>
              
              <p class="message" style="margin-top: 30px;">
                <strong>Need help?</strong> If you're having trouble resetting your password or 
                suspect unauthorized access, please contact our support team immediately.
              </p>
            </div>
            <div class="footer">
              <p><strong>Forex Signals Platform</strong></p>
              <p>Professional Trading Intelligence</p>
              <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Reset Request

We received a request to reset your password for your Forex Signals account.

Your password reset code is: ${resetCode}

This code will expire in 10 minutes.

Enter this code on the password reset page along with your new password.

If you didn't request a password reset, please ignore this email.

---
Forex Signals Platform
Professional Trading Intelligence
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Test email configuration
 */
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  testEmailConfig,
};
