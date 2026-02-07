require('dotenv').config();

console.log('--- M-Pesa Configuration Check ---');
console.log('Environment:', process.env.MPESA_ENVIRONMENT || 'Not Set (Defaulting to sandbox)');

// Check Keys
const hasKey = !!process.env.MPESA_CONSUMER_KEY;
const hasSecret = !!process.env.MPESA_CONSUMER_SECRET;
console.log('Consumer Key Present:', hasKey ? '✅' : '❌');
console.log('Consumer Secret Present:', hasSecret ? '✅' : '❌');

if (hasKey) console.log('Consumer Key (first 5):', process.env.MPESA_CONSUMER_KEY.substring(0, 5) + '...');

// Check Shortcode
const shortcode = process.env.MPESA_SHORTCODE;
console.log('Shortcode Present:', shortcode ? '✅' : '❌');
if (shortcode) {
    console.log('Current Shortcode:', shortcode);
    if (shortcode === '174379') {
        console.log('✅ Using Standard Sandbox Shortcode (Correct)');
    } else {
        console.log('⚠️ Using Custom Shortcode (Ensure this is intended for Sandbox)');
    }
} else {
    console.log('❌ MISSING SHORTCODE. For Sandbox, use: 174379');
}

// Check Passkey
const passkey = process.env.MPESA_PASSKEY;
console.log('Passkey Present:', passkey ? '✅' : '❌');
if (!passkey && (!process.env.MPESA_ENVIRONMENT || process.env.MPESA_ENVIRONMENT === 'sandbox')) {
    console.log('❌ MISSING PASSKEY. For Sandbox, use the default test passkey.');
}

console.log('--- End Check ---');
