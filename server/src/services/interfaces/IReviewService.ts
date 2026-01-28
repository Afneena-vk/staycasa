

import { CreateReviewDto, ReviewResponseDto } from '../../dtos/review.dto';

export interface IReviewService {
  createReview(
    bookingId: string,
    userId: string,
    data: CreateReviewDto
  ): Promise<ReviewResponseDto>;
}