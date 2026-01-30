import { StateCreator } from "zustand";
import { reviewService} from "../../services/reviewService";
import { SubmitReviewDTO, ReviewResponseDTO } from "../../types/review";

export interface ReviewSlice {
  reviewLoading: boolean;
  reviewError: string | null;
  reviews: ReviewResponseDTO[];


  submitReview: (
    bookingId: string,
    data: SubmitReviewDTO
  ) => Promise<void>;
  fetchReviews: (propertyId: string) => Promise<void>;
  fetchReviewsForAdmin: (propertyId: string) => Promise<void>;
}

export const createReviewSlice: StateCreator<
  ReviewSlice,
  [],
  [],
  ReviewSlice
> = (set) => ({
  reviewLoading: false,
  reviewError: null,
  reviews: [],

  
   submitReview: async (bookingId, data) => {
    set({ reviewLoading: true, reviewError: null });
    try {
      await reviewService.submitReview(bookingId, data);
    } catch (err: any) {
      set({
        reviewError:
          err.response?.data?.error ||
          err.message ||
          "Failed to submit review",
      });
      throw err;
    } finally {
      set({ reviewLoading: false });
    }
  },

  fetchReviews: async (propertyId) => {
    set({ reviewLoading: true, reviewError: null });
    try {
      const reviews = await reviewService.getReviewsByPropertyId(propertyId);
      set({ reviews });
    } catch (err: any) {
      set({ reviewError: err.response?.data?.error || err.message || "Failed to fetch reviews" });
    } finally {
      set({ reviewLoading: false });
    }
  },

  fetchReviewsForAdmin: async (propertyId) => {
    set({ reviewLoading: true, reviewError: null });
  try {
    const reviews =
      await reviewService.getReviewsByPropertyIdForAdmin(propertyId);
    set({ reviews });
  } catch (err: any) {
    set({
      reviewError:
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch admin reviews",
    });
  } finally {
    set({ reviewLoading: false });
  }
},


});