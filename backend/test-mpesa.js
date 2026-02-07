require('dotenv').config();
const { initiateSTKPush } = require('./src/utils/mpesa');

async function testToken() {
    console.log('Testing M-Pesa Token Generation...');
    console.log('Environment:', process.env.MPESA_ENVIRONMENT);
    console.log('Consumer Key defined:', !!process.env.MPESA_CONSUMER_KEY);
    console.log('Consumer Secret defined:', !!process.env.MPESA_CONSUMER_SECRET);
    console.log('Shortcode defined:', !!process.env.MPESA_SHORTCODE);
    console.log('Passkey defined:', !!process.env.MPESA_PASSKEY);
    console.log('Backend URL:', process.env.BACKEND_URL);

    try {
        // We'll try to initiate with a test number and small amount
        // Note: For STK push to work in sandbox, use test credentials and test number
        // Depending on what initiateSTKPush does internally (token + push), if token fails it throws.
        
        // We can't access getMpesaToken directly as it's not exported, so we test initiateSTKPush
        // Or I can modify mpesa.js to export getMpesaToken temporarily?
        // Or just duplicate the token logic here for testing.
        
        const axios = require('axios');
        const getMpesaBaseUrl = () => {
            return process.env.MPESA_ENVIRONMENT === 'production' 
                ? "https://api.safaricom.co.ke" 
                : "https://sandbox.safaricom.co.ke";
        };

        const consumer_key = process.env.MPESA_CONSUMER_KEY;
        const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
        const baseUrl = getMpesaBaseUrl();
        const url = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;
    
        const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    
        console.log('Requesting token from:', url);
        const response = await axios.get(url, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        console.log('Token generated successfully:', response.data.access_token ? 'YES' : 'NO');
        
    } catch (error) {
        console.error('Error generating M-Pesa token:', error.response?.data || error.message);
    }
}

testToken();
