

import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaCrown,
  FaBuilding,
  FaCalendarAlt,
  FaCog,
  FaConciergeBell,
  FaSignOutAlt,
  FaChevronLeft
} from "react-icons/fa";
import { useState } from "react";

const navLinks = [
  { name: "Home", path: "/admin-dashboard", icon: FaHome },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  { name: "Owners", path: "/admin/owners", icon: FaCrown },
  { name: "Properties", path: "/admin/properties", icon: FaBuilding },
  { name: "Bookings", path: "/admin/bookings", icon: FaCalendarAlt },
  { name: "Settings", path: "/admin/settings", icon: FaCog },
  { name: "Services & Features", path: "/admin/services", icon: FaConciergeBell },
  { name: "Logout", path: "/admin/logout", icon: FaSignOutAlt },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ collapsed, onToggle }: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebarMobile = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const renderNavItem = (link: typeof navLinks[number]) => {
    const Icon = link.icon;
    const isActive = location.pathname === link.path;
    const isLogout = link.name === "Logout";

    return (
      <Link
        key={link.name}
        to={link.path}
        onClick={handleLinkClick}
        title={collapsed ? link.name : undefined}
        className={`group flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-[1.02]"
            : isLogout
            ? "hover:bg-red-600/20 text-red-400"
            : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
        }`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <Icon size={18} />
        </div>
        {!collapsed && (
          <span className="font-medium text-sm">
            {link.name}
          </span>
        )}
        {isActive && !collapsed && (
          <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FaCog className="text-white text-sm" />
            </div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
          </div>
          <button
            onClick={toggleSidebarMobile}
            className="p-2 rounded-lg hover:bg-slate-700 transition"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-full ${
          collapsed ? "w-16" : "w-72"
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white z-50 transition-transform duration-300 ease-in-out shadow-2xl`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <FaCog className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <p className="text-xs text-slate-400">Management Console</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-slate-700/40 transition"
          >
            {collapsed ? <FaBars size={16} /> : <FaChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col p-3 space-y-1">
          {navLinks.map(renderNavItem)}
        </nav>

        {/* Footer */}
        {/* {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center text-xs text-slate-400">
            <p>Admin Dashboard v2.0</p>
            <p className="text-slate-500">© 2025 Your Company</p>
          </div>
        )} */}
      </aside>
    </>
  );
};

export default AdminSidebar;













// import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
// import { 
//   FaBars, 
//   FaTimes, 
//   FaHome,
//   FaUsers,
//   FaCrown,
//   FaBuilding,
//   FaCalendarAlt,
//   FaCog,
//   FaConciergeBell,
//   FaSignOutAlt,
//   FaChevronLeft
// } from "react-icons/fa";

// const navLinks = [
//   { name: "Dashboard", path: "/admin/home", icon: FaHome },
//   { name: "Users", path: "/admin/users", icon: FaUsers },
//   { name: "Owners", path: "/admin/owners", icon: FaCrown },
//   { name: "Properties", path: "/admin/properties", icon: FaBuilding },
//   { name: "Bookings", path: "/admin/bookings", icon: FaCalendarAlt },
//   { name: "Services", path: "/admin/services", icon: FaConciergeBell },
//   { name: "Settings", path: "/admin/settings", icon: FaCog },
// ];

// interface ModernAdminSidebarProps {
//   collapsed: boolean;
//   onToggle: () => void;
// }

// const AdminSidebar = ({ collapsed, onToggle }: ModernAdminSidebarProps) => {
//   const location = useLocation();

//   return (
//     <aside className={`${
//       collapsed ? "w-16" : "w-64"
//     } bg-gradient-sidebar text-admin-sidebar-foreground shadow-sidebar transition-all duration-300 ease-smooth flex flex-col h-full`}>
      
//       {/* Header */}
//       <div className="p-4 border-b border-admin-sidebar-border/30">
//         <div className="flex items-center justify-between">
//           {!collapsed && (
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
//                 <FaCog className="text-white text-sm" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold">Admin Panel</h1>
//                 <p className="text-xs text-admin-sidebar-foreground/70">Management Console</p>
//               </div>
//             </div>
//           )}
//           <button 
//             onClick={onToggle}
//             className="p-2 rounded-lg hover:bg-admin-sidebar-accent/20 transition-colors duration-200"
//           >
//             {collapsed ? <FaBars size={16} /> : <FaChevronLeft size={16} />}
//           </button>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-3 space-y-1">
//         {navLinks.map((link) => {
//           const IconComponent = link.icon;
//           const isActive = location.pathname === link.path;
          
//           return (
//             <Link
//               key={link.name}
//               to={link.path}
//               className={`group flex items-center space-x-3 py-3 px-3 rounded-xl transition-all duration-200 ${
//                 isActive
//                   ? "bg-gradient-primary text-white shadow-md"
//                   : "hover:bg-admin-sidebar-accent/20 hover:text-white"
//               }`}
//               title={collapsed ? link.name : undefined}
//             >
//               <div className="flex items-center justify-center w-5 h-5">
//                 <IconComponent size={18} />
//               </div>
//               {!collapsed && (
//                 <span className="font-medium text-sm">{link.name}</span>
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout Button */}
//       <div className="p-3 border-t border-admin-sidebar-border/30">
//         <Link
//           to="/admin/logout"
//           className="group flex items-center space-x-3 py-3 px-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-200"
//           title={collapsed ? "Logout" : undefined}
//         >
//           <div className="flex items-center justify-center w-5 h-5">
//             <FaSignOutAlt size={18} />
//           </div>
//           {!collapsed && (
//             <span className="font-medium text-sm">Logout</span>
//           )}
//         </Link>
//       </div>

//       {/* Footer */}
//       {!collapsed && (
//         <div className="p-3 border-t border-admin-sidebar-border/30">
//           <div className="text-xs text-admin-sidebar-foreground/50 text-center">
//             <p>Admin Dashboard v2.0</p>
//             <p>© 2025 Your Company</p>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// };

// export default AdminSidebar;