

import { IReview } from '../models/reviewModel';
import { ReviewResponseDto, PropertyReviewDto } from '../dtos/review.dto';
import { IUser } from '../models/userModel';

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

 static toPropertyReviewDto(review: IReview): PropertyReviewDto {
    const user = review.userId as unknown as IUser;

    return {
      id: review._id.toString(),
      rating: review.rating,
      reviewText: review.reviewText,
      createdAt: review.createdAt,
      isHidden: review.isHidden,
      user: {
        id: user._id.toString(),
        name: user.name,
        // avatar: user.profileImage,
      },
    };
  }
  
}