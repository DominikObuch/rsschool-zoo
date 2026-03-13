export interface ApiErrorResponseDto {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ApiEnvelopeDto<TData> {
  data: TData;
}
