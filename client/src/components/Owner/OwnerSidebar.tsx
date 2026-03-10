
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaWallet,
  FaBell,
  FaCrown,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import { useAuthStore } from "../../stores/authStore";
import { NotificationBell } from "../../pages/user/NotificationBell";

interface OwnerSidebarProps {
  onMobileClose?: () => void;
}

const OwnerSidebar = ({ onMobileClose }: OwnerSidebarProps) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/owner/login");
  };

  const handleLinkClick = () => {
    onMobileClose?.();
  };

  return (

    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 flex flex-col shadow-lg overflow-y-auto">

      {/* Logo / Header */}
      <div className="p-6 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">StayCasa</h1>
            <p className="text-sm text-gray-400">Owner Dashboard</p>
          </div>
          {/* Close button — only visible on mobile */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition text-gray-300"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <div className="mt-4">
          <NotificationBell role="Owner" />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem to="/owner/dashboard" icon={<FaHome />} label="Dashboard" onClick={handleLinkClick} />
        <NavItem to="/owner/profile" icon={<FaUser />} label="Profile" onClick={handleLinkClick} />
        <NavItem to="/owner/properties" icon={<FaBuilding />} label="Properties" onClick={handleLinkClick} />
        <NavItem to="/owner/bookings" icon={<FaCalendarAlt />} label="Bookings" onClick={handleLinkClick} />
        <NavItem to="/owner/wallet" icon={<FaWallet />} label="Wallet" onClick={handleLinkClick} />
        <NavItem to="/owner/subscription" icon={<FaCrown />} label="Subscription" onClick={handleLinkClick} />
        <NavItem to="/owner/chat" icon={<FaBell />} label="Messages" onClick={handleLinkClick} />
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, onClick }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-indigo-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
};

export default OwnerSidebar;




// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaUser,
//   FaBuilding,
//   FaCalendarAlt,
//   FaWallet,
//   FaBell,
//   FaCrown,
//   FaSignOutAlt,
// } from "react-icons/fa";

// import { useAuthStore } from "../../stores/authStore";
// import { NotificationBell } from "../../pages/user/NotificationBell";

// const OwnerSidebar = () => {
//   const logout = useAuthStore((state) => state.logout);
//   const navigate = useNavigate();
//   const { unreadCount } = useAuthStore();

//    const handleLogout = async () => {
//     await logout(); 
//     navigate("/owner/login"); 
//   };
//   return (
//     <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 flex flex-col shadow-lg">
//       {/* Logo */}
//       <div className="p-6 border-b border-gray-700">
//         <h1 className="text-2xl font-bold text-white tracking-wide">StayCasa</h1>
//         <p className="text-sm text-gray-400">Owner Dashboard</p>
//                 <div className="mt-4">
//           <NotificationBell role="Owner" />
//         </div>
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 px-4 py-6 space-y-2">
//         <NavItem to="/owner/dashboard" icon={<FaHome />} label="Dashboard" />
//         <NavItem to="/owner/profile" icon={<FaUser />} label="Profile" />
//         <NavItem to="/owner/properties" icon={<FaBuilding />} label="Properties" />
//         <NavItem to="/owner/bookings" icon={<FaCalendarAlt />} label="Bookings" />
//         <NavItem to="/owner/wallet" icon={<FaWallet />} label="Wallet" />
//         <NavItem to="/owner/subscription" icon={<FaCrown />} label="Subscription" />
//         <NavItem to="/owner/chat" icon={<FaBell />} label="Messages" />

//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-700">
//         {/* <NavItem to="/owner/logout" icon={<FaSignOutAlt />} label="Logout" /> */}
//          <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
//         >
//           <FaSignOutAlt className="text-lg" />
//           <span className="text-sm font-medium">Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// interface NavItemProps {
//   to: string;
//   icon: React.ReactNode;
//   label: string;
// }

// const NavItem = ({ to, icon, label }: NavItemProps) => {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
//           isActive
//             ? "bg-indigo-600 text-white shadow-md"
//             : "text-gray-300 hover:bg-gray-700 hover:text-white"
//         }`
//       }
//     >
//       <span className="text-lg">{icon}</span>
//       <span className="text-sm font-medium">{label}</span>
//     </NavLink>
//   );
// };

// export default OwnerSidebar;