const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getMpesaBaseUrl = () => {
    return process.env.MPESA_ENVIRONMENT === 'production' 
        ? "https://api.safaricom.co.ke" 
        : "https://sandbox.safaricom.co.ke";
};

const getMpesaToken = async () => {
    const consumer_key = process.env.MPESA_CONSUMER_KEY;
    const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
    const baseUrl = getMpesaBaseUrl();
    const url = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating M-Pesa token:', error.response?.data || error.message);
        throw new Error(`M-Pesa Token Error: ${error.response?.data?.errorMessage || error.message}`);
    }
};

const initiateSTKPush = async (phoneNumber, amount) => {
    const token = await getMpesaToken();
    const baseUrl = getMpesaBaseUrl();
    const url = `${baseUrl}/mpesa/stkpush/v1/processrequest`;
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(
        (process.env.MPESA_SHORTCODE || '') + 
        (process.env.MPESA_PASSKEY || '') + 
        timestamp
    ).toString('base64');

    const data = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.BACKEND_URL}/api/payments/mpesa-callback`,
        AccountReference: "FFSignal Pro",
        TransactionDesc: "Pro Subscription Payment"
    };

    try {
        console.log(`Initiating STK Push (${process.env.MPESA_ENVIRONMENT || 'sandbox'}) for:`, phoneNumber, 'Amount:', amount);
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error initiating STK Push:', error.response?.data || error.message);
        throw new Error(`STK Push Error: ${error.response?.data?.errorMessage || error.message}`);
    }
};

module.exports = {
    initiateSTKPush
};
