import React from "react";
import { ReviewResponseDTO } from "../../types/review";
import { FaStar } from "react-icons/fa";

interface ReviewProps {
  review: ReviewResponseDTO;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  return (
    <div className="border-b py-3 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="font-medium">{review.userId}</div>
        <div className="flex items-center text-yellow-500 gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
      </div>
      {review.reviewText && <p className="text-gray-700 mt-1">{review.reviewText}</p>}
      <div className="text-sm text-gray-400 mt-1">
        {new Date(review.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default Review;
