

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // profile icon
//import { useAuthStore } from "../../store/authStore"; // adjust path if needed
import { useAuthStore } from "../../stores/authStore";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { userData, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    navigate("/user/login");
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-950">
          Staycasa
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/user/dashboard" className="text-gray-700 hover:text-blue-950">
            Home
          </Link>
          <Link to="/user/destination" className="text-gray-700 hover:text-blue-950">
            Destinations
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-950">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-950">
            Contact
          </Link>
        </nav>

        {/* Right side */}
        {isAuthenticated ? (
          <div className="relative">
            {/* Profile Icon */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
              ) : (
                <User className="w-8 h-8 text-blue-950" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                <Link
                  to="/user/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/bookings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                 Bookings
                </Link>
                <Link
                  to="/user/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  to="/user/wallet"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                 Wallet
                </Link>                
                {/* <Link
                  to="/user/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/user/signup"
              className="bg-purple-100 text-blue-950 px-4 py-2 rounded-lg hover:bg-purple-200 transition"
            >
              Register
            </Link>
            <Link
              to="/user/login"
              className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-950 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
