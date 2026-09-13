export const UserType = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  COMPANY_USER: 'COMPANY_USER',
  VENDOR_USER: 'VENDOR_USER',
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

export const Status = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED'
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export interface User {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  userType: UserType;
  status: Status;
  createdAt: string;
}

export interface CreateUserRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  userType: UserType;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}