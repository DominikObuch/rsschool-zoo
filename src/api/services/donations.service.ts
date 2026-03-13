import { apiClient } from '../client/http-client.ts';
import type {
  DonationRequestDto,
  DonationSuccessResponseDto,
} from '../models/donations.dto.ts';

export const donationsService = {
  createDonation(payload: DonationRequestDto): Promise<DonationSuccessResponseDto> {
    return apiClient.post<DonationSuccessResponseDto, DonationRequestDto>('/donations', payload);
  },
};
