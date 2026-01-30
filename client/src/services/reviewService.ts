import { api } from "../api/api";
import { ADMIN_API, USER_API } from "../constants/apiRoutes";
import { SubmitReviewDTO, ReviewResponseDTO } from "../types/review";

export const reviewService = {
  submitReview: async (bookingId: string, data: SubmitReviewDTO) => {
    const res = await api.post(
      USER_API.SUBMIT_REVIEW(bookingId),
      data
    );
    return res.data;
  },

    getReviewsByPropertyId: async (propertyId: string): Promise<ReviewResponseDTO[]> => {
    const res = await api.get(USER_API.REVIEWS_BY_PROPERTY(propertyId));
    return res.data.reviews; 
  },

    getReviewsByPropertyIdForAdmin: async (propertyId: string): Promise<ReviewResponseDTO[]> => {
    const res = await api.get(ADMIN_API.REVIEWS_BY_PROPERTY(propertyId));
    return res.data.reviews; 
  },


};
