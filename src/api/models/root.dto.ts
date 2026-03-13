export interface RootApiResponseDto {
  message: string;
  data: ApiDataDto;
}

export interface ApiDataDto {
  version: string;
  endpoints: ApiEndpointsDto;
}

export interface ApiEndpointsDto {
  pets: Record<string, string>;
  feedback: Record<string, string>;
  cameras: Record<string, string>;
  docs: Record<string, string>;
  auth: Record<string, string>;
  donations: Record<string, string>;
}
