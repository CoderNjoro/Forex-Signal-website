const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getMpesaBaseUrl = () => {
    return process.env.MPESA_ENVIRONMENT === 'production' 
        ? "https://api.safaricom.co.ke" 
        : "https://sandbox.safaricom.co.ke";
};

// Diagnostic: log M-Pesa config status at startup (no secret values)
const logMpesaConfig = () => {
    const env = process.env.MPESA_ENVIRONMENT || 'sandbox (default)';
    console.log('=== M-Pesa Config Check ===');
    console.log('MPESA_ENVIRONMENT:', env);
    console.log('MPESA_CONSUMER_KEY:', process.env.MPESA_CONSUMER_KEY ? `SET (${process.env.MPESA_CONSUMER_KEY.slice(0,6)}...)` : 'MISSING ❌');
    console.log('MPESA_CONSUMER_SECRET:', process.env.MPESA_CONSUMER_SECRET ? 'SET ✓' : 'MISSING ❌');
    console.log('MPESA_SHORTCODE:', process.env.MPESA_SHORTCODE || 'MISSING ❌');
    console.log('MPESA_PASSKEY:', process.env.MPESA_PASSKEY ? 'SET ✓' : 'MISSING ❌');
    console.log('BACKEND_URL:', process.env.BACKEND_URL || 'MISSING ❌ (using fallback)');
    console.log('===========================');
};
logMpesaConfig();

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

    // Determine Transaction Type (Paybill vs Buy Goods)
    const transactionType = process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline";
    
    // For Buy Goods, PartyB is usually the Till Number (if different from Shortcode)
    // For Paybill, PartyB is the Shortcode
    const partyB = process.env.MPESA_PARTY_B || process.env.MPESA_SHORTCODE;

    const data = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: transactionType,
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: partyB,
        PhoneNumber: phoneNumber,
        CallBackURL: callBackUrl,
        AccountReference: "FFSignal Pro",
        TransactionDesc: "Pro Subscription Payment"
    };

    try {
        console.log(`Initiating STK Push (${process.env.MPESA_ENVIRONMENT || 'sandbox'}) for:`, phoneNumber, 'Amount:', amount);
        console.log('STK Push payload:', JSON.stringify({ ...data, Password: '[HIDDEN]' }, null, 2));
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('STK Push response:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        // Log the full detailed error from Safaricom
        console.error('=== STK Push Failed ===');
        console.error('HTTP Status:', error.response?.status);
        console.error('Safaricom Error Body:', JSON.stringify(error.response?.data, null, 2));
        console.error('Axios Error Message:', error.message);
        console.error('=======================');
        
        const safaricomError = error.response?.data;
        let errorMessage = safaricomError?.errorMessage 
            || safaricomError?.ResultDesc 
            || safaricomError?.requestId 
            || error.message;
        
        // Surface the Safaricom error code if available
        if (safaricomError?.errorCode) {
            errorMessage = `[Code ${safaricomError.errorCode}] ${errorMessage}`;
        }
        if (safaricomError?.ResultCode && safaricomError.ResultCode !== 0) {
            errorMessage = `[Code ${safaricomError.ResultCode}] ${errorMessage}`;
        }
        
        throw new Error(`STK Push Error: ${errorMessage}`);
    }
};

module.exports = {
    initiateSTKPush
};
