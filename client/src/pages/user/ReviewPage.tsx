
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";

const ReviewPage = () => {
  const { bookingId } = useParams();
  const { selectedBooking, fetchBookingDetails, submitReview } = useAuthStore();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) fetchBookingDetails(bookingId);
  }, [bookingId]);

  if (!selectedBooking)
    return <div className="pt-40 text-center text-gray-500">Loading...</div>;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please give a star rating");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await submitReview(selectedBooking.id, { rating, reviewText });
      alert("Thanks for your review!");
      navigate(`/user/bookings/${bookingId}`);
    } catch (err: any) {
      // setError(err.message || "Failed to submit review");
        setError(
    err.response?.data?.error ||
    err.message ||
    "Failed to submit review"
  );
    } finally {
      setLoading(false);
    }
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-28 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="md:flex">
            {/* LEFT: Property Image */}
            <div className="md:w-1/2 relative">
              {selectedBooking.property?.images?.[0] ? (
                <img
                  src={selectedBooking.property.images[0]}
                  alt={selectedBooking.property.title}
                  className="w-full h-80 md:h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-80 md:h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg md:text-xl">
                  {selectedBooking.property.title}
                </h3>
              </div>
            </div>

            {/* RIGHT: Rating & Review */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Rate your stay
              </h2>

              {/* Star Rating */}
              <div className="flex items-center space-x-2">
                {stars.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-3xl transition-transform ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400 scale-110"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Optional Review Text */}
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                placeholder="Write your experience (optional)..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none resize-none"
              />

              {error && <p className="text-red-600 text-sm">{error}</p>}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewPage;

