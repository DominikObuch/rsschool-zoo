import { apiClient } from '../client/http-client.ts';
import type {
  GetPetByIdSuccessResponseDto,
  GetPetsSuccessResponseDto,
} from '../models/pets.dto.ts';

export const petsService = {
  getPets(): Promise<GetPetsSuccessResponseDto> {
    return apiClient.get<GetPetsSuccessResponseDto>('/pets');
  },

  getPetById(id: number): Promise<GetPetByIdSuccessResponseDto> {
    return apiClient.get<GetPetByIdSuccessResponseDto>(`/pets/${id}`);
  },
};
