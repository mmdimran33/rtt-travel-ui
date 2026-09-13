import type { BaseResponse, CreateUserRequest, UpdateUserRequest, User } from './user';
import api from '../../app/config/axios';



// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  createUser: async (data: CreateUserRequest): Promise<BaseResponse<User>> => {
    const response = await api.post<BaseResponse<User>>('/users', data);
    return response.data;
  },

  getUserById: async (id: number): Promise<BaseResponse<User>> => {
    const response = await api.get<BaseResponse<User>>(`/users/${id}`);
    return response.data;
  },

  getAllUsers: async (): Promise<BaseResponse<User[]>> => {
    const response = await api.get<BaseResponse<User[]>>('/users');
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<BaseResponse<User>> => {
    const response = await api.put<BaseResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<BaseResponse<string>> => {
    const response = await api.delete<BaseResponse<string>>(`/users/${id}`);
    return response.data;
  },
};