
import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { IReviewController } from './interfaces/IReviewController';
import { IReviewService } from '../services/interfaces/IReviewService';
import { TOKENS } from '../config/tokens';
import { STATUS_CODES, MESSAGES } from '../utils/constants';
import logger from '../utils/logger';
import { CreateReviewDto } from '../dtos/review.dto';

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
      const { bookingId } = req.params;
      const userId = (req as any).userId;
      const reviewData: CreateReviewDto = req.body;

      
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          status: STATUS_CODES.BAD_REQUEST,
          error: 'Rating must be between 1 and 5',
        });
        return;
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
      logger.error('Create review error:', error);
      
    //   const statusCode = 
    //     error.message.includes('not found') ? STATUS_CODES.NOT_FOUND :
    //     error.message.includes('Unauthorized') ? STATUS_CODES.FORBIDDEN :
    //     STATUS_CODES.BAD_REQUEST;

    //   res.status(statusCode).json({
    //     status: statusCode,
    //     error: error.message || 'Failed to submit review',
    //   });
          if (error instanceof Error) {
        const statusCode =
          error.message.includes('not found')
            ? STATUS_CODES.NOT_FOUND
            : error.message.includes('Unauthorized')
            ? STATUS_CODES.FORBIDDEN
            : STATUS_CODES.BAD_REQUEST;

        res.status(statusCode).json({
          status: statusCode,
          error: error.message,
        });
      } else {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        });
      }
    }
  }
}
