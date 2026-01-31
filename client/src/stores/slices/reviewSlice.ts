import { StateCreator } from "zustand";
import { reviewService} from "../../services/reviewService";
import { SubmitReviewDTO, ReviewResponseDTO, PropertyReviewDTO } from "../../types/review";

export interface ReviewSlice {
  reviewLoading: boolean;
  reviewError: string | null;
  reviews: PropertyReviewDTO[];


  submitReview: (
    bookingId: string,
    data: SubmitReviewDTO
  ) => Promise<void>;
  fetchReviews: (propertyId: string) => Promise<void>;
  fetchReviewsForAdmin: (propertyId: string) => Promise<void>;
  toggleReviewVisibility: (reviewId: string, hide: boolean) => Promise<void>;
  fetchReviewsForOwner: (propertyId: string) => Promise<void>;

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

toggleReviewVisibility: async (reviewId: string, hide: boolean) => {
  set({ reviewLoading: true, reviewError: null });
  try {
    const updatedReview = await reviewService.toggleReviewVisibility(reviewId, hide);

    
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === updatedReview.id
          ? { ...r, isHidden: updatedReview.isHidden }
          : r
      ),
    }));
  } catch (err: unknown) {
    let errorMessage = "Failed to toggle review visibility";
    if (err instanceof Error) errorMessage = err.message;
    set({ reviewError: errorMessage });
  } finally {
    set({ reviewLoading: false });
  }
},

fetchReviewsForOwner: async (propertyId) => {
  set({ reviewLoading: true, reviewError: null });
  try {
    const reviews =
      await reviewService.getReviewsByPropertyIdForOwner(propertyId);
    set({ reviews });
  } catch (err: any) {
    set({
      reviewError:
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch owner reviews",
    });
  } finally {
    set({ reviewLoading: false });
  }
},



});