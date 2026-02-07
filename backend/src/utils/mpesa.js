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

    if (!consumer_key || !consumer_secret) {
        throw new Error("M-Pesa Configuration Error: Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET");
    }

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
        
        let errorMessage = error.response?.data?.errorMessage || error.message;
        if (errorMessage.includes('Invalid Authentication') || error.response?.status === 401) {
            errorMessage += ` (Check if MPESA_ENVIRONMENT matches your credentials. Current: ${process.env.MPESA_ENVIRONMENT || 'sandbox'})`;
        }
        
        throw new Error(`M-Pesa Token Error: ${errorMessage}`);
    }
};

const initiateSTKPush = async (phoneNumber, amount) => {
    if (!process.env.MPESA_SHORTCODE || !process.env.MPESA_PASSKEY) {
        throw new Error("M-Pesa Configuration Error: Missing MPESA_SHORTCODE or MPESA_PASSKEY");
    }
    
    if (!process.env.BACKEND_URL) {
        console.warn("Warning: BACKEND_URL is not defined, callback URL might be invalid");
    }

    const token = await getMpesaToken();
    const baseUrl = getMpesaBaseUrl();
    const url = `${baseUrl}/mpesa/stkpush/v1/processrequest`;
    
    // Sanitize and Validate BACKEND_URL
    let backendUrl = process.env.BACKEND_URL || "https://forex-signal-website-njoro.up.railway.app";
    backendUrl = backendUrl.trim().replace(/\/$/, ''); // Remove trailing slash
    
    if (!backendUrl.startsWith('http')) {
        backendUrl = `https://${backendUrl}`; // Ensure protocol exists
    }

    const callBackUrl = `${backendUrl}/api/payments/mpesa-callback`;
    console.log("Generated CallBackURL:", callBackUrl);

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
        CallBackURL: callBackUrl,
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
        // Log the detailed error from Safaricom if available
        if (error.response?.data) {
             console.error('Safaricom API Error Details:', JSON.stringify(error.response.data, null, 2));
        }
        
        const errorMessage = error.response?.data?.errorMessage || error.response?.data?.requestId || error.message;
        throw new Error(`STK Push Error: ${errorMessage}`);
    }
};

module.exports = {
    initiateSTKPush
};
