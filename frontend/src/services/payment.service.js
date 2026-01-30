import api from './api';

const initiateMpesa = async (phoneNumber, amount) => {
  const response = await api.post('/payments/mpesa', { phoneNumber, amount });
  return response.data;
};

const initiateCrypto = async (amount) => {
  const response = await api.post('/payments/crypto', { amount });
  return response.data;
};

const confirmCrypto = async (paymentId, transactionId, screenshot) => {
  const formData = new FormData();
  formData.append('paymentId', paymentId);
  formData.append('transactionId', transactionId);
  if (screenshot) {
    formData.append('screenshot', screenshot);
  }
  
  const response = await api.post('/payments/crypto/confirm', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const paymentService = {
  initiateMpesa,
  initiateCrypto,
  confirmCrypto,
};

export default paymentService;
