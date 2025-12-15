
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { User } from "lucide-react";

const Dashboard: React.FC = () => {
  const { userData, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/user/login");
  };

  const menuItems = [
    { name: "Upcoming Bookings", path: "upcoming" },
    { name: "Past Bookings", path: "past" },
    { name: "All Bookings", path: "all" },
    { name: "Booking History", path: "history" },
    { name: "Wallet / Payments", path: "wallet" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-center border-b">
          {userData?.profileImage ? (
            <img
              src={userData.profileImage}
              alt="profile"
              className="w-20 h-20 mx-auto rounded-full"
            />
          ) : (
            <User className="w-20 h-20 mx-auto text-blue-950" />
          )}
          <h2 className="mt-4 font-semibold text-lg">{userData?.name || "User"}</h2>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-950 transition"
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-red-500 transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
