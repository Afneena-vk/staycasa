import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-3">
          <h3 className="text-white text-lg font-bold">VacayStay</h3>
          <p className="text-sm leading-relaxed">
            Find the perfect vacation home and create memories that last forever.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/destinations" className="hover:text-white transition-colors">Destinations</a></li>
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-3">
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <span className="cursor-pointer hover:text-white transition-colors">🌐</span>
            <span className="cursor-pointer hover:text-white transition-colors">📘</span>
            <span className="cursor-pointer hover:text-white transition-colors">📸</span>
            <span className="cursor-pointer hover:text-white transition-colors">🐦</span>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-900 py-4">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Staycasa. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
