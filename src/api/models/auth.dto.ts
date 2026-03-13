export interface RegisterRequestDto {
  login: string;
  password: string;
  name: string;
  email: string;
}

export interface AuthResponseDto {
  token: string;
}

export interface LoginRequestDto {
  login: string;
  password: string;
}

export interface UserProfileDto {
  id?: number | string;
  login: string;
  name: string;
  email: string;
}

export interface GetProfileSuccessResponseDto {
  data: UserProfileDto;
}
