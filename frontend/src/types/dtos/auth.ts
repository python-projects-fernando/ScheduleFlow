// frontend/src/types/dtos/auth.ts
export interface LoginRequest {
  email: string; // O backend pode esperar 'email' ou 'username'
  password: string;
  // grant_type?: string; // Opcional para OAuth2, talvez não necessário para login simples
  // scope?: string;
  // client_id?: string;
  // client_secret?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token?: string;
  token_type?: string;
  user_id?: string;
  error_code?: string;
}
