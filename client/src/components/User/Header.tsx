

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { NotificationBell } from "../../pages/user/NotificationBell";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { userData, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/user/login");
  };

  return (

    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

    {/* Logo */}
    <Link
      to="/"
      className="text-xl font-extrabold bg-gradient-to-r from-blue-950 to-blue-600 bg-clip-text text-transparent tracking-tight"
    >
      Staycasa
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
      {[
        { name: "Home", path: "/user/dashboard" },
        { name: "Destinations", path: "/user/destination" },
        { name: "About", path: "/user/about" },
        { name: "Contact", path: "/user/contact" },
      ].map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="relative group hover:text-blue-700 transition-colors"
        >
          {item.name}
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-700 transition-all group-hover:w-full"></span>
        </Link>
      ))}

      {isAuthenticated && <NotificationBell role="User" />}
    </nav>

    {/* Right side */}
    {isAuthenticated ? (
      <div className="relative flex items-center gap-3">

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 focus:outline-none hover:scale-105 transition-transform"
          >
            {userData?.profileImage?.url ? (
              <img
                src={userData.profileImage.url}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-blue-700" />
              </div>
            )}
          </button>

          {/* Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
              <Link to="/user/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</Link>
              <Link to="/user/bookings" className="block px-4 py-2 text-sm hover:bg-gray-100">Bookings</Link>
              <Link to="/user/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">My Profile</Link>
              <Link to="/user/wallet" className="block px-4 py-2 text-sm hover:bg-gray-100">Wallet</Link>

              <div className="border-t my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    ) : (
      <div className="hidden md:flex items-center gap-3">
        <Link
          to="/user/signup"
          className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
        >
          Register
        </Link>
        <Link
          to="/user/login"
          className="text-sm font-medium bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Sign In
        </Link>
      </div>
    )}
  </div>

  {/* Mobile Navigation */}
  {isMobileMenuOpen && (
    <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-gray-200 bg-white/90 backdrop-blur-md">
      {[
        { name: "Home", path: "/user/dashboard" },
        { name: "Destinations", path: "/user/destination" },
        { name: "About", path: "/user/about" },
        { name: "Contact", path: "/user/contact" },
      ].map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition"
        >
          {item.name}
        </Link>
      ))}

      {isAuthenticated && (
        <div className="py-2">
          <NotificationBell role="User" />
        </div>
      )}
    </div>
  )}
</header>
  );
};

export default Header;





