import { api } from "../api/api";
import { USER_API } from "../constants/apiRoutes";
import { SubmitReviewDTO } from "../types/review";

export const reviewService = {
  submitReview: async (bookingId: string, data: SubmitReviewDTO) => {
    const res = await api.post(
      USER_API.SUBMIT_REVIEW(bookingId),
      data
    );
    return res.data;
  },
};
