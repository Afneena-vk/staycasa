import { StateCreator } from "zustand";
import { reviewService} from "../../services/reviewService";
import { SubmitReviewDTO } from "../../types/review";

export interface ReviewSlice {
  reviewLoading: boolean;
  reviewError: string | null;

  submitReview: (
    bookingId: string,
    data: SubmitReviewDTO
  ) => Promise<void>;
}

export const createReviewSlice: StateCreator<
  ReviewSlice,
  [],
  [],
  ReviewSlice
> = (set) => ({
  reviewLoading: false,
  reviewError: null,

  
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
});