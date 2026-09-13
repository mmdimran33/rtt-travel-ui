import api from '../../app/config/axios';
import type { CompanyResponse, CreateCompanyRequest } from './company';




interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const fetchAllCompany = async (): Promise<CompanyResponse[]> => {
  const response = await api.get<ApiResponse<CompanyResponse[]>>('/companies');
  return response.data.data;
};

export const addCompanyApi = async (
  request: CreateCompanyRequest
): Promise<CompanyResponse> => {
  const response = await api.post<ApiResponse<CompanyResponse>>(
    '/companies',
    request
  );
  return response.data.data;
};
