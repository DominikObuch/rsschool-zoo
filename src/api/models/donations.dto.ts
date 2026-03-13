export interface DonationRequestDto {
  name: string;
  email: string;
  amount: number;
  petId: number;
}

export interface DonationSuccessResponseDto {
  message?: string;
  success?: boolean;
}
