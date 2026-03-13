import { apiClient } from '../client/http-client.ts';
import type { RootApiResponseDto } from '../models/root.dto.ts';

export const rootService = {
  getRoot(): Promise<RootApiResponseDto> {
    return apiClient.get<RootApiResponseDto>('/');
  },
};
