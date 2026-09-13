import api from '../../app/config/axios';
import type { DashboardApiResponse } from "./dashboard";

export const fetchDashboardData = async (): Promise<DashboardApiResponse> => {
  const response = await api.get<DashboardApiResponse>("/dashboard");

  return response.data;
};