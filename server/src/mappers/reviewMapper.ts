

import { IReview } from '../models/reviewModel';
import { ReviewResponseDto } from '../dtos/review.dto';

export class ReviewMapper {
  static toResponseDto(review: IReview): ReviewResponseDto {
    return {
      id: review._id.toString(),
      bookingId: review.bookingId.toString(),
      propertyId: review.propertyId.toString(),
      ownerId: review.ownerId.toString(),
      userId: review.userId.toString(),
      rating: review.rating,
      reviewText: review.reviewText,
      isHidden: review.isHidden,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}