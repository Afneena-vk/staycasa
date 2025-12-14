
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";

const BookingFailure: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const reason =
    location.state?.reason ||
    "Your payment could not be completed. Please try again.";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 pt-24">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Failed
          </h1>

          {/* Message */}
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {reason}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/user/payment")}
              className="w-full rounded-xl bg-red-600 py-3 text-white font-medium hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Try Payment Again
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full rounded-xl border border-gray-300 py-3 text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Go to Home
            </button>
          </div>

          {/* Support hint */}
          {/* <p className="mt-6 text-xs text-gray-400">
            If the amount was debited, it will be refunded automatically within 3–5 business days.
          </p> */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingFailure;
