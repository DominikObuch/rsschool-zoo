import { apiClient } from '../client/http-client.ts';
import type {
  AuthResponseDto,
  GetProfileSuccessResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
} from '../models/auth.dto.ts';

export const authService = {
  register(payload: RegisterRequestDto): Promise<AuthResponseDto> {
    return apiClient.post<AuthResponseDto, RegisterRequestDto>('/auth/register', payload);
  },

  login(payload: LoginRequestDto): Promise<AuthResponseDto> {
    return apiClient.post<AuthResponseDto, LoginRequestDto>('/auth/login', payload);
  },

  getProfile(token: string): Promise<GetProfileSuccessResponseDto> {
    return apiClient.get<GetProfileSuccessResponseDto>('/auth/profile', { token });
  },
};
