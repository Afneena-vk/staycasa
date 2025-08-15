
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { FaBuilding, FaCalendarAlt, FaWallet, FaComments } from "react-icons/fa";

const OwnerDashboard = () => {
  const stats = [
    {
      title: "Total Properties",
      value: 12,
      icon: <FaBuilding size={22} />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Active Bookings",
      value: 8,
      icon: <FaCalendarAlt size={22} />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Wallet Balance",
      value: "$2,450",
      icon: <FaWallet size={22} />,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "New Messages",
      value: 5,
      icon: <FaComments size={22} />,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <OwnerLayout>
      <div>
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 flex items-center space-x-4 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder for Charts / Recent Activity */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
              Recent Bookings
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Booking data and charts will appear here.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
              Earnings Overview
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Earnings data and charts will appear here.
            </p>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;
