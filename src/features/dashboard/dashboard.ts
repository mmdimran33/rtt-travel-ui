export interface DashboardResponse {
  totalTenants: number;
  totalCompanies: number;
  totalCandidates: number;
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardResponse;
}