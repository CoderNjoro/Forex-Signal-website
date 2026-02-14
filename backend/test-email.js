/**
 * Email Configuration Test Script
 * 
 * This script tests your MailerSend SMTP configuration
 * Run: node test-email.js
 */

require('dotenv').config();
const { testEmailConfig, sendPasswordResetEmail } = require('./src/services/emailService');

async function runTests() {
  console.log('\n🧪 Testing Email Configuration...\n');
  console.log('═'.repeat(50));

  // Test 1: Verify SMTP Configuration
  console.log('\n📋 Test 1: Verifying SMTP Configuration');
  console.log('─'.repeat(50));
  
  const configCheck = {
    host: process.env.MAILERSEND_SMTP_HOST,
    port: process.env.MAILERSEND_SMTP_PORT,
    user: process.env.MAILERSEND_SMTP_USER,
    from: process.env.MAILERSEND_FROM_EMAIL,
  };

  console.log('Configuration:');
  console.log(`  Host: ${configCheck.host || '❌ NOT SET'}`);
  console.log(`  Port: ${configCheck.port || '❌ NOT SET'}`);
  console.log(`  User: ${configCheck.user || '❌ NOT SET'}`);
  console.log(`  From: ${configCheck.from || '❌ NOT SET'}`);
  console.log(`  Pass: ${process.env.MAILERSEND_SMTP_PASS ? '✅ SET' : '❌ NOT SET'}`);

  if (!configCheck.host || !configCheck.user || !process.env.MAILERSEND_SMTP_PASS) {
    console.log('\n❌ Email configuration is incomplete!');
    console.log('\nPlease update your .env file with MailerSend credentials.');
    console.log('See MAILERSEND_SETUP_GUIDE.md for instructions.\n');
    process.exit(1);
  }

  // Test 2: Verify SMTP Connection
  console.log('\n📋 Test 2: Testing SMTP Connection');
  console.log('─'.repeat(50));
  
  const isValid = await testEmailConfig();
  
  if (!isValid) {
    console.log('\n❌ SMTP connection failed!');
    console.log('\nPossible issues:');
    console.log('  1. Incorrect SMTP credentials');
    console.log('  2. Network/firewall blocking port 587');
    console.log('  3. MailerSend account not activated\n');
    process.exit(1);
  }

  console.log('✅ SMTP connection successful!');

  // Test 3: Send Test Email
  console.log('\n📋 Test 3: Sending Test Email');
  console.log('─'.repeat(50));
  
  const testEmail = process.argv[2];
  
  if (!testEmail) {
    console.log('\n⚠️  No test email provided. Skipping send test.');
    console.log('\nTo send a test email, run:');
    console.log('  node test-email.js your-email@example.com\n');
  } else {
    console.log(`Sending test password reset email to: ${testEmail}`);
    
    try {
      await sendPasswordResetEmail(testEmail, '123456');
      console.log('\n✅ Test email sent successfully!');
      console.log(`\nCheck your inbox at: ${testEmail}`);
      console.log('(Also check spam/junk folder)\n');
    } catch (error) {
      console.log('\n❌ Failed to send test email!');
      console.log(`Error: ${error.message}\n`);
      
      if (error.message.includes('sandbox')) {
        console.log('💡 Tip: If using sandbox domain, you need to:');
        console.log('  1. Add recipient in MailerSend dashboard');
        console.log('  2. Verify the recipient email address\n');
      }
      
      process.exit(1);
    }
  }

  // Summary
  console.log('═'.repeat(50));
  console.log('\n✅ All tests passed! Email system is ready.\n');
  console.log('Next steps:');
  console.log('  1. Test password reset: http://localhost:5173/forgot-password');
  console.log('  2. Monitor emails in MailerSend dashboard');
  console.log('  3. Check email deliverability\n');
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  console.error('\nFull error:', error);
  process.exit(1);
});
