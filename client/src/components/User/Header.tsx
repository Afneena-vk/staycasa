

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { NotificationBell } from "../../pages/user/NotificationBell";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { userData, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/user/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-950 tracking-tight">
          Staycasa
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/user/dashboard" className="hover:text-blue-700 transition-colors">Home</Link>
          <Link to="/user/destination" className="hover:text-blue-700 transition-colors">Destinations</Link>
          <Link to="/about" className="hover:text-blue-700 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-blue-700 transition-colors">Contact</Link>
          {isAuthenticated && <NotificationBell role="User" />}
        </nav>

        {/* Right side */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {userData?.profileImage?.url ? (
                <img
                  src={userData.profileImage.url}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-700" />
                </div>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                <Link to="/user/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                <Link to="/user/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Bookings</Link>
                <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                <Link to="/user/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Wallet</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/user/signup"
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
            >
              Register
            </Link>
            <Link
              to="/user/login"
              className="text-sm font-medium bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
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
