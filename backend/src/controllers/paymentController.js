const Payment = require('../models/Payment');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { initiateSTKPush } = require('../utils/mpesa');
const logActivity = require('../utils/activityLogger');

// @desc    Initiate M-Pesa Payment
// @route   POST /api/payments/mpesa
// @access  Private
exports.initiateMpesaPayment = async (req, res) => {
    try {
        const { phoneNumber, amount } = req.body;
        
        // Format phone number to 254xxxxxxxxx
        let formattedPhone = phoneNumber.replace('+', '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.slice(1);
        } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
            formattedPhone = '254' + formattedPhone;
        }

        const response = await initiateSTKPush(formattedPhone, amount);

        if (response.ResponseCode === "0") {
            const payment = await Payment.create({
                user: req.user.id,
                amount: amount,
                currency: 'KES',
                paymentMethod: 'mpesa',
                phoneNumber: formattedPhone,
                checkoutRequestID: response.CheckoutRequestID,
                status: 'pending'
            });

            await logActivity({
                userId: req.user.id, 
                action: 'payment_initiated', 
                details: `M-Pesa payment of KES ${amount} initiated`,
                req
            });

            res.status(200).json({
                success: true,
                message: "STK Push initiated successfully. Please check your phone.",
                checkoutRequestID: response.CheckoutRequestID
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to initialize M-Pesa payment"
            });
        }
    } catch (error) {
        console.error('M-Pesa Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// @desc    M-Pesa Callback
// @route   POST /api/payments/mpesa-callback
// @access  Public
exports.mpesaCallback = async (req, res) => {
    try {
        const { Body } = req.body;
        const { stkCallback } = Body;

        console.log('M-Pesa Callback Received:', JSON.stringify(Body));

        const payment = await Payment.findOne({ checkoutRequestID: stkCallback.CheckoutRequestID });

        if (!payment) {
            return res.status(404).json({ message: "Payment record not found" });
        }

        if (stkCallback.ResultCode === 0) {
            payment.status = 'completed';
            payment.transactionId = stkCallback.CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
            await payment.save();

            // Upgrade User to Premium
            const user = await User.findById(payment.user);
            if (user) {
                user.subscriptionType = 'premium';
                // Set to 99 years for "Lifetime" access
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 99);
                user.subscriptionExpiresAt = expiryDate;
                
                await user.save();
                await logActivity({
                    userId: user._id, 
                    action: 'subscription_upgraded', 
                    details: 'User upgraded to Premium via M-Pesa'
                });
            }
        } else {
            payment.status = 'failed';
            await payment.save();
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Callback Error:', error);
        res.status(500).json({ success: false });
    }
};

// @desc    Initiate Crypto Payment
// @route   POST /api/payments/crypto
// @access  Private
exports.initiateCryptoPayment = async (req, res) => {
    try {
        const { amount, currency } = req.body;
        
        const settings = await Settings.getSettings();
        const cryptoAddress = settings.cryptoSettings?.usdtAddress || process.env.USDT_WALLET_ADDRESS || "TYourWalletAddressHere";
        const network = settings.cryptoSettings?.network || "TRC20";

        const payment = await Payment.create({
            user: req.user.id,
            amount,
            currency: 'USD',
            paymentMethod: 'crypto',
            cryptoAddress,
            status: 'pending'
        });

        await logActivity({
            userId: req.user.id, 
            action: 'payment_initiated', 
            details: `Crypto payment of $${amount} initiated`,
            req
        });

        res.status(200).json({
            success: true,
            cryptoAddress,
            network,
            paymentId: payment._id,
            message: "Please send the USDT to the address provided and upload a screenshot for confirmation."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Confirm Crypto Payment (Manual)
// @route   POST /api/payments/crypto/confirm
// @access  Private
exports.confirmCryptoPayment = async (req, res) => {
    try {
        const { paymentId, transactionId } = req.body;
        const screenshot = req.file ? req.file.path : null;

        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        payment.transactionId = transactionId;
        if (screenshot) payment.screenshot = screenshot;
        payment.status = 'pending'; // Stays pending until admin reviews
        await payment.save();

        res.status(200).json({
            success: true,
            message: "Payment submitted for review. An administrator will verify and upgrade your account soon."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
