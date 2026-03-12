

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
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-950 tracking-tight">
          Staycasa
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/user/dashboard" className="hover:text-blue-700 transition-colors">Home</Link>
          <Link to="/user/destination" className="hover:text-blue-700 transition-colors">Destinations</Link>
          <Link to="/about" className="hover:text-blue-700 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-blue-700 transition-colors">Contact</Link>
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
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
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

              {isProfileMenuOpen && (
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
              className="text-sm font-medium bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 border-t border-gray-100 bg-white">
          <Link to="/user/dashboard" className="block py-2 text-gray-700 hover:bg-gray-50 rounded">Home</Link>
          <Link to="/user/destination" className="block py-2 text-gray-700 hover:bg-gray-50 rounded">Destinations</Link>
          <Link to="/about" className="block py-2 text-gray-700 hover:bg-gray-50 rounded">About</Link>
          <Link to="/contact" className="block py-2 text-gray-700 hover:bg-gray-50 rounded">Contact</Link>

          {/* Notification bell only in mobile nav */}
          {isAuthenticated && (
            <div className="relative py-2">
              <NotificationBell role="User" />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;




// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { User } from "lucide-react";
// import { useAuthStore } from "../../stores/authStore";
// import { NotificationBell } from "../../pages/user/NotificationBell";

// const Header: React.FC = () => {
//   const navigate = useNavigate();
//   const { userData, isAuthenticated, logout } = useAuthStore();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate("/user/login");
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="text-xl font-bold text-blue-950 tracking-tight">
//           Staycasa
//         </Link>

//         {/* Navigation */}
//         <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
//           <Link to="/user/dashboard" className="hover:text-blue-700 transition-colors">Home</Link>
//           <Link to="/user/destination" className="hover:text-blue-700 transition-colors">Destinations</Link>
//           <Link to="/about" className="hover:text-blue-700 transition-colors">About</Link>
//           <Link to="/contact" className="hover:text-blue-700 transition-colors">Contact</Link>
//           {isAuthenticated && <NotificationBell role="User" />}
//         </nav>

//         {/* Right side */}
//         {isAuthenticated ? (
//           <div className="relative">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="flex items-center space-x-2 focus:outline-none"
//             >
//               {userData?.profileImage?.url ? (
//                 <img
//                   src={userData.profileImage.url}
//                   alt="profile"
//                   className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
//                 />
//               ) : (
//                 <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
//                   <User className="w-5 h-5 text-blue-700" />
//                 </div>
//               )}
//             </button>

//             {isMenuOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
//                 <Link to="/user/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
//                 <Link to="/user/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Bookings</Link>
//                 <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
//                 <Link to="/user/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Wallet</Link>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex items-center gap-3">
//             <Link
//               to="/user/signup"
//               className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
//             >
//               Register
//             </Link>
//             <Link
//               to="/user/login"
//               className="text-sm font-medium bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
//             >
//               Sign In
//             </Link>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

