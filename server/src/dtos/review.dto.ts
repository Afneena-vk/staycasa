
export interface CreateReviewDto {
  rating: number;
  reviewText?: string;
}

export interface ReviewResponseDto {
  id: string;
  bookingId: string;
  propertyId: string;
  ownerId: string;
  userId: string;
  rating: number;
  reviewText?: string;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyReviewDto {
  id: string;
  rating: number;
  reviewText?: string;
  createdAt: Date;
  isHidden: boolean;

  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}
