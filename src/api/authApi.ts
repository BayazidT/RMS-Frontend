import api from './axiosInstance';
import type { User } from '../types/auth.types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post('/v1/public/auth/login', credentials);
  return res.data;
};

export const getProfile = async (accessToken?: string): Promise<User> => {
  // If token is passed (first login), use it; otherwise axios interceptor will add it
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
  const res = await api.get('/v1/public/auth/profile', { headers });
  return res.data;
};