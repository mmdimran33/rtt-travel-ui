export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  message?: string;
  userId?: string;
  userType?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
} 
