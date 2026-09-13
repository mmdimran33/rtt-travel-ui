export type TenantStatus = "ACTIVE" | "INACTIVE";

export interface TenantResponse {
  id: number;
  employeeCode?: string;
  tenantName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  status: TenantStatus;
  createdDate: string;
  updatedDate: string;
}

export interface CreateTenantRequest {
  employeeCode: string;
  tenantName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  address: string;
}

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}