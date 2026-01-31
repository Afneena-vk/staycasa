
import { injectable } from 'tsyringe';
import { BaseRepository } from './baseRepository';
import { IReview } from '../models/reviewModel';
import Review from '../models/reviewModel';
import { IReviewRepository } from './interfaces/IReviewRepository';
import mongoose from 'mongoose';

@injectable()
export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
  constructor() {
    super(Review);
  }

  async findByBookingId(bookingId: string | mongoose.Types.ObjectId): Promise<IReview | null> {
    return await this.model.findOne({ bookingId }).exec();
  }

  async findByPropertyId(propertyId: string | mongoose.Types.ObjectId): Promise<IReview[]> {
    return await this.model
      .find({ propertyId, isHidden: false })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPropertyIdForAdmin(
  propertyId: string | mongoose.Types.ObjectId
): Promise<IReview[]> {
  return this.model
    .find({ propertyId }) 
    .populate('userId', 'name profileImage')
    .sort({ createdAt: -1 })
    .exec();
}

async findByPropertyIdForOwner(
  propertyId: string | mongoose.Types.ObjectId,
  ownerId: string | mongoose.Types.ObjectId
): Promise<IReview[]> {
  return this.model
    .find({
      propertyId,
      ownerId,
      isHidden: false,
    })
    .populate("userId", "name profileImage")
    .sort({ createdAt: -1 })
    .exec();
}



  async calculatePropertyRating(
    propertyId: string | mongoose.Types.ObjectId
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const reviews = await this.model.find({ propertyId, isHidden: false }).exec();
    
    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

    return {
      averageRating,
      totalReviews: reviews.length,
    };
  }

async toggleVisibility(
  reviewId: string | mongoose.Types.ObjectId,
  isHidden: boolean
): Promise<IReview | null> {
  return this.model.findByIdAndUpdate(
    reviewId,
    { isHidden },
    { new: true }
  ).exec();
}


}