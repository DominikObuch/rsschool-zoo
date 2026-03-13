export interface SimulatedApiErrorDto {
  error: string;
  isTestError: boolean;
  timestamp: string;
}

export interface FeedbackItemDto {
  id: number;
  city: string;
  month: string;
  year: string;
  text: string;
  name: string;
}

export interface GetFeedbackSuccessResponseDto {
  data: FeedbackItemDto[];
}
