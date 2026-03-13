import { apiClient } from '../client/http-client.ts';
import type { GetCamerasSuccessResponseDto } from '../models/cameras.dto.ts';

export const camerasService = {
  getCameras(): Promise<GetCamerasSuccessResponseDto> {
    return apiClient.get<GetCamerasSuccessResponseDto>('/cameras');
  },
};
