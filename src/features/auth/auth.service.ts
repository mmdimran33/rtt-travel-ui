import axios from 'axios';
import type { LoginRequest, LoginResponse } from './auth';

const API_URL = 'http://localhost:8082/api/v1/auth';

class AuthService {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/login`,
      request
    );

    return response.data;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService();