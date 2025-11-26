export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token?: string;
  token_type?: string;
  user_id?: string;
  error_code?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user_id?: string;
  error_code?: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  role?: string;
  access_token?: string;
  token_type?: string;
  error_code?: string;
}
