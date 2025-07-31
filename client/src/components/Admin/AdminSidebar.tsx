// import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
// import { FaBars, FaTimes } from "react-icons/fa";

// const navLinks = [
//   { name: "Home", path: "/admin/home" },
//   { name: "Users", path: "/admin/users" },
//   { name: "Owners", path: "/admin/owners" },
//   { name: "Properties", path: "/admin/properties" },
//   { name: "Bookings", path: "/admin/bookings" },
//   { name: "Settings", path: "/admin/settings" },
//   { name: "Services & Features", path: "/admin/services" },
//   { name: "Logout", path: "/admin/logout" },
// ];

// const AdminSidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       {/* Sidebar toggle for mobile */}
//       <div className="lg:hidden p-4 bg-gray-900 text-white flex justify-between items-center">
//         <h1 className="text-xl font-bold">Admin Panel</h1>
//         <button onClick={toggleSidebar}>
//           {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`${
//           isOpen ? "block" : "hidden"
//         } lg:block fixed lg:static top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transition-transform duration-300`}
//       >
//         <div className="p-6 text-2xl font-bold border-b border-gray-700">
//           Admin Panel
//         </div>
//         <nav className="flex flex-col p-4 gap-2">
//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               to={link.path}
//               className={`py-2 px-4 rounded hover:bg-gray-700 transition ${
//                 location.pathname === link.path
//                   ? "bg-gray-700 font-semibold"
//                   : ""
//               }`}
//               onClick={() => setIsOpen(false)}
//             >
//               {link.name}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </>
//   );
// };

// export default AdminSidebar;
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
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
  FaSignOutAlt
} from "react-icons/fa";

const navLinks = [
  { name: "Home", path: "/admin/home", icon: FaHome },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  { name: "Owners", path: "/admin/owners", icon: FaCrown },
  { name: "Properties", path: "/admin/properties", icon: FaBuilding },
  { name: "Bookings", path: "/admin/bookings", icon: FaCalendarAlt },
  { name: "Settings", path: "/admin/settings", icon: FaCog },
  { name: "Services & Features", path: "/admin/services", icon: FaConciergeBell },
  { name: "Logout", path: "/admin/logout", icon: FaSignOutAlt },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FaCog className="text-white text-sm" />
            </div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:static top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white z-50 transition-transform duration-300 ease-in-out shadow-2xl`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaCog className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-slate-400 text-sm">Management Console</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            const isActive = location.pathname === link.path;
            const isLogout = link.name === "Logout";
            
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`group flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                    : isLogout
                    ? "hover:bg-red-600/20 hover:text-red-400"
                    : "hover:bg-slate-700/50 hover:text-white hover:transform hover:translate-x-1"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className={`flex items-center justify-center w-5 h-5 ${
                  isActive ? "text-white" : isLogout ? "text-red-400" : "text-slate-400 group-hover:text-white"
                }`}>
                  <IconComponent size={18} />
                </div>
                <span className={`font-medium ${
                  isActive ? "text-white" : isLogout ? "text-red-400" : "text-slate-300"
                }`}>
                  {link.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-400 text-center">
            <p>Admin Dashboard v2.0</p>
            <p className="text-slate-500">© 2025 Your Company</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;