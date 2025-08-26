
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { FaBuilding, FaCalendarAlt, FaWallet, FaComments, FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
//import OwnerStatus from "../../components/Owner/OwnerStaus";

const OwnerDashboard = () => {

  const { userData } = useAuthStore();
  const isApproved = userData?.approvalStatus === 'approved';

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

        {!isApproved && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          userData?.approvalStatus === 'pending' 
          ? 'bg-yellow-50 border-yellow-400' 
          : 'bg-red-50 border-red-400'
        }`}>
       <div className="flex items-center gap-3">
      {userData?.approvalStatus === 'pending' ? 
        <FaClock className="text-yellow-500" /> : 
        <FaExclamationTriangle className="text-red-500" />
      }
      <div>
        <h3 className="font-medium">
          {userData?.approvalStatus === 'pending' ? 'Account Under Review' : 'Account Action Required'}
        </h3>
        <p className="text-sm mt-1">
          {userData?.approvalStatus === 'pending' 
            ? 'Your account is being reviewed. Property listing will be available once approved.'
            : 'Your account needs attention. Please contact support or resubmit documents.'
          }
        </p>
      </div>
    </div>
  </div>
)}

{/* Account Status Card + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Account Status Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Account Status</p>
                <p className="text-2xl font-bold">{userData?.approvalStatus}</p>
              </div>
              {userData?.approvalStatus === "approved" && (
                <FaCheckCircle className="text-green-500 text-2xl" />
              )}
              {userData?.approvalStatus === "pending" && (
                <FaClock className="text-yellow-500 text-2xl" />
              )}
              {userData?.approvalStatus === "rejected" && (
                <FaTimesCircle className="text-red-500 text-2xl" />
              )}
            </div>
          </div>


        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
        </div> */}
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


 {/* Profile + Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          {/* <div className="lg:col-span-1">
            <OwnerStatus />
          </div> */}
        {/* Placeholder for Charts / Recent Activity */}
        {/* <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div> */}
        <div className="lg:col-span-2">
            {isApproved ? (
              <div>
                {/* Normal dashboard content */}
                <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Getting Started</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FaCheckCircle className="text-green-500" />
                    <span>Account created</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 border rounded-lg ${
                      userData?.documents?.length > 0 ? "" : "opacity-50"
                    }`}
                  >
                    {userData?.documents?.length > 0 ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaClock className="text-gray-400" />
                    )}
                    <span>Documents uploaded</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
                    <FaClock className="text-gray-400" />
                    <span>Admin approval</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
                    <FaClock className="text-gray-400" />
                    <span>Start listing properties</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;
