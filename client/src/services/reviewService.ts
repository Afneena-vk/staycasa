import { api } from "../api/api";
import { ADMIN_API, USER_API, OWNER_API } from "../constants/apiRoutes";
import { SubmitReviewDTO, ReviewResponseDTO, PropertyReviewDTO } from "../types/review";

export const reviewService = {
  submitReview: async (bookingId: string, data: SubmitReviewDTO) => {
    const res = await api.post(
      USER_API.SUBMIT_REVIEW(bookingId),
      data
    );
    return res.data;
  },

    getReviewsByPropertyId: async (propertyId: string): Promise<PropertyReviewDTO[]> => {
    const res = await api.get(USER_API.REVIEWS_BY_PROPERTY(propertyId));
    return res.data.reviews; 
  },

    getReviewsByPropertyIdForAdmin: async (propertyId: string): Promise<PropertyReviewDTO[]> => {
    const res = await api.get(ADMIN_API.REVIEWS_BY_PROPERTY(propertyId));
    return res.data.reviews; 
  },


toggleReviewVisibility: async (reviewId: string, hide: boolean) => {
  const res = await api.patch(ADMIN_API.TOGGLE_REVIEW_VISIBILITY(reviewId), { hide });
  return res.data.review;
},

getReviewsByPropertyIdForOwner: async (propertyId: string): Promise<PropertyReviewDTO[]> => {
  const res = await api.get(OWNER_API.REVIEWS_BY_PROPERTY(propertyId));
  return res.data.reviews;
},



};
