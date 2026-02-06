

import { Link, useLocation, useNavigate } from "react-router-dom";
import { NotificationBell } from "../../pages/user/NotificationBell";
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

import { useAuthStore } from "../../stores/authStore";

const navLinks = [
  { name: "Home", path: "/admin/dashboard", icon: FaHome },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  { name: "Owners", path: "/admin/owners", icon: FaCrown },
  { name: "Properties", path: "/admin/properties", icon: FaBuilding },
  { name: "Bookings", path: "/admin/bookings", icon: FaCalendarAlt },
  { name: "Subscriptions", path: "/admin/subscriptions", icon: FaConciergeBell },
  { name: "Settings", path: "/admin/settings", icon: FaCog },
  // { name: "Services & Features", path: "/admin/services", icon: FaConciergeBell },
  { name: "Logout", path: "/admin/logout", icon: FaSignOutAlt },
 

];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ collapsed, onToggle }: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const logout = useAuthStore((state)=>state.logout);
  const navigate = useNavigate();

   const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/admin/login"); 
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };



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

   if (isLogout) {
      return (
        <button
          key={link.name}
          onClick={handleLogout}
          className="group flex items-center space-x-3 py-3 px-4 w-full text-left rounded-xl transition-all duration-200 hover:bg-red-600/20 text-red-400"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <Icon size={18} />
          </div>
          {!collapsed && <span className="font-medium text-sm">{link.name}</span>}
        </button>
      );
    }

    return (
      <Link
        key={link.name}
        to={link.path}
        onClick={handleLinkClick}
        title={collapsed ? link.name : undefined}
        className={`group flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-[1.02]"
            // : isLogout
            // ? "hover:bg-red-600/20 text-red-400"
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

            <div className="flex items-center space-x-2">
               <NotificationBell role="Admin" /> 
          <button
            onClick={toggleSidebarMobile}
            className="p-2 rounded-lg hover:bg-slate-700 transition"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
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
            <div className="flex items-center space-x-2">
              <NotificationBell role="Admin" /> 
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-slate-700/40 transition"
          >
            {collapsed ? <FaBars size={16} /> : <FaChevronLeft size={16} />}
          </button>
        </div> 
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












