import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number; 
  max?: number;
}

const StarRating = ({ rating, max = 5 }: StarRatingProps) => {
  const roundedRating = Math.round(rating); 

  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: max }).map((_, index) => (
        <FaStar
          key={index}
          className={
            index < roundedRating ? "text-yellow-500" : "text-gray-300"
          }
          size={14}
        />
      ))}

            {/* {totalReviews !== undefined && (
        <span className="text-gray-500 text-sm ml-1">
          ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
        </span>
      )} */}
    </div>
  );
};

export default StarRating;
