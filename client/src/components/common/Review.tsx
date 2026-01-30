// import React from "react";
// import { ReviewResponseDTO, PropertyReviewDTO } from "../../types/review";
// import { FaStar } from "react-icons/fa";

// interface ReviewProps {
//   // review: ReviewResponseDTO;
//   review: PropertyReviewDTO;
//    onToggleVisibility?: (reviewId: string, hide: boolean) => void;
// }

// const Review: React.FC<ReviewProps> = ({ review, onToggleVisibility }) => {
//   return (
//     <div className="border-b py-3 last:border-b-0 flex justify-between items-start">
//       <div>
//       <div className="flex items-center justify-between">
//         <div className="font-medium">{review.user.name}</div>
//         <div className="flex items-center text-yellow-500 gap-1">
//           {[...Array(review.rating)].map((_, i) => (
//             <FaStar key={i} />
//           ))}
//         </div>
//       </div>
//       {review.reviewText && <p className="text-gray-700 mt-1">{review.reviewText}</p>}
//       <div className="text-sm text-gray-400 mt-1">
//         {new Date(review.createdAt).toLocaleDateString()}
//       </div>
//     </div>
//       {onToggleVisibility && (
//         <button
//           className={`ml-4 px-2 py-1 text-sm rounded ${
//             review.isHidden ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//           }`}
//           onClick={() => onToggleVisibility(review.id, !review.isHidden)}
//         >
//           {review.isHidden ? "Show" : "Hide"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default Review;

import React from "react";
import { PropertyReviewDTO } from "../../types/review";
import { FaStar } from "react-icons/fa";

interface ReviewProps {
  review: PropertyReviewDTO;
  onToggleVisibility?: (reviewId: string, hide: boolean) => void;
}

const Review: React.FC<ReviewProps> = ({ review, onToggleVisibility }) => {

  const handleToggleClick = () => {
    if (!onToggleVisibility) return;

    const action = review.isHidden ? "show" : "hide";
    const confirmMsg = `Are you sure you want to ${action} this review?`;

    if (window.confirm(confirmMsg)) {
      onToggleVisibility(review.id, !review.isHidden);
    }
  };  

  return (
    <div
      className={`border-b py-3 last:border-b-0 flex justify-between items-start ${
        review.isHidden ? "opacity-50 italic" : ""
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="font-medium">
            {review.user.name}
            {review.isHidden && (
              <span className="ml-2 text-xs text-red-500">(Hidden)</span>
            )}
          </div>

          <div className="flex items-center text-yellow-500 gap-1">
            {[...Array(review.rating)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
        </div>

        {review.reviewText && (
          <p className="text-gray-700 mt-1">{review.reviewText}</p>
        )}

        <div className="text-sm text-gray-400 mt-1">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </div>

      {onToggleVisibility && (
        <button
          className={`ml-4 px-2 py-1 text-sm rounded ${
            review.isHidden
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          // onClick={() => onToggleVisibility(review.id, !review.isHidden)}
          onClick={handleToggleClick}
        >
          {review.isHidden ? "Show" : "Hide"}
        </button>
      )}
    </div>
  );
};

export default Review;

