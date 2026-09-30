export type CompanyStatus = "ACTIVE" | "INACTIVE";

export interface CompanyResponse {
  id: number;
  companyCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  address: string;
  status: CompanyStatus;
  createdDate: string;
  updatedDate: string;
}

export interface CreateCompanyRequest {
  companyCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  address: string;
}

export type UpdateCompanyRequest = CreateCompanyRequest;