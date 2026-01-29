

import { CreateReviewDto, PropertyReviewDto, ReviewResponseDto } from '../../dtos/review.dto';

export interface IReviewService {
  createReview(
    bookingId: string,
    userId: string,
    data: CreateReviewDto
  ): Promise<ReviewResponseDto>;

 getReviewsByPropertyId(
  propertyId: string
): Promise<PropertyReviewDto[]>

}