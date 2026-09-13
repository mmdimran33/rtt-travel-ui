import api from '../../app/config/axios';
import type { TenantResponse, CreateTenantRequest } from './tenant';

export const fetchTenantsAPI = async (): Promise<TenantResponse[]> => {
  const response = await api.get('/tenants');
  return response.data.data;
};

export const createTenantAPI = async (
  tenant: CreateTenantRequest
): Promise<TenantResponse> => {
  const response = await api.post('/tenants', tenant);
  return response.data.data;
};