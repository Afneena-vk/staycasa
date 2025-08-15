import React from "react";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { Link } from "react-router-dom";

const UserLanding: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white pt-28 pb-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Dream Vacation Starts Here
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Discover and book unique vacation homes, cabins, and villas across the globe.
            Your perfect getaway is just a few clicks away.
          </p>
          <Link
            to="/destinations"
            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card */}
            {["Bali", "Santorini", "Swiss Alps"].map((place, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={`https://source.unsplash.com/600x400/?${place}`}
                  alt={place}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{place}</h3>
                  <p className="text-gray-600 mt-2">
                    Experience the beauty of {place} with stunning views and luxurious stays.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLanding;
