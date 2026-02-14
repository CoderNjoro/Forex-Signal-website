import api from './api';

const getAdmins = async () => {
  const response = await api.get('/superadmin/admins');
  return response.data;
};

const createAdmin = async (adminData) => {
  const response = await api.post('/superadmin/admins', adminData);
  return response.data;
};

const toggleAdminBlock = async (id) => {
  const response = await api.patch(`/superadmin/admins/${id}/block`);
  return response.data;
};

const togglePromotionPermission = async (id) => {
  const response = await api.patch(`/superadmin/admins/${id}/promotion-perm`);
  return response.data;
};

const getOverview = async () => {
  const response = await api.get('/superadmin/overview');
  return response.data;
};

const getActivityLogs = async (page = 1, action = '') => {
  const response = await api.get(`/superadmin/activities?page=${page}&action=${action}`);
  return response.data;
};

const getSubscriptions = async () => {
  const response = await api.get('/superadmin/subscriptions');
  return response.data;
};

const getPayments = async (page = 1, status = '') => {
  const response = await api.get(`/superadmin/payments?page=${page}&status=${status}`);
  return response.data;
};

export const superAdminService = {
  getAdmins,
  createAdmin,
  toggleAdminBlock,
  togglePromotionPermission,
  getOverview,
  getActivityLogs,
  getSubscriptions,
  getPayments
};
