export interface DonationRequestDto {
  name: string;
  email: string;
  amount: number;
  petId: number;
}

export interface DonationSuccessDataDto {
  message: string;
  donationId: string;
}

export interface DonationSuccessResponseDto {
  data: DonationSuccessDataDto;
}
