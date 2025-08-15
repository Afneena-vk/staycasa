import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-purple-600">
          VacayStay
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-purple-600">
            Home
          </Link>
          <Link to="/destinations" className="text-gray-700 hover:text-purple-600">
            Destinations
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-purple-600">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-purple-600">
            Contact
          </Link>
        </nav>

        {/* Login Button */}
        <Link
          to="/user/login"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
