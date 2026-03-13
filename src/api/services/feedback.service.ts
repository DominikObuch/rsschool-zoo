import { apiClient } from '../client/http-client.ts';
import type { GetFeedbackSuccessResponseDto } from '../models/feedback.dto.ts';

export const feedbackService = {
  getFeedback(): Promise<GetFeedbackSuccessResponseDto> {
    return apiClient.get<GetFeedbackSuccessResponseDto>('/feedback');
  },
};
