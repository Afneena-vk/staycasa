
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../config/tokens';
import { IReviewService } from './interfaces/IReviewService';
import { IReviewRepository } from '../repositories/interfaces/IReviewRepository';
import { IBookingRepository } from '../repositories/interfaces/IBookingRepository';
import { IPropertyRepository } from '../repositories/interfaces/IPropertyRepository';
import { CreateReviewDto, ReviewResponseDto, PropertyReviewDto} from '../dtos/review.dto';
import { ReviewMapper } from '../mappers/reviewMapper';
import { BookingStatus, PaymentStatus } from '../models/status/status';
import { MESSAGES } from '../utils/constants';
import mongoose from 'mongoose';

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TOKENS.IReviewRepository) private _reviewRepository: IReviewRepository,
    @inject(TOKENS.IBookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TOKENS.IPropertyRepository) private _propertyRepository: IPropertyRepository
  ) {}

  async createReview(
    bookingId: string,
    userId: string,
    data: CreateReviewDto
  ): Promise<ReviewResponseDto> {
   
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

   
    const booking = await this._bookingRepository.findByBookingIdAndUser(bookingId,userId);
    
    if (!booking) {
      throw new Error(MESSAGES.ERROR.BOOKING_NOT_FOUND);
    }

//     console.log('Booking userId:', booking.userId);
//   console.log('Booking userId type:', typeof booking.userId);
//   console.log('Booking userId toString:', booking.userId.toString());
//   console.log('Request userId:', userId);
//   console.log('Request userId type:', typeof userId);
//   console.log('Are they equal?', booking.userId.toString() === userId);

    // Verify booking belongs to user
    // if (booking.userId.toString() !== userId) {
    //   throw new Error('Unauthorized to review this booking');
    // }

   
    if (booking.bookingStatus !== BookingStatus.Completed) {
      throw new Error('Can only review completed bookings');
    }

    
    if (booking.paymentStatus !== PaymentStatus.Completed) {
      throw new Error('Payment must be completed to submit a review');
    }

    
    if (booking.isCancelled) {
      throw new Error('Cannot review a cancelled booking');
    }

    
    if (booking.reviewSubmitted) {
      throw new Error('You have already submitted a review for this booking');
    }

    
    const existingReview = await this._reviewRepository.findByBookingId(bookingId);
    if (existingReview) {
      throw new Error('Review already exists for this booking');
    }



   
    const review = await this._reviewRepository.create({
      bookingId: new mongoose.Types.ObjectId(bookingId),
      propertyId: booking.propertyId,
      ownerId: booking.ownerId,
 
      userId: new mongoose.Types.ObjectId(userId),
      rating: data.rating,
      reviewText: data.reviewText || '',
      isHidden: false,
    });

   
    await this._bookingRepository.update(bookingId, {
      reviewSubmitted: true,
    } as any);

    
    const { averageRating, totalReviews } = await this._reviewRepository.calculatePropertyRating(
      booking.propertyId
    );

   
    await this._propertyRepository.update(booking.propertyId.toString(), {
      averageRating,
      totalReviews,
    } as any);

    return ReviewMapper.toResponseDto(review);
  }

async getReviewsByPropertyId(
  propertyId: string
): Promise<PropertyReviewDto[]> {
  const reviews = await this._reviewRepository.findByPropertyId(propertyId);
    return reviews.map(review =>
    ReviewMapper.toPropertyReviewDto(review)
  );
}

async getReviewsByPropertyForAdmin(
  propertyId: string
): Promise<PropertyReviewDto[]> {
    const reviews = await this._reviewRepository.findByPropertyIdForAdmin(propertyId);
    return reviews.map(review =>
    ReviewMapper.toPropertyReviewDto(review)
  );
}

async toggleReviewVisibility(reviewId: string, hide: boolean): Promise<ReviewResponseDto> {
  const review = await this._reviewRepository.toggleVisibility(reviewId, hide);

  if (!review) {
    throw new Error('Review not found');
  }

  const { averageRating, totalReviews } = await this._reviewRepository.calculatePropertyRating(
    review.propertyId
  );

    await this._propertyRepository.update(review.propertyId.toString(), {
    averageRating,
    totalReviews,
  } as any);

  return ReviewMapper.toResponseDto(review);
}

async getReviewsByPropertyForOwner(
  propertyId: string,
  ownerId: string
): Promise<PropertyReviewDto[]> {
  const reviews =
    await this._reviewRepository.findByPropertyIdForOwner(
      propertyId,
      ownerId
    );

  return reviews.map(review =>
    ReviewMapper.toPropertyReviewDto(review)
  );
}



}