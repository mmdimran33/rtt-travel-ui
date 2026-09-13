import api from "../../app/config/axios";
import type {
  CandidateResponse,
  CreateCandidateRequest,
  UpdateCandidateRequest,
} from "./candidate";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const authorizationHeader = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

export const fetchAllCandidates = async (accessToken: string): Promise<CandidateResponse[]> => {
  const response = await api.get<ApiResponse<CandidateResponse[]>>(
    "/candidates",
    authorizationHeader(accessToken)
  );
  return response.data.data;
};

export const createCandidate = async (
  request: CreateCandidateRequest,
  accessToken: string
): Promise<CandidateResponse> => {
  const response = await api.post<ApiResponse<CandidateResponse>>(
    "/candidates",
    request,
    authorizationHeader(accessToken)
  );
  return response.data.data;
};

export const updateCandidate = async (
  id: number,
  request: UpdateCandidateRequest,
  accessToken: string
): Promise<CandidateResponse> => {
  const response = await api.put<ApiResponse<CandidateResponse>>(
    `/candidates/${id}`,
    request,
    authorizationHeader(accessToken)
  );
  return response.data.data;
};
