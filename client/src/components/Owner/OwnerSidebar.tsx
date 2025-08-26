// import { Link, useLocation } from "react-router-dom";
// import {
//   FaBars,
//   FaTimes,
//   FaHome,
//   FaUser,
//   FaBuilding,
//   FaCalendarAlt,
//   FaWallet,
//   FaComments,
//   FaBell,
//   FaCog,
//   FaSignOutAlt,
//   FaChevronLeft
// } from "react-icons/fa";
// import { useState } from "react";

// const navLinks = [
//   { name: "Home", path: "/owner/home", icon: FaHome },
//   { name: "Profile", path: "/owner/profile", icon: FaUser },
//   { name: "Properties", path: "/owner/properties", icon: FaBuilding },
//   { name: "Bookings", path: "/owner/bookings", icon: FaCalendarAlt },
//   { name: "Wallet & Transactions", path: "/owner/wallet", icon: FaWallet },
//   { name: "Chats & Notifications", path: "/owner/chats", icon: FaComments }, // you can merge icon with FaBell if you want both
//   { name: "Settings", path: "/owner/settings", icon: FaCog },
//   { name: "Logout", path: "/owner/logout", icon: FaSignOutAlt },
// ];

// interface OwnerSidebarProps {
//   collapsed: boolean;
//   onToggle: () => void;
// }

// const OwnerSidebar = ({ collapsed, onToggle }: OwnerSidebarProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const toggleSidebarMobile = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleLinkClick = () => {
//     setIsOpen(false);
//   };

//   const renderNavItem = (link: typeof navLinks[number]) => {
//     const Icon = link.icon;
//     const isActive = location.pathname === link.path;
//     const isLogout = link.name === "Logout";

//     return (
//       <Link
//         key={link.name}
//         to={link.path}
//         onClick={handleLinkClick}
//         title={collapsed ? link.name : undefined}
//         className={`group flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
//           isActive
//             ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-[1.02]"
//             : isLogout
//             ? "hover:bg-red-600/20 text-red-400"
//             : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
//         }`}
//       >
//         <div className="w-5 h-5 flex items-center justify-center">
//           <Icon size={18} />
//         </div>
//         {!collapsed && (
//           <span className="font-medium text-sm">
//             {link.name}
//           </span>
//         )}
//         {isActive && !collapsed && (
//           <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75" />
//         )}
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* Mobile Header */}
//       <div className="lg:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md">
//         <div className="flex justify-between items-center p-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
//               <FaCog className="text-white text-sm" />
//             </div>
//             <h1 className="text-lg font-bold">Owner Panel</h1>
//           </div>
//           <button
//             onClick={toggleSidebarMobile}
//             className="p-2 rounded-lg hover:bg-slate-700 transition"
//           >
//             {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 fixed lg:static top-0 left-0 h-full ${
//           collapsed ? "w-16" : "w-72"
//         } bg-gradient-to-b from-slate-900 to-slate-800 text-white z-50 transition-transform duration-300 ease-in-out shadow-2xl`}
//       >
//         {/* Sidebar Header */}
//         <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
//           {!collapsed && (
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
//                 <FaCog className="text-white text-sm" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold">Owner Panel</h1>
//                 <p className="text-xs text-slate-400">Management Console</p>
//               </div>
//             </div>
//           )}
//           <button
//             onClick={onToggle}
//             className="p-2 rounded-lg hover:bg-slate-700/40 transition"
//           >
//             {collapsed ? <FaBars size={16} /> : <FaChevronLeft size={16} />}
//           </button>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex flex-col p-3 space-y-1">
//           {navLinks.map(renderNavItem)}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default OwnerSidebar;

import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaWallet,
  FaSignOutAlt,
} from "react-icons/fa";

const OwnerSidebar = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white tracking-wide">StayCasa</h1>
        <p className="text-sm text-gray-400">Owner Dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem to="/owner/dashboard" icon={<FaHome />} label="Dashboard" />
        <NavItem to="/owner/profile" icon={<FaUser />} label="Profile" />
        <NavItem to="/owner/properties" icon={<FaBuilding />} label="Properties" />
        <NavItem to="/owner/bookings" icon={<FaCalendarAlt />} label="Bookings" />
        <NavItem to="/owner/wallet" icon={<FaWallet />} label="Wallet" />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <NavItem to="/owner/logout" icon={<FaSignOutAlt />} label="Logout" />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
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

