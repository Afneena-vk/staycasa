


import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-950">
            About Staycasa
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Discover unique vacation homes, book with confidence, and enjoy seamless travel experiences.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* TEXT */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your perfect stay starts here
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Staycasa is a modern vacation home booking platform designed to make travel simple and enjoyable. Whether you're planning a short getaway or a long stay, you can explore a wide range of properties tailored to your needs.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              We connect travelers with trusted property owners, providing a smooth booking experience, transparent reviews, and reliable service every step of the way.
            </p>
          </div>

          {/* IMAGE PLACEHOLDER */}
          {/* <div className="w-full h-64 bg-gray-200 rounded-xl" /> */}
          <img
  src="/images/about.jpg"
  alt="Vacation Home"
  className="w-full h-64 object-cover rounded-xl"
/>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            What you can do on Staycasa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Search Properties</h3>
              <p className="text-sm text-gray-500">Find stays by location, price, and amenities.</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-500">Book your stay quickly with a smooth process.</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Wishlist</h3>
              <p className="text-sm text-gray-500">Save and manage your favorite properties.</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Reviews & Ratings</h3>
              <p className="text-sm text-gray-500">Make decisions based on real user feedback.</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Host Your Property</h3>
              <p className="text-sm text-gray-500">List your property and reach more travelers.</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Secure Experience</h3>
              <p className="text-sm text-gray-500">Safe bookings with reliable platform support.</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-blue-950 text-white rounded-xl p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Start your journey today
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Explore stays, find your favorite place, and book with ease.
          </p>

          <button className="mt-6 bg-white text-blue-950 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Browse Properties
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;