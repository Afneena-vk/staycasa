

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

getReviewsByPropertyForAdmin(
  propertyId: string
): Promise<PropertyReviewDto[]>

toggleReviewVisibility(
  reviewId: string,
  hide: boolean
  ): Promise<ReviewResponseDto>

}