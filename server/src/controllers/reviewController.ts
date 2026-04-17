
import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { IReviewController } from './interfaces/IReviewController';
import { IReviewService } from '../services/interfaces/IReviewService';
import { TOKENS } from '../config/tokens';
import { STATUS_CODES, MESSAGES } from '../utils/constants';
import logger from '../utils/logger';
import { CreateReviewDto } from '../dtos/review.dto';
import { AppError } from '../utils/AppError';
import { parseParam } from '../utils/parseParam';

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject(TOKENS.IReviewService) private _reviewService: IReviewService
  ) {}

  async createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { bookingId } = req.params;

      const bookingId = parseParam(req.params.bookingId);

     if (!bookingId) {
       throw new AppError("Booking ID is required", STATUS_CODES.BAD_REQUEST);
     }

      const userId = req.userId!;
      const reviewData: CreateReviewDto = req.body;

      
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {

         throw new AppError('Rating must be between 1 and 5', STATUS_CODES.BAD_REQUEST);
      }

      const review = await this._reviewService.createReview(
        bookingId,
        userId,
        reviewData
      );

      logger.info(`Review created for booking ${bookingId} by user ${userId}`);

      res.status(STATUS_CODES.CREATED).json({
        status: STATUS_CODES.CREATED,
        message: 'Review submitted successfully',
        review,
      });
        } catch (error: unknown) {
      next(error);
    }

  }

async getReviewsByProperty(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // const { propertyId } = req.params;

    const propertyId = parseParam(req.params.propertyId);

    if (!propertyId) {
      throw new AppError("Property ID is required", STATUS_CODES.BAD_REQUEST);
    }

    const reviews = await this._reviewService.getReviewsByPropertyId(propertyId);

    res.status(STATUS_CODES.OK).json({
      message: "Reviews fetched successfully",
      reviews,
    });
      } catch (error: unknown) {
      next(error);
    }

}

async getReviewsByPropertyForAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // const { propertyId } = req.params;

    const propertyId = parseParam(req.params.propertyId);

    if (!propertyId) {
       throw new AppError("Property ID is required", STATUS_CODES.BAD_REQUEST);
    }

    const reviews = await this._reviewService.getReviewsByPropertyForAdmin(propertyId);

    res.status(STATUS_CODES.OK).json({
      message: "Reviews fetched successfully",
      reviews,
    });
    } catch (error: unknown) {
      next(error);
    }

}

async toggleReviewVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // const { reviewId } = req.params;

    const reviewId = parseParam(req.params.reviewId);

  if (!reviewId) {
     throw new AppError("Review ID is required", STATUS_CODES.BAD_REQUEST);
  }

    const { hide } = req.body; 

    if (typeof hide !== 'boolean') {

      throw new AppError('hide must be a boolean', STATUS_CODES.BAD_REQUEST);
    }

    const updatedReview = await this._reviewService.toggleReviewVisibility(reviewId, hide);

    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: `Review has been ${hide ? 'hidden' : 'shown'} successfully`,
      review: updatedReview,
    }); 
    } catch (error: unknown) {
      next(error);
    }

 
}

async getReviewsByPropertyForOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // const { propertyId } = req.params;

    const propertyId = parseParam(req.params.propertyId);

    if (!propertyId) {
      throw new AppError("Property ID is required", STATUS_CODES.BAD_REQUEST);
    }
    
    const ownerId = req.userId!; 

    const reviews = await this._reviewService.getReviewsByPropertyForOwner(
        propertyId,
        ownerId
      );
    res.status (STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: "properties reviews fetched successfully",
      reviews,
    });

    } catch (error: unknown) {
      next(error);
    }
}


}
