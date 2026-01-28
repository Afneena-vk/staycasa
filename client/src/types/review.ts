export interface SubmitReviewDTO {
  rating: number;
  reviewText?: string;
}

export interface ReviewResponseDTO {
  id: string;
  bookingId: string;
  propertyId: string;
  userId: string;
  rating: number;
  reviewText?: string;
  createdAt: string;
  updatedAt: string;
}