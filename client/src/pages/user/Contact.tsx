import React from "react";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-950">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Have questions or need help? We're here to assist you.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* FORM */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Send us a message
            </h2>

            <form className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Message</label>
                <textarea
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none text-sm"
                />
              </div>

              {/* <button
                type="submit"
                className="w-full bg-blue-950 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
              >
                Send Message
              </button> */}
            </form>
          </div>

          {/* INFO */}
          <div className="space-y-6">

            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Support
              </h3>
              <p className="text-sm text-gray-500">
                For general inquiries, feel free to reach out via email.
              </p>
              <p className="mt-2 text-sm font-medium text-blue-950">
                support@staycasa.com
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Response Time
              </h3>
              <p className="text-sm text-gray-500">
                We usually respond within 24 hours on business days.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Booking Help
              </h3>
              <p className="text-sm text-gray-500">
                For property-specific questions or booking details, you can chat directly with the property owner through the platform.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;