import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold text-white">VacayStay</h2>
          <p className="mt-4 text-gray-400">
            Find the perfect vacation home and create memories that last forever.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/destinations" className="hover:underline">Destinations</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-white">🌐</a>
            <a href="#" className="hover:text-white">📘</a>
            <a href="#" className="hover:text-white">📸</a>
            <a href="#" className="hover:text-white">🐦</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} VacayStay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
