
import { IReview } from '../../models/reviewModel';
import { IBaseRepository } from './IBaseRepository';
import mongoose from 'mongoose';

export interface IReviewRepository extends IBaseRepository<IReview> {
  findByBookingId(bookingId: string | mongoose.Types.ObjectId): Promise<IReview | null>;
  findByPropertyId(propertyId: string | mongoose.Types.ObjectId): Promise<IReview[]>;
  findByPropertyIdForAdmin(propertyId: string | mongoose.Types.ObjectId): Promise<IReview[]>;
  calculatePropertyRating(propertyId: string | mongoose.Types.ObjectId): Promise<{ averageRating: number; totalReviews: number }>;
  toggleVisibility(reviewId: string | mongoose.Types.ObjectId,isHidden: boolean): Promise<IReview | null>;
}
