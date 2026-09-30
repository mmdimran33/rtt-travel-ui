import api from "../../app/config/axios";

import type {
  CompanyResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "./company";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * GET /api/v1/companies
 */
export const fetchAllCompany = async (): Promise<CompanyResponse[]> => {
  const response = await api.get<ApiResponse<CompanyResponse[]>>(
    "/companies"
  );

  return response.data.data;
};

/**
 * POST /api/v1/companies
 */
export const addCompanyApi = async (
  request: CreateCompanyRequest
): Promise<CompanyResponse> => {
  const response = await api.post<ApiResponse<CompanyResponse>>(
    "/companies",
    request
  );

  return response.data.data;
};

/**
 * PUT /api/v1/companies/{companyId}
 */
export const updateCompanyApi = async (
  companyId: number,
  request: UpdateCompanyRequest
): Promise<CompanyResponse> => {
  const response = await api.put<ApiResponse<CompanyResponse>>(
    `/companies/${companyId}`,
    request
  );

  return response.data.data;
};

/**
 * DELETE /api/v1/companies/{companyId}
 */
export const deleteCompanyApi = async (
  companyId: number
): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/companies/${companyId}`);
};